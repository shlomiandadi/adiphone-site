import { organizationLogo } from '../../lib/seo';
import { ORGANIZATION_SAME_AS, PERSON_SAME_AS, SOCIAL_LINKEDIN } from '../../lib/social';

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
    "name": "Top Webstak Blog",
    "description": "בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי",
    "url": "https://adi-phone.co.il/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Top Webstak",
      "url": "https://adi-phone.co.il",
      "logo": organizationLogo(),
      "sameAs": [...ORGANIZATION_SAME_AS]
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.mainImage,
      "author": {
        "@type": "Person",
        "name": "שלומי",
        "url": SOCIAL_LINKEDIN,
        "sameAs": [...PERSON_SAME_AS]
      },
      "publisher": {
        "@type": "Organization",
        "name": "Top Webstak",
        "url": "https://adi-phone.co.il",
        "logo": organizationLogo(),
        "sameAs": [...ORGANIZATION_SAME_AS]
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