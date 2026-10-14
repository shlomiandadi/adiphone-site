'use client';

import { useState } from 'react';
import { Area, CmsShell, EnableField, Field, SaveButton, useCmsResource } from './CmsUi';

function listValue(value: string[] | string | undefined) {
  if (Array.isArray(value)) return value.join('\n');
  return String(value || '');
}

export function GeneralSettingsAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ row: Record<string, string | boolean | null> | null }>(
    '/api/admin/cms/site-settings'
  );
  const row = data?.row || {};
  const [draft, setDraft] = useState<Record<string, string | boolean>>({});
  const value = (key: string) => (key in draft ? draft[key] : row[key] ?? '');
  const set = (key: string, v: string | boolean) => setDraft({ ...draft, [key]: v });

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell title="הגדרות כלליות" hint="מזהי GA/GTM/Pixel ריקים משאירים את הערכים החיים (G-QMC63HG6SD / GTM-NHQ4DRWX)." error={error} message={message}>
      <div className="bg-white rounded shadow p-4 max-w-2xl">
        {['siteName', 'siteDescription', 'siteKeywords', 'siteUrl', 'siteLogo', 'siteFavicon', 'googleAnalyticsId', 'googleTagManagerId', 'facebookPixelId', 'twitterHandle', 'facebookPage', 'instagramHandle', 'linkedinPage'].map((key) => (
          <Field key={key} label={key} value={String(value(key) || '')} onChange={(v) => set(key, v)} />
        ))}
        <EnableField checked={Boolean(value('cmsEnabled'))} onChange={(v) => set('cmsEnabled', v)} />
        <SaveButton saving={saving} onClick={() => mutate('PUT', { ...row, ...draft })} />
      </div>
    </CmsShell>
  );
}

export function RobotsSettingsAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ row: Record<string, unknown> | null }>(
    '/api/admin/cms/robots'
  );
  const row = data?.row || {};
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const merged = { ...row, ...draft };
  const allow = listValue(merged.allowPaths as string[]);
  const disallow = listValue(merged.disallowPaths as string[]);
  const preview = [
    `User-agent: ${merged.userAgent || '*'}`,
    ...(allow.split('\n').filter(Boolean).map((p) => `Allow: ${p}`)),
    ...(disallow.split('\n').filter(Boolean).map((p) => `Disallow: ${p}`)),
    merged.crawlDelay ? `Crawl-delay: ${merged.crawlDelay}` : '',
    `Sitemap: ${merged.sitemapUrl || 'https://adi-phone.co.il/sitemap.xml'}`,
  ]
    .filter(Boolean)
    .join('\n');

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell
      title="Robots"
      hint="לא ניתן להפעיל אם Disallow כולל / או /_next, או אם רשימת Allow קיימת בלי /."
      error={error}
      message={message}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <Field label="userAgent" value={String(merged.userAgent || '*')} onChange={(v) => setDraft({ ...draft, userAgent: v })} />
          <Area label="Allow (שורה לכל נתיב)" value={allow} onChange={(v) => setDraft({ ...draft, allowPaths: v })} />
          <Area label="Disallow" value={disallow} onChange={(v) => setDraft({ ...draft, disallowPaths: v })} />
          <Field label="crawlDelay" type="number" value={Number(merged.crawlDelay || 0)} onChange={(v) => setDraft({ ...draft, crawlDelay: Number(v) })} />
          <Field label="sitemapUrl" value={String(merged.sitemapUrl || '')} onChange={(v) => setDraft({ ...draft, sitemapUrl: v })} />
          <label className="flex gap-2 mb-2 text-sm">
            <input type="checkbox" checked={Boolean(merged.isActive)} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
            isActive
          </label>
          <EnableField checked={Boolean(merged.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
          <SaveButton saving={saving} onClick={() => mutate('PUT', { ...merged, allowPaths: allow, disallowPaths: disallow })} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">תצוגה מקדימה</h2>
          <pre className="bg-gray-900 text-green-200 p-4 rounded text-sm whitespace-pre-wrap">{preview}</pre>
        </div>
      </div>
    </CmsShell>
  );
}

export function SitemapSettingsAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ row: Record<string, unknown> | null }>(
    '/api/admin/cms/sitemap'
  );
  const row = data?.row || {
    isEnabled: true,
    includePages: true,
    includePosts: true,
    includeCategories: false,
    includePortfolio: true,
    excludePages: [],
    excludePaths: [],
    priority: 0.8,
    changeFreq: 'weekly',
    cmsEnabled: false,
  };
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const merged = { ...row, ...draft };

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell title="Sitemap" hint="includeCategories כבוי כברירת מחדל כמו באתר החי. cmsEnabled חייב להיות דלוק כדי שהדגלים ייכנסו ל-sitemap.xml." error={error} message={message}>
      <div className="bg-white rounded shadow p-4 max-w-2xl">
        {['isEnabled', 'includePages', 'includePosts', 'includeCategories', 'includePortfolio'].map((key) => (
          <label key={key} className="flex gap-2 mb-2 text-sm">
            <input type="checkbox" checked={Boolean(merged[key])} onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })} />
            {key}
          </label>
        ))}
        <Area label="excludePages" value={listValue(merged.excludePages as string[])} onChange={(v) => setDraft({ ...draft, excludePages: v })} />
        <Area label="excludePaths" value={listValue(merged.excludePaths as string[])} onChange={(v) => setDraft({ ...draft, excludePaths: v })} />
        <Field label="priority" type="number" value={Number(merged.priority || 0.8)} onChange={(v) => setDraft({ ...draft, priority: Number(v) })} />
        <Field label="changeFreq" value={String(merged.changeFreq || 'weekly')} onChange={(v) => setDraft({ ...draft, changeFreq: v })} />
        <EnableField checked={Boolean(merged.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
        <SaveButton saving={saving} onClick={() => mutate('PUT', merged)} />
      </div>
    </CmsShell>
  );
}

export function AnnouncementAdmin() {
  const { data, loading, saving, message, error, mutate } = useCmsResource<{ row: Record<string, unknown> | null }>(
    '/api/admin/cms/announcement'
  );
  const row = data?.row || {};
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const merged = { ...row, ...draft };

  if (loading) return <div className="p-6">טוען…</div>;

  return (
    <CmsShell title="סרט הודעות" hint="מוצג באתר רק אם isActive ו-cmsEnabled. כרגע isActive=false." error={error} message={message}>
      <div className="bg-white rounded shadow p-4 max-w-2xl">
        <Area label="טקסט" value={String(merged.text || '')} onChange={(v) => setDraft({ ...draft, text: v })} />
        <Field label="backgroundColor" value={String(merged.backgroundColor || '#3b82f6')} onChange={(v) => setDraft({ ...draft, backgroundColor: v })} />
        <Field label="textColor" value={String(merged.textColor || '#ffffff')} onChange={(v) => setDraft({ ...draft, textColor: v })} />
        <Field label="linkUrl" value={String(merged.linkUrl || '')} onChange={(v) => setDraft({ ...draft, linkUrl: v })} />
        <Field label="linkText" value={String(merged.linkText || '')} onChange={(v) => setDraft({ ...draft, linkText: v })} />
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(merged.isActive)} onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })} />
          isActive
        </label>
        <label className="flex gap-2 mb-2 text-sm">
          <input type="checkbox" checked={Boolean(merged.showCloseButton)} onChange={(e) => setDraft({ ...draft, showCloseButton: e.target.checked })} />
          כפתור סגירה
        </label>
        <EnableField checked={Boolean(merged.cmsEnabled)} onChange={(v) => setDraft({ ...draft, cmsEnabled: v })} />
        <SaveButton saving={saving} onClick={() => mutate('PUT', merged)} />
      </div>
    </CmsShell>
  );
}
