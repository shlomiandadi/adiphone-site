import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../../../lib/adminAuth';
import PostEditor from '../../components/PostEditor';

interface EditPostPageProps {
  params: {
    slug: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await getAdminUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  return <PostEditor mode="edit" postId={params.slug} />;
} 