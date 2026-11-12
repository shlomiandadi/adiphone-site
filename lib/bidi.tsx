import type { ReactNode } from 'react';

const BRAND_PHRASES = [
  'ChatGPT Business Hub',
  'ChatGPT Business',
  'Business Agent',
  'Business Hub',
  'ChatGPT',
] as const;

/** Wrap common Latin brand terms for stable RTL reading order. */
export function isolateLatinPhrases(text: string): ReactNode {
  let remaining = text;
  const nodes: ReactNode[] = [];
  let key = 0;

  while (remaining.length > 0) {
    let match: { index: number; phrase: string } | null = null;
    for (const phrase of BRAND_PHRASES) {
      const index = remaining.indexOf(phrase);
      if (index >= 0 && (match === null || index < match.index)) {
        match = { index, phrase };
      }
    }

    if (!match) {
      nodes.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (match.index > 0) {
      nodes.push(<span key={key++}>{remaining.slice(0, match.index)}</span>);
    }

    nodes.push(
      <bdi key={key++} dir="ltr" className="whitespace-nowrap">
        {match.phrase}
      </bdi>
    );
    remaining = remaining.slice(match.index + match.phrase.length);
  }

  return nodes;
}

export function chatgptBusinessHubCrumbLabel(): ReactNode {
  return (
    <>
      עסק ב-
      <bdi dir="ltr" className="whitespace-nowrap">
        ChatGPT Business Hub
      </bdi>
    </>
  );
}
