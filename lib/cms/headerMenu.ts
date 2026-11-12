import {
  navigation,
  type NavigationItem,
} from '../../app/components/navigation-data.ts';

/** Injected after AEO/GEO when CMS header menu omits a new service link. */
export const REQUIRED_CHATGPT_NAV_LINK = {
  name: 'עסק ב-ChatGPT',
  href: '/services/chatgpt-business-hub',
  icon: 'code',
  description: 'תביעת הפרופיל, עדכון פרטים ומעקב אחרי אזכורים וקליקים',
} as const;

export const REQUIRED_CHATGPT_ADS_NAV_LINK = {
  name: 'מודעות ב-ChatGPT',
  href: '/services/chatgpt-ads',
  icon: 'code',
  description: 'הקמת חשבון, מודעות ומדידה ב-ChatGPT Ads Manager',
} as const;

function servicesSubmenu(item: NavigationItem): NavigationItem['submenu'] | undefined {
  if (item.href === '/services' && item.submenu?.length) return item.submenu;
  if (item.name === 'שירותים' && item.submenu?.length) return item.submenu;
  return undefined;
}

export function withRequiredHeaderMenu(items: NavigationItem[] | null | undefined): NavigationItem[] {
  const base = items && items.length > 0 ? items : navigation;

  return base.map((item) => {
    const submenu = servicesSubmenu(item);
    if (!submenu) return item;

    let nextSubmenu = [...submenu];

    if (!nextSubmenu.some((link) => link.href === REQUIRED_CHATGPT_NAV_LINK.href)) {
      const aeoIndex = nextSubmenu.findIndex((link) => link.href === '/services/aeo-geo');
      const insertAt = aeoIndex >= 0 ? aeoIndex + 1 : nextSubmenu.length;
      nextSubmenu.splice(insertAt, 0, { ...REQUIRED_CHATGPT_NAV_LINK });
    }

    if (!nextSubmenu.some((link) => link.href === REQUIRED_CHATGPT_ADS_NAV_LINK.href)) {
      const hubIndex = nextSubmenu.findIndex((link) => link.href === REQUIRED_CHATGPT_NAV_LINK.href);
      const insertAt = hubIndex >= 0 ? hubIndex + 1 : nextSubmenu.length;
      nextSubmenu.splice(insertAt, 0, { ...REQUIRED_CHATGPT_ADS_NAV_LINK });
    }

    return { ...item, submenu: nextSubmenu };
  });
}
