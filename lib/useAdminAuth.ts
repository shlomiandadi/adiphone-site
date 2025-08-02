'use client';

import { useState, useEffect } from 'react';
import { AdminUser } from './adminAuth';

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('שגיאה בבדיקת אימות:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('שגיאה בהתנתקות:', error);
    }
  };

  return { user, loading, logout };
} 