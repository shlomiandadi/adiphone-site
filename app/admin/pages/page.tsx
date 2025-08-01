import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import PagesManager from '../components/PagesManager';
import AdminLayout from '../../components/admin/AdminLayout';

export default async function PagesPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <PagesManager />
    </AdminLayout>
  );
} 