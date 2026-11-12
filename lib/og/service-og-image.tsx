import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { ltrPaintRuns, splitOgTitleLines } from './og-text-runs';
import type { OgRun } from './og-text-runs';

export const serviceOgSize = { width: 1200, height: 630 };
export const serviceOgContentType = 'image/png';

/** Bump when OG PNG pixels change so link previews refetch (WhatsApp, Facebook). */
export const SERVICE_OG_CACHE_VERSION = 12;

export function versionedServiceOgImagePath(routePath: string): string {
  const base = routePath.replace(/\/$/, '');
  return `${base}/opengraph-image?v=${SERVICE_OG_CACHE_VERSION}`;
}

const RUN_GAP = 14;

function glueHebrewLetter(gluePrefix: string | undefined): string {
  return gluePrefix?.replace(/-$/, '') ?? '';
}

function GluedLatinCluster({
  run,
  fontSize,
  color,
}: {
  run: OgRun;
  fontSize: number;
  color: string;
}) {
  const words = run.text.includes(' ') ? run.text.split(/\s+/).filter(Boolean) : [run.text];
  const letter = glueHebrewLetter(run.gluePrefix);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'baseline',
        direction: 'ltr',
      }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          style={{
            fontFamily: 'HeeboLatin',
            fontSize,
            fontWeight: 700,
            color,
            marginLeft: wordIndex === 0 ? 0 : 10,
          }}
        >
          {word}
        </span>
      ))}
      <span
        style={{
          fontFamily: 'HeeboHebrew',
          fontSize,
          fontWeight: 700,
          color,
          direction: 'ltr',
          unicodeBidi: 'isolate',
        }}
      >
        {`-${letter}`}
      </span>
    </div>
  );
}

function OgLine({
  text,
  fontSize,
  color,
}: {
  text: string;
  fontSize: number;
  color: string;
}) {
  const runs = ltrPaintRuns(text);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'baseline',
        width: '100%',
        maxWidth: '100%',
        direction: 'ltr',
        unicodeBidi: 'bidi-override',
      }}
    >
      {runs.map((run, index) => {
        const latinWords =
          run.latin && !run.gluePrefix && run.text.includes(' ')
            ? run.text.split(/\s+/).filter(Boolean)
            : null;

        return (
          <div
            key={`${run.text}-${index}`}
            style={{
              display: 'flex',
              flexShrink: 0,
              marginLeft: index === 0 ? 0 : RUN_GAP,
              fontFamily: run.latin ? 'HeeboLatin' : 'HeeboHebrew',
              fontSize,
              fontWeight: 700,
              color,
              whiteSpace: 'nowrap',
              direction: 'ltr',
              unicodeBidi: 'embed',
            }}
          >
            {run.gluePrefix ? (
              <GluedLatinCluster run={run} fontSize={fontSize} color={color} />
            ) : latinWords ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  direction: 'ltr',
                }}
              >
                {latinWords.map((word, wordIndex) => (
                  <span
                    key={`${word}-${wordIndex}`}
                    style={{ marginLeft: wordIndex === 0 ? 0 : 10 }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : (
              run.text
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Heebo (SIL OFL). Hebrew and Latin are separate subset files so both scripts render. */
async function loadFonts() {
  const [hebrew, latin] = await Promise.all([
    readFile(join(process.cwd(), 'lib/og/Heebo-Hebrew-700.woff')),
    readFile(join(process.cwd(), 'lib/og/Heebo-Latin-700.woff')),
  ]);
  return { hebrew, latin };
}

export async function serviceOgImage(title: string) {
  const [{ hebrew, latin }, mark] = await Promise.all([
    loadFonts(),
    readFile(join(process.cwd(), 'lib/og/brand-mark.png')),
  ]);
  const titleLines = splitOgTitleLines(title);
  const longestLine = Math.max(...titleLines.map((line) => line.length));
  const titleSize = titleLines.length > 1 ? 52 : longestLine > 26 ? 56 : longestLine > 22 ? 64 : 76;
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#071433',
          backgroundImage:
            'linear-gradient(135deg, #071433 0%, #0b1f4d 42%, #1e3a8a 78%, #0b1f4d 100%)',
          padding: '64px 72px',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={markSrc} width={186} height={48} alt="Top Webstak" />
          <div
            style={{
              display: 'flex',
              width: 88,
              height: 10,
              borderRadius: 999,
              backgroundColor: '#38bdf8',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {titleLines.map((line, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'flex-end',
                marginTop: index === 0 ? 0 : 10,
              }}
            >
              <OgLine text={line} fontSize={titleSize} color="#ffffff" />
            </div>
          ))}
          <div style={{ display: 'flex', marginTop: 28 }}>
            <OgLine text="בנייה וקידום אתרים · עדי פון תקשורת" fontSize={30} color="#cbd5e1" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              width: 220,
              height: 8,
              borderRadius: 999,
              backgroundColor: '#2563eb',
            }}
          />
          <div
            style={{
              display: 'flex',
              fontFamily: 'HeeboLatin',
              fontSize: 22,
              color: '#93c5fd',
            }}
          >
            adi-phone.co.il
          </div>
        </div>
      </div>
    ),
    {
      ...serviceOgSize,
      fonts: [
        { name: 'HeeboHebrew', data: hebrew, weight: 700, style: 'normal' },
        { name: 'HeeboLatin', data: latin, weight: 700, style: 'normal' },
      ],
    }
  );
}
