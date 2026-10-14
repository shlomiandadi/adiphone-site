'use client';

import { useMemo, useState } from 'react';
import { Area, CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Row = {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  cmsEnabled: boolean | null;
};

type Live = Record<string, Omit<Row, 'id' | 'cmsEnabled'> & { path: string }>;

export default function SeoPagesAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ rows: Row[]; live: Live }>(
    '/api/admin/cms/seo'
  );
  const [key, setKey] = useState('home');
  const selected = useMemo(
    () => (data?.rows || []).find((row) => row.page === key),
    [data, key]
  );
  const live = data?.live?.[key];
  const [draft, setDraft] = useState<Partial<Row>>({});
  const form = {
    page: key,
    title: draft.title ?? selected?.title ?? live?.title ?? '',
    description: draft.description ?? selected?.description ?? live?.description ?? '',
    keywords: draft.keywords ?? selected?.keywords ?? live?.keywords ?? '',
    ogTitle: draft.ogTitle ?? selected?.ogTitle ?? live?.ogTitle ?? '',
    ogDescription: draft.ogDescription ?? selected?.ogDescription ?? live?.ogDescription ?? '',
    ogImage: draft.ogImage ?? selected?.ogImage ?? '',
    canonicalUrl: draft.canonicalUrl ?? selected?.canonicalUrl ?? live?.canonicalUrl ?? '',
    robots: draft.robots ?? selected?.robots ?? live?.robots ?? '',
    cmsEnabled: draft.cmsEnabled ?? selected?.cmsEnabled ?? false,
    id: selected?.id,
  };

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell
      title="SEO לפי עמוד"
      hint="ייבוא שומר null בשדות שזהים לברירת המחדל של הקוד (robots/OG). cmsEnabled משנה מטא רק בשדות שמילאתם במפורש לנתיב הזה."
      error={error}
      message={message}
    >
      <label className="block mb-4 text-sm">
        עמוד
        <select
          className="mr-3 border rounded px-3 py-2"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setDraft({});
          }}
        >
          {Object.keys(data?.live || { home: 1 }).map((pageKey) => (
            <option key={pageKey} value={pageKey}>
              {pageKey}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          type="button"
          className="text-sm bg-gray-800 text-white px-3 py-2 rounded"
          onClick={() => live && setDraft({ ...live, cmsEnabled: form.cmsEnabled, id: selected?.id })}
        >
          טען ערכים חיים
        </button>
        <button
          type="button"
          className="text-sm bg-gray-800 text-white px-3 py-2 rounded"
          onClick={() => mutate('POST')}
        >
          ייבא את ה-SEO החי לכל העמודים
        </button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <Field label="title" value={form.title} onChange={(v) => setDraft({ ...form, title: v })} />
        <Area label="description" value={form.description} onChange={(v) => setDraft({ ...form, description: v })} />
        <Area label="keywords" value={form.keywords} onChange={(v) => setDraft({ ...form, keywords: v })} rows={2} />
        <Field label="ogTitle" value={String(form.ogTitle || '')} onChange={(v) => setDraft({ ...form, ogTitle: v })} />
        <Area label="ogDescription" value={String(form.ogDescription || '')} onChange={(v) => setDraft({ ...form, ogDescription: v })} rows={2} />
        <Field label="ogImage" value={String(form.ogImage || '')} onChange={(v) => setDraft({ ...form, ogImage: v })} />
        <Field label="canonicalUrl" value={String(form.canonicalUrl || '')} onChange={(v) => setDraft({ ...form, canonicalUrl: v })} />
        <Field label="robots" value={form.robots} onChange={(v) => setDraft({ ...form, robots: v })} />
        <EnableField checked={Boolean(form.cmsEnabled)} onChange={(v) => setDraft({ ...form, cmsEnabled: v })} />
        <SaveButton saving={saving} onClick={() => mutate('PUT', form)} />
      </div>
    </CmsShell>
  );
}
