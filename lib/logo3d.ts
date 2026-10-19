export type LogoEdge = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  r: number;
  g: number;
  b: number;
};

export type Rgb = { r: number; g: number; b: number };

const onMask = (mask: Uint8Array, width: number, height: number, x: number, y: number) =>
  x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] !== 0;

type Pt = { x: number; y: number };

const pointKey = (point: Pt) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`;

function marchingLinks(code: number, x: number, y: number): Array<[Pt, Pt]> {
  if (code === 0 || code === 15) return [];
  const top = { x: x + 0.5, y };
  const right = { x: x + 1, y: y + 0.5 };
  const bottom = { x: x + 0.5, y: y + 1 };
  const left = { x, y: y + 0.5 };
  if (code === 1 || code === 14) return [[left, top]];
  if (code === 2 || code === 13) return [[top, right]];
  if (code === 3 || code === 12) return [[left, right]];
  if (code === 4 || code === 11) return [[right, bottom]];
  if (code === 6 || code === 9) return [[top, bottom]];
  if (code === 7 || code === 8) return [[bottom, left]];
  if (code === 5) return [[left, top], [right, bottom]];
  if (code === 10) return [[top, right], [bottom, left]];
  return [];
}

/** Smooth silhouette loops, including holes. Pixel space, y downward. */
export function traceContours(mask: Uint8Array, width: number, height: number): Pt[][] {
  const paddedWidth = width + 2;
  const paddedHeight = height + 2;
  const padded = new Uint8Array(paddedWidth * paddedHeight);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (mask[y * width + x]) padded[(y + 1) * paddedWidth + (x + 1)] = 1;
    }
  }

  type Seg = { a: Pt; b: Pt; used: boolean };
  const buckets = new Map<string, Seg[]>();
  const push = (from: Pt, to: Pt) => {
    const segment: Seg = { a: from, b: to, used: false };
    for (const point of [from, to]) {
      const key = pointKey(point);
      const list = buckets.get(key);
      if (list) list.push(segment);
      else buckets.set(key, [segment]);
    }
  };

  for (let y = 0; y < paddedHeight - 1; y += 1) {
    for (let x = 0; x < paddedWidth - 1; x += 1) {
      let code = 0;
      if (onMask(padded, paddedWidth, paddedHeight, x, y)) code |= 1;
      if (onMask(padded, paddedWidth, paddedHeight, x + 1, y)) code |= 2;
      if (onMask(padded, paddedWidth, paddedHeight, x + 1, y + 1)) code |= 4;
      if (onMask(padded, paddedWidth, paddedHeight, x, y + 1)) code |= 8;
      for (const [from, to] of marchingLinks(code, x, y)) push(from, to);
    }
  }

  const contours: Pt[][] = [];
  for (const [startKey, segments] of Array.from(buckets.entries())) {
    if (!segments.some((segment) => !segment.used)) continue;
    const [sx, sy] = startKey.split(',').map(Number);
    let cursor = { x: sx, y: sy };
    const loop: Pt[] = [];
    let guard = 0;
    while (guard < paddedWidth * paddedHeight) {
      guard += 1;
      const choices = buckets.get(pointKey(cursor));
      const segment = choices?.find((item) => !item.used);
      if (!segment) break;
      segment.used = true;
      const nextPoint = pointKey(segment.a) === pointKey(cursor) ? segment.b : segment.a;
      loop.push({ x: cursor.x - 1, y: cursor.y - 1 });
      if (pointKey(nextPoint) === startKey) break;
      cursor = nextPoint;
    }
    if (loop.length >= 8) contours.push(loop);
  }
  return contours;
}

function rdpSplit(points: Pt[], epsilon: number): { index: number; max: number } {
  let max = 0;
  let index = 0;
  const start = points[0];
  const end = points[points.length - 1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  for (let i = 1; i < points.length - 1; i += 1) {
    const dist = Math.abs(dy * points[i].x - dx * points[i].y + end.x * start.y - end.y * start.x) / length;
    if (dist > max) {
      max = dist;
      index = i;
    }
  }
  return { index, max };
}

export function simplifyRdp(points: Pt[], epsilon: number): Pt[] {
  if (points.length < 3) return points;
  const { index, max } = rdpSplit(points, epsilon);
  if (max <= epsilon) return [points[0], points[points.length - 1]];
  const left = simplifyRdp(points.slice(0, index + 1), epsilon);
  const right = simplifyRdp(points.slice(index), epsilon);
  return left.slice(0, -1).concat(right);
}

async function simplifyRdpYielded(
  points: Pt[],
  epsilon: number,
  yieldFn: () => Promise<void>,
  budget: { n: number },
): Promise<Pt[]> {
  budget.n += points.length;
  if (budget.n >= 2500) {
    budget.n = 0;
    await yieldFn();
  }
  if (points.length < 3) return points;
  const { index, max } = rdpSplit(points, epsilon);
  if (max <= epsilon) return [points[0], points[points.length - 1]];
  const left = await simplifyRdpYielded(points.slice(0, index + 1), epsilon, yieldFn, budget);
  const right = await simplifyRdpYielded(points.slice(index), epsilon, yieldFn, budget);
  return left.slice(0, -1).concat(right);
}

/** Map a mask pixel into model space. x is ±1 across the logo; y is up. */
export function maskToModel(px: number, py: number, width: number, height: number): { x: number; y: number } {
  const aspect = height / width;
  return {
    x: (px / width - 0.5) * 2,
    y: (0.5 - py / height) * 2 * aspect,
  };
}

function sampleEdgeColor(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  width: number,
  height: number,
  colorAt: (x: number, y: number) => Rgb,
): Rgb {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy) || 1;
  const lx = -dy / length;
  const ly = dx / length;
  const read = (ox: number, oy: number) => {
    const x = Math.max(0, Math.min(width - 1, Math.round(mx + ox)));
    const y = Math.max(0, Math.min(height - 1, Math.round(my + oy)));
    return colorAt(x, y);
  };
  const left = read(lx * 1.4, ly * 1.4);
  const right = read(-lx * 1.4, -ly * 1.4);
  const score = (color: Rgb) => color.r + color.g + color.b;
  return score(left) >= score(right) ? left : right;
}

/** Extrude simplified silhouette loops into model-space walls. */
export function extrudeMask(
  mask: Uint8Array,
  width: number,
  height: number,
  colorAt: (x: number, y: number) => Rgb,
): LogoEdge[] {
  const edges: LogoEdge[] = [];
  for (const raw of traceContours(mask, width, height)) {
    const loop = simplifyRdp(raw, 1.15);
    if (loop.length < 4) continue;
    for (let i = 0; i < loop.length; i += 1) {
      const a = loop[i];
      const b = loop[(i + 1) % loop.length];
      if (Math.hypot(b.x - a.x, b.y - a.y) < 0.35) continue;
      const start = maskToModel(a.x, a.y, width, height);
      const end = maskToModel(b.x, b.y, width, height);
      const color = sampleEdgeColor(a.x, a.y, b.x, b.y, width, height, colorAt);
      edges.push({ x0: start.x, y0: start.y, x1: end.x, y1: end.y, r: color.r, g: color.g, b: color.b });
    }
  }
  return edges;
}

/** Hand the main thread back between extrusion slices. */
export function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (typeof scheduler?.yield === 'function') return scheduler.yield();
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

const EXTRUDE_ROW_BATCH = 8;
const EXTRUDE_WALK_BATCH = 200;

/**
 * Same walls as extrudeMask, but the mask scan, marching squares, and contour walk
 * each return to the event loop so a single task stays short.
 */
export async function extrudeMaskYielded(
  mask: Uint8Array,
  width: number,
  height: number,
  colorAt: (x: number, y: number) => Rgb,
  yieldFn: () => Promise<void> = yieldToMain,
): Promise<LogoEdge[]> {
  const paddedWidth = width + 2;
  const paddedHeight = height + 2;
  const padded = new Uint8Array(paddedWidth * paddedHeight);
  for (let y = 0; y < height; y += 1) {
    const src = y * width;
    const dest = (y + 1) * paddedWidth + 1;
    for (let x = 0; x < width; x += 1) {
      if (mask[src + x]) padded[dest + x] = 1;
    }
    if ((y + 1) % EXTRUDE_ROW_BATCH === 0) await yieldFn();
  }

  type Seg = { a: Pt; b: Pt; used: boolean };
  const buckets = new Map<string, Seg[]>();
  const push = (from: Pt, to: Pt) => {
    const segment: Seg = { a: from, b: to, used: false };
    for (const point of [from, to]) {
      const key = pointKey(point);
      const list = buckets.get(key);
      if (list) list.push(segment);
      else buckets.set(key, [segment]);
    }
  };

  for (let y = 0; y < paddedHeight - 1; y += 1) {
    for (let x = 0; x < paddedWidth - 1; x += 1) {
      let code = 0;
      if (onMask(padded, paddedWidth, paddedHeight, x, y)) code |= 1;
      if (onMask(padded, paddedWidth, paddedHeight, x + 1, y)) code |= 2;
      if (onMask(padded, paddedWidth, paddedHeight, x + 1, y + 1)) code |= 4;
      if (onMask(padded, paddedWidth, paddedHeight, x, y + 1)) code |= 8;
      for (const [from, to] of marchingLinks(code, x, y)) push(from, to);
    }
    if ((y + 1) % EXTRUDE_ROW_BATCH === 0) await yieldFn();
  }

  const contours: Pt[][] = [];
  const entries = Array.from(buckets.entries());
  let walked = 0;
  for (let n = 0; n < entries.length; n += 1) {
    const [startKey, segments] = entries[n];
    if (!segments.some((segment) => !segment.used)) continue;
    const [sx, sy] = startKey.split(',').map(Number);
    let cursor = { x: sx, y: sy };
    const loop: Pt[] = [];
    let guard = 0;
    while (guard < paddedWidth * paddedHeight) {
      guard += 1;
      walked += 1;
      if (walked % EXTRUDE_WALK_BATCH === 0) await yieldFn();
      const choices = buckets.get(pointKey(cursor));
      const segment = choices?.find((item) => !item.used);
      if (!segment) break;
      segment.used = true;
      const nextPoint = pointKey(segment.a) === pointKey(cursor) ? segment.b : segment.a;
      loop.push({ x: cursor.x - 1, y: cursor.y - 1 });
      if (pointKey(nextPoint) === startKey) break;
      cursor = nextPoint;
    }
    if (loop.length >= 8) contours.push(loop);
    if ((n + 1) % EXTRUDE_ROW_BATCH === 0) await yieldFn();
  }

  const edges: LogoEdge[] = [];
  const simplifyBudget = { n: 0 };
  for (let c = 0; c < contours.length; c += 1) {
    const loop = await simplifyRdpYielded(contours[c], 1.15, yieldFn, simplifyBudget);
    if (loop.length < 4) continue;
    for (let i = 0; i < loop.length; i += 1) {
      const a = loop[i];
      const b = loop[(i + 1) % loop.length];
      if (Math.hypot(b.x - a.x, b.y - a.y) < 0.35) continue;
      const start = maskToModel(a.x, a.y, width, height);
      const end = maskToModel(b.x, b.y, width, height);
      const color = sampleEdgeColor(a.x, a.y, b.x, b.y, width, height, colorAt);
      edges.push({ x0: start.x, y0: start.y, x1: end.x, y1: end.y, r: color.r, g: color.g, b: color.b });
    }
    if ((c + 1) % 2 === 0) await yieldFn();
  }
  return edges;
}

export function projectPoint(
  x: number,
  y: number,
  z: number,
  rotY: number,
  rotX: number,
  cx: number,
  cy: number,
  scale: number,
  camera = 2.7,
): { x: number; y: number; z: number } {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  const perspective = camera / (camera + z2);
  return {
    x: cx + x1 * scale * perspective,
    y: cy - y2 * scale * perspective,
    z: z2,
  };
}

/** 0..1 light on an extruded wall. Normals that face the camera stay brighter. */
export function extrusionShade(nx: number, ny: number, nz: number, luma: number): number {
  const light = Math.abs(nx * 0.22 + ny * 0.42 + nz * -0.88);
  const minShade = luma > 0.78 ? 0.64 : 0.36;
  return minShade + (1 - minShade) * Math.max(0, Math.min(1, light));
}

export function shadeNormal(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  zFront: number,
  zBack: number,
  rotY: number,
  rotX: number,
): { nx: number; ny: number; nz: number } {
  const p0 = rotate(x0, y0, zFront, rotY, rotX);
  const p1 = rotate(x1, y1, zFront, rotY, rotX);
  const p2 = rotate(x0, y0, zBack, rotY, rotX);
  const ux = p1.x - p0.x;
  const uy = p1.y - p0.y;
  const uz = p1.z - p0.z;
  const vx = p2.x - p0.x;
  const vy = p2.y - p0.y;
  const vz = p2.z - p0.z;
  let nx = uy * vz - uz * vy;
  let ny = uz * vx - ux * vz;
  let nz = ux * vy - uy * vx;
  const length = Math.hypot(nx, ny, nz) || 1;
  nx /= length;
  ny /= length;
  nz /= length;
  return { nx, ny, nz };
}

export function rotate(x: number, y: number, z: number, rotY: number, rotX: number): { x: number; y: number; z: number } {
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  return {
    x: x1,
    y: y * cosX - z1 * sinX,
    z: y * sinX + z1 * cosX,
  };
}

/** True when a face whose rest normal is (0, 0, -1) points toward the camera. */
export function frontFacesCamera(rotY: number, rotX: number): boolean {
  const normal = rotate(0, 0, -1, rotY, rotX);
  return normal.z < 0;
}

export const LOGO_EXTRUDE_DEPTH = 0.16;
export const LOGO_MAX_DPR = 1.5;
