import { nanoid } from 'nanoid';
import { db, saveDb } from '../db/db.js';
import { getBlog } from './blogService.js';

function nowIso() {
  return new Date().toISOString();
}

export async function publishBlog(blogId, platform) {
  const blog = getBlog(blogId);
  if (!blog) return null;

  const publishJob = {
    id: nanoid(12),
    blog_id: blogId,
    platform,
    status: 'publishing',
    created_at: nowIso(),
    completed_at: null,
    published_url: null,
    error: null,
  };

  db.data.publishJobs.unshift(publishJob);
  await saveDb();

  // MVP fallback: simulate successful publishing and keep API contract stable.
  await new Promise((resolve) => setTimeout(resolve, 500));

  const slug = blog.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);

  const publishedUrl = `https://${platform}.com/mock/${slug}-${blog.id}`;
  publishJob.status = 'completed';
  publishJob.completed_at = nowIso();
  publishJob.published_url = publishedUrl;

  blog.status = 'published';
  blog.publish_date = nowIso();
  blog.published_urls = {
    ...(blog.published_urls ?? {}),
    [platform]: publishedUrl,
  };
  blog.updated_at = nowIso();

  await saveDb();
  return publishJob;
}

export function getPublishJob(jobId) {
  return db.data.publishJobs.find((job) => job.id === jobId) ?? null;
}
