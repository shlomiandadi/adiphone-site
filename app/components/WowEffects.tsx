'use client';

import { useEffect } from 'react';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
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

export default function WowEffects() {
  useEffect(() => {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    const reduced = prefersReducedMotion();
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      progress.style.transform = `scaleX(${value})`;
    };
    updateProgress();

    if (reduced) {
      window.addEventListener('scroll', updateProgress, { passive: true });
      return () => {
        window.removeEventListener('scroll', updateProgress);
        progress.remove();
      };
    }

    document.documentElement.classList.add('wow-ready');

    const revealTargets = document.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-reveal-stagger], [data-clip-reveal], [data-count]'
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add('is-inview');
          if (target.hasAttribute('data-count')) countUp(target);
          io.unobserve(target);
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));

    const parallaxNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let ticking = false;
    const applyParallax = () => {
      ticking = false;
      const y = window.scrollY;
      for (const el of parallaxNodes) {
        const speed = Number(el.dataset.parallax || 0.16);
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      }
    };
    const onScroll = () => {
      updateProgress();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(applyParallax);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const tilts = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
    const cleanups: Array<() => void> = [];
    if (canTilt) {
      for (const card of tilts) {
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
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      }
    }

    return () => {
      document.documentElement.classList.remove('wow-ready');
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      cleanups.forEach((fn) => fn());
      progress.remove();
    };
  }, []);

  return null;
}
