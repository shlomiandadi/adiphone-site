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
  if (post.schemaMarkup) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: post.schemaMarkup }}
      />
    );
  }

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage,
    author: {
      '@type': 'Person',
      name: post.authorName?.trim() || 'שלומי',
      url: 'https://www.linkedin.com/in/shlomi-malfuf-709961221/',
      worksFor: {
        '@type': 'Organization',
        name: 'Top Webstak',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Top Webstak',
      url: 'https://adi-phone.co.il',
      logo: {
        '@type': 'ImageObject',
        url: 'https://adi-phone.co.il/logo.png',
      },
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url: `https://adi-phone.co.il/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://adi-phone.co.il/blog/${post.slug}`,
    },
    articleSection: post.category,
    wordCount: post.content.length,
    articleBody: post.content.replace(/<[^>]*>/g, ''),
    keywords: post.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
    />
  );
}
