import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LEAD_RETENTION_MAX_DELETE,
  NEWSLETTER_CONTACT_MESSAGE,
  leadRetentionCutoff,
  runLeadRetentionCleanup,
} from './leadRetention.ts';

function mockPrisma(count: number) {
  const calls: { countWhere?: unknown; deleteWhere?: unknown } = {};
  return {
    calls,
    prisma: {
      contact: {
        count: async ({ where }: { where: unknown }) => {
          calls.countWhere = where;
          return count;
        },
        deleteMany: async ({ where }: { where: unknown }) => {
          calls.deleteWhere = where;
          return { count };
        },
      },
    },
  };
}

test('cutoff is exactly 12 UTC calendar months before now', () => {
  const now = new Date('2026-10-25T03:00:00.000Z');
  assert.equal(leadRetentionCutoff(now).toISOString(), '2025-10-25T03:00:00.000Z');
});

test('dry run counts expired contact leads and does not delete', async () => {
  const { prisma, calls } = mockPrisma(3);
  const result = await runLeadRetentionCleanup({
    prisma,
    now: new Date('2026-10-25T03:00:00.000Z'),
    dryRun: true,
  });

  assert.equal(result.found, 3);
  assert.equal(result.deleted, 0);
  assert.equal(result.dryRun, true);
  assert.equal(result.aborted, false);
  assert.equal(result.cutoff, '2025-10-25T03:00:00.000Z');
  assert.deepEqual(calls.countWhere, {
    createdAt: { lt: new Date('2025-10-25T03:00:00.000Z') },
    NOT: { message: NEWSLETTER_CONTACT_MESSAGE },
  });
  assert.equal(calls.deleteWhere, undefined);
});

test('live run deletes only when under the safety cap', async () => {
  const { prisma, calls } = mockPrisma(2);
  const result = await runLeadRetentionCleanup({
    prisma,
    now: new Date('2026-10-25T03:00:00.000Z'),
    dryRun: false,
  });

  assert.equal(result.deleted, 2);
  assert.deepEqual(calls.deleteWhere, calls.countWhere);
});

test('aborts when more than 500 rows would be deleted', async () => {
  const { prisma, calls } = mockPrisma(LEAD_RETENTION_MAX_DELETE + 1);
  const result = await runLeadRetentionCleanup({
    prisma,
    now: new Date('2026-10-25T03:00:00.000Z'),
    dryRun: false,
  });

  assert.equal(result.aborted, true);
  assert.equal(result.deleted, 0);
  assert.equal(result.found, 501);
  assert.match(result.reason ?? '', /safety cap/);
  assert.equal(calls.deleteWhere, undefined);
});
