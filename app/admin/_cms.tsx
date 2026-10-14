import { redirect } from 'next/navigation';
import { getAdminUser } from '../../lib/adminAuth';
import AdminLayout from '../components/admin/AdminLayout';

export default async function CmsAdminPage({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return <AdminLayout user={user}>{children}</AdminLayout>;
}
