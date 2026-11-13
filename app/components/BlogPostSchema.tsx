import { omitBreadcrumbList } from '../../lib/cms/breadcrumbShared';
import { buildBlogPostingSchema, withShlomiAuthor } from '../../lib/blogPosting';

interface BlogPostSchemaProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    mainImage: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    authorName: string;
    authorEmail: string;
    content: string;
    schemaMarkup?: string | null;
  };
}

export default function BlogPostSchema({ post }: BlogPostSchemaProps) {
  let json = post.schemaMarkup
    ? withShlomiAuthor(post.schemaMarkup)
    : JSON.stringify(buildBlogPostingSchema(post));
  try {
    const parsed = JSON.parse(json);
    const withoutCrumbs = omitBreadcrumbList(parsed);
    if (withoutCrumbs == null) json = '';
    else json = JSON.stringify(withoutCrumbs);
  } catch {
    // keep stored markup when it is not JSON
  }
  if (!json) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
