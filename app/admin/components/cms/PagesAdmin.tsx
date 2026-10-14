'use client';

import { useState } from 'react';
import { Area, CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  template: string;
  templateId: string | null;
  cmsEnabled: boolean | null;
};

export default function PagesAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{
    pages: Page[];
    templates: { id: string; name: string }[];
  }>('/api/admin/cms/pages');
  const [draft, setDraft] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    published: false,
    template: 'DEFAULT',
    cmsEnabled: false,
  });

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell
      title="עמודי CMS"
      hint="Catch-all רק ל-slugs בלי route קיים, ורק אם published ו-cmsEnabled."
      error={error}
      message={message}
    >
      <div className="bg-white rounded shadow p-4 mb-6 max-w-2xl">
        <Field label="כותרת" value={String(draft.title || '')} onChange={(v) => setDraft({ ...draft, title: v })} />
        <Field label="slug" value={String(draft.slug || '')} onChange={(v) => setDraft({ ...draft, slug: v })} />
        <label className="block mb-3 text-sm">
          template enum
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={String(draft.template || 'DEFAULT')}
            onChange={(e) => setDraft({ ...draft, template: e.target.value })}
          >
            {['DEFAULT', 'HOME', 'ABOUT', 'SERVICE', 'LANDING', 'CONTACT', 'BLOG', 'CUSTOM'].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-3 text-sm">
          תבנית סקשנים
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={draft.templateId || ''}
            onChange={(e) => setDraft({ ...draft, templateId: e.target.value || null })}
          >
            <option value="">ללא</option>
            {(data?.templates || []).map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
        <Area label="תוכן HTML" rows={8} value={String(draft.content || '')} onChange={(v) => setDraft({ ...draft, content: v })} />
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(draft.published)} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />
          published
        </label>
        <EnableField checked={Boolean(draft.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
        <SaveButton saving={saving} onClick={() => mutate('PUT', draft)} />
      </div>
      <table className="min-w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-right">כותרת</th>
            <th className="p-2 text-right">slug</th>
            <th className="p-2 text-right">פורסם</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data?.pages || []).map((page) => (
            <tr key={page.id} className="border-t">
              <td className="p-2">{page.title}</td>
              <td className="p-2 font-mono">{page.slug}</td>
              <td className="p-2">{page.published ? 'כן' : 'לא'}</td>
              <td className="p-2">
                <button className="text-indigo-600 ml-3" onClick={() => setDraft(page)}>ערוך</button>
                <button className="text-red-600" onClick={() => confirm('למחוק?') && mutate('DELETE', { id: page.id })}>מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CmsShell>
  );
}
