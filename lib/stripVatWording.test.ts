import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stripVatFromUnknown, stripVatWording } from './stripVatWording.ts';

test('strips plus-VAT and not-including VAT from Hebrew prices', () => {
  assert.equal(stripVatWording('מ-12,000 ₪ + מע״מ'), 'מ-12,000 ₪');
  assert.equal(
    stripVatWording('מחירי פתיחה מאושרים, לא כוללים מע״מ. הפירוט המלא'),
    'מחירי פתיחה מאושרים. הפירוט המלא'
  );
  assert.equal(
    stripVatWording('מחיר פתיחה מאושר, לא כולל מע״מ. המחיר הסופי נקבע לפי היקף הפרויקט.'),
    'מחיר פתיחה מאושר. המחיר הסופי נקבע לפי היקף הפרויקט.'
  );
});

test('drops valueAddedTaxIncluded from JSON-LD objects', () => {
  const cleaned = stripVatFromUnknown({
    price: '12000',
    valueAddedTaxIncluded: false,
    description: 'מ-12,000 ₪ + מע״מ',
  }) as Record<string, unknown>;
  assert.equal('valueAddedTaxIncluded' in cleaned, false);
  assert.equal(cleaned.description, 'מ-12,000 ₪');
});
