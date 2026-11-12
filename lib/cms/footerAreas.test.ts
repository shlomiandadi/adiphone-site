import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  FOOTER_AREA_LINKS,
  FOOTER_CONTACT_LINKS,
  HARDCODED_FOOTER,
  withRequiredSocialLinks,
  withRequiredServiceLinks,
  withServiceAreaColumn,
} from './footerData.ts';
import { SOCIAL_INSTAGRAM, SOCIAL_X } from '../social.ts';

describe('withRequiredServiceLinks', () => {
  test('injects ChatGPT after AEO/GEO in CMS footer services column', () => {
    const merged = withRequiredServiceLinks({
      ...HARDCODED_FOOTER,
      columns: HARDCODED_FOOTER.columns.map((column) =>
        column.kind === 'services'
          ? {
              ...column,
              links: column.links.filter((link) => link.url !== '/services/chatgpt-business-hub'),
            }
          : column
      ),
    });
    const column = merged.columns.find((item) => item.kind === 'services');
    const urls = column?.links.map((link) => link.url) || [];
    const aeo = urls.indexOf('/services/aeo-geo');
    const hub = urls.indexOf('/services/chatgpt-business-hub');
    assert.ok(aeo >= 0 && hub === aeo + 1);
  });
});

describe('withServiceAreaColumn', () => {
  test('hardcoded footer already lists every city plus aeo-geo', () => {
    const urls = FOOTER_AREA_LINKS.map((link) => link.url);
    assert.ok(urls.includes('/services/bniyat-atarim-haifa'));
    assert.ok(urls.includes('/services/aeo-geo'));
    assert.equal(urls.length, 11);
  });

  test('injects the column when a CMS footer omitted it', () => {
    const merged = withServiceAreaColumn({
      ...HARDCODED_FOOTER,
      columns: HARDCODED_FOOTER.columns.filter((column) => column.title !== 'אזורי שירות'),
    });
    const column = merged.columns.find((item) => item.title === 'אזורי שירות');
    assert.ok(column);
    assert.equal(column?.links.length, FOOTER_AREA_LINKS.length);
  });
});

describe('withRequiredSocialLinks', () => {
  test('hardcoded contact column already includes Instagram and X', () => {
    const urls = FOOTER_CONTACT_LINKS.map((link) => link.url);
    assert.ok(urls.includes(SOCIAL_INSTAGRAM));
    assert.ok(urls.includes(SOCIAL_X));
  });

  test('injects missing Instagram and X into a CMS contact column', () => {
    const merged = withRequiredSocialLinks({
      ...HARDCODED_FOOTER,
      columns: HARDCODED_FOOTER.columns.map((column) =>
        column.kind === 'contact'
          ? {
              ...column,
              links: column.links.filter((link) => link.icon !== 'instagram' && link.icon !== 'x'),
            }
          : column
      ),
    });
    const column = merged.columns.find((item) => item.kind === 'contact');
    const urls = column?.links.map((link) => link.url) || [];
    assert.ok(urls.includes(SOCIAL_INSTAGRAM));
    assert.ok(urls.includes(SOCIAL_X));
  });
});
