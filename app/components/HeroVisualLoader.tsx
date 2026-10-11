'use client';

import dynamic from 'next/dynamic';

const HeroVisual = dynamic(() => import('./HeroVisual'), {
  ssr: false,
  loading: () => null,
});

export default function HeroVisualLoader() {
  return <HeroVisual />;
}
