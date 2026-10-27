import { FaBlog, FaCode, FaMobileAlt, FaSearch, FaPaintBrush, FaShoppingCart } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { mergeSeoAgentMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { metadata as blogMetadata } from '../../metadata';
import { getPostsByCategorySlugCached } from '../../../../lib/posts';

export const revalidate = 3600;

type Category = 'SEO' | 'WEB_DEVELOPMENT' | 'APP_DEVELOPMENT' | 'DIGITAL_MARKETING' | 'UI_UX' | 'ECOMMERCE';

const categoryIcons: Record<Category, IconType> = {
  SEO: FaSearch,
  WEB_DEVELOPMENT: FaCode,
  APP_DEVELOPMENT: FaMobileAlt,
  DIGITAL_MARKETING: FaBlog,
  UI_UX: FaPaintBrush,
  ECOMMERCE: FaShoppingCart,
};

const categoryTitles: Record<Category, string> = {
  SEO: 'קידום אתרים',
  WEB_DEVELOPMENT: 'פיתוח אתרים',
  APP_DEVELOPMENT: 'פיתוח אפליקציות',
  DIGITAL_MARKETING: 'שיווק דיגיטלי',
  UI_UX: 'עיצוב ממשק משתמש',
  ECOMMERCE: 'מסחר אלקטרוני',
};

interface Props {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return mergeSeoAgentMetadata(`/blog/category/${params.category}`, blogMetadata);
}

export default async function CategoryPage({ params }: Props) {
  const category = params.category.toUpperCase() as Category;
  const { categoryRecord, posts } = await getPostsByCategorySlugCached(params.category);

  if (!categoryRecord) {
    notFound();
  }

  const Icon = categoryIcons[category] || FaBlog;
  const title = categoryTitles[category] || categoryRecord.name;
  const description = categoryRecord.description?.trim() || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <SeoAgentPageExtras path={`/blog/category/${params.category}`} />
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2">
          <Icon className="text-4xl text-primary" />
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        {description ? (
          <p className="mt-4 mx-auto max-w-2xl text-gray-600">{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={post.mainImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(post.createdAt).toLocaleDateString('he-IL')}</span>
                <div className="flex items-center space-x-4">
                  <span>{post.views} צפיות</span>
                  <span>{post.likes} לייקים</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 