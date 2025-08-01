import { redirect } from 'next/navigation';
import { getAdminUser } from '../../lib/adminAuth';
import AdminDashboard from './components/AdminDashboard';
import AdminLayout from '../components/admin/AdminLayout';

export default async function AdminPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <AdminDashboard user={user} />
    </AdminLayout>
  );
} 