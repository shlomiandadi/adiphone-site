import type { ReactNode } from 'react';

/** Longest first so multi-word phrases win over prefixes. */
const LATIN_PHRASES = [
  'Ads Manager Availability',
  'ChatGPT Business Hub',
  'ChatGPT Ads Manager',
  'ChatGPT Ads',
  'Business Hub',
  'Ads Manager',
  'Answer Engine Optimization',
  'Generative Engine Optimization',
  'OpenAI',
  'ChatGPT',
  'Google AI',
  'Google Ads',
  'Meta Ads',
  'Available',
  'Persona',
  'Shopify',
  'Free',
  'Enterprise',
  'AEO/GEO',
  'AEO',
  'GEO',
  'ILS',
  'CPM',
  'CPC',
  'UTM',
  'PPC',
  'Plus',
  'Pro',
  'Go',
  'UI',
  'UX',
  'SEO',
  'AI',
  'DNS',
  'Insights',
  'Context hints',
] as const;

function BdiLatin({ children }: { children: string }) {
  return (
    <bdi dir="ltr" className="whitespace-nowrap" style={{ unicodeBidi: 'isolate' }}>
      {children}
    </bdi>
  );
}

/** Wrap Latin phrases (and כ-/ב-/ל- prefixes glued to them) for stable RTL rendering. */
export function isolateLatinPhrases(text: string): ReactNode {
  let remaining = text;
  const nodes: ReactNode[] = [];
  let key = 0;

  while (remaining.length > 0) {
    let match: { index: number; phrase: string } | null = null;
    for (const phrase of LATIN_PHRASES) {
      const index = remaining.indexOf(phrase);
      if (index >= 0 && (match === null || index < match.index)) {
        match = { index, phrase };
      }
    }

    if (!match) {
      nodes.push(<span key={key++}>{remaining}</span>);
      break;
    }

    let before = match.index > 0 ? remaining.slice(0, match.index) : '';
    let gluedPrefix = '';
    const prefixMatch = before.match(/^(.*?)([בלכ]{1,2}-)$/);
    if (prefixMatch) {
      before = prefixMatch[1];
      gluedPrefix = prefixMatch[2];
    }

    if (before) {
      nodes.push(<span key={key++}>{before}</span>);
    }

    remaining = remaining.slice(match.index + match.phrase.length);
    const punctMatch = remaining.match(/^[?!.,:;)]+/);
    const phraseWithPunct = punctMatch ? `${match.phrase}${punctMatch[0]}` : match.phrase;
    if (punctMatch) {
      remaining = remaining.slice(punctMatch[0].length);
    }

    nodes.push(<BdiLatin key={key++}>{`${gluedPrefix}${phraseWithPunct}`}</BdiLatin>);
  }

  if (nodes.length === 1) {
    return nodes[0];
  }
  return <>{nodes}</>;
}

export function chatgptBusinessHubCrumbLabel(): ReactNode {
  return (
    <>
      עסק ב-
      <BdiLatin>ChatGPT Business Hub</BdiLatin>
    </>
  );
}

export function chatgptAdsHeroTitle(): ReactNode {
  return (
    <>
      פרסום ממומן{' '}
      <BdiLatin>ב-ChatGPT</BdiLatin> לעסקים בישראל
    </>
  );
}
