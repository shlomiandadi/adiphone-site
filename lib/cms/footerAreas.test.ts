import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { FOOTER_AREA_LINKS, HARDCODED_FOOTER, withServiceAreaColumn } from './footerData.ts';

describe('withServiceAreaColumn', () => {
  test('hardcoded footer already lists every city plus tadmit and aeo-geo', () => {
    const urls = FOOTER_AREA_LINKS.map((link) => link.url);
    assert.ok(urls.includes('/services/bniyat-atarim-haifa'));
    assert.ok(urls.includes('/services/website-tadmit'));
    assert.ok(urls.includes('/services/aeo-geo'));
    assert.equal(urls.length, 12);
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
