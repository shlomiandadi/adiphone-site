export type SeoAgentFaqItem = {
  question: string;
  answer: string;
};

export type SeoAgentPageOverride = {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  faq?: SeoAgentFaqItem[];
  schemaMarkup?: string;
};

export type SeoAgentRedirect = {
  from: string;
  to: string;
  status?: 301 | 302;
};

export type SeoAgentStoreState = {
  pages: Record<string, SeoAgentPageOverride>;
  redirects: SeoAgentRedirect[];
  llms: string;
};

export type SeoAgentApplyPayload = {
  action?: string;
  type?: string;
  path?: string;
  url?: string;
  title?: string;
  seoTitle?: string;
  metaTitle?: string;
  description?: string;
  metaDescription?: string;
  metaDesc?: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  faq?: SeoAgentFaqItem[];
  faqs?: SeoAgentFaqItem[];
  schema?: unknown;
  schemaMarkup?: string;
  jsonLd?: unknown;
  override?: Partial<SeoAgentPageOverride> & { path?: string; url?: string };
  overrides?: Record<string, Partial<SeoAgentPageOverride> | null>;
  pages?: Array<Partial<SeoAgentPageOverride> & { path?: string; url?: string }>;
  redirects?: SeoAgentRedirect[] | Record<string, string>;
  llmsTxt?: string;
  llms?: string;
  revalidate?: string[];
  paths?: string[];
};
