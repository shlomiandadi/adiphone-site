import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isTelHref,
  isWhatsAppHref,
  resolveContactClickEvent,
} from './contactClicks.ts';

test('matches wa.me, api.whatsapp.com, and whatsapp:// hrefs', () => {
  assert.equal(isWhatsAppHref('https://wa.me/972509159951'), true);
  assert.equal(
    isWhatsAppHref('https://api.whatsapp.com/send?phone=972509159951'),
    true
  );
  assert.equal(isWhatsAppHref('https://web.whatsapp.com/send?phone=972509159951'), true);
  assert.equal(isWhatsAppHref('whatsapp://send?phone=972509159951'), true);
  assert.equal(isWhatsAppHref('WHATSAPP://send?phone=972509159951'), true);
  assert.equal(isWhatsAppHref('/contact'), false);
  assert.equal(isWhatsAppHref('https://example.com/?q=wa.me'), false);
});

test('phone_click and whatsapp_click share the same href resolver', () => {
  assert.equal(resolveContactClickEvent('tel:0509159951'), 'phone_click');
  assert.equal(resolveContactClickEvent('TEL:+972509159951'), 'phone_click');
  assert.equal(isTelHref('tel:0509159951'), true);
  assert.equal(
    resolveContactClickEvent('https://wa.me/972509159951'),
    'whatsapp_click'
  );
  assert.equal(
    resolveContactClickEvent('https://api.whatsapp.com/send?phone=972509159951'),
    'whatsapp_click'
  );
  assert.equal(
    resolveContactClickEvent('whatsapp://send?phone=972509159951'),
    'whatsapp_click'
  );
  assert.equal(resolveContactClickEvent('mailto:info@example.com'), 'email_click');
  assert.equal(resolveContactClickEvent('/pricing'), null);
});
