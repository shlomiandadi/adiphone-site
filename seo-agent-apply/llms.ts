import { readFile } from 'fs/promises';
import { join } from 'path';
import { BASE_LLMS_TXT } from './base-llms';
import { getSeoAgentLlmsAddition } from './state';

const APPLY_HEADING = '## SEO Agent';

const CANDIDATE_FILES = [
  join(process.cwd(), 'seo-agent-apply/base-llms.txt'),
  join(process.cwd(), 'public/llms.txt'),
];

async function readExistingLlms(): Promise<string> {
  for (const file of CANDIDATE_FILES) {
    try {
      return await readFile(file, 'utf8');
    } catch {
      // try the next source
    }
  }
  return BASE_LLMS_TXT;
}

function stripPreviousApplySection(base: string): string {
  const index = base.indexOf(`\n${APPLY_HEADING}`);
  if (index === -1) {
    return base.startsWith(APPLY_HEADING) ? '' : base;
  }
  return base.slice(0, index).replace(/\s+$/, '');
}

/** Merge store additions onto the existing llms.txt. No addition → existing body as-is. */
export async function buildLlmsTxt(): Promise<string> {
  const existing = await readExistingLlms();
  const addition = await getSeoAgentLlmsAddition();
  const base = stripPreviousApplySection(existing).replace(/\s+$/, '');

  if (!addition) {
    return existing.endsWith('\n') || existing.length === 0 ? existing : `${existing}\n`;
  }

  return `${base}\n\n${APPLY_HEADING}\n\n${addition.replace(/\s+$/, '')}\n`;
}
