import Link from 'next/link';
import './niche-hero.css';

import type { NicheHeroTheme } from '../../../lib/web-dev-niches';

export type { NicheHeroTheme };

type Cta = {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
};

type Props = {
  theme: NicheHeroTheme;
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctas: Cta[];
};

function ScalesIcon() {
  return (
    <svg className="nh-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="none" stroke="rgba(186,230,253,0.95)" strokeWidth="2" d="M24 8v28M12 18h24" />
      <path fill="none" stroke="rgba(186,230,253,0.95)" strokeWidth="2" d="M12 18c0 6 4 10 0 14h0c4 0 8-4 8-14M36 18c0 6-4 10 0 14h0c-4 0-8-4-8-14" />
      <rect x="16" y="36" width="16" height="4" rx="1" fill="rgba(125,211,252,0.9)" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="nh-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect x="8" y="12" width="32" height="26" rx="4" fill="none" stroke="rgba(186,230,253,0.95)" strokeWidth="2" />
      <path stroke="rgba(186,230,253,0.95)" strokeWidth="2" d="M8 20h32M16 8v8M32 8v8" />
      <circle cx="18" cy="28" r="2" fill="rgba(125,211,252,0.95)" />
      <circle cx="24" cy="28" r="2" fill="rgba(255,255,255,0.55)" />
      <circle cx="30" cy="28" r="2" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="nh-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="none" stroke="rgba(186,230,253,0.95)" strokeWidth="2" d="M10 38V12M10 38h28" />
      <path fill="none" stroke="rgba(125,211,252,0.95)" strokeWidth="2.4" d="M14 30l8-8 6 4 8-12" />
      <circle cx="14" cy="30" r="2" fill="rgba(125,211,252,0.95)" />
      <circle cx="22" cy="22" r="2" fill="rgba(125,211,252,0.95)" />
      <circle cx="28" cy="26" r="2" fill="rgba(125,211,252,0.95)" />
      <circle cx="36" cy="14" r="2" fill="rgba(125,211,252,0.95)" />
    </svg>
  );
}

function Scene({ theme }: { theme: NicheHeroTheme }) {
  if (theme === 'lawyers') {
    return (
      <div className="nh-scene" aria-hidden="true">
        <div className="nh-back" />
        <div className="nh-card nh-card-a">
          <ScalesIcon />
          <span className="nh-label">אתר למשרד</span>
          <span className="nh-title">תחומי עיסוק</span>
          <div className="nh-docs">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="nh-card nh-card-b">
          <span className="nh-label">עמוד שירות</span>
          <span className="nh-title">פנייה מסודרת</span>
          <div className="nh-docs">
            <i />
            <i />
          </div>
        </div>
        <div className="nh-card nh-card-c">
          <span className="nh-label">מסמך</span>
          <span className="nh-title">סקירה מקצועית</span>
        </div>
      </div>
    );
  }

  if (theme === 'clinics') {
    return (
      <div className="nh-scene" aria-hidden="true">
        <div className="nh-back" />
        <div className="nh-card nh-card-a">
          <CalendarIcon />
          <span className="nh-label">יומן טיפולים</span>
          <span className="nh-title">קביעת תור</span>
          <div className="nh-cal">
            <i />
            <i className="on" />
            <i />
            <i />
            <i />
            <i />
            <i className="on" />
            <i />
          </div>
        </div>
        <div className="nh-card nh-card-b">
          <span className="nh-label">עמוד טיפול</span>
          <span className="nh-title">פיזיותרפיה</span>
        </div>
        <div className="nh-card nh-card-c">
          <span className="nh-label">וואטסאפ</span>
          <span className="nh-title">חזרה למטופל</span>
        </div>
      </div>
    );
  }

  return (
    <div className="nh-scene" aria-hidden="true">
      <div className="nh-back" />
      <div className="nh-card nh-card-a">
        <ChartIcon />
        <span className="nh-label">לוח בקרה</span>
        <span className="nh-title">שירותי המשרד</span>
        <div className="nh-bars" aria-hidden="true">
          <span className="b1" />
          <span className="b2" />
          <span className="b3" />
          <span className="b4" />
        </div>
      </div>
      <div className="nh-card nh-card-b">
        <span className="nh-label">עמוד שירות</span>
        <span className="nh-title">הנהלת חשבונות</span>
      </div>
      <div className="nh-card nh-card-c">
        <span className="nh-label">טופס קצר</span>
        <span className="nh-title">שיחת היכרות</span>
      </div>
    </div>
  );
}

export default function NicheHero({ theme, title, subtitle, eyebrow, ctas }: Props) {
  return (
    <header className={`nh-stage nh-theme-${theme}`}>
      <div className="container mx-auto px-4">
        <div className="nh-shell">
          <div className="nh-copy text-white">
            {eyebrow ? <p className="mb-3 text-sm font-semibold tracking-wide text-sky-300">{eyebrow}</p> : null}
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
            <p className="mb-8 text-xl text-white/90 md:text-2xl">{subtitle}</p>
            <div className="flex flex-wrap gap-3">
              {ctas.map((cta) => {
                const className =
                  cta.variant === 'secondary'
                    ? 'inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10'
                    : 'inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700';
                const isExternal = cta.href.startsWith('tel:') || cta.href.startsWith('http') || cta.href.startsWith('https:');
                if (isExternal) {
                  return (
                    <a key={cta.href + cta.label} href={cta.href} data-cta="true" data-cta-location="hero" className={className}>
                      {cta.label}
                    </a>
                  );
                }
                return (
                  <Link key={cta.href + cta.label} href={cta.href} prefetch={false} data-cta="true" data-cta-location="hero" className={className}>
                    {cta.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="nh-visual" aria-hidden="true">
            <Scene theme={theme} />
          </div>
        </div>
      </div>
    </header>
  );
}
