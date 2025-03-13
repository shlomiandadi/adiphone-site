import Image from 'next/image';

interface BlogPost {
  title: string;
  image: string;
  excerpt: string;
  date: string;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src={`/images/blog/${post.image}.svg`}
        alt={post.title}
        width={800}
        height={600}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="text-sm text-gray-500">{post.date}</div>
      </div>
    </div>
  );
} 