'use client';

import { useState } from 'react';
import { Area, CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Link = { id: string; title: string; url: string | null; order: number; openInNewTab: boolean; columnId: string };
type Column = { id: string; title: string; order: number; isActive: boolean; footerId: string; links: Link[] };
type Footer = {
  id: string;
  description: string | null;
  copyrightText: string;
  cmsEnabled: boolean | null;
  columns: Column[];
};

export default function FooterAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ row: Footer | null }>(
    '/api/admin/cms/footer'
  );
  const footer = data?.row;
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [copyright, setCopyright] = useState<string | null>(null);
  const [columnTitle, setColumnTitle] = useState('');
  const [link, setLink] = useState({ title: '', url: '/', columnId: '', order: 1, openInNewTab: false });

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell
      title="פוטר"
      hint="footer_links ריק ב-DB — האתר נשאר עם הפוטר החי עד ייבוא + cmsEnabled."
      error={error}
      message={message}
    >
      <button
        type="button"
        className="bg-gray-800 text-white px-4 py-2 rounded text-sm mb-4"
        onClick={() => mutate('POST')}
      >
        ייבא את הפוטר החי
      </button>
      <div className="bg-white rounded shadow p-4 mb-6 max-w-2xl">
        <Area
          label="תיאור"
          value={description ?? footer?.description ?? ''}
          onChange={setDescription}
        />
        <Field
          label="copyright"
          value={copyright ?? footer?.copyrightText ?? ''}
          onChange={setCopyright}
        />
        <EnableField
          checked={enabled ?? Boolean(footer?.cmsEnabled)}
          onChange={setEnabled}
        />
        <SaveButton
          saving={saving}
          onClick={() =>
            mutate('PUT', {
              ...footer,
              description: description ?? footer?.description,
              copyrightText: copyright ?? footer?.copyrightText,
              cmsEnabled: enabled ?? Boolean(footer?.cmsEnabled),
            })
          }
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">עמודה חדשה</h2>
          <Field label="כותרת" value={columnTitle} onChange={setColumnTitle} />
          <SaveButton
            saving={saving}
            onClick={() =>
              footer &&
              mutate('PUT', {
                kind: 'column',
                title: columnTitle,
                order: (footer.columns?.length || 0) + 1,
                isActive: true,
                footerId: footer.id,
              })
            }
          />
          <h2 className="font-semibold mt-6 mb-3">קישור</h2>
          <label className="block mb-3 text-sm">
            עמודה
            <select
              className="w-full border rounded px-3 py-2 mt-1"
              value={link.columnId}
              onChange={(e) => setLink({ ...link, columnId: e.target.value })}
            >
              <option value="">בחרו עמודה</option>
              {(footer?.columns || []).map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </label>
          <Field label="כותרת" value={link.title} onChange={(v) => setLink({ ...link, title: v })} />
          <Field label="URL" value={link.url} onChange={(v) => setLink({ ...link, url: v })} />
          <SaveButton saving={saving} onClick={() => mutate('PUT', { kind: 'link', ...link })} />
        </div>
        <div>
          {(footer?.columns || []).map((column) => (
            <div key={column.id} className="bg-white rounded shadow p-4 mb-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <button className="text-red-600 text-sm" onClick={() => confirm('למחוק עמודה?') && mutate('DELETE', { id: column.id, kind: 'column' })}>
                  מחק עמודה
                </button>
              </div>
              <ul className="mt-2 text-sm">
                {column.links.map((entry) => (
                  <li key={entry.id} className="flex justify-between py-1">
                    <span>
                      {entry.title} <span className="font-mono text-gray-500">{entry.url}</span>
                    </span>
                    <button className="text-red-600" onClick={() => mutate('DELETE', { id: entry.id, kind: 'link' })}>
                      מחק
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </CmsShell>
  );
}
