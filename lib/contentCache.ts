import { revalidateTag, unstable_cache } from 'next/cache';
import { CONTENT_REVALIDATE_SECONDS } from './contentCachePolicy';
export {
  BLOG_CACHE_TAG,
  CONTENT_REVALIDATE_SECONDS,
  LLMS_CACHE_TAG,
  PORTFOLIO_CACHE_TAG,
  POST_LIST_SELECT,
  PRERENDER_CACHE_TAG,
  PRIVATE_NO_STORE,
  PUBLIC_CACHE_CONTROL,
  SEO_AGENT_CACHE_TAG,
  reviveDates,
} from './contentCachePolicy';

export function contentCache<Args extends unknown[], Result>(
  key: string,
  tags: string[],
  fn: (...args: Args) => Promise<Result>
): (...args: Args) => Promise<Result> {
  return (...args: Args) =>
    unstable_cache(fn, [key, ...args.map((value) => JSON.stringify(value))], {
      tags,
      revalidate: CONTENT_REVALIDATE_SECONDS,
    })(...args);
}

export function revalidateContentTags(tags: string[]) {
  for (const tag of tags) {
    try {
      revalidateTag(tag);
    } catch {
      // ignore — same as revalidatePath in this codebase
    }
  }
}
