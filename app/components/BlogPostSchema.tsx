import { omitBreadcrumbList } from '../../lib/cms/breadcrumbShared';
import { buildBlogPostingSchema, withShlomiAuthor } from '../../lib/blogPosting';
import { resolveBlogOgImage } from '../../lib/seo';

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
    ogImage?: string | null;
  };
}

function fillEmptyBlogPostingImage(node: unknown, imageUrl: string): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => fillEmptyBlogPostingImage(item, imageUrl));
  }
  if (!node || typeof node !== 'object') return node;
  const rec = node as Record<string, unknown>;
  if (rec['@type'] === 'BlogPosting') {
    const current = rec.image;
    const empty =
      current == null ||
      current === '' ||
      (typeof current === 'string' && !current.trim());
    if (empty) rec.image = imageUrl;
  }
  return rec;
}

export default function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const fallbackImage = resolveBlogOgImage(post).url;
  let json = post.schemaMarkup
    ? withShlomiAuthor(post.schemaMarkup)
    : JSON.stringify(buildBlogPostingSchema(post));
  try {
    const parsed = JSON.parse(json);
    const withoutCrumbs = omitBreadcrumbList(parsed);
    if (withoutCrumbs == null) json = '';
    else json = JSON.stringify(fillEmptyBlogPostingImage(withoutCrumbs, fallbackImage));
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
