import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminContactsClient from '../components/AdminContactsClient';

export default async function AdminContactsPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <AdminContactsClient />
    </AdminLayout>
  );
} 