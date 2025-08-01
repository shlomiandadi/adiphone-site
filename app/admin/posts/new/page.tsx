import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../../lib/adminAuth';
import PostEditor from '../../components/PostEditor';

export default async function NewPostPage() {
  const user = await getAdminUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  return <PostEditor mode="create" />;
} 