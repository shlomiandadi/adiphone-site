/** Rows seeded on 2025-08-01/02. Never treat them as live CMS content. */
export const LEGACY_SEED_CUTOFF = new Date('2025-08-03T00:00:00.000Z');

/**
 * Apply a CMS row only when the dashboard has explicitly enabled it.
 * `cmsEnabled === true` is required. Null/false, missing column, or
 * `updatedAt <= 2025-08-03` (legacy seed) all mean "use hardcoded output".
 */
export function isCmsEnabled(row: { cmsEnabled?: boolean | null; updatedAt?: Date | string | null } | null | undefined): boolean {
  if (!row) return false;
  if (row.cmsEnabled === true) return true;
  if (row.cmsEnabled === false) return false;
  if (row.updatedAt) {
    const updated = row.updatedAt instanceof Date ? row.updatedAt : new Date(row.updatedAt);
    if (!Number.isNaN(updated.getTime()) && updated <= LEGACY_SEED_CUTOFF) {
      return false;
    }
  }
  return false;
}

export async function cmsRead<T>(fn: () => Promise<T | null | undefined>): Promise<T | null> {
  try {
    const result = await fn();
    return result ?? null;
  } catch (error) {
    console.warn('CMS read fell back to hardcoded site output:', error);
    return null;
  }
}
