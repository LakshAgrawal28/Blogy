import fs from 'node:fs';
import path from 'node:path';

const promptPath = path.resolve(process.cwd(), '..', 'files', 'MASTER_STITCH_PROMPT.md');

export function getMasterPrompt() {
  try {
    const markdown = fs.readFileSync(promptPath, 'utf-8');
    return markdown;
  } catch {
    return `You are an expert SEO architect and content strategist. Return only valid JSON matching the requested schema.`;
  }
}
