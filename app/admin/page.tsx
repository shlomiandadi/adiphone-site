'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/admin/AdminLayout';
import DashboardStats from '../../components/admin/DashboardStats';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    posts: 0,
    pages: 0,
    users: 0
  });

  useEffect(() => {
    // בדיקת הרשאות
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // קבלת סטטיסטיקות
    const fetchStats = async () => {
      try {
        const [postsRes, pagesRes, usersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
        ]);

        const [posts, pages, users] = await Promise.all([
          postsRes.json(),
          pagesRes.json(),
          usersRes.json()
        ]);

        setStats({
          posts: posts.length,
          pages: pages.length,
          users: users.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">לוח בקרה</h1>
        <DashboardStats stats={stats} />
      </div>
    </AdminLayout>
  );
} 