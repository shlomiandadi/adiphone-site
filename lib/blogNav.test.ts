import assert from 'node:assert/strict';
import test from 'node:test';
import { adjacentBlogPosts, type BlogNavPost } from './blogNav.ts';

const posts: BlogNavPost[] = [
  { title: 'Newest', slug: 'newest', category: 'SEO' },
  { title: 'Middle', slug: 'middle', category: 'AI' },
  { title: 'Oldest', slug: 'oldest', category: 'Web' },
];

test('adjacent posts follow createdAt desc order', () => {
  assert.deepEqual(adjacentBlogPosts(posts, 'middle'), {
    previousPost: posts[0],
    nextPost: posts[2],
  });
  assert.deepEqual(adjacentBlogPosts(posts, 'newest'), {
    previousPost: null,
    nextPost: posts[1],
  });
  assert.deepEqual(adjacentBlogPosts(posts, 'oldest'), {
    previousPost: posts[1],
    nextPost: null,
  });
});
