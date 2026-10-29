import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  ORGANIZATION_SAME_AS,
  PERSON_SAME_AS,
  organizationSameAs,
  SOCIAL_FACEBOOK,
  SOCIAL_INSTAGRAM,
  SOCIAL_LINKEDIN,
  SOCIAL_X,
} from './social.ts';

describe('verified social profiles', () => {
  test('organization sameAs is Facebook and Instagram only', () => {
    assert.deepEqual([...ORGANIZATION_SAME_AS], [SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM]);
    assert.ok(!(ORGANIZATION_SAME_AS as readonly string[]).includes(SOCIAL_LINKEDIN));
    assert.ok(!(ORGANIZATION_SAME_AS as readonly string[]).includes(SOCIAL_X));
  });

  test('person sameAs is LinkedIn and X only', () => {
    assert.deepEqual([...PERSON_SAME_AS], [SOCIAL_LINKEDIN, SOCIAL_X]);
    assert.ok(!(PERSON_SAME_AS as readonly string[]).includes(SOCIAL_FACEBOOK));
    assert.ok(!(PERSON_SAME_AS as readonly string[]).includes(SOCIAL_INSTAGRAM));
  });

  test('organizationSameAs keeps Google Maps, dedupes, and drops personal profiles', () => {
    const maps =
      'https://www.google.com/maps/place/Top+webStak/@32.465799,34.952319,17z';
    const merged = organizationSameAs(maps, SOCIAL_FACEBOOK, SOCIAL_LINKEDIN, SOCIAL_X, null);
    assert.equal(merged.filter((url) => url === SOCIAL_FACEBOOK).length, 1);
    assert.ok(merged.includes(maps));
    assert.ok(!merged.includes(SOCIAL_LINKEDIN));
    assert.ok(!merged.includes(SOCIAL_X));
    assert.equal(merged.length, 3);
  });
});
