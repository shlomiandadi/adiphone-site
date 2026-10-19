export type Logo3dSignals = {
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

/** Skip the extruded hero logo on reduced motion, data-saver, or a weak device. */
export function shouldSkipLogo3d(signals: Logo3dSignals): boolean {
  if (signals.reducedMotion || signals.saveData) return true;
  if (typeof signals.deviceMemory === 'number' && signals.deviceMemory >= 0.5 && signals.deviceMemory < 4) {
    return true;
  }
  if (
    typeof signals.hardwareConcurrency === 'number' &&
    signals.hardwareConcurrency >= 1 &&
    signals.hardwareConcurrency < 4
  ) {
    return true;
  }
  return false;
}

/** Touch/narrow viewports wait for a gesture or this long after the load event. */
export const LOGO3D_MOBILE_DELAY_MS = 4000;

export type HeroLogoArm = {
  blocked: boolean;
  loaded: boolean;
  inView: boolean;
  touchLike: boolean;
  interacted: boolean;
  sinceLoadMs: number;
};

/**
 * The extruded logo may download only after the load event.
 * Touch and narrow screens also wait for the first gesture or 4s, whichever is first.
 */
export function canArmHeroLogo(input: HeroLogoArm): boolean {
  if (input.blocked || !input.loaded || !input.inView) return false;
  if (!input.touchLike) return true;
  return input.interacted || input.sinceLoadMs >= LOGO3D_MOBILE_DELAY_MS;
}
