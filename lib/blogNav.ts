export type BlogNavPost = {
  title: string;
  slug: string;
  category: string;
};

/**
 * Previous/next from a createdAt-desc list capped at 100.
 * Matches the old client: index - 1 is previous, index + 1 is next.
 */
export function adjacentBlogPosts(posts: BlogNavPost[], currentSlug: string) {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  return { previousPost, nextPost };
}
