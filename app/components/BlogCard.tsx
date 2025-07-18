import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  mainImage: string;
  category: string;
  createdAt: string;
  tags: string[];
  slug: string;
  published: boolean;
  authorName: string;
  authorEmail: string;
  views: number;
  likes: number;
  metaTitle: string;
  metaDesc: string;
  updatedAt: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48">
          <Image
            src={post.mainImage || '/images/blog/nextjs-guide.jpg'}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
          <span>{formatDate(post.createdAt)}</span>
          {post.authorName && (
            <span>על ידי {post.authorName}</span>
          )}
        </div>
        
        <Link href={`/blog/${post.slug}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {post.views > 0 && (
              <span>👁️ {post.views} צפיות</span>
            )}
            {post.likes > 0 && (
              <span>❤️ {post.likes} לייקים</span>
            )}
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            קרא עוד →
          </Link>
        </div>
      </div>
    </div>
  );
} 