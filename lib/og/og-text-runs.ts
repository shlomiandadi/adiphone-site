export type OgRun = { text: string; latin: boolean };

const HEBREW = /[\u0590-\u05FF]/;
const LATIN_START = /[A-Za-z0-9]/;
const LATIN_CONTINUE = /[A-Za-z0-9./()+\-_]/;

/** Satori has no bidi: reverse Hebrew graphemes per word; leave Latin in logical order. */
function reverseHebrewVisual(text: string): string {
  return text.split('').reverse().join('');
}

/**
 * Split mixed Hebrew/Latin titles into drawable runs for a left-to-right flex row
 * (runs are reversed before display so RTL reading order is correct).
 */
export function displayRuns(text: string): OgRun[] {
  const runs: OgRun[] = [];
  let i = 0;

  while (i < text.length) {
  const ch = text[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (HEBREW.test(ch)) {
      let j = i + 1;
      while (j < text.length) {
        const c = text[j];
        if (HEBREW.test(c) || c === '\u05BE') {
          j += 1;
          continue;
        }
        if (c === '-' && j + 1 < text.length && LATIN_START.test(text[j + 1])) {
          j += 1;
          break;
        }
        break;
      }
      runs.push({ text: reverseHebrewVisual(text.slice(i, j)), latin: false });
      i = j;
      continue;
    }

    if (ch === '(' && i + 1 < text.length && LATIN_START.test(text[i + 1])) {
      let j = i + 1;
      while (j < text.length && text[j] !== ')') j += 1;
      if (j < text.length) j += 1;
      runs.push({ text: text.slice(i, j), latin: true });
      i = j;
      continue;
    }

    if (LATIN_START.test(ch)) {
      let j = i + 1;
      while (j < text.length && LATIN_CONTINUE.test(text[j])) j += 1;
      runs.push({ text: text.slice(i, j), latin: true });
      i = j;
      continue;
    }

    i += 1;
  }

  return runs.reverse();
}
