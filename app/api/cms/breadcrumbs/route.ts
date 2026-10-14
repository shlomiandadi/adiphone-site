import { NextResponse } from 'next/server';
import { getBreadcrumbMap } from '../../../lib/cms/breadcrumbs';

export const revalidate = 3600;

/** Small cached JSON map of pathname → CMS breadcrumb trail. */
export async function GET() {
  try {
    const map = await getBreadcrumbMap();
    return NextResponse.json(map, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.warn('CMS breadcrumbs API fell back to empty map:', error);
    return NextResponse.json({});
  }
}
