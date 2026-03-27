import fs from 'node:fs';
import path from 'node:path';

const dbPath = path.resolve(process.cwd(), 'data', 'db.json');

function loadData() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {
      blogs: [],
      runs: [],
      publishJobs: [],
    };
  }
}

export const db = {
  data: loadData(),
};

export async function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db.data, null, 2));
}
