/** Document titles for the four service pages that were over 60 characters. */
export const SERVICE_DOCUMENT_TITLES = {
  ecommerce: 'בניית חנות אינטרנטית לעסקים | Top Webstak',
  analytics: 'אנליטיקס וניתוח נתונים | Top Webstak',
  softwareDevelopment: 'פיתוח תוכנה בהתאמה אישית | Top Webstak',
  ai: 'בינה מלאכותית לעסקים | Top Webstak',
} as const;

export const TITLE_BRAND_SUFFIX = ' | Top Webstak';

/**
 * Replace only the document title. Description, canonical, Open Graph, and
 * Twitter fields from the SEO-agent merge stay as they are.
 */
export function forceAbsoluteTitle<T extends object>(metadata: T, title: string): T {
  return { ...metadata, title: { absolute: title } };
}
