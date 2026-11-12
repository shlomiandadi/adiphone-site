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
    if (submenu.some((link) => link.href === REQUIRED_CHATGPT_NAV_LINK.href)) {
      return item;
    }

    const aeoIndex = submenu.findIndex((link) => link.href === '/services/aeo-geo');
    const insertAt = aeoIndex >= 0 ? aeoIndex + 1 : submenu.length;
    const nextSubmenu = [...submenu];
    nextSubmenu.splice(insertAt, 0, { ...REQUIRED_CHATGPT_NAV_LINK });

    return { ...item, submenu: nextSubmenu };
  });
}
