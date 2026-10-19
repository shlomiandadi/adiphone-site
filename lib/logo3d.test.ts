import assert from 'node:assert/strict';
import test from 'node:test';
import { canArmHeroLogo, LOGO3D_MOBILE_DELAY_MS, shouldSkipLogo3d } from './logo3dGate.ts';
import {
  extrudeMask,
  extrudeMaskYielded,
  extrusionShade,
  frontFacesCamera,
  maskToModel,
  projectPoint,
  traceContours,
} from './logo3d.ts';

test('skips the 3D logo for reduced motion, save-data, and weak devices', () => {
  const ok = { reducedMotion: false, saveData: false, deviceMemory: 8, hardwareConcurrency: 8 };
  assert.equal(shouldSkipLogo3d(ok), false);
  assert.equal(shouldSkipLogo3d({ ...ok, reducedMotion: true }), true);
  assert.equal(shouldSkipLogo3d({ ...ok, saveData: true }), true);
  assert.equal(shouldSkipLogo3d({ ...ok, deviceMemory: 2 }), true);
  assert.equal(shouldSkipLogo3d({ ...ok, deviceMemory: 4 }), false);
  assert.equal(shouldSkipLogo3d({ ...ok, hardwareConcurrency: 2 }), true);
  assert.equal(shouldSkipLogo3d({ ...ok, hardwareConcurrency: 4 }), false);
  assert.equal(shouldSkipLogo3d({ reducedMotion: false, saveData: false }), false);
});

test('the hero logo arms only after load, and later still on touch', () => {
  const ready = {
    blocked: false,
    loaded: true,
    inView: true,
    touchLike: false,
    interacted: false,
    sinceLoadMs: 0,
  };
  assert.equal(canArmHeroLogo(ready), true);
  assert.equal(canArmHeroLogo({ ...ready, loaded: false, interacted: true }), false);
  assert.equal(canArmHeroLogo({ ...ready, inView: false }), false);
  assert.equal(canArmHeroLogo({ ...ready, blocked: true }), false);
  assert.equal(canArmHeroLogo({ ...ready, touchLike: true, sinceLoadMs: 0 }), false);
  assert.equal(canArmHeroLogo({ ...ready, touchLike: true, interacted: true, sinceLoadMs: 0 }), true);
  assert.equal(canArmHeroLogo({ ...ready, touchLike: true, sinceLoadMs: LOGO3D_MOBILE_DELAY_MS - 1 }), false);
  assert.equal(canArmHeroLogo({ ...ready, touchLike: true, sinceLoadMs: LOGO3D_MOBILE_DELAY_MS }), true);
});

test('a solid rectangle traces one outer loop and extrudes it', () => {
  const width = 8;
  const height = 6;
  const mask = new Uint8Array(width * height).fill(1);
  const contours = traceContours(mask, width, height);
  assert.equal(contours.length, 1);
  const extruded = extrudeMask(mask, width, height, () => ({ r: 10, g: 20, b: 30 }));
  assert.ok(extruded.length >= 4);
  assert.equal(extruded[0].r, 10);
  const xs = extruded.flatMap((edge) => [edge.x0, edge.x1]);
  const ys = extruded.flatMap((edge) => [edge.y0, edge.y1]);
  assert.ok(Math.min(...xs) < -0.7);
  assert.ok(Math.max(...xs) > 0.7);
  assert.ok(Math.max(...ys) > 0);
  assert.ok(Math.min(...ys) < 0);
});

test('a hole adds an inner contour', () => {
  const width = 12;
  const height = 10;
  const mask = new Uint8Array(width * height).fill(1);
  for (let y = 3; y <= 6; y += 1) {
    for (let x = 4; x <= 7; x += 1) mask[y * width + x] = 0;
  }
  const contours = traceContours(mask, width, height);
  assert.equal(contours.length, 2);
});

test('projects the origin to the screen center and keeps y up', () => {
  const origin = projectPoint(0, 0, 0, 0, 0, 100, 80, 50);
  assert.ok(Math.abs(origin.x - 100) < 0.001);
  assert.ok(Math.abs(origin.y - 80) < 0.001);
  const above = projectPoint(0, 1, 0, 0, 0, 100, 80, 50);
  assert.ok(above.y < origin.y);
  const turned = maskToModel(0, 0, 100, 25);
  assert.ok(turned.x < 0);
  assert.ok(turned.y > 0);
});

test('yielded extrusion matches the sync walls and keeps each slice under 50ms', async () => {
  const width = 480;
  const height = 120;
  const mask = new Uint8Array(width * height).fill(1);
  for (let y = 40; y <= 80; y += 1) {
    for (let x = 160; x <= 320; x += 1) mask[y * width + x] = 0;
  }
  const color = () => ({ r: 8, g: 16, b: 32 });
  const sync = extrudeMask(mask, width, height, color);
  let last = performance.now();
  let maxSlice = 0;
  let yields = 0;
  const yielded = await extrudeMaskYielded(mask, width, height, color, async () => {
    const now = performance.now();
    maxSlice = Math.max(maxSlice, now - last);
    yields += 1;
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    last = performance.now();
  });
  maxSlice = Math.max(maxSlice, performance.now() - last);
  assert.equal(yielded.length, sync.length);
  assert.ok(yields >= 8, `expected several yields, got ${yields}`);
  assert.ok(maxSlice < 50, `longest slice ${maxSlice.toFixed(2)}ms`);
});

test('the front face points at the camera only while yaw stays in front', () => {
  assert.equal(frontFacesCamera(0, 0), true);
  assert.equal(frontFacesCamera(Math.PI, 0), false);
  assert.ok(extrusionShade(0, 0, -1, 0.9) > extrusionShade(0, 0, 1, 0.2));
});
