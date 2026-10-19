import type { Metadata } from 'next';
import { mergeCmsMetadata } from '../lib/cms/seo';
import { applySeoAgentOverride } from './override';
import { getSeoAgentPageOverride } from './state';

export { applySeoAgentOverride } from './override';

/**
 * Returns `base` unchanged when neither the SEO-agent store nor an explicitly
 * cmsEnabled row applies. Legacy `seo` / `canonical_tags` rows are ignored
 * until cmsEnabled is set in the admin — they must never overwrite live titles.
 */
export async function mergeSeoAgentMetadata(path: string, base: Metadata): Promise<Metadata> {
  const withCms = await mergeCmsMetadata(path, base);
  const override = await getSeoAgentPageOverride(path);
  // Agent overrides win over CMS and hardcoded metadata. Title-only payloads
  // leave canonical and other omitted fields untouched.
  return override ? applySeoAgentOverride(withCms, override) : withCms;
}

export function createSeoAgentGenerateMetadata(path: string, base: Metadata) {
  return async function generateMetadata(): Promise<Metadata> {
    return mergeSeoAgentMetadata(path, base);
  };
}
