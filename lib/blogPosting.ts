const DEFAULT_SITE_URL = 'https://adi-phone.co.il';
const SOCIAL_LINKEDIN = 'https://www.linkedin.com/in/shlomi-malfuf-709961221/';
const ORGANIZATION_SAME_AS = [
  'https://www.facebook.com/profile.php?id=61578707397365',
  'https://www.instagram.com/topwebstack/',
  SOCIAL_LINKEDIN,
  'https://x.com/shlomiMalfuf',
];
const PERSON_SAME_AS = [SOCIAL_LINKEDIN, 'https://x.com/shlomiMalfuf'];

/** Same default as getSiteUrl(), kept local so this module has no relative imports. */
function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '').replace(/^http:\/\//i, 'https://');
}

function publisherLogo(base: string) {
  return {
    '@type': 'ImageObject' as const,
    url: `${base}/logo.png`,
    width: 1024,
    height: 1024,
  };
}

export const BLOG_AUTHOR = {
  '@type': 'Person' as const,
  name: 'שלומי',
  url: SOCIAL_LINKEDIN,
  sameAs: [...PERSON_SAME_AS],
  worksFor: {
    '@type': 'Organization' as const,
    name: 'Top Webstak',
    sameAs: [...ORGANIZATION_SAME_AS],
  },
};

export type BlogPostingInput = {
  title: string;
  excerpt: string;
  mainImage: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  content?: string;
};

/** BlogPosting JSON-LD shared by database posts and static articles. */
export function buildBlogPostingSchema(post: BlogPostingInput) {
  const base = siteUrl();
  const url = `${base}/blog/${post.slug}`;
  const plain = (post.content || '').replace(/<[^>]*>/g, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage,
    author: BLOG_AUTHOR,
    publisher: {
      '@type': 'Organization',
      name: 'Top Webstak',
      url: base,
      logo: publisherLogo(base),
      sameAs: [...ORGANIZATION_SAME_AS],
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category || '',
    wordCount: (post.content || '').length,
    articleBody: plain,
    keywords: post.category || '',
  };
}

/** Stored markup keeps its shape; the author is always שלומי, as on the other posts. */
export function withShlomiAuthor(markup: string): string {
  try {
    const parsed = JSON.parse(markup);
    const apply = (node: Record<string, unknown>) => {
      if (node['@type'] === 'BlogPosting') node.author = BLOG_AUTHOR;
      return node;
    };
    if (Array.isArray(parsed)) {
      return JSON.stringify(
        parsed.map((item) => (item && typeof item === 'object' ? apply(item as Record<string, unknown>) : item))
      );
    }
    if (parsed && typeof parsed === 'object') {
      return JSON.stringify(apply(parsed as Record<string, unknown>));
    }
  } catch {
    // Keep stored markup if it is not valid JSON.
  }
  return markup;
}
