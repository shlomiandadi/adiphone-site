import prisma from '../../lib/prisma';
import { runLeadRetentionCleanup } from '../../lib/leadRetention';

export const config = {
  schedule: '0 3 * * 0',
};

type HandlerResponse = {
  statusCode: number;
  headers: { 'Content-Type': string };
  body: string;
};

export async function handler(): Promise<HandlerResponse> {
  try {
    const result = await runLeadRetentionCleanup({
      prisma,
      dryRun: process.env.DRY_RUN === 'true',
    });
    return {
      statusCode: result.aborted ? 409 : 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'lead retention failed';
    console.error('[lead-retention] error', message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}
