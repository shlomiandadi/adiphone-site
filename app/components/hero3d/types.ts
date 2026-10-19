import type { ReactNode } from 'react';

export type HeroTheme =
  | 'home'
  | 'web-development'
  | 'seo'
  | 'ppc'
  | 'aeo-geo'
  | 'ecommerce'
  | 'wordpress'
  | 'ui-design'
  | 'apps'
  | 'software'
  | 'ai'
  | 'analytics'
  | 'cloud'
  | 'local'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'portfolio'
  | 'blog'
  | 'services';

export type HeroCta = {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
  external?: boolean;
};

export type Hero3DProps = {
  theme: HeroTheme;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  extraHeading?: string;
  extraHeadingAs?: 'h2' | 'p';
  ctas?: HeroCta[];
  cityName?: string;
  align?: 'start' | 'center';
  /** Homepage-only mark. Other pages omit it so its client code stays off their bundles. */
  mark?: ReactNode;
  children?: ReactNode;
};
