export type OgRun = {
  text: string;
  latin: boolean;
  glueLeft?: boolean;
  glueRight?: boolean;
};

const HEBREW = /[\u0590-\u05FF]/;
const LATIN_START = /[A-Za-z0-9]/;
const LATIN_CONTINUE = /[A-Za-z0-9./()+\-_]/;

/** Satori has no bidi: reverse Hebrew graphemes per word; leave Latin in logical order. */
function reverseHebrewVisual(text: string): string {
  return text.split('').reverse().join('');
}

function isLatinPhraseContinuation(text: string, i: number): boolean {
  if (i >= text.length) return false;
  const ch = text[i];
  if (LATIN_START.test(ch)) return true;
  if (ch === '(' && i + 1 < text.length && LATIN_START.test(text[i + 1])) return true;
  return false;
}

/** One contiguous LTR phrase from `start` (Latin letters, spaces, parentheticals). */
function readLatinPhrase(text: string, start: number): number {
  let i = start;

  while (i < text.length) {
    const ch = text[i];
    if (LATIN_START.test(ch)) {
      i += 1;
      while (i < text.length && LATIN_CONTINUE.test(text[i])) i += 1;
      continue;
    }
    if (ch === '(' && i + 1 < text.length && LATIN_START.test(text[i + 1])) {
      i += 1;
      while (i < text.length && text[i] !== ')') i += 1;
      if (i < text.length) i += 1;
      continue;
    }
    if (/\s/.test(ch)) {
      let j = i;
      while (j < text.length && /\s/.test(text[j])) j += 1;
      if (isLatinPhraseContinuation(text, j)) {
        i = j;
        continue;
      }
      break;
    }
    break;
  }

  return i;
}

function pushLatinPhrase(text: string, start: number, runs: OgRun[], glueLeft: boolean) {
  const end = readLatinPhrase(text, start);
  const phrase = text.slice(start, end);
  if (phrase) {
    runs.push({ text: phrase, latin: true, glueLeft });
  }
  return end;
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
          break;
        }
        break;
      }
      const word = text.slice(i, j);
      runs.push({ text: reverseHebrewVisual(word), latin: false });
      i = j;
      continue;
    }

    if (ch === '-' && i + 1 < text.length && LATIN_START.test(text[i + 1])) {
      const prev = runs[runs.length - 1];
      const afterBet = Boolean(prev && !prev.latin && prev.text === 'ב');
      if (afterBet) {
        const bet = runs[runs.length - 1];
        if (bet && !bet.latin) {
          bet.text = 'ב-';
          bet.glueRight = true;
        }
        i += 1;
        i = pushLatinPhrase(text, i, runs, true);
      } else {
        const end = readLatinPhrase(text, i + 1);
        runs.push({ text: text.slice(i, end), latin: true });
        i = end;
      }
      continue;
    }

    if (ch === '(' && i + 1 < text.length && LATIN_START.test(text[i + 1])) {
      i = pushLatinPhrase(text, i, runs, false);
      continue;
    }

    if (LATIN_START.test(ch)) {
      i = pushLatinPhrase(text, i, runs, false);
      continue;
    }

    i += 1;
  }

  return runs.reverse();
}

/** Break long mixed titles into stacked OG lines without changing wording. */
export function ogLineUsesLatinPhraseFlip(text: string): boolean {
  return displayRuns(text).some((run) => run.latin && run.text.includes(' '));
}

export function splitOgTitleLines(title: string): string[] {
  const glued = title.match(/^([\u0590-\u05FF\s·]+?)(ב-[A-Za-z].+)$/);
  if (glued && title.length > 20) {
    return [glued[1].trim(), glued[2]];
  }
  if (title.length > 32) {
    const space = title.indexOf(' ', Math.max(12, title.length - 24));
    if (space > 0) return [title.slice(0, space), title.slice(space + 1)];
  }
  return [title];
}
