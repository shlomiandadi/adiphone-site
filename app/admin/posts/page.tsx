import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import PostsManager from '../components/PostsManager';
import AdminLayout from '../../components/admin/AdminLayout';

export default async function PostsPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <PostsManager />
    </AdminLayout>
  );
} 