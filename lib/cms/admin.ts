import { NextResponse } from 'next/server';
import { requireAdminApiAuth } from '../adminAuth';
import { revalidateCmsTag } from './cache';
import { revalidateSitePaths } from '../revalidateContent';
import { FOOTER_IMPORT as FOOTER_IMPORT_DATA } from './footerData';

export const PAGE_TEMPLATES = ['GENERAL', 'SERVICE', 'ABOUT', 'CONTACT', 'LANDING', 'BLOG'] as const;
export const MENU_LOCATIONS = [
  'HEADER_MAIN',
  'HEADER_SECONDARY',
  'FOOTER_MAIN',
  'FOOTER_SECONDARY',
  'MOBILE',
] as const;

export type PageTemplateValue = (typeof PAGE_TEMPLATES)[number];
export type MenuLocationValue = (typeof MENU_LOCATIONS)[number];

export function parsePageTemplate(value: unknown): PageTemplateValue {
  const next = String(value || '');
  return (PAGE_TEMPLATES as readonly string[]).includes(next) ? (next as PageTemplateValue) : 'GENERAL';
}

export function parseMenuLocation(value: unknown): MenuLocationValue {
  const next = String(value || '');
  return (MENU_LOCATIONS as readonly string[]).includes(next) ? (next as MenuLocationValue) : 'HEADER_MAIN';
}

export const CMS_ROLES = ['ADMIN', 'EDITOR'];

export async function requireCmsAdmin() {
  return requireAdminApiAuth({ role: CMS_ROLES });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function stamp() {
  const now = new Date();
  return { createdAt: now, updatedAt: now };
}

export function touch() {
  return { updatedAt: new Date() };
}

export function revalidateLayout() {
  revalidateCmsTag();
  revalidateSitePaths(['/'], true);
}

export { LIVE_SEO } from './liveSeo';
export const FOOTER_IMPORT = FOOTER_IMPORT_DATA;
