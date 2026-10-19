import { readLogo3dBlockers } from './logo3d/signals';

const MAX_Y = 12;
const MAX_X = 8;

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

/** Subtle CSS 3D tilt for the header SVG. No WebGL, no extra paint loop when idle. */
export function bindHeaderLogoTilt(el: HTMLElement | null): () => void {
  if (!el || readLogo3dBlockers()) return () => undefined;
  const fine = window.matchMedia('(pointer: fine)');
  if (!fine.matches) return () => undefined;

  let frame = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

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

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = clamp(-px * 22, MAX_Y);
    targetY = clamp(py * 16, MAX_X);
    kick();
  };

  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    kick();
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.style.removeProperty('--logo-rx');
    el.style.removeProperty('--logo-ry');
  };
}
