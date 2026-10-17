import assert from 'node:assert/strict';
import test from 'node:test';
import { ensureGa4Config } from './deferredTags.ts';

test('queued events stay after consent and GA4 config', () => {
  const dataLayer: unknown[] = [];
  function gtag(...args: unknown[]) {
    dataLayer.push(args);
  }

  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });
  gtag('event', 'generate_lead', { form_name: 'contact' });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('event', 'phone_click', { link_url: 'tel:050' });

  const configured = ensureGa4Config(dataLayer, gtag, 'G-TEST', false);

  assert.equal(configured, true);
  const commands = dataLayer.map((entry) => (entry as unknown[])[0]);
  assert.deepEqual(commands, [
    'consent',
    'consent',
    'js',
    'config',
    'event',
    'event',
  ]);
  assert.equal((dataLayer[3] as unknown[])[1], 'G-TEST');
  assert.equal(((dataLayer[4] as unknown[])[1]), 'generate_lead');
  assert.equal(((dataLayer[5] as unknown[])[1]), 'phone_click');
});

test('does not queue a second config', () => {
  const dataLayer: unknown[] = [];
  function gtag(...args: unknown[]) {
    dataLayer.push(args);
  }
  gtag('consent', 'default', { analytics_storage: 'denied' });
  ensureGa4Config(dataLayer, gtag, 'G-TEST', false);
  const length = dataLayer.length;
  ensureGa4Config(dataLayer, gtag, 'G-TEST', true);
  assert.equal(dataLayer.length, length);
});
