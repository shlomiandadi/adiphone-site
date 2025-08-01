import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import UsersManager from '../components/UsersManager';
import AdminLayout from '../../components/admin/AdminLayout';

export default async function UsersPage() {
  const user = await getAdminUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // בדיקת הרשאות - רק מנהלים יכולים לגשת לניהול משתמשים
  if (user.role !== 'ADMIN') {
    redirect('/admin');
  }

  return (
    <AdminLayout user={user}>
      <UsersManager />
    </AdminLayout>
  );
} 