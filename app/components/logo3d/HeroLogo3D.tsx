'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { readLogo3dBlockers } from './signals';

const HeroLogoRuntime = dynamic(() => import(/* webpackChunkName: "hero-logo-3d" */ './HeroLogoRuntime'), {
  ssr: false,
});

export default function HeroLogo3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || readLogo3dBlockers()) return;

    let cancelled = false;
    let armed = false;
    let inView = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const start = () => {
      if (cancelled || armed || !inView || readLogo3dBlockers()) return;
      armed = true;
      setActive(true);
    };

    const arm = () => {
      if (cancelled || armed || !inView || document.readyState !== 'complete') return;
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(start, { timeout: 4000 });
      } else {
        timeoutId = window.setTimeout(start, 250);
      }
    };

    const onLoad = () => arm();

    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) arm();
      },
      { rootMargin: '160px', threshold: 0.01 },
    );
    intersection.observe(host);

    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', onLoad, { once: true });

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      if (!motion.matches) return;
      cancelled = true;
      setActive(false);
    };
    motion.addEventListener?.('change', onMotion);

    return () => {
      cancelled = true;
      intersection.disconnect();
      window.removeEventListener('load', onLoad);
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      motion.removeEventListener?.('change', onMotion);
    };
  }, []);

  return (
    <div ref={hostRef} className="hero-logo3d">
      <Link href="/" prefetch={false} className="hero-logo3d-link">
        <img
          src="/brand/logo-horizontal-transparent.svg"
          alt="Top Webstak"
          width={1440}
          height={360}
          className="hero-logo3d-static"
          decoding="async"
          fetchPriority="low"
        />
        {active ? <HeroLogoRuntime /> : null}
      </Link>
    </div>
  );
}
