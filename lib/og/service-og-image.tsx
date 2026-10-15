import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const serviceOgSize = { width: 1200, height: 630 };
export const serviceOgContentType = 'image/png';

type OgRun = { text: string; latin: boolean };

/**
 * Satori draws glyphs left-to-right and does not apply the Unicode bidi
 * algorithm. Reverse each Hebrew token (leave Latin, digits, and punctuation
 * as-is) and reverse token order so the first Hebrew word lands on the right.
 */
function displayRuns(text: string): OgRun[] {
  const tokens = text.split(/\s+/).filter((token) => token.length > 0);
  const shaped = tokens.map((token) => {
    const hebrew = /[\u0590-\u05FF]/.test(token);
    return {
      text: hebrew ? token.split('').reverse().join('') : token,
      latin: !hebrew,
    };
  });
  return shaped.reverse();
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
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 14 }}>
      {displayRuns(text).map((run, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            fontFamily: run.latin ? 'HeeboLatin' : 'HeeboHebrew',
            fontSize,
            fontWeight: 700,
            color,
          }}
        >
          {run.text}
        </div>
      ))}
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
  const { hebrew, latin } = await loadFonts();
  const titleSize = title.length > 22 ? 64 : 76;

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
          <div
            style={{
              display: 'flex',
              fontFamily: 'HeeboLatin',
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 0.4,
              color: '#7dd3fc',
            }}
          >
            Top Webstak
          </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <OgLine text={title} fontSize={titleSize} color="#ffffff" />
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
