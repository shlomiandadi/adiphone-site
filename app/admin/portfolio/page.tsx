import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import PortfolioManager from '../components/PortfolioManager';
import AdminLayout from '../../components/admin/AdminLayout';

export default async function PortfolioPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminLayout user={user}>
      <PortfolioManager />
    </AdminLayout>
  );
} 