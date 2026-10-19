import {
  LOGO_EXTRUDE_DEPTH,
  LOGO_MAX_DPR,
  type LogoEdge,
  extrusionShade,
  extrudeMaskYielded,
  frontFacesCamera,
  projectPoint,
  shadeNormal,
  yieldToMain,
} from '@/lib/logo3d';
import { readLogo3dBlockers } from './signals';

const MASK_WIDTH = 480;
const TEXTURE_WIDTH = 720;
const ROCK_SPEED = 0.00038;
const ROCK_AMPLITUDE = 0.62;
const SRC = '/brand/logo-horizontal-transparent.svg';

type BakedEdge = LogoEdge & { luma: number };
type Quad = {
  a: { x: number; y: number };
  b: { x: number; y: number };
  c: { x: number; y: number };
  d: { x: number; y: number };
};

function isNarrow() {
  return window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches;
}

function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sx0: number,
  sy0: number,
  sx1: number,
  sy1: number,
  sx2: number,
  sy2: number,
  dx0: number,
  dy0: number,
  dx1: number,
  dy1: number,
  dx2: number,
  dy2: number,
) {
  const denom = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1);
  if (!denom) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(dx0, dy0);
  ctx.lineTo(dx1, dy1);
  ctx.lineTo(dx2, dy2);
  ctx.closePath();
  ctx.clip();
  const a = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denom;
  const b = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denom;
  const c = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denom;
  const d = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denom;
  const e = (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denom;
  const f = (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denom;
  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(image, 0, 0);
  ctx.restore();
}

function drawFace(
  ctx: CanvasRenderingContext2D,
  texture: HTMLCanvasElement,
  rotY: number,
  rotX: number,
  z: number,
  cx: number,
  cy: number,
  scale: number,
  halfH: number,
  flipX: boolean,
) {
  const cols = 4;
  const rows = 2;
  const corners: Array<{ x: number; y: number; u: number; v: number }> = [];
  for (let iy = 0; iy <= rows; iy += 1) {
    for (let ix = 0; ix <= cols; ix += 1) {
      const mx = -1 + (ix / cols) * 2;
      const my = halfH - (iy / rows) * 2 * halfH;
      const u = ((flipX ? cols - ix : ix) / cols) * texture.width;
      const v = (iy / rows) * texture.height;
      const projected = projectPoint(mx, my, z, rotY, rotX, cx, cy, scale);
      corners.push({ x: projected.x, y: projected.y, u, v });
    }
  }
  const stride = cols + 1;
  for (let iy = 0; iy < rows; iy += 1) {
    for (let ix = 0; ix < cols; ix += 1) {
      const i00 = iy * stride + ix;
      const i10 = i00 + 1;
      const i01 = i00 + stride;
      const i11 = i01 + 1;
      const a = corners[i00];
      const b = corners[i10];
      const c = corners[i11];
      const d = corners[i01];
      drawTexturedTriangle(ctx, texture, a.u, a.v, b.u, b.v, c.u, c.v, a.x, a.y, b.x, b.y, c.x, c.y);
      drawTexturedTriangle(ctx, texture, a.u, a.v, c.u, c.v, d.u, d.v, a.x, a.y, c.x, c.y, d.x, d.y);
    }
  }
}

export function startHeroLogo(canvas: HTMLCanvasElement): () => void {
  if (readLogo3dBlockers()) return () => undefined;

  const stage: EventTarget = canvas.closest('.h3d-stage') ?? canvas.parentElement ?? canvas;
  const host = canvas.parentElement ?? canvas;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => undefined;

  let cancelled = false;
  let running = false;
  let visible = document.visibilityState === 'visible';
  let inView = true;
  let narrow = isNarrow();
  let width = 0;
  let height = 0;
  let dpr = 1;
  let edges: BakedEdge[] = [];
  let order: number[] = [];
  let depths: number[] = [];
  let texture: HTMLCanvasElement | null = null;
  let halfH = 0.25;
  let edgeScratch: Quad[] = [];
  let yaw = 0;
  let pitch = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let pointer = false;
  let frameId = 0;
  let timerId = 0;
  let last = performance.now();
  const zFront = -LOGO_EXTRUDE_DEPTH / 2;
  const zBack = LOGO_EXTRUDE_DEPTH / 2;

  const resize = () => {
    narrow = isNarrow();
    const rect = host.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, LOGO_MAX_DPR);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  };

  const halt = () => {
    if (frameId) cancelAnimationFrame(frameId);
    if (timerId) window.clearTimeout(timerId);
    frameId = 0;
    timerId = 0;
  };

  const draw = (now: number) => {
    if (!texture) return;
    const dt = Math.min(34, now - last);
    last = now;
    yaw += (targetYaw - yaw) * 0.08;
    pitch += (targetPitch - pitch) * 0.08;
    const rotY = Math.sin(now * ROCK_SPEED) * ROCK_AMPLITUDE + yaw;
    const rotX = 0.2 + pitch + Math.sin(now * 0.00055) * 0.08;
    const parallaxX = yaw * 22;
    const parallaxY = pitch * 14;
    const cx = width / 2 + parallaxX;
    const cy = height / 2 + parallaxY;
    const scale = width * 0.46;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      const a = projectPoint(edge.x0, edge.y0, zFront, rotY, rotX, cx, cy, scale);
      const b = projectPoint(edge.x1, edge.y1, zFront, rotY, rotX, cx, cy, scale);
      const c = projectPoint(edge.x1, edge.y1, zBack, rotY, rotX, cx, cy, scale);
      const d = projectPoint(edge.x0, edge.y0, zBack, rotY, rotX, cx, cy, scale);
      depths[i] = (a.z + b.z + c.z + d.z) / 4;
      order[i] = i;
      edgeScratch[i] = { a, b, c, d };
    }
    order.sort((i, j) => depths[j] - depths[i]);

    for (let n = 0; n < order.length; n += 1) {
      const index = order[n];
      const edge = edges[index];
      const quad = edgeScratch[index];
      const normal = shadeNormal(edge.x0, edge.y0, edge.x1, edge.y1, zFront, zBack, rotY, rotX);
      const shade = extrusionShade(normal.nx, normal.ny, normal.nz, edge.luma);
      ctx.fillStyle = `rgb(${(edge.r * shade) | 0},${(edge.g * shade) | 0},${(edge.b * shade) | 0})`;
      ctx.beginPath();
      ctx.moveTo(quad.a.x, quad.a.y);
      ctx.lineTo(quad.b.x, quad.b.y);
      ctx.lineTo(quad.c.x, quad.c.y);
      ctx.lineTo(quad.d.x, quad.d.y);
      ctx.closePath();
      ctx.fill();
    }

    const facing = frontFacesCamera(rotY, rotX);
    drawFace(ctx, texture, rotY, rotX, facing ? zFront : zBack, cx, cy, scale, halfH, !facing);
  };

  const loop = (now: number) => {
    frameId = 0;
    if (!running || !visible || !inView || cancelled) return;
    draw(now);
    if (narrow) {
      timerId = window.setTimeout(() => {
        timerId = 0;
        if (running && visible && inView) frameId = requestAnimationFrame(loop);
      }, 34);
    } else {
      frameId = requestAnimationFrame(loop);
    }
  };

  const schedule = () => {
    if (frameId || timerId || !running || !visible || !inView || !texture) return;
    last = performance.now();
    frameId = requestAnimationFrame(loop);
  };

  const sync = () => {
    running = visible && inView && !cancelled && Boolean(texture);
    if (running) schedule();
    else halt();
  };

  const onPointer = (event: Event) => {
    const point = event as PointerEvent;
    if (point.pointerType === 'touch') return;
    const rect = (stage as HTMLElement).getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const nx = (point.clientX - rect.left) / rect.width - 0.5;
    const ny = (point.clientY - rect.top) / rect.height - 0.5;
    targetYaw = nx * 0.55;
    targetPitch = ny * 0.34;
    pointer = true;
  };

  const onLeave = () => {
    targetYaw = 0;
    targetPitch = 0;
    pointer = false;
  };

  const onOrient = (event: DeviceOrientationEvent) => {
    if (pointer || event.gamma == null || event.beta == null) return;
    const gx = Math.max(-1, Math.min(1, event.gamma / 42));
    const gy = Math.max(-1, Math.min(1, (event.beta - 42) / 42));
    targetYaw = gx * 0.45;
    targetPitch = gy * 0.28;
  };

  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    sync();
  };

  const onMotion = () => {
    if (!readLogo3dBlockers()) return;
    cancelled = true;
    canvas.closest('.hero-logo3d')?.removeAttribute('data-logo3d');
    halt();
  };

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener?.('change', onMotion);

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(host);

  const intersection = new IntersectionObserver(
    ([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      sync();
    },
    { threshold: 0.05 },
  );
  intersection.observe(canvas.closest('.hero-logo3d') ?? host);

  stage.addEventListener('pointermove', onPointer);
  stage.addEventListener('pointerleave', onLeave);
  document.addEventListener('visibilitychange', onVisibility);
  if (isNarrow()) window.addEventListener('deviceorientation', onOrient);

  resize();

  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    void prepare(image);
  };
  image.src = SRC;

  const prepare = async (source: HTMLImageElement) => {
    await yieldToMain();
    if (cancelled) return;
    const maskHeight = Math.max(8, Math.round((MASK_WIDTH * source.height) / source.width));
    const bitmap = await createImageBitmap(source).catch(() => null);
    await yieldToMain();
    if (cancelled) {
      bitmap?.close();
      return;
    }
    const drawable: CanvasImageSource = bitmap ?? source;
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = MASK_WIDTH;
    maskCanvas.height = maskHeight;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) {
      bitmap?.close();
      return;
    }
    maskCtx.drawImage(drawable, 0, 0, MASK_WIDTH, maskHeight);
    const pixels = maskCtx.getImageData(0, 0, MASK_WIDTH, maskHeight);
    await yieldToMain();
    if (cancelled) {
      bitmap?.close();
      return;
    }
    const mask = new Uint8Array(MASK_WIDTH * maskHeight);
    for (let y = 0; y < maskHeight; y += 1) {
      const row = y * MASK_WIDTH;
      for (let x = 0; x < MASK_WIDTH; x += 1) {
        mask[row + x] = pixels.data[(row + x) * 4 + 3] > 170 ? 1 : 0;
      }
      if ((y + 1) % 8 === 0) await yieldToMain();
      if (cancelled) {
        bitmap?.close();
        return;
      }
    }
    const built = await extrudeMaskYielded(mask, MASK_WIDTH, maskHeight, (x, y) => {
      const index = (y * MASK_WIDTH + x) * 4;
      return { r: pixels.data[index], g: pixels.data[index + 1], b: pixels.data[index + 2] };
    });
    if (cancelled) {
      bitmap?.close();
      return;
    }
    edges = built.map((edge) => ({
      ...edge,
      luma: (edge.r * 0.3 + edge.g * 0.59 + edge.b * 0.11) / 255,
    }));
    order = new Array(edges.length);
    depths = new Array(edges.length);
    edgeScratch = new Array(edges.length);
    halfH = maskHeight / MASK_WIDTH;

    await yieldToMain();
    if (cancelled) {
      bitmap?.close();
      return;
    }
    const textureHeight = Math.max(8, Math.round((TEXTURE_WIDTH * source.height) / source.width));
    const face = document.createElement('canvas');
    face.width = TEXTURE_WIDTH;
    face.height = textureHeight;
    const faceCtx = face.getContext('2d');
    if (!faceCtx) {
      bitmap?.close();
      return;
    }
    faceCtx.drawImage(drawable, 0, 0, TEXTURE_WIDTH, textureHeight);
    bitmap?.close();
    texture = face;
    await yieldToMain();
    if (cancelled || !texture) return;
    resize();
    draw(performance.now());
    canvas.closest('.hero-logo3d')?.setAttribute('data-logo3d', 'on');
    sync();
  };

  sync();

  return () => {
    cancelled = true;
    running = false;
    halt();
    resizeObserver.disconnect();
    intersection.disconnect();
    stage.removeEventListener('pointermove', onPointer);
    stage.removeEventListener('pointerleave', onLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('deviceorientation', onOrient);
    motion.removeEventListener?.('change', onMotion);
    canvas.closest('.hero-logo3d')?.removeAttribute('data-logo3d');
  };
}
