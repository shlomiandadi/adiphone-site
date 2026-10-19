import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { SERVICE_DOCUMENT_TITLES, TITLE_BRAND_SUFFIX } from './serviceTitles.ts';

describe('short service titles', () => {
  for (const [name, title] of Object.entries(SERVICE_DOCUMENT_TITLES)) {
    test(`${name} is 60 characters or fewer and ends with the brand`, () => {
      assert.equal(title.length <= 60, true, `${title} is ${title.length}`);
      assert.equal(title.endsWith(TITLE_BRAND_SUFFIX), true);
      const keyword = title.slice(0, title.length - TITLE_BRAND_SUFFIX.length).trim();
      assert.equal(keyword.length > 0, true);
      assert.equal(/[א-ת]/.test(keyword), true);
    });
  }
});
