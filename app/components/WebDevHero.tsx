'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import HeroVisualLoader from './HeroVisualLoader';

type Props = {
  title: string;
  subtitle: string;
};

export default function WebDevHero({ title, subtitle }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    let cancelled = false;
    let raf = 0;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const apply = () => {
      if (cancelled) return;
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      scene.style.setProperty('--tilt-x', `${currentX.toFixed(2)}deg`);
      scene.style.setProperty('--tilt-y', `${currentY.toFixed(2)}deg`);
      raf = window.requestAnimationFrame(apply);
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 14;
      targetY = -py * 10;
    };
    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      scene.style.setProperty('--scroll-shift', `${(progress * 28).toFixed(1)}px`);
    };

    const start = () => {
      if (cancelled || !rootRef.current || !sceneRef.current) return;
      raf = window.requestAnimationFrame(apply);
      root.addEventListener('pointermove', onMove);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    };

    const afterPaint = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(start, { timeout: 500 });
      } else {
        timeoutId = window.setTimeout(start, 80);
      }
    };

    const paintRaf = window.requestAnimationFrame(afterPaint);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(paintRaf);
      window.cancelAnimationFrame(raf);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      root.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section ref={rootRef} className="webdev-hero-stage">
      <div className="webdev-hero-visual" aria-hidden="true">
        <HeroVisualLoader />
        <div ref={sceneRef} className="webdev-scene">
          <div className="webdev-back-card" />
          <div className="webdev-laptop">
            <div className="webdev-laptop-lid">
              <div className="webdev-browser">
                <div className="webdev-chrome">
                  <span />
                  <span />
                  <span />
                  <div className="webdev-url">adi-phone.co.il</div>
                </div>
                <div className="webdev-browser-body">
                  <div className="webdev-ui-hero" />
                  <div className="webdev-ui-row">
                    <div className="webdev-ui-card" />
                    <div className="webdev-ui-card" />
                    <div className="webdev-ui-card" />
                  </div>
                </div>
              </div>
            </div>
            <div className="webdev-laptop-base" />
          </div>
          <div className="webdev-phone">
            <div className="webdev-phone-screen">
              <div className="webdev-phone-bar" />
              <div className="webdev-phone-block" />
              <div className="webdev-phone-block short" />
            </div>
          </div>
          <div className="webdev-float-card webdev-float-a">אתר תדמית</div>
          <div className="webdev-float-card webdev-float-b">דף נחיתה</div>
          <div className="webdev-float-card webdev-float-c">חנות</div>
        </div>
      </div>
      <div className="webdev-hero-content">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">{title}</h1>
            <p className="mb-8 text-xl text-white/90 md:text-2xl">{subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                data-cta="true"
                data-cta-location="hero"
                className="inline-block rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                ייעוץ לבניית אתר
              </Link>
              <Link
                href="/pricing"
                data-cta="true"
                data-cta-location="hero"
                className="inline-block rounded-full border border-white/80 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
              >
                מחירון בניית אתרים
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
