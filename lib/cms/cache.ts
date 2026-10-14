import { revalidateTag, unstable_cache } from 'next/cache';

export const CMS_CACHE_TAG = 'cms';
export const CMS_REVALIDATE_SECONDS = 3600;

export function cmsCache<Args extends unknown[], Result>(
  key: string,
  fn: (...args: Args) => Promise<Result>
): (...args: Args) => Promise<Result> {
  return (...args: Args) =>
    unstable_cache(fn, [key, ...args.map((value) => JSON.stringify(value))], {
      tags: [CMS_CACHE_TAG],
      revalidate: CMS_REVALIDATE_SECONDS,
    })(...args);
}

export function revalidateCmsTag() {
  try {
    revalidateTag(CMS_CACHE_TAG);
  } catch {
    // ignore — same as revalidatePath in this codebase
  }
}
