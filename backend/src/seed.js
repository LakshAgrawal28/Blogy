import { nanoid } from 'nanoid';
import { db, saveDb } from './db/db.js';

function nowIso() {
  return new Date().toISOString();
}

function makeBlog(title, seo, status, market) {
  return {
    id: nanoid(10),
    run_id: null,
    keywords: [title.split(' ').slice(0, 4).join(' ')],
    target_market: market,
    brand_name: 'Blogy',
    tone: 'Professional',
    target_audience: 'SaaS founders',
    search_intent: 'informational',
    title,
    body: `${title}\n\nThis is seeded demo content for dashboard preview.`,
    seo_score: seo,
    seo_breakdown: {},
    outline: {},
    clustering: {},
    serp_gap: {},
    status,
    published_urls: status === 'published' ? { devto: `https://devto.com/mock/${nanoid(6)}` } : {},
    publish_date: status === 'published' ? nowIso() : null,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

async function run() {
  if (db.data.blogs.length > 0) {
    console.log('Seed skipped: blogs already exist.');
    return;
  }

  db.data.blogs.push(
    makeBlog('Scaling SaaS in the Indian Ecosystem', 92, 'published', 'India'),
    makeBlog('Top 10 AI Tools for Content Marketing', 78, 'draft', 'India'),
    makeBlog('Future of Work: Remote Indian Teams', 89, 'published', 'India'),
  );

  await saveDb();
  console.log('Seed completed: 3 demo blogs added.');
}

run();
