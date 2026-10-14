'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'חדש' },
  { value: 'IN_PROGRESS', label: 'בטיפול' },
  { value: 'COMPLETED', label: 'הושלם' },
] as const;

const SERVICE_LABELS: Record<string, string> = {
  WEB_DEVELOPMENT: 'פיתוח אתרים',
  SEO: 'קידום אתרים',
  PPC: 'פרסום ממומן',
  OTHER: 'אחר',
};

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-700',
};

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status;
}

function csvEscape(value: string) {
  const normalized = value.replace(/"/g, '""');
  return `"${normalized}"`;
}

export default function AdminContactsClient() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (debouncedQuery.trim()) params.set('q', debouncedQuery.trim());
      const qs = params.toString();
      const response = await fetch(`/api/admin/contacts${qs ? `?${qs}` : ''}`, {
        credentials: 'same-origin',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, debouncedQuery]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleStatusChange = async (id: string, status: string) => {
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'שגיאה בעדכון הסטטוס');
      }
      const data = await response.json();
      setContacts((prev) => prev.map((contact) => (contact.id === id ? data.contact : contact)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בעדכון הסטטוס');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את הפנייה? הפעולה לא ניתנת לביטול.')) {
      return;
    }
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'שגיאה במחיקת הפנייה');
      }
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה במחיקת הפנייה');
    } finally {
      setBusyId(null);
    }
  };

  const handleExportCsv = () => {
    const header = ['name', 'email', 'phone', 'service', 'status', 'message', 'createdAt'];
    const rows = contacts.map((contact) =>
      [
        contact.name,
        contact.email,
        contact.phone,
        contact.service,
        contact.status,
        contact.message,
        contact.createdAt,
      ].map((value) => csvEscape(String(value ?? ''))).join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const counts = useMemo(() => {
    return {
      all: contacts.length,
      new: contacts.filter((contact) => contact.status === 'NEW').length,
    };
  }, [contacts]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">פניות / לידים</h1>
          <p className="text-sm text-gray-600">
            {counts.all} פניות{counts.new ? ` · ${counts.new} חדשות` : ''}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={contacts.length === 0}
          className="self-start rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ייצוא CSV
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי שם, אימייל או טלפון"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">כל הסטטוסים</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {isLoading ? (
        <div className="p-4 text-gray-600">טוען פניות...</div>
      ) : contacts.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">אין פניות להצגה</div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">שם</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">יצירת קשר</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">שירות</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">סטטוס</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">תאריך</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-4 py-4 align-top">
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <p className="mt-1 max-w-xs text-sm text-gray-600">{contact.message}</p>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-gray-700">
                    <div>{contact.phone}</div>
                    <div>{contact.email}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-gray-700">
                    {SERVICE_LABELS[contact.service] || contact.service}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLES[contact.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabel(contact.status)}
                      </span>
                      <select
                        value={['NEW', 'IN_PROGRESS', 'COMPLETED'].includes(contact.status) ? contact.status : 'NEW'}
                        disabled={busyId === contact.id}
                        onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleString('he-IL')}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={busyId === contact.id}
                      className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
