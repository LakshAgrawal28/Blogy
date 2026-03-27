import { Router } from 'express';
import {
  createBlogGenerationRun,
  getBlog,
  getRun,
  listBlogs,
  updateBlog,
} from '../services/blogService.js';

const router = Router();

router.post('/', async (req, res) => {
  const input = req.body ?? {};
  if (!Array.isArray(input.keywords) || input.keywords.length === 0) {
    return res.status(400).json({ error: 'keywords array is required' });
  }

  const run = await createBlogGenerationRun(input);
  return res.status(202).json({
    jobId: run.id,
    status: run.status,
    createdAt: run.created_at,
    estimatedDuration: 45,
  });
});

router.get('/', (req, res) => {
  const blogs = listBlogs(req.query);
  res.json({ blogs, total: blogs.length });
});

router.get('/:blogId', (req, res) => {
  const blog = getBlog(req.params.blogId);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  return res.json(blog);
});

router.patch('/:blogId', async (req, res) => {
  const blog = await updateBlog(req.params.blogId, req.body ?? {});
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  return res.json(blog);
});

router.get('/run/:runId', (req, res) => {
  const run = getRun(req.params.runId);
  if (!run) return res.status(404).json({ error: 'Run not found' });
  return res.json(run);
});

export default router;
