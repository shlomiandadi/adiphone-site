/** Store calendar dates at 12:00 UTC so timezone conversion does not shift the day. */
export function dateOnlyUtcNoon(value: string | Date | null | undefined): Date {
  if (!value) {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
  }

  const raw = typeof value === 'string' ? value : value.toISOString();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return dateOnlyUtcNoon(null);
  }
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 12, 0, 0));
}

export function toDateInputValue(value: string | Date | null | undefined): string {
  const date = dateOnlyUtcNoon(value);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
