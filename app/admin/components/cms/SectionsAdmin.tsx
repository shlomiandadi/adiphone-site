'use client';

import { useMemo, useState } from 'react';
import { Area, CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

type Section = {
  id: string;
  type: string;
  title: string;
  content: unknown;
  order: number;
  templateId: string;
  cmsEnabled: boolean | null;
};

type Template = {
  id: string;
  name: string;
  description: string | null;
  cmsEnabled: boolean | null;
  sections: Section[];
};

const TYPES = ['hero', 'content', 'benefits', 'features', 'testimonials', 'pricing', 'process', 'faq', 'cta'];

export default function SectionsAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ templates: Template[] }>(
    '/api/admin/cms/sections'
  );
  const [templateId, setTemplateId] = useState('');
  const templates = data?.templates || [];
  const current = useMemo(
    () => templates.find((row) => row.id === (templateId || templates[0]?.id)),
    [templateId, templates]
  );
  const [draft, setDraft] = useState<Partial<Section>>({
    type: 'hero',
    title: '',
    content: '{}',
    order: 0,
    cmsEnabled: false,
  });

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell
      title="סקשנים"
      hint="התוכן הנוכחי ב-DB הוא placeholder. שום דבר לא מוצג באתר עד שתבנית/סקשן מסומנים cmsEnabled ומקושרים לעמוד."
      error={error}
      message={message}
    >
      <label className="block mb-4 text-sm">
        תבנית
        <select
          className="mr-3 border rounded px-3 py-2"
          value={current?.id || ''}
          onChange={(e) => setTemplateId(e.target.value)}
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </label>
      {current ? (
        <div className="mb-4">
          <EnableField
            checked={Boolean(current.cmsEnabled)}
            onChange={(v) => mutate('PUT', { kind: 'template', id: current.id, name: current.name, description: current.description, cmsEnabled: v })}
            label="הפעל תבנית זו"
          />
        </div>
      ) : null}
      <div className="bg-white rounded shadow p-4 mb-6">
        <label className="block mb-3 text-sm">
          סוג
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={String(draft.type)}
            onChange={(e) => setDraft({ ...draft, type: e.target.value })}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <Field label="כותרת פנימית" value={String(draft.title || '')} onChange={(v) => setDraft({ ...draft, title: v })} />
        <Field label="סדר" type="number" value={Number(draft.order || 0)} onChange={(v) => setDraft({ ...draft, order: Number(v) })} />
        <Area
          label="content JSON"
          rows={12}
          value={typeof draft.content === 'string' ? draft.content : JSON.stringify(draft.content || {}, null, 2)}
          onChange={(v) => setDraft({ ...draft, content: v })}
        />
        <EnableField checked={Boolean(draft.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
        <SaveButton
          saving={saving}
          onClick={() =>
            current &&
            mutate('PUT', {
              ...draft,
              templateId: current.id,
            })
          }
        />
      </div>
      <ul className="bg-white rounded shadow divide-y">
        {(current?.sections || []).map((section) => (
          <li key={section.id} className="p-3 flex justify-between">
            <span>
              {section.order}. [{section.type}] {section.title} {section.cmsEnabled ? '· מופעל' : ''}
            </span>
            <span>
              <button className="text-indigo-600 ml-3" onClick={() => setDraft({ ...section, content: JSON.stringify(section.content, null, 2) })}>
                ערוך
              </button>
              <button className="text-red-600" onClick={() => confirm('למחוק סקשן?') && mutate('DELETE', { id: section.id })}>
                מחק
              </button>
            </span>
          </li>
        ))}
      </ul>
    </CmsShell>
  );
}
