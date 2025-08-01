import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import TagsManager from '../components/TagsManager';
import AdminLayout from '../../components/admin/AdminLayout';

export default async function TagsPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <TagsManager />
    </AdminLayout>
  );
} 