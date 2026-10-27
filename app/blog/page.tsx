import Link from 'next/link';
import BlogCard from '../components/BlogCard';
import Hero3D from '../components/hero3d/Hero3D';
import BlogSchema from '../components/BlogSchema';
import BlogNewsletterForm from '../components/BlogNewsletterForm';
import { BLOG_POSTS_PER_PAGE, getPublishedPostsPage } from '../../lib/posts';

export const revalidate = 3600;

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

function blogHref(page: number): string {
  return page <= 1 ? '/blog' : `/blog?page=${page}`;
}

function mapPost(post: Awaited<ReturnType<typeof getPublishedPostsPage>>['posts'][number]) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    mainImage: post.mainImage,
    category: post.category?.name || 'כללי',
    categoryColor: post.category?.color || null,
    createdAt: post.createdAt.toISOString(),
    tags: post.tags,
    slug: post.slug,
    published: post.published,
    authorName: post.authorName || 'שלומי',
    authorEmail: post.authorEmail || '',
    views: post.views,
    likes: post.likes,
    metaTitle: post.metaTitle,
    metaDesc: post.metaDesc,
    updatedAt: post.updatedAt.toISOString(),
  };
}

export default async function Blog({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const requestedPage = Math.max(1, parseInt(searchParams?.page || '1', 10) || 1);
  let posts: ReturnType<typeof mapPost>[] = [];
  let pagination = {
    page: requestedPage,
    limit: BLOG_POSTS_PER_PAGE,
    total: 0,
    pages: 1,
  };

  try {
    const result = await getPublishedPostsPage(requestedPage, BLOG_POSTS_PER_PAGE);
    posts = result.posts.map(mapPost);
    pagination = result.pagination;
  } catch (error) {
    console.error('Error loading published blog posts:', error);
  }

  const pageNumbers = getPageNumbers(pagination.page, pagination.pages);
  const showPagination = pagination.pages > 1 && pagination.total > 0;
  const fromPost = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const toPost = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BlogSchema posts={posts} />
      <Hero3D
        theme="blog"
        title="בלוג"
        subtitle="טיפים, מדריכים ועדכונים מהעולם הדיגיטלי"
        align="center"
        ctas={[{ href: '#blog-posts', label: 'למאמרים' }]}
      />

      <div data-reveal className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div id="blog-posts" className="lg:col-span-2 scroll-mt-28">
            <Link
              href="/blog/kama-oleh-bniyat-atar-2026"
              className="mb-8 block rounded-2xl border border-blue-100 bg-blue-50 p-6 text-right shadow-sm transition-colors hover:bg-blue-100"
            >
              <p className="mb-1 text-sm font-semibold text-blue-700">מדריך מעודכן ל-2026</p>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">כמה עולה בניית אתר ב-2026</h2>
              <p className="text-gray-700">
                טבלת מחירים לדף נחיתה, אתר תדמית, חנות ומערכת – לפי המחירון באתר, בלי מספרים סותרים.
              </p>
            </Link>
            <p className="mb-8 text-right text-gray-700 dark:text-gray-300">
              לעבודת בניית האתר עצמה:{' '}
              <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
                בניית אתרים
              </Link>
              {' '}ו{' '}
              <Link href="/services/website-tadmit" className="font-semibold text-blue-700 underline">
                בניית אתר תדמית
              </Link>
              .
            </p>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  אין פוסטים זמינים כרגע
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  בקרוב נוסיף תוכן מעניין לבלוג שלנו
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  מציג {fromPost}–{toPost} מתוך {pagination.total} מאמרים
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {showPagination && (
                  <nav
                    className="mt-12 flex flex-wrap items-center justify-center gap-2"
                    aria-label="ניווט בין עמודי הבלוג"
                  >
                    {pagination.page > 1 ? (
                      <Link
                        href={blogHref(pagination.page - 1)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        הקודם
                      </Link>
                    ) : (
                      <span className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium opacity-40">
                        הקודם
                      </span>
                    )}

                    {pageNumbers.map((item, index) =>
                      item === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-gray-400"
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <Link
                          key={item}
                          href={blogHref(item)}
                          aria-current={item === pagination.page ? 'page' : undefined}
                          className={`min-w-[2.5rem] px-3 py-2 rounded-lg font-medium transition-colors text-center ${
                            item === pagination.page
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {item}
                        </Link>
                      )
                    )}

                    {pagination.page < pagination.pages ? (
                      <Link
                        href={blogHref(pagination.page + 1)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        הבא
                      </Link>
                    ) : (
                      <span className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium opacity-40">
                        הבא
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <BlogNewsletterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
