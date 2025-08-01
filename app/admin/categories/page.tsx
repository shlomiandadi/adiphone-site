import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import CategoriesManager from '../components/CategoriesManager';
import AdminLayout from '../../components/admin/AdminLayout';

export default async function CategoriesPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <CategoriesManager />
    </AdminLayout>
  );
} 