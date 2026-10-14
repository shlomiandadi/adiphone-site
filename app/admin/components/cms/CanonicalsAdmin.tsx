'use client';

import { useState } from 'react';
import { CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Row = {
  id: string;
  pageSlug: string;
  canonicalUrl: string;
  isActive: boolean;
  cmsEnabled: boolean | null;
};

export default function CanonicalsAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ rows: Row[] }>(
    '/api/admin/cms/canonicals'
  );
  const [draft, setDraft] = useState<Partial<Row>>({
    pageSlug: '/',
    canonicalUrl: 'https://adi-phone.co.il/',
    isActive: true,
    cmsEnabled: false,
  });

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell title="קנוניקל" hint="חל רק כש-cmsEnabled מסומן. אחרת נשאר ה-canonical הנוכחי של העמוד." error={error} message={message}>
      <button
        type="button"
        className="bg-gray-800 text-white px-4 py-2 rounded text-sm mb-4"
        onClick={() => mutate('POST')}
      >
        ייבא קנוניקל חיים
      </button>
      <div className="bg-white rounded shadow p-4 mb-6">
        <Field label="נתיב" value={String(draft.pageSlug || '')} onChange={(v) => setDraft({ ...draft, pageSlug: v })} />
        <Field label="canonical URL" value={String(draft.canonicalUrl || '')} onChange={(v) => setDraft({ ...draft, canonicalUrl: v })} />
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(draft.isActive)} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
          פעיל
        </label>
        <EnableField checked={Boolean(draft.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
        <SaveButton saving={saving} onClick={() => mutate('PUT', draft)} />
      </div>
      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-right">נתיב</th>
            <th className="p-2 text-right">canonical</th>
            <th className="p-2 text-right">מופעל</th>
            <th className="p-2 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {(data?.rows || []).map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-2 font-mono">{row.pageSlug}</td>
              <td className="p-2">{row.canonicalUrl}</td>
              <td className="p-2">{row.cmsEnabled ? 'כן' : 'לא'}</td>
              <td className="p-2">
                <button className="text-indigo-600 ml-3" onClick={() => setDraft(row)}>ערוך</button>
                <button className="text-red-600" onClick={() => confirm('למחוק?') && mutate('DELETE', { id: row.id })}>מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CmsShell>
  );
}
