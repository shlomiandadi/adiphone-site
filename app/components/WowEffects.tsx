'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const REVEAL_SELECTOR = '[data-reveal], [data-reveal-stagger], [data-clip-reveal], [data-count]';
const FAILSAFE_MS = 1500;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const vw = window.innerWidth || document.documentElement.clientWidth || 0;
  return rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw;
}

function countUp(el: HTMLElement) {
  if (el.dataset.countRan === 'true') return;
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  el.dataset.countRan = 'true';
  const suffix = el.dataset.suffix ?? '';
  const prefix = el.dataset.prefix ?? '';
  const decimals = Number(el.dataset.decimals ?? 0);
  const start = performance.now();
  const duration = 900;
  const format = (value: number) => {
    const rounded = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
    return `${prefix}${rounded}${suffix}`;
  };

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = format(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function revealEl(el: HTMLElement) {
  el.classList.add('is-inview');
  if (el.hasAttribute('data-count')) countUp(el);
}

function revealAll() {
  document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(revealEl);
}

function showAllSafely() {
  document.documentElement.classList.add('wow-fallback');
  revealAll();
}

export default function WowEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const progress = document.querySelector('.scroll-progress') || document.createElement('div');
    if (!progress.parentElement) {
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);
    }

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      (progress as HTMLElement).style.transform = `scaleX(${value})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    showAllSafely();

    const reduced = prefersReducedMotion();
    const ioSupported = typeof IntersectionObserver === 'function';
    if (reduced || !ioSupported) {
      html.classList.remove('wow-ready');
      return () => showAllSafely();
    }

    let io: IntersectionObserver;
    try {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLElement;
            revealEl(target);
            io.unobserve(target);
          }
        },
        { threshold: 0.01, rootMargin: '64px 0px 64px 0px' }
      );
    } catch {
      showAllSafely();
      html.classList.remove('wow-ready');
      return () => showAllSafely();
    }

    const observed = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (isInViewport(el)) revealEl(el);
        if (observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
    };

    scan();
    const raf = window.requestAnimationFrame(scan);

    html.classList.add('wow-ready');
    html.classList.remove('wow-fallback');
    scan();

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    const failsafe = window.setTimeout(() => {
      showAllSafely();
    }, FAILSAFE_MS);

    const parallaxNodes = () => Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let ticking = false;
    const applyParallax = () => {
      ticking = false;
      const y = window.scrollY;
      for (const el of parallaxNodes()) {
        const speed = Number(el.dataset.parallax || 0.16);
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyParallax);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        showAllSafely();
        scan();
      }
    };
    window.addEventListener('pageshow', onPageShow);

    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const tiltCleanups: Array<() => void> = [];
    const bindTilts = () => {
      if (!canTilt) return;
      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
        if (card.dataset.tiltBound === 'true') return;
        card.dataset.tiltBound = 'true';
        const onMove = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateZ(0)`;
        };
        const onLeave = () => {
          card.style.transform = '';
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        tiltCleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
          delete card.dataset.tiltBound;
        });
      });
    };
    bindTilts();

    return () => {
      window.clearTimeout(failsafe);
      window.cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pageshow', onPageShow);
      tiltCleanups.forEach((fn) => fn());
      showAllSafely();
    };
  }, [pathname]);

  return null;
}
