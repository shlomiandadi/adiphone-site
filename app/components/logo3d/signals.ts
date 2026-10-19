import { shouldSkipLogo3d } from '@/lib/logo3d';

export function readLogo3dBlockers(): boolean {
  if (typeof window === 'undefined') return true;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return shouldSkipLogo3d({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(nav.connection?.saveData),
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
  });
}
