export type WebDevNicheHubCard = {
  href: string;
  name: string;
  benefit: string;
  icon: 'briefcase' | 'clinic' | 'calculator';
};

/** Keep in sync with `subtitle` on each page in `web-dev-niches.ts` (do not import that module here — it pulls ~30KB of copy into the homepage bundle). */
export const WEB_DEV_NICHE_HUB_CARDS: WebDevNicheHubCard[] = [
  {
    href: '/services/web-development/lawyers',
    name: 'עורכי דין',
    benefit: 'אתר שמציג תחומי עיסוק, דרך פנייה ברורה ומבנה שמתאים לקריאה בנייד.',
    icon: 'briefcase',
  },
  {
    href: '/services/web-development/clinics',
    name: 'קליניקות ומטפלים',
    benefit: 'אתר מהיר בנייד, עם טיפולים ברורים ודרך פשוטה לקבוע תור.',
    icon: 'clinic',
  },
  {
    href: '/services/web-development/accountants',
    name: 'רואי חשבון',
    benefit: 'אתר שמסביר שירותי המשרד ומאפשר פנייה מסודרת, בלי לאסוף מסמכים רגישים בטופס הפתוח.',
    icon: 'calculator',
  },
];

export const WEB_DEV_NICHE_HUB_HEADING = 'אתרים לפי תחום';
export const WEB_DEV_NICHE_HUB_SUBTITLE = 'דפי בניית אתרים ייעודיים לעורכי דין, לקליניקות ומטפלים ולרואי חשבון.';
