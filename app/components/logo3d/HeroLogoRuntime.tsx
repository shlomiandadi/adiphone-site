'use client';

import { useEffect, useRef } from 'react';
import { startHeroLogo } from './hero-logo-canvas';

export default function HeroLogoRuntime() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startHeroLogo(canvas);
  }, []);

  return <canvas ref={canvasRef} className="hero-logo3d-canvas" aria-hidden="true" />;
}
