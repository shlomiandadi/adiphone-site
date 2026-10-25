import type { PrismaClient } from '@prisma/client';

export const LEAD_RETENTION_MONTHS = 12;
export const LEAD_RETENTION_MAX_DELETE = 500;
export const NEWSLETTER_CONTACT_MESSAGE = 'Newsletter subscription';

export type LeadRetentionPrisma = Pick<PrismaClient, 'contact'>;

export type LeadRetentionOptions = {
  prisma: LeadRetentionPrisma;
  now?: Date;
  dryRun?: boolean;
  maxDelete?: number;
};

export type LeadRetentionResult = {
  cutoff: string;
  found: number;
  deleted: number;
  dryRun: boolean;
  aborted: boolean;
  reason: string | null;
};

/** Calendar cutoff: strictly older than 12 months from `now`. */
export function leadRetentionCutoff(now: Date = new Date()): Date {
  return new Date(
    Date.UTC(
      now.getUTCFullYear() - LEAD_RETENTION_MONTHS / 12,
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );
}

function expiredLeadWhere(cutoff: Date) {
  return {
    createdAt: { lt: cutoff },
    NOT: { message: NEWSLETTER_CONTACT_MESSAGE },
  };
}

export async function runLeadRetentionCleanup(
  options: LeadRetentionOptions,
): Promise<LeadRetentionResult> {
  const now = options.now ?? new Date();
  const cutoff = leadRetentionCutoff(now);
  const dryRun = options.dryRun === true;
  const maxDelete = options.maxDelete ?? LEAD_RETENTION_MAX_DELETE;
  const where = expiredLeadWhere(cutoff);

  const found = await options.prisma.contact.count({ where });
  const result: LeadRetentionResult = {
    cutoff: cutoff.toISOString(),
    found,
    deleted: 0,
    dryRun,
    aborted: false,
    reason: null,
  };

  if (found > maxDelete) {
    result.aborted = true;
    result.reason = `safety cap: would delete ${found} Contact rows (max ${maxDelete})`;
    console.log(
      `[lead-retention] aborted found=${found} deleted=0 cutoff=${result.cutoff} dryRun=${dryRun} ${result.reason}`,
    );
    return result;
  }

  if (!dryRun && found > 0) {
    const deleted = await options.prisma.contact.deleteMany({ where });
    result.deleted = deleted.count;
  }

  console.log(
    `[lead-retention] found=${found} deleted=${result.deleted} cutoff=${result.cutoff} dryRun=${dryRun}`,
  );
  return result;
}
