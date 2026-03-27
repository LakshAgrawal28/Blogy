import { nanoid } from 'nanoid';
import { db, saveDb } from '../db/db.js';
import { generatePipelineResult } from './claudeService.js';
import { buildMockResult } from './mockResult.js';

const STEP_NAMES = ['clustering', 'serp_gap', 'outline_generation', 'blog_drafting', 'seo_validation'];

function nowIso() {
  return new Date().toISOString();
}

function toBlogRecord(resultBlog, input, runId) {
  const id = nanoid(10);
  return {
    id,
    run_id: runId,
    keywords: [resultBlog.keyword],
    target_market: input.target_market ?? 'India',
    brand_name: input.brand_name ?? 'Blogy',
    tone: input.tone ?? 'Professional and friendly',
    target_audience: input.target_audience ?? '',
    search_intent: input.search_intent ?? '',
    title: resultBlog.step3_outline?.seo_meta?.h1 ?? resultBlog.keyword,
    body: resultBlog.step4_blog_draft?.blog_text ?? '',
    seo_score: resultBlog.step5_seo_validation?.seo_score ?? 0,
    seo_breakdown: resultBlog.step5_seo_validation?.score_breakdown ?? {},
    outline: resultBlog.step3_outline ?? {},
    clustering: resultBlog.step1_clustering ?? {},
    serp_gap: resultBlog.step2_serp_gap ?? {},
    status: 'draft',
    published_urls: {},
    publish_date: null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

function createRun(input) {
  const run = {
    id: nanoid(12),
    status: 'queued',
    current_step: 0,
    step_name: 'queued',
    progress: 0,
    input,
    blog_ids: [],
    error: null,
    created_at: nowIso(),
    started_at: null,
    completed_at: null,
  };
  db.data.runs.unshift(run);
  return run;
}

function getRunOrThrow(runId) {
  const run = db.data.runs.find((item) => item.id === runId);
  if (!run) {
    throw new Error('Run not found');
  }
  return run;
}

function markStep(run, step) {
  run.current_step = step;
  run.step_name = STEP_NAMES[step - 1];
  run.progress = Math.min(95, Math.round((step / STEP_NAMES.length) * 100));
  run.status = 'in_progress';
  run.updated_at = nowIso();
}

async function safeSave() {
  try {
    await saveDb();
  } catch (error) {
    console.error('Persistence write failed:', error.message);
  }
}

export async function createBlogGenerationRun(input) {
  const run = createRun(input);
  await safeSave();
  processRun(run.id).catch(async (error) => {
    const failedRun = db.data.runs.find((item) => item.id === run.id);
    if (failedRun) {
      failedRun.status = 'failed';
      failedRun.error = error.message;
      failedRun.completed_at = nowIso();
      failedRun.progress = 100;
      await safeSave();
    }
  });
  return run;
}

async function processRun(runId) {
  const run = getRunOrThrow(runId);
  run.status = 'in_progress';
  run.started_at = nowIso();
  await safeSave();

  for (let step = 1; step <= 4; step += 1) {
    markStep(run, step);
    await safeSave();
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const result = await Promise.race([
    generatePipelineResult(run.input),
    new Promise((resolve) => {
      setTimeout(() => resolve(buildMockResult(run.input)), 20000);
    }),
  ]);

  markStep(run, 5);
  await safeSave();

  const blogs = Array.isArray(result.blogs) ? result.blogs : [];
  const createdIds = [];

  for (const resultBlog of blogs) {
    const blog = toBlogRecord(resultBlog, run.input, run.id);
    createdIds.push(blog.id);
    db.data.blogs.unshift(blog);
  }

  run.blog_ids = createdIds;
  run.status = 'completed';
  run.progress = 100;
  run.completed_at = nowIso();
  run.output_summary = result.summary ?? {};
  await safeSave();
}

export function listBlogs({ status, target_market, sortBy = 'created_at', order = 'desc' }) {
  let blogs = [...db.data.blogs];

  if (status) {
    const allowed = new Set(String(status).split(','));
    blogs = blogs.filter((blog) => allowed.has(blog.status));
  }

  if (target_market) {
    blogs = blogs.filter((blog) => blog.target_market === target_market);
  }

  const sortDir = order === 'asc' ? 1 : -1;
  blogs.sort((a, b) => {
    const av = a[sortBy] ?? '';
    const bv = b[sortBy] ?? '';
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * sortDir;
    }
    return String(av).localeCompare(String(bv)) * sortDir;
  });

  return blogs;
}

export function getBlog(blogId) {
  return db.data.blogs.find((blog) => blog.id === blogId) ?? null;
}

export async function updateBlog(blogId, patch) {
  const blog = getBlog(blogId);
  if (!blog) return null;

  const allowedKeys = ['title', 'body', 'status', 'tone', 'target_audience', 'search_intent'];
  for (const key of allowedKeys) {
    if (Object.hasOwn(patch, key)) {
      blog[key] = patch[key];
    }
  }
  blog.updated_at = nowIso();

  await safeSave();
  return blog;
}

export function getRun(runId) {
  return db.data.runs.find((run) => run.id === runId) ?? null;
}

export function getStats() {
  const blogs = db.data.blogs;
  const total = blogs.length;
  const published = blogs.filter((blog) => blog.status === 'published').length;
  const avgSeo = total
    ? Number((blogs.reduce((sum, blog) => sum + (blog.seo_score || 0), 0) / total).toFixed(1))
    : 0;

  const topBlogs = [...blogs]
    .sort((a, b) => (b.seo_score || 0) - (a.seo_score || 0))
    .slice(0, 5)
    .map((blog) => ({
      id: blog.id,
      title: blog.title,
      seo_score: blog.seo_score,
      status: blog.status,
      created_at: blog.created_at,
    }));

  return {
    total_blogs_generated: total,
    total_blogs_published: published,
    avg_seo_score: avgSeo,
    active_runs: db.data.runs.filter((run) => run.status === 'in_progress').length,
    top_blogs: topBlogs,
  };
}
