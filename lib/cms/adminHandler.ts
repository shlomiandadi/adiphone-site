import { NextResponse } from 'next/server';
import { jsonError, requireCmsAdmin } from './admin';

export async function cmsGet(fn: () => Promise<unknown>) {
  const unauthorized = await requireCmsAdmin();
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await fn());
  } catch (error) {
    console.error('CMS admin GET failed:', error);
    return jsonError(error instanceof Error ? error.message : 'CMS read failed', 500);
  }
}

export async function cmsWrite(fn: () => Promise<unknown>) {
  const unauthorized = await requireCmsAdmin();
  if (unauthorized) return unauthorized;
  try {
    return NextResponse.json(await fn());
  } catch (error) {
    console.error('CMS admin write failed:', error);
    return jsonError(error instanceof Error ? error.message : 'CMS write failed', 500);
  }
}
