import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { stripPhoneFromTitle, withoutPhoneInLocalTitles } from './strip-title-phone.ts';

describe('stripPhoneFromTitle', () => {
  test('drops an en-dash phone suffix and keeps brand', () => {
    assert.equal(
      stripPhoneFromTitle('בניית אתרים בחיפה לעסקים | Top Webstak – 050-9159951'),
      'בניית אתרים בחיפה לעסקים | Top Webstak'
    );
  });

  test('does not leave a trailing dash or double separator', () => {
    assert.equal(
      stripPhoneFromTitle('בניית אתרים באור עקיבא לעסקים | Top Webstak - 050-9159951'),
      'בניית אתרים באור עקיבא לעסקים | Top Webstak'
    );
  });
});

describe('withoutPhoneInLocalTitles', () => {
  test('cleans title, og:title and twitter:title without touching description', () => {
    const cleaned = withoutPhoneInLocalTitles({
      title: { absolute: 'בניית אתרים בחיפה לעסקים | Top Webstak – 050-9159951' },
      description: 'לייעוץ: 050-9159951.',
      openGraph: { title: 'בניית אתרים בחיפה לעסקים | Top Webstak – 050-9159951' },
      twitter: { title: 'בניית אתרים בחיפה לעסקים | Top Webstak – 050-9159951' },
    });
    assert.deepEqual(cleaned.title, { absolute: 'בניית אתרים בחיפה לעסקים | Top Webstak' });
    assert.equal(cleaned.description, 'לייעוץ: 050-9159951.');
    assert.equal(
      cleaned.openGraph && 'title' in cleaned.openGraph ? cleaned.openGraph.title : '',
      'בניית אתרים בחיפה לעסקים | Top Webstak'
    );
    assert.equal(
      cleaned.twitter && 'title' in cleaned.twitter ? cleaned.twitter.title : '',
      'בניית אתרים בחיפה לעסקים | Top Webstak'
    );
  });
});
