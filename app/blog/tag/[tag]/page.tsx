import { Category } from '@prisma/client';
import { FaBlog, FaCode, FaMobileAlt, FaSearch, FaPaintBrush, FaShoppingCart } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '../../../../lib/prisma';

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
    tag: string;
  };
}

export default async function TagPage({ params }: Props) {
  const decodedTag = decodeURIComponent(params.tag);
  
  const posts = await prisma.post.findMany({
    where: {
      tags: {
        has: decodedTag,
      },
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">תוצאות עבור: {decodedTag}</h1>
        <p className="text-gray-600">נמצאו {posts.length} פוסטים</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const Icon = categoryIcons[post.category];
          return (
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
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="text-primary" />
                  <span className="text-sm text-gray-600">{categoryTitles[post.category]}</span>
                </div>
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
          );
        })}
      </div>
    </div>
  );
} 