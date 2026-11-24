import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  isValidPhone,
  normalizeWebsiteUrl,
  websiteCheckLeadPayload,
  WEBSITE_CHECK_FORM_NAME,
  WEBSITE_CHECK_PATH,
  WEBSITE_CHECK_SERVICE,
} from './website-check.ts';

describe('normalizeWebsiteUrl', () => {
  test('adds https when the protocol is missing', () => {
    assert.equal(normalizeWebsiteUrl('example.co.il'), 'https://example.co.il/');
  });

  test('rejects empty or invalid values', () => {
    assert.equal(normalizeWebsiteUrl(''), null);
    assert.equal(normalizeWebsiteUrl('not a url'), null);
    assert.equal(normalizeWebsiteUrl('localhost'), null);
  });
});

describe('isValidPhone', () => {
  test('accepts common Israeli formats', () => {
    assert.equal(isValidPhone('050-9159951'), true);
    assert.equal(isValidPhone('0509159951'), true);
    assert.equal(isValidPhone('+972509159951'), true);
  });

  test('rejects too-short values', () => {
    assert.equal(isValidPhone('050'), false);
    assert.equal(isValidPhone(''), false);
  });
});

describe('websiteCheckLeadPayload', () => {
  test('identifies the /check source in the message and form_name', () => {
    const payload = websiteCheckLeadPayload('https://example.co.il/', '0509159951');
    assert.equal(payload.service, WEBSITE_CHECK_SERVICE);
    assert.equal(payload.form_name, WEBSITE_CHECK_FORM_NAME);
    assert.equal(payload.name, 'example.co.il');
    assert.match(payload.message, new RegExp(WEBSITE_CHECK_PATH));
    assert.match(payload.message, /https:\/\/example\.co\.il\//);
  });
});
