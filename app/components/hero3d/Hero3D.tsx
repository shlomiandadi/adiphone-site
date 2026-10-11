'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import HeroVisualLoader from '../HeroVisualLoader';
import Hero3DScene from './Hero3DScene';
import type { Hero3DProps } from './types';

export default function Hero3D({
  theme,
  title,
  subtitle,
  eyebrow,
  extraHeading,
  extraHeadingAs = 'h2',
  ctas = [],
  cityName,
  align = 'start',
  children,
}: Hero3DProps) {
  const rootRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    const simplify = window.matchMedia('(max-width: 767px)').matches;
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
      targetX = px * (simplify ? 8 : 14);
      targetY = -py * (simplify ? 6 : 10);
    };
    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      scene.style.setProperty('--scroll-shift', `${(progress * (simplify ? 16 : 28)).toFixed(1)}px`);
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

  const ExtraTag = extraHeadingAs;

  return (
    <section ref={rootRef} className={`h3d-stage h3d-theme-${theme}`}>
      <div className="h3d-visual" aria-hidden="true">
        <HeroVisualLoader />
        <div ref={sceneRef} className="h3d-scene">
          <Hero3DScene theme={theme} cityName={cityName} />
        </div>
      </div>
      <div className={`h3d-content h3d-align-${align}`}>
        <div className="container mx-auto px-4">
          <div className={`h3d-copy text-white ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}`}>
            {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-300">{eyebrow}</p> : null}
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">{title}</h1>
            {extraHeading ? (
              <ExtraTag className="mb-4 text-2xl font-bold text-white md:text-3xl">{extraHeading}</ExtraTag>
            ) : null}
            {subtitle ? <p className="mb-8 text-xl text-white/90 md:text-2xl">{subtitle}</p> : null}
            {children}
            {ctas.length > 0 ? (
              <div className={`flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
                {ctas.map((cta) => {
                  const className =
                    cta.variant === 'secondary'
                      ? 'inline-block rounded-full border border-white/80 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10'
                      : 'inline-block rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700';
                  if (cta.external || cta.href.startsWith('tel:') || cta.href.startsWith('http')) {
                    return (
                      <a
                        key={cta.href + cta.label}
                        href={cta.href}
                        data-cta="true"
                        data-cta-location="hero"
                        className={className}
                      >
                        {cta.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={cta.href + cta.label}
                      href={cta.href}
                      data-cta="true"
                      data-cta-location="hero"
                      className={className}
                    >
                      {cta.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
