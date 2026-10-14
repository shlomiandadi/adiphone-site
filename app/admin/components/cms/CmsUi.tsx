'use client';

import { useCallback, useEffect, useState } from 'react';

export function useCmsResource<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'שגיאה בטעינה');
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינה');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  const mutate = useCallback(
    async (method: string, body?: unknown) => {
      setSaving(true);
      setError('');
      setMessage('');
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'שגיאה בשמירה');
        setMessage('נשמר בהצלחה');
        await reload();
        return json;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'שגיאה בשמירה');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [reload, url]
  );

  return { data, loading, saving, message, error, reload, mutate, setData };
}

export function CmsShell({
  title,
  hint,
  children,
  message,
  error,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  message?: string;
  error?: string;
}) {
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      {hint ? <p className="text-sm text-gray-600 mb-4">{hint}</p> : null}
      {error ? <div className="mb-4 rounded bg-red-50 text-red-700 px-4 py-2">{error}</div> : null}
      {message ? <div className="mb-4 rounded bg-green-50 text-green-700 px-4 py-2">{message}</div> : null}
      {children}
    </div>
  );
}

export function EnableField({
  checked,
  onChange,
  label = 'הפעל באתר (cmsEnabled) — בלי זה האתר ממשיך עם הפלט הנוכחי',
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-start gap-2 text-sm font-medium text-gray-800 bg-amber-50 border border-amber-200 rounded p-3 my-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1" />
      <span>{label}</span>
    </label>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block mb-3 text-sm">
      <span className="block text-gray-700 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </label>
  );
}

export function Area({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block mb-3 text-sm">
      <span className="block text-gray-700 mb-1">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 font-mono text-sm"
      />
    </label>
  );
}

export function SaveButton({ saving, onClick, label = 'שמירה' }: { saving: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
    >
      {saving ? 'שומר…' : label}
    </button>
  );
}
