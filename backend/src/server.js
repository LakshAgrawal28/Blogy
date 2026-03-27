import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import blogsRouter from './routes/blogs.js';
import publishRouter from './routes/publish.js';
import statsRouter from './routes/stats.js';
import statusRouter from './routes/status.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'blogy-backend' });
});

app.use('/api/blogs', blogsRouter);
app.use('/api/status', statusRouter);
app.use('/api/stats', statsRouter);
app.use('/api/publish', publishRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Blogy backend listening on http://localhost:${port}`);
});
