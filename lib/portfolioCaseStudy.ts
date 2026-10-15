import type { PrismaClient } from '@prisma/client';

export type PortfolioCaseStudy = {
  challenge: string;
  solution: string;
  result: string;
};

type CaseStudyDb = Pick<PrismaClient, '$queryRaw' | '$executeRaw'>;

const CASE_STUDY_SQL_HINT =
  'שדות סיפור המקרה עדיין לא קיימים במסד. הריצו את פקודת ה-SQL מתיאור ה-PR, ואז שמרו שוב.';

function textOrEmpty(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function textOrNull(value: unknown): string | null {
  const text = textOrEmpty(value);
  return text ? text : null;
}

export function caseStudyFromRow(
  row: { challenge?: string | null; solution?: string | null; result?: string | null } | null | undefined
): PortfolioCaseStudy | null {
  if (!row) return null;
  const challenge = textOrEmpty(row.challenge);
  const solution = textOrEmpty(row.solution);
  const result = textOrEmpty(row.result);
  if (!challenge && !solution && !result) return null;
  return { challenge, solution, result };
}

export function caseStudyText(study: PortfolioCaseStudy): string {
  const parts: string[] = [];
  if (study.challenge) parts.push(`האתגר: ${study.challenge}`);
  if (study.solution) parts.push(`הפתרון: ${study.solution}`);
  if (study.result) parts.push(`התוצאה: ${study.result}`);
  return parts.join('\n');
}

/** Reads optional columns. Returns null when they are empty or not migrated yet. */
export async function readPortfolioCaseStudy(db: CaseStudyDb, slug: string): Promise<PortfolioCaseStudy | null> {
  try {
    const rows = await db.$queryRaw<
      Array<{ challenge: string | null; solution: string | null; result: string | null }>
    >`
      SELECT challenge, solution, result
      FROM "PortfolioProject2"
      WHERE slug = ${slug}
      LIMIT 1
    `;
    return caseStudyFromRow(rows[0]);
  } catch (error) {
    console.warn('Portfolio case study read skipped:', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function writePortfolioCaseStudy(
  db: CaseStudyDb,
  slug: string,
  input: { challenge?: unknown; solution?: unknown; result?: unknown }
): Promise<{ saved: true } | { saved: false; warning: string }> {
  try {
    await db.$executeRaw`
      UPDATE "PortfolioProject2"
      SET challenge = ${textOrNull(input.challenge)},
          solution = ${textOrNull(input.solution)},
          result = ${textOrNull(input.result)}
      WHERE slug = ${slug}
    `;
    return { saved: true };
  } catch (error) {
    console.warn('Portfolio case study write skipped:', error instanceof Error ? error.message : error);
    return { saved: false, warning: CASE_STUDY_SQL_HINT };
  }
}

export function bodyHasCaseStudy(body: Record<string, unknown>): boolean {
  return 'challenge' in body || 'solution' in body || 'result' in body;
}
