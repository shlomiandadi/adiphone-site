import { ContactService } from '@prisma/client';

const WEB_DEVELOPMENT_VALUES = new Set([
  'WEB_DEVELOPMENT',
  'web-development',
  'web_development',
  'wordpress',
  'ecommerce',
  'בניית אתרים',
  'פיתוח אתרים',
  'אתרי וורדפרס',
  'חנויות אונליין',
]);

const SEO_VALUES = new Set([
  'SEO',
  'seo',
  'קידום אתרים',
  'קידום אורגני',
  'קידום אורגני SEO',
]);

const PPC_VALUES = new Set([
  'PPC',
  'ppc',
  'פרסום ממומן',
  'קידום ממומן',
  'קידום ממומן PPC',
]);

const OTHER_VALUES = new Set([
  'OTHER',
  'other',
  'אחר',
  'social',
  'ai-bots',
  'ניהול סושיאל',
  'בוטים AI',
]);

function normalizeServiceToken(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function mapContactService(...rawValues: unknown[]): ContactService {
  for (const raw of rawValues) {
    const value = normalizeServiceToken(raw);
    if (!value) continue;

    const upper = value.toUpperCase().replace(/-/g, '_');
    if (upper === 'WEB_DEVELOPMENT' || WEB_DEVELOPMENT_VALUES.has(value) || WEB_DEVELOPMENT_VALUES.has(upper)) {
      return ContactService.WEB_DEVELOPMENT;
    }
    if (upper === 'SEO' || SEO_VALUES.has(value) || SEO_VALUES.has(upper)) {
      return ContactService.SEO;
    }
    if (upper === 'PPC' || PPC_VALUES.has(value) || PPC_VALUES.has(upper)) {
      return ContactService.PPC;
    }
    if (upper === 'OTHER' || OTHER_VALUES.has(value) || OTHER_VALUES.has(upper)) {
      return ContactService.OTHER;
    }
  }

  return ContactService.OTHER;
}
