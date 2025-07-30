import { redirect } from 'next/navigation';
import { getAdminUser } from '../../../lib/adminAuth';
import TagsManager from '../components/TagsManager';

export default async function TagsPage() {
  const user = await getAdminUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  return <TagsManager />;
} 