import { canArmHeroLogo, LOGO3D_MOBILE_DELAY_MS } from '@/lib/logo3dGate';
import { readLogo3dBlockers } from './signals';

/** Download the extrusion only after load + idle, and later still on touch. */
export function bootHeroLogo(host: HTMLElement): () => void {
  if (readLogo3dBlockers()) return () => undefined;

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
  let stopCanvas = () => {};

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
      const link = host.querySelector('.hero-logo3d-link');
      if (!link) return;
      void import(/* webpackChunkName: "hero-logo-3d" */ './hero-logo-canvas').then((mod) => {
        if (cancelled) return;
        const canvas = document.createElement('canvas');
        canvas.className = 'hero-logo3d-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        link.appendChild(canvas);
        stopCanvas = mod.startHeroLogo(canvas);
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
    stopCanvas();
  };
  motion.addEventListener?.('change', onMotion);

  return () => {
    cancelled = true;
    clearTimers();
    stopCanvas();
    intersection.disconnect();
    window.removeEventListener('load', onLoad);
    window.removeEventListener('scroll', onInteract);
    window.removeEventListener('touchstart', onInteract);
    window.removeEventListener('pointerdown', onInteract);
    motion.removeEventListener?.('change', onMotion);
  };
}
