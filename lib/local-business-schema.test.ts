import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaSource = readFileSync(join(repoRoot, 'lib/local-business-schema.ts'), 'utf8');
const homeSource = readFileSync(join(repoRoot, 'app/components/HomeSchema.tsx'), 'utf8');

describe('business JSON-LD alternateName', () => {
  test('shared names keep Top Webstak as name and add Top WebStack as alternate', () => {
    assert.match(schemaSource, /export const BUSINESS_NAME = 'Top Webstak בנייה וקידום אתרים'/);
    assert.match(schemaSource, /export const BUSINESS_NAME_VARIANT = 'Top WebStack'/);
    assert.match(
      schemaSource,
      /export const BUSINESS_ALTERNATE_NAMES = \[BUSINESS_ALTERNATE_NAME, BUSINESS_NAME_VARIANT\]/
    );
    assert.match(schemaSource, /alternateName: \[\.\.\.BUSINESS_ALTERNATE_NAMES\]/);
  });

  test('homepage WebSite and business graphs include Top WebStack without renaming name', () => {
    assert.match(homeSource, /name: 'Top Webstak בנייה וקידום אתרים'/);
    assert.match(homeSource, /alternateName: \[\.\.\.BUSINESS_ALTERNATE_NAMES\]/);
    assert.match(homeSource, /alternateName: BUSINESS_NAME_VARIANT/);
    assert.match(homeSource, /alternateName: \['Top Webstak בנייה וקידום אתרים', BUSINESS_NAME_VARIANT\]/);
  });
});
