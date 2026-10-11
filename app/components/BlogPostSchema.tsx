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

const AUTHOR_PERSON = {
  '@type': 'Person',
  name: 'שלומי',
  url: 'https://www.linkedin.com/in/shlomi-malfuf-709961221/',
  worksFor: {
    '@type': 'Organization',
    name: 'Top Webstak',
  },
};

function withShlomiAuthor(markup: string): string {
  try {
    const parsed = JSON.parse(markup);
    const apply = (node: Record<string, unknown>) => {
      if (node['@type'] === 'BlogPosting') node.author = AUTHOR_PERSON;
      return node;
    };
    if (Array.isArray(parsed)) {
      return JSON.stringify(parsed.map((item) => (item && typeof item === 'object' ? apply(item as Record<string, unknown>) : item)));
    }
    if (parsed && typeof parsed === 'object') {
      return JSON.stringify(apply(parsed as Record<string, unknown>));
    }
  } catch {
    // Keep stored markup if it is not valid JSON.
  }
  return markup;
}

export default function BlogPostSchema({ post }: BlogPostSchemaProps) {
  if (post.schemaMarkup) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: withShlomiAuthor(post.schemaMarkup) }}
      />
    );
  }

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage,
    author: AUTHOR_PERSON,
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
