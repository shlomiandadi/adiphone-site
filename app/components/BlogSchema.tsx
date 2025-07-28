interface BlogSchemaProps {
  posts: Array<{
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
  }>;
}

export default function BlogSchema({ posts }: BlogSchemaProps) {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Top WebStack Blog",
    "description": "בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי",
    "url": "https://adi-phone.co.il/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Top WebStack",
      "url": "https://adi-phone.co.il"
    },
    "blogPost": posts.map(post => ({
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
        "url": "https://adi-phone.co.il"
      },
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt,
      "url": `https://adi-phone.co.il/blog/${post.slug}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://adi-phone.co.il/blog/${post.slug}`
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
    />
  );
} 