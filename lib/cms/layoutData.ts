import { GA4_MEASUREMENT_ID } from '../tracking';
import { getBreadcrumbMap, type CmsBreadcrumbItem } from './breadcrumbs';
import { cmsCache } from './cache';
import { getFooter } from './footer';
import { getHeaderMenu } from './navigation';
import { getSiteSettings, getTrackingIds, GTM_CONTAINER_ID } from './siteSettings';
import { getActiveTopStrip } from './topStrip';

export type LayoutCms = {
  tracking: { ga: string; gtm: string; pixel: string };
  topStrip: Awaited<ReturnType<typeof getActiveTopStrip>>;
  headerMenu: Awaited<ReturnType<typeof getHeaderMenu>>;
  footer: Awaited<ReturnType<typeof getFooter>>;
  siteSettings: Awaited<ReturnType<typeof getSiteSettings>>;
  breadcrumbs: Record<string, CmsBreadcrumbItem[]>;
};

export const FALLBACK_LAYOUT_CMS: LayoutCms = {
  tracking: { ga: GA4_MEASUREMENT_ID, gtm: GTM_CONTAINER_ID, pixel: '' },
  topStrip: null,
  headerMenu: null,
  footer: null,
  siteSettings: null,
  breadcrumbs: {},
};

async function loadLayoutCmsUncached(): Promise<LayoutCms> {
  try {
    const [tracking, topStrip, headerMenu, footer, siteSettings, breadcrumbs] = await Promise.all([
      getTrackingIds(),
      getActiveTopStrip(),
      getHeaderMenu(),
      getFooter(),
      getSiteSettings(),
      getBreadcrumbMap(),
    ]);
    return { tracking, topStrip, headerMenu, footer, siteSettings, breadcrumbs };
  } catch (error) {
    console.warn('Layout CMS read failed, using hardcoded fallbacks:', error);
    return FALLBACK_LAYOUT_CMS;
  }
}

const getCachedLayoutCms = cmsCache('cms-layout', loadLayoutCmsUncached);

/** Cached layout CMS reads. Never throws — DB down returns hardcoded fallbacks. */
export async function getLayoutCms(): Promise<LayoutCms> {
  try {
    return await getCachedLayoutCms();
  } catch (error) {
    console.warn('Layout CMS cache failed, using hardcoded fallbacks:', error);
    return FALLBACK_LAYOUT_CMS;
  }
}
