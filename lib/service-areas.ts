/** City service pages plus the two commercial service pages that only sat in the header. */

export type ServiceAreaLink = {
  href: string;
  name: string;
  /** One unique line taken from the live city hero / nav copy — no new local claims. */
  blurb: string;
};

export const CITY_SERVICE_AREAS: readonly ServiceAreaLink[] = [
  {
    href: '/services/bniyat-atarim-pardes-hana',
    name: 'בניית אתרים בפרדס חנה',
    blurb: 'סוכנות דיגיטל מפרדס חנה – אתרי תדמית, חנויות ווורדפרס לאזור.',
  },
  {
    href: '/services/bniyat-atarim-hadera',
    name: 'בניית אתרים בחדרה',
    blurb: 'אתרים לעסקים בחדרה, בגבעת אולגה ובאזור התעשייה.',
  },
  {
    href: '/services/bniyat-atarim-caesarea',
    name: 'בניית אתרים בקיסריה',
    blurb: 'אתרים למגורים, לנמל ולמשרדים בפארק התעשיות בקיסריה.',
  },
  {
    href: '/services/bniyat-atarim-zichron-yaakov',
    name: 'בניית אתרים בזכרון יעקב',
    blurb: 'אתרים ליקבים, מסעדות, צימרים ובוטיקים במושבות הכרמל.',
  },
  {
    href: '/services/bniyat-atarim-haifa',
    name: 'בניית אתרים בחיפה',
    blurb: 'אתרי תדמית, חנויות ומערכות בחיפה, בקריות ובמטרופולין.',
  },
  {
    href: '/services/bniyat-atarim-netanya',
    name: 'בניית אתרים בנתניה',
    blurb: 'אתרים לעסקים בנתניה, בפולג ובאייר פורט סיטי.',
  },
  {
    href: '/services/bniyat-atarim-or-akiva',
    name: 'בניית אתרים באור עקיבא',
    blurb: 'אתרים לעסקים באור עקיבא, בין חדרה לקיסריה.',
  },
  {
    href: '/services/bniyat-atarim-binyamina',
    name: 'בניית אתרים בבנימינה',
    blurb: 'אתרים ליקבים, אירוח, קליניקות וחנויות בבנימינה ובגבעת עדה.',
  },
  {
    href: '/services/bniyat-atarim-yokneam',
    name: 'בניית אתרים ביוקנעם',
    blurb: 'אתרי תדמית, דפי מוצר ומערכות לחברות וליועצים ביוקנעם.',
  },
  {
    href: '/services/bniyat-atarim-afula',
    name: 'בניית אתרים בעפולה',
    blurb: 'אתרי תדמית, חנויות ווורדפרס לעסקים בעפולה ובעמק יזרעאל.',
  },
] as const;

export const KEY_CITY_HREFS = [
  '/services/bniyat-atarim-hadera',
  '/services/bniyat-atarim-haifa',
  '/services/bniyat-atarim-netanya',
  '/services/bniyat-atarim-pardes-hana',
  '/services/bniyat-atarim-caesarea',
  '/services/bniyat-atarim-zichron-yaakov',
] as const;

export const EXTRA_SERVICE_AREA_LINKS: readonly ServiceAreaLink[] = [
  {
    href: '/services/website-tadmit',
    name: 'אתרי תדמית לעסקים',
    blurb: 'אתר תדמית שמציג את העסק ומביא פניות.',
  },
  {
    href: '/services/aeo-geo',
    name: 'קידום במנועי AI (AEO ו-GEO)',
    blurb: 'הופעה בתשובות של ChatGPT ו-Gemini.',
  },
] as const;

export const FOOTER_SERVICE_AREA_LINKS = [
  ...CITY_SERVICE_AREAS.map((item) => ({ title: item.name, url: item.href })),
  ...EXTRA_SERVICE_AREA_LINKS.map((item) => ({ title: item.name, url: item.href })),
];
