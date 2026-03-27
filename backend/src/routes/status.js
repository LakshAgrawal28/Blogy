import { Router } from 'express';
import { getRun } from '../services/blogService.js';

const router = Router();

router.get('/:jobId', (req, res) => {
  const run = getRun(req.params.jobId);
  if (!run) {
    return res.status(404).json({ error: 'Run not found' });
  }

  return res.json({
    jobId: run.id,
    status: run.status,
    currentStep: run.current_step,
    stepName: run.step_name,
    progress: run.progress,
    blogIds: run.blog_ids,
    error: run.error,
    createdAt: run.created_at,
    startedAt: run.started_at,
    completedAt: run.completed_at,
  });
});

export default router;
