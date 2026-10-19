'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { canArmHeroLogo, LOGO3D_MOBILE_DELAY_MS } from '@/lib/logo3dGate';
import { readLogo3dBlockers } from './signals';

export default function HeroLogo3D() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [Runtime, setRuntime] = useState<ComponentType | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || readLogo3dBlockers()) return;

    let cancelled = false;
    let started = false;
    let inView = false;
    let loaded = document.readyState === 'complete';
    let interacted = false;
    let loadAt = loaded ? performance.now() : 0;
    const touchLike =
      window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 767px)').matches;
    let idleId = 0;
    let delayId = 0;
    let fallbackId = 0;

    const clearTimers = () => {
      if (idleId && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId);
      idleId = 0;
      if (delayId) window.clearTimeout(delayId);
      delayId = 0;
      if (fallbackId) window.clearTimeout(fallbackId);
      fallbackId = 0;
    };

    const arm = () => {
      if (cancelled || started) return;
      const sinceLoadMs = loadAt ? performance.now() - loadAt : 0;
      if (
        !canArmHeroLogo({
          blocked: readLogo3dBlockers(),
          loaded,
          inView,
          touchLike,
          interacted,
          sinceLoadMs,
        })
      ) {
        return;
      }
      started = true;
      const launch = () => {
        if (cancelled || readLogo3dBlockers()) return;
        void import(/* webpackChunkName: "hero-logo-3d" */ './HeroLogoRuntime').then((mod) => {
          if (cancelled) return;
          setRuntime(() => mod.default);
        });
      };
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(launch, { timeout: 10000 });
      } else {
        fallbackId = window.setTimeout(launch, 250);
      }
    };

    const onInteract = () => {
      interacted = true;
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('pointerdown', onInteract);
      if (delayId) {
        window.clearTimeout(delayId);
        delayId = 0;
      }
      arm();
    };

    const onLoad = () => {
      loaded = true;
      if (!loadAt) loadAt = performance.now();
      if (touchLike && !interacted) {
        delayId = window.setTimeout(() => {
          delayId = 0;
          arm();
        }, LOGO3D_MOBILE_DELAY_MS);
      }
      arm();
    };

    if (touchLike) {
      window.addEventListener('scroll', onInteract, { passive: true });
      window.addEventListener('touchstart', onInteract, { passive: true });
      window.addEventListener('pointerdown', onInteract, { passive: true });
    }

    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) arm();
      },
      { rootMargin: '160px', threshold: 0.01 },
    );
    intersection.observe(host);

    if (loaded) onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      if (!motion.matches) return;
      cancelled = true;
      clearTimers();
      setRuntime(null);
    };
    motion.addEventListener?.('change', onMotion);

    return () => {
      cancelled = true;
      clearTimers();
      intersection.disconnect();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('pointerdown', onInteract);
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
        {Runtime ? <Runtime /> : null}
      </Link>
    </div>
  );
}
