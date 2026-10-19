const MAX_Y = 12;
const MAX_X = 8;

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

/** Pointer tilt for every on-page logo. Loaded only after the load event and an idle callback. */
export function bindLogoTilt(el: HTMLElement): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => undefined;
  if (!window.matchMedia('(pointer: fine)').matches) return () => undefined;

  const plane = el.querySelector('.logo-tilt-plane');
  if (!(plane instanceof HTMLElement)) return () => undefined;

  let frame = 0;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const apply = () => {
    frame = 0;
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    plane.style.setProperty('--logo-rx', `${currentY.toFixed(2)}deg`);
    plane.style.setProperty('--logo-ry', `${currentX.toFixed(2)}deg`);
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
    plane.style.setProperty('--logo-rx', '0deg');
    plane.style.setProperty('--logo-ry', '0deg');
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    el.classList.remove('is-pointing');
    plane.style.removeProperty('--logo-rx');
    plane.style.removeProperty('--logo-ry');
  };
}
