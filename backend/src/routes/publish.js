import { Router } from 'express';
import { getPublishJob, publishBlog } from '../services/publishService.js';

const router = Router();

router.post('/:blogId', async (req, res) => {
  const platform = req.body?.platform ?? 'devto';
  const job = await publishBlog(req.params.blogId, platform);

  if (!job) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  return res.status(202).json({
    publishJobId: job.id,
    status: job.status,
    platform: job.platform,
  });
});

router.get('/status/:publishJobId', (req, res) => {
  const job = getPublishJob(req.params.publishJobId);
  if (!job) return res.status(404).json({ error: 'Publish job not found' });
  return res.json(job);
});

export default router;
