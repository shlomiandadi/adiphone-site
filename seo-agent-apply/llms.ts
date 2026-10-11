import { readFile } from 'fs/promises';
import { join } from 'path';
import { getSeoAgentLlmsAddition } from './store';

const APPLY_HEADING = '## SEO Agent';

async function readExistingLlms(): Promise<string> {
  try {
    return await readFile(join(process.cwd(), 'public/llms.txt'), 'utf8');
  } catch {
    return '';
  }
}

function stripPreviousApplySection(base: string): string {
  const index = base.indexOf(`\n${APPLY_HEADING}`);
  if (index === -1) {
    return base.startsWith(APPLY_HEADING) ? '' : base;
  }
  return base.slice(0, index).replace(/\s+$/, '');
}

/** Merge store additions onto the checked-in `public/llms.txt`. No addition → existing file as-is. */
export async function buildLlmsTxt(): Promise<string> {
  const existing = await readExistingLlms();
  const addition = await getSeoAgentLlmsAddition();
  const base = stripPreviousApplySection(existing).replace(/\s+$/, '');

  if (!addition) {
    return existing.endsWith('\n') || existing.length === 0 ? existing : `${existing}\n`;
  }

  const merged = `${base}\n\n${APPLY_HEADING}\n\n${addition.replace(/\s+$/, '')}\n`;
  return merged;
}
