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
  };
}

export default function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.mainImage,
    "author": {
      "@type": "Person",
      "name": post.authorName,
      "email": post.authorEmail
    },
    "publisher": {
      "@type": "Organization",
      "name": "Top WebStack",
      "url": "https://adi-phone.co.il",
      "logo": {
        "@type": "ImageObject",
        "url": "https://adi-phone.co.il/logo.png"
      }
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "url": `https://adi-phone.co.il/blog/${post.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://adi-phone.co.il/blog/${post.slug}`
    },
    "articleSection": post.category,
    "wordCount": post.content.length,
    "articleBody": post.content.replace(/<[^>]*>/g, ''), // Remove HTML tags for text content
    "keywords": post.category
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
    />
  );
} 