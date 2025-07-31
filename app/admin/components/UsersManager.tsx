'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  postCount: number;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
  isActive: boolean;
}

const ROLES = [
  { value: 'admin', label: 'מנהל', description: 'גישה מלאה לכל המערכת' },
  { value: 'editor', label: 'עורך', description: 'ניהול פוסטים וקטגוריות' },
  { value: 'author', label: 'כותב', description: 'יצירה ועריכה של פוסטים בלבד' }
];

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'author',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      setError('שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ולידציה
    if (!formData.username || !formData.email) {
      setError('שם משתמש ואימייל הם שדות חובה');
      return;
    }

    if (!editingUser && !formData.password) {
      setError('סיסמה היא שדה חובה למשתמש חדש');
      return;
    }

    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users';
      
      const method = editingUser ? 'PUT' : 'POST';

      // אם זה עדכון ולא שינינו סיסמה, לא נשלח אותה
      const submitData = editingUser && !formData.password 
        ? { ...formData, password: undefined }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(editingUser ? 'משתמש עודכן בהצלחה!' : 'משתמש נוצר בהצלחה!');
        resetForm();
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'שגיאה בשמירת המשתמש');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // לא נציג סיסמה קיימת
      role: user.role,
      isActive: user.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('משתמש נמחק בהצלחה!');
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'שגיאה במחיקת המשתמש');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setSuccess(`משתמש ${!currentStatus ? 'הופעל' : 'הושבת'} בהצלחה!`);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'שגיאה בשינוי סטטוס המשתמש');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'author',
      isActive: true
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getRoleLabel = (role: string) => {
    const roleObj = ROLES.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'author': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'לא התחבר';
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ניהול משתמשים</h1>
              <p className="text-gray-600">צור וערוך משתמשים במערכת</p>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                הוסף משתמש
              </button>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                חזרה לדשבורד
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">רשימת משתמשים</h3>
              </div>
              
              {users.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  אין משתמשים עדיין
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <div key={user.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {user.username}
                            </h4>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center space-x-4 space-x-reverse mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                {getRoleLabel(user.role)}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'פעיל' : 'מושבת'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {user.postCount} פוסטים
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              התחברות אחרונה: {formatDate(user.lastLogin)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                            className={`text-sm px-3 py-1 rounded ${
                              user.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {user.isActive ? 'השבת' : 'הפעל'}
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            מחק
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingUser ? 'עריכת משתמש' : 'משתמש חדש'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      שם משתמש *
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="הכנס שם משתמש..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      אימייל *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="הכנס אימייל..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      סיסמה {!editingUser && '*'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={editingUser ? "השאר ריק אם לא רוצה לשנות" : "הכנס סיסמה..."}
                      required={!editingUser}
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      תפקיד *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {ROLES.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="mr-2 text-sm text-gray-700">משתמש פעיל</span>
                    </label>
                  </div>

                  <div className="flex space-x-2 space-x-reverse pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {editingUser ? 'עדכן' : 'צור'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      ביטול
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 