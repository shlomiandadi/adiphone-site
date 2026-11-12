export type OgRun = {
  text: string;
  latin: boolean;
  glueLeft?: boolean;
  glueRight?: boolean;
  /** Hebrew prefix glued to the following Latin phrase (e.g. ב-ChatGPT). */
  gluePrefix?: string;
};

const HEBREW = /[\u0590-\u05FF]/;
const LATIN_START = /[A-Za-z0-9]/;
const LATIN_CONTINUE = /[A-Za-z0-9./()+\-_]/;

/** Undo `reverseHebrewVisual` for tests and glue letter extraction. */
export function undoHebrewVisual(reversed: string): string {
  return reversed.split('').reverse().join('');
}

/** Satori paints LTR; reverse Hebrew graphemes per word for correct RTL glyphs. */
function reverseHebrewVisual(text: string): string {
  // Glued Hebrew–Latin prefixes (e.g. ב-) must stay in logical order for Satori.
  if (/^[\u0590-\u05FF]+-$/.test(text)) {
    return text;
  }
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
      const glueLetter =
        prev && !prev.latin ? undoHebrewVisual(prev.text) : '';
      const gluable = Boolean(glueLetter && /^[\u0590-\u05FF]$/.test(glueLetter));
      if (gluable) {
        const particle = runs[runs.length - 1];
        if (particle && !particle.latin) {
          particle.text = `${glueLetter}-`;
          particle.glueRight = true;
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

  const coalesced: OgRun[] = [];
  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i];
    const next = runs[i + 1];
    if (run.glueRight && next?.latin && next.glueLeft) {
      coalesced.push({
        text: next.text,
        latin: true,
        gluePrefix: run.text,
      });
      i += 1;
      continue;
    }
    coalesced.push(run);
  }

  return coalesced;
}

/** Drawable runs in right-to-left logical order (rightmost run first). */
export function logicalRuns(text: string): OgRun[] {
  return displayRuns(text);
}

/** Runs laid out left-to-right on the OG line (for tests). */
export function ltrPaintRuns(text: string): OgRun[] {
  return displayRuns(text).slice().reverse();
}

/**
 * Left-to-right pixel order of painted segments (for tests).
 * Hebrew words are logical (unreversed); glued prefixes become `…, '-', letter`.
 */
export function ltrVisualSegments(text: string): string[] {
  const segments: string[] = [];
  for (const run of ltrPaintRuns(text)) {
    if (run.gluePrefix) {
      const letter = run.gluePrefix.replace(/-$/, '');
      const words = run.text.split(/\s+/).filter(Boolean);
      segments.push(...words, '-', letter);
      continue;
    }
    if (run.latin) {
      segments.push(...(run.text.includes(' ') ? run.text.split(/\s+/) : [run.text]));
      continue;
    }
    segments.push(undoHebrewVisual(run.text));
  }
  return segments;
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
