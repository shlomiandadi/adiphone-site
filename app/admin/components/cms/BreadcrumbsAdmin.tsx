'use client';

import { useState } from 'react';
import { Area, CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Node = {
  id: string;
  pageId: string;
  pageSlug: string;
  pageTitle: string;
  parentId: string | null;
  level: number;
  order: number;
  isActive: boolean;
  showInBreadcrumb: boolean;
  breadcrumbTitle: string | null;
  cmsEnabled: boolean | null;
};

type Crumb = {
  id: string;
  pageSlug: string;
  breadcrumbData: unknown;
  isActive: boolean;
  cmsEnabled: boolean | null;
};

export default function BreadcrumbsAdmin() {
  const hierarchy = useCmsResource<{ nodes: Node[] }>('/api/admin/cms/hierarchy');
  const crumbs = useCmsResource<{ rows: Crumb[] }>('/api/admin/cms/breadcrumbs');
  const [draft, setDraft] = useState<Partial<Node>>({
    pageId: '',
    pageSlug: '/',
    pageTitle: '',
    level: 0,
    order: 1,
    isActive: true,
    showInBreadcrumb: true,
    cmsEnabled: false,
  });
  const [override, setOverride] = useState<Partial<Crumb>>({
    pageSlug: '/',
    breadcrumbData: '[]',
    isActive: true,
    cmsEnabled: false,
  });

  return (
    <CmsShell
      title="פירורי לחם"
      hint="עץ page_hierarchy הוא המקור העיקרי. JSON ב-breadcrumbs הוא override לפי slug. cmsEnabled חייב להיות דלוק כדי שהאתר ישתמש בזה."
      error={hierarchy.error || crumbs.error}
      message={hierarchy.message || crumbs.message}
    >
      <h2 className="text-lg font-semibold mb-3">עץ היררכיה</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        <Field label="pageId" value={String(draft.pageId || '')} onChange={(v) => setDraft({ ...draft, pageId: v })} />
        <Field label="נתיב" value={String(draft.pageSlug || '')} onChange={(v) => setDraft({ ...draft, pageSlug: v })} />
        <Field label="כותרת" value={String(draft.pageTitle || '')} onChange={(v) => setDraft({ ...draft, pageTitle: v })} />
        <Field label="כותרת ב-breadcrumb" value={String(draft.breadcrumbTitle || '')} onChange={(v) => setDraft({ ...draft, breadcrumbTitle: v })} />
        <label className="block mb-3 text-sm">
          <span className="block mb-1">הורה</span>
          <select
            className="w-full border rounded px-3 py-2"
            value={draft.parentId || ''}
            onChange={(e) => setDraft({ ...draft, parentId: e.target.value || null })}
          >
            <option value="">ללא (שורש)</option>
            {(hierarchy.data?.nodes || []).map((node) => (
              <option key={node.id} value={node.id}>
                {node.pageTitle} ({node.pageSlug})
              </option>
            ))}
          </select>
        </label>
        <Field label="level" type="number" value={Number(draft.level || 0)} onChange={(v) => setDraft({ ...draft, level: Number(v) })} />
        <Field label="order" type="number" value={Number(draft.order || 0)} onChange={(v) => setDraft({ ...draft, order: Number(v) })} />
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(draft.isActive)} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
          פעיל
        </label>
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(draft.showInBreadcrumb)} onChange={(e) => setDraft({ ...draft, showInBreadcrumb: e.target.checked })} />
          הצג ב-breadcrumb
        </label>
        <EnableField checked={Boolean(draft.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
        <SaveButton saving={hierarchy.saving} onClick={() => hierarchy.mutate('PUT', draft)} />
      </div>
      <div className="overflow-x-auto bg-white rounded shadow mb-10">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-right">סדר</th>
              <th className="p-2 text-right">כותרת</th>
              <th className="p-2 text-right">נתיב</th>
              <th className="p-2 text-right">cmsEnabled</th>
              <th className="p-2 text-right">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {(hierarchy.data?.nodes || []).map((node) => (
              <tr key={node.id} className="border-t">
                <td className="p-2">{node.order}</td>
                <td className="p-2">{node.breadcrumbTitle || node.pageTitle}</td>
                <td className="p-2 font-mono">{node.pageSlug}</td>
                <td className="p-2">{node.cmsEnabled ? 'כן' : 'לא'}</td>
                <td className="p-2 space-x-2 space-x-reverse">
                  <button className="text-indigo-600" onClick={() => setDraft(node)}>ערוך</button>
                  <button
                    className="text-red-600"
                    onClick={() => confirm('למחוק?') && hierarchy.mutate('DELETE', { id: node.id })}
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold mb-3">Override לפי slug (JSON)</h2>
      <div className="bg-white rounded shadow p-4 mb-6">
        <Field label="slug" value={String(override.pageSlug || '')} onChange={(v) => setOverride({ ...override, pageSlug: v })} />
        <Area
          label='breadcrumbData (מערך [{"url","title","isActive"}])'
          rows={8}
          value={
            typeof override.breadcrumbData === 'string'
              ? override.breadcrumbData
              : JSON.stringify(override.breadcrumbData || [], null, 2)
          }
          onChange={(v) => setOverride({ ...override, breadcrumbData: v })}
        />
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(override.isActive)} onChange={(e) => setOverride({ ...override, isActive: e.target.checked })} />
          פעיל
        </label>
        <EnableField checked={Boolean(override.cmsEnabled)} onChange={(v) => setOverride({ ...override, cmsEnabled: v })} />
        <SaveButton saving={crumbs.saving} onClick={() => crumbs.mutate('PUT', override)} />
      </div>
      <ul className="bg-white rounded shadow divide-y">
        {(crumbs.data?.rows || []).map((row) => (
          <li key={row.id} className="p-3 flex justify-between gap-4">
            <span className="font-mono text-sm">{row.pageSlug}</span>
            <span>{row.cmsEnabled ? 'מופעל' : 'לא מופעל'}</span>
            <div className="space-x-2 space-x-reverse">
              <button className="text-indigo-600" onClick={() => setOverride({ ...row, breadcrumbData: JSON.stringify(row.breadcrumbData, null, 2) })}>
                ערוך
              </button>
              <button className="text-red-600" onClick={() => confirm('למחוק?') && crumbs.mutate('DELETE', { id: row.id })}>
                מחק
              </button>
            </div>
          </li>
        ))}
      </ul>
    </CmsShell>
  );
}
