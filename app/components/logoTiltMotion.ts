const MAX_Y = 12;
const MAX_X = 8;
const STYLE_ID = 'logo-tilt-style';

const TILT_CSS = `
.brand-lockup.is-logo-tilt {
  transform: perspective(640px) rotateX(var(--logo-rx, 0deg)) rotateY(var(--logo-ry, 0deg));
  animation: logo-tilt-idle 8s ease-in-out infinite;
}
.brand-lockup.is-logo-tilt.is-pointing { animation: none; }
@keyframes logo-tilt-idle {
  0%, 100% { transform: perspective(640px) rotateX(0deg) rotateY(0deg); }
  50% { transform: perspective(640px) rotateX(2.5deg) rotateY(-3.5deg); }
}
.site-header[data-contrast='hero'] .brand-lockup.is-logo-tilt,
footer.bg-gray-900 .brand-lockup.is-logo-tilt {
  filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.28));
}
.site-header[data-contrast='light'] .brand-lockup.is-logo-tilt {
  filter: drop-shadow(0 6px 8px rgba(15, 23, 42, 0.16));
}
.mobile-drawer:not(.mobile-drawer-open) .brand-lockup.is-logo-tilt { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .brand-lockup.is-logo-tilt { animation: none !important; transform: none !important; }
}
`;

function ensureTiltStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = TILT_CSS;
  document.head.appendChild(style);
}

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

/** Pointer tilt for on-page logos. Loaded only after load + idle, and only for a fine pointer. */
export function bindLogoTilt(el: HTMLElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined;
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) return () => undefined;

  let frame = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  ensureTiltStyle();
  el.classList.add('is-logo-tilt');

  const apply = () => {
    frame = 0;
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    el.style.setProperty('--logo-rx', `${currentY.toFixed(2)}deg`);
    el.style.setProperty('--logo-ry', `${currentX.toFixed(2)}deg`);
    if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
      frame = window.requestAnimationFrame(apply);
    }
  };

  const kick = () => {
    if (!frame) frame = window.requestAnimationFrame(apply);
  };

  const onMove = (event: Event) => {
    const point = event as PointerEvent;
    if (point.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const px = (point.clientX - rect.left) / rect.width - 0.5;
    const py = (point.clientY - rect.top) / rect.height - 0.5;
    targetX = clamp(-px * 22, MAX_Y);
    targetY = clamp(py * 16, MAX_X);
    el.classList.add('is-pointing');
    kick();
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    el.classList.remove('is-pointing');
    el.style.setProperty('--logo-rx', '0deg');
    el.style.setProperty('--logo-ry', '0deg');
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.classList.remove('is-pointing', 'is-logo-tilt');
    el.style.removeProperty('--logo-rx');
    el.style.removeProperty('--logo-ry');
  };
}
