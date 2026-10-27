import Link from 'next/link';
import { FEATURED_HOME_POSTS } from '../../lib/related-content';

export default function FeaturedHomePosts() {
  return (
    <p className="container mx-auto px-4 pb-4 text-center text-lg text-gray-700">
      מהבלוג:{' '}
      {FEATURED_HOME_POSTS.map((item, index) => (
        <span key={item.href}>
          {index > 0 ? ' · ' : null}
          <Link href={item.href} className="font-semibold text-blue-700 underline">
            {item.label}
          </Link>
        </span>
      ))}
    </p>
  );
}
