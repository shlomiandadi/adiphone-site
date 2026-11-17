import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { NavigationItem } from '../../app/components/navigation-data';
import { withRequiredHeaderMenu } from './headerMenu.ts';

describe('withRequiredHeaderMenu', () => {
  test('injects ChatGPT link after AEO/GEO in a CMS services submenu', () => {
    const cmsMenu: NavigationItem[] = [
      {
        name: 'שירותים',
        href: '/services',
        submenu: [
          { name: 'קידום אתרים', href: '/services/seo' },
          { name: 'קידום במנועי AI (AEO/GEO)', href: '/services/aeo-geo' },
          { name: 'בניית אתרים', href: '/services/web-development' },
        ],
      },
    ];

    const merged = withRequiredHeaderMenu(cmsMenu);
    const services = merged[0].submenu?.map((item) => item.href);
    assert.deepEqual(services, [
      '/services/seo',
      '/services/aeo-geo',
      '/services/chatgpt-business-hub',
      '/services/chatgpt-ads',
      '/services/web-development',
    ]);
  });

  test('does not duplicate when already present', () => {
    const cmsMenu: NavigationItem[] = [
      {
        name: 'שירותים',
        href: '/services',
        submenu: [
          { name: 'קידום במנועי AI (AEO/GEO)', href: '/services/aeo-geo' },
          { name: 'עסק ב-ChatGPT', href: '/services/chatgpt-business-hub' },
        ],
      },
    ];
    const merged = withRequiredHeaderMenu(cmsMenu);
    assert.equal(
      merged[0].submenu?.filter((item) => item.href === '/services/chatgpt-business-hub').length,
      1
    );
  });
});
