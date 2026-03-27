import { useState } from 'react';
import { api } from '../api/client';

const POLL_INTERVAL_MS = 1200;

export function useGenerator({ onComplete } = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [runState, setRunState] = useState(null);
  const [error, setError] = useState('');

  async function start(payload) {
    try {
      setError('');
      setIsRunning(true);
      const run = await api.createBlogRun(payload);
      setRunState({
        jobId: run.jobId,
        progress: 0,
        stepName: 'queued',
        status: run.status,
      });

      let done = false;
      while (!done) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        const status = await api.getRunStatus(run.jobId);
        setRunState(status);

        if (status.status === 'completed') {
          done = true;
          onComplete?.(status);
        }

        if (status.status === 'failed') {
          throw new Error(status.error || 'Generation failed');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  }

  return {
    start,
    isRunning,
    runState,
    error,
  };
}
