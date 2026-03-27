import Anthropic from '@anthropic-ai/sdk';
import { getMasterPrompt } from '../prompts/masterPrompt.js';
import { buildMockResult } from './mockResult.js';

function extractJsonPayload(text) {
  const trimmed = text.trim();
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) {
    throw new Error('No JSON object found in model output');
  }
  return trimmed.slice(first, last + 1);
}

async function callWithRetry(client, userContent, attempts = 2) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 12000,
        messages: [{ role: 'user', content: userContent }],
      });

      const text = response.content?.[0]?.text ?? '';
      const json = extractJsonPayload(text);
      return JSON.parse(json);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)));
    }
  }
  throw lastError;
}

export async function generatePipelineResult(input) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return buildMockResult(input);
  }

  const client = new Anthropic({ apiKey });
  const masterPrompt = getMasterPrompt();
  const userContent = `${masterPrompt}\n\nINPUT:\n${JSON.stringify(input, null, 2)}\n\nExecute the pipeline now. Return ONLY valid JSON.`;

  return callWithRetry(client, userContent, 2);
}
