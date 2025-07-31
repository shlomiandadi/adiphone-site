import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import UsersManager from '../components/UsersManager';

export default async function UsersPage() {
  const user = await getAdminUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // בדיקת הרשאות - רק מנהלים יכולים לגשת לניהול משתמשים
  if (user.role !== 'admin') {
    redirect('/admin');
  }

  return <UsersManager />;
} 