type Particle = {
  x: number;
  y: number;
  z: number;
};

const DESKTOP_COUNT = 88;
const MOBILE_COUNT = 38;
const MAX_DPR = 1.5;
const LINK_DIST = 0.34;

function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches;
}

function project(
  p: Particle,
  rotY: number,
  rotX: number,
  cx: number,
  cy: number,
  scale: number
) {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);

  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;
  const y1 = p.y * cosX - z1 * sinX;
  const z2 = p.y * sinX + z1 * cosX;

  const perspective = 1.7 / (1.7 + z2);
  return {
    x: cx + x1 * scale * perspective,
    y: cy + y1 * scale * perspective,
    r: Math.max(1.1, 2.6 * perspective),
    depth: perspective,
  };
}

export function startHeroParticles(host: HTMLElement): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'absolute inset-0 h-full w-full';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    canvas.remove();
    return () => undefined;
  }

  const particles: Particle[] = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let running = false;
  let visible = true;
  let inView = true;
  let rotY = 0.35;
  let rotX = 0.18;
  let targetY = 0.35;
  let targetX = 0.18;
  let last = performance.now();

  const seed = () => {
    const count = isMobile() ? MOBILE_COUNT : DESKTOP_COUNT;
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
      });
    }
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (now: number) => {
    const dt = Math.min(32, now - last);
    last = now;
    rotY += (targetY - rotY) * 0.04 + dt * 0.000045;
    rotX += (targetX - rotX) * 0.04;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width, height) * 0.46;
    const projected = particles.map((p) => project(p, rotY, rotX, cx, cy, scale));
    const link = Math.min(width, height) * LINK_DIST;

    ctx.lineWidth = 1;
    for (let i = 0; i < projected.length; i += 1) {
      const a = projected[i];
      for (let j = i + 1; j < projected.length; j += 1) {
        const b = projected[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > link) continue;
        const alpha = (1 - dist / link) * 0.28 * Math.min(a.depth, b.depth);
        ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const point of projected) {
      const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.r * 3.2);
      glow.addColorStop(0, 'rgba(191, 219, 254, 0.95)');
      glow.addColorStop(0.45, 'rgba(96, 165, 250, 0.7)');
      glow.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r * 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(239, 246, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const tick = (now: number) => {
    if (running && visible && inView) draw(now);
    raf = requestAnimationFrame(tick);
  };

  const syncLoop = () => {
    const shouldRun = visible && inView;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
    } else if (!shouldRun) {
      running = false;
    }
  };

  const onMouse = (event: MouseEvent) => {
    const rect = host.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    targetY = 0.35 + nx * 0.35;
    targetX = 0.18 + ny * 0.22;
  };

  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    syncLoop();
  };

  seed();
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const intersection = new IntersectionObserver(
    ([entry]) => {
      inView = !!entry?.isIntersecting;
      syncLoop();
    },
    { threshold: 0.05 }
  );
  intersection.observe(host);

  window.addEventListener('mousemove', onMouse, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  running = true;
  raf = requestAnimationFrame(tick);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersection.disconnect();
    window.removeEventListener('mousemove', onMouse);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.remove();
  };
}
