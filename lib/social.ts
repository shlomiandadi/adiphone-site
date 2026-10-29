/** Verified public profiles. Do not invent extra networks. */
export const SOCIAL_FACEBOOK =
  'https://www.facebook.com/profile.php?id=61578707397365';
export const SOCIAL_INSTAGRAM = 'https://www.instagram.com/topwebstack/';
export const SOCIAL_LINKEDIN = 'https://www.linkedin.com/in/shlomi-malfuf-709961221/';
export const SOCIAL_X = 'https://x.com/shlomiMalfuf';

/** Organization / LocalBusiness sameAs — business + public profiles the business uses. */
export const ORGANIZATION_SAME_AS = [
  SOCIAL_FACEBOOK,
  SOCIAL_INSTAGRAM,
  SOCIAL_LINKEDIN,
  SOCIAL_X,
] as const;

/** Person (founder) sameAs — personal profiles only. */
export const PERSON_SAME_AS = [SOCIAL_LINKEDIN, SOCIAL_X] as const;

export function organizationSameAs(...extra: Array<string | undefined | null>): string[] {
  return Array.from(
    new Set([...ORGANIZATION_SAME_AS, ...extra.filter((url): url is string => Boolean(url))])
  );
}
