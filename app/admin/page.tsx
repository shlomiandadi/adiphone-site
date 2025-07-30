import { redirect } from 'next/navigation';
import { getAdminUser } from '../../lib/adminAuth';
import AdminDashboard from './components/AdminDashboard';

export default async function AdminPage() {
  const user = await getAdminUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  return <AdminDashboard user={user} />;
} 