'use client';

import { useState } from 'react';
import { CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Item = {
  id: string;
  title: string;
  url: string | null;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  parentId: string | null;
  menuId: string;
  children?: Item[];
};

type Menu = {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  cmsEnabled: boolean | null;
  items: Item[];
};

export default function NavigationAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{
    header: Record<string, unknown> | null;
    menus: Menu[];
  }>('/api/admin/cms/navigation');
  const menu = data?.menus?.find((row) => row.location === 'HEADER_MAIN') || data?.menus?.[0];
  const [item, setItem] = useState<Partial<Item>>({
    title: '',
    url: '/',
    order: 1,
    isActive: true,
    openInNewTab: false,
    parentId: null,
  });
  const [headerEnabled, setHeaderEnabled] = useState<boolean | null>(null);
  const [menuEnabled, setMenuEnabled] = useState<boolean | null>(null);

  if (loading) return <div className="p-6">טוען…</div>;

  const roots = (menu?.items || []).filter((entry) => !entry.parentId);
  const cmsMenu = menuEnabled ?? Boolean(menu?.cmsEnabled);
  const cmsHeader = headerEnabled ?? Boolean(data?.header?.cmsEnabled);

  return (
    <CmsShell
      title="ניווט"
      hint="ייבוא ממלא את HEADER_MAIN מ-navigation-data.ts בלי להפעיל באתר. סמנו cmsEnabled רק אחרי בדיקה."
      error={error}
      message={message}
    >
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm"
          onClick={() => mutate('POST', { action: 'import' })}
        >
          ייבא את הניווט החי
        </button>
        <EnableField
          checked={cmsMenu}
          onChange={(v) => setMenuEnabled(v)}
          label="הפעל תפריט HEADER_MAIN באתר"
        />
        <SaveButton
          saving={saving}
          label="שמור מצב תפריט"
          onClick={() => menu && mutate('PUT', { kind: 'menu', id: menu.id, name: menu.name, location: menu.location, isActive: true, cmsEnabled: cmsMenu })}
        />
      </div>
      <div className="bg-white rounded shadow p-4 mb-6 max-w-xl">
        <h2 className="font-semibold mb-3">פריט תפריט</h2>
        <Field label="כותרת" value={String(item.title || '')} onChange={(v) => setItem({ ...item, title: v })} />
        <Field label="URL" value={String(item.url || '')} onChange={(v) => setItem({ ...item, url: v })} />
        <Field label="סדר" type="number" value={Number(item.order || 0)} onChange={(v) => setItem({ ...item, order: Number(v) })} />
        <label className="block mb-3 text-sm">
          הורה
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={item.parentId || ''}
            onChange={(e) => setItem({ ...item, parentId: e.target.value || null })}
          >
            <option value="">פריט עליון</option>
            {roots.map((root) => (
              <option key={root.id} value={root.id}>
                {root.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(item.openInNewTab)} onChange={(e) => setItem({ ...item, openInNewTab: e.target.checked })} />
          פתח בטאב חדש
        </label>
        <label className="flex gap-2 mb-3 text-sm">
          <input type="checkbox" checked={item.isActive !== false} onChange={(e) => setItem({ ...item, isActive: e.target.checked })} />
          פעיל
        </label>
        <SaveButton
          saving={saving}
          onClick={() =>
            menu &&
            mutate('PUT', {
              ...item,
              menuId: menu.id,
            })
          }
        />
      </div>
      <ul className="bg-white rounded shadow divide-y mb-8">
        {roots.map((root) => (
          <li key={root.id} className="p-3">
            <div className="flex justify-between">
              <span>
                {root.order}. {root.title} <span className="font-mono text-gray-500">{root.url}</span>
              </span>
              <span className="space-x-2 space-x-reverse">
                <button className="text-indigo-600" onClick={() => setItem(root)}>ערוך</button>
                <button className="text-red-600" onClick={() => confirm('למחוק?') && mutate('DELETE', { id: root.id })}>מחק</button>
              </span>
            </div>
            <ul className="pr-6 mt-2 text-sm text-gray-700">
              {(root.children || []).map((child) => (
                <li key={child.id} className="flex justify-between py-1">
                  <span>
                    {child.order}. {child.title} <span className="font-mono">{child.url}</span>
                  </span>
                  <span>
                    <button className="text-indigo-600 ml-3" onClick={() => setItem(child)}>ערוך</button>
                    <button className="text-red-600" onClick={() => confirm('למחוק?') && mutate('DELETE', { id: child.id })}>מחק</button>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="bg-white rounded shadow p-4 max-w-xl">
        <h2 className="font-semibold mb-2">Header settings</h2>
        <p className="text-sm text-gray-600 mb-2">הלוגו/חיפוש מהטבלה header לא מחליפים את ה-header החי עד cmsEnabled.</p>
        <EnableField checked={cmsHeader} onChange={setHeaderEnabled} label="הפעל הגדרות header" />
        <SaveButton
          saving={saving}
          onClick={() => mutate('PUT', { kind: 'header', ...(data?.header || {}), cmsEnabled: cmsHeader })}
        />
      </div>
    </CmsShell>
  );
}
