import { ACCOUNTANTS_NICHE, CLINICS_NICHE, LAWYERS_NICHE } from './web-dev-niches.ts';

export type WebDevNicheHubCard = {
  href: string;
  name: string;
  benefit: string;
  icon: 'briefcase' | 'clinic' | 'calculator';
};

/** Profession labels requested for discovery cards; benefits are existing page subtitles. */
export const WEB_DEV_NICHE_HUB_CARDS: WebDevNicheHubCard[] = [
  {
    href: LAWYERS_NICHE.path,
    name: 'עורכי דין',
    benefit: LAWYERS_NICHE.subtitle,
    icon: 'briefcase',
  },
  {
    href: CLINICS_NICHE.path,
    name: 'קליניקות ומטפלים',
    benefit: CLINICS_NICHE.subtitle,
    icon: 'clinic',
  },
  {
    href: ACCOUNTANTS_NICHE.path,
    name: 'רואי חשבון',
    benefit: ACCOUNTANTS_NICHE.subtitle,
    icon: 'calculator',
  },
];

export const WEB_DEV_NICHE_HUB_HEADING = 'אתרים לפי תחום';
export const WEB_DEV_NICHE_HUB_SUBTITLE = 'דפי בניית אתרים ייעודיים לעורכי דין, לקליניקות ומטפלים ולרואי חשבון.';
