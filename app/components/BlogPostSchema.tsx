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
  const json = post.schemaMarkup
    ? withShlomiAuthor(post.schemaMarkup)
    : JSON.stringify(buildBlogPostingSchema(post));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
