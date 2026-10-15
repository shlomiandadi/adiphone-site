export type FooterLinkView = {
  id?: string;
  title: string;
  url: string;
  icon?: string | null;
  openInNewTab?: boolean;
};

export type FooterColumnView = {
  id?: string;
  title: string;
  kind: 'links' | 'services' | 'contact';
  links: FooterLinkView[];
};

export type FooterView = {
  name: string;
  description: string;
  copyrightText: string;
  columns: FooterColumnView[];
};

export const FOOTER_BRAND_NAME = 'Top Webstak - בנייה וקידום אתרים (מבית עדי פון תקשורת)';
export const FOOTER_DESCRIPTION = 'פתרונות דיגיטל מתקדמים לעסקים. בניית אתרים, קידום אתרים ופיתוח אפליקציות.';
export const FOOTER_COPYRIGHT_SUFFIX =
  'Top Webstak - בנייה וקידום אתרים (מבית עדי פון תקשורת). כל הזכויות שמורות.';

export const FOOTER_QUICK_LINKS: FooterLinkView[] = [
  { title: 'דף הבית', url: '/' },
  { title: 'שירותים', url: '/services' },
  { title: 'פורטפוליו', url: '/portfolio' },
  { title: 'אודות', url: '/about' },
  { title: 'צור קשר', url: '/contact' },
  { title: 'מחירון', url: '/pricing' },
  { title: 'מדיניות פרטיות', url: '/privacy-policy' },
  { title: 'הצהרת נגישות', url: '/accessibility-statement' },
];

export const FOOTER_SERVICE_LINKS: FooterLinkView[] = [
  { title: 'בניית אתרים', url: '/services/web-development' },
  { title: 'אתרי תדמית לעסקים', url: '/services/website-tadmit' },
  { title: 'מחירון בניית אתרים', url: '/pricing' },
  { title: 'אתרי וורדפרס', url: '/services/wordpress' },
  { title: 'קידום אתרים SEO', url: '/services/seo' },
  { title: 'קידום במנועי AI (AEO/GEO)', url: '/services/aeo-geo' },
  { title: 'קידום ממומן PPC', url: '/services/ppc' },
  { title: 'חנויות אונליין', url: '/services/ecommerce' },
  { title: 'פיתוח אפליקציות', url: '/services/mobile-apps' },
  { title: 'עיצוב UI/UX', url: '/services/ui-design' },
  { title: 'פיתוח תוכנה', url: '/services/software-development' },
  { title: 'אנליטיקס', url: '/services/analytics' },
  { title: 'פתרונות AI', url: '/services/ai' },
  { title: 'שירותי ענן', url: '/services/cloud' },
  { title: 'בלוג', url: '/blog' },
  { title: 'כמה עולה בניית אתר ב-2026', url: '/blog/kama-oleh-bniyat-atar-2026' },
];

export const FOOTER_AREA_LINKS: FooterLinkView[] = [
  { title: 'בניית אתרים בפרדס חנה', url: '/services/bniyat-atarim-pardes-hana' },
  { title: 'בניית אתרים בחדרה', url: '/services/bniyat-atarim-hadera' },
  { title: 'בניית אתרים בקיסריה', url: '/services/bniyat-atarim-caesarea' },
  { title: 'בניית אתרים בזכרון יעקב', url: '/services/bniyat-atarim-zichron-yaakov' },
  { title: 'בניית אתרים בחיפה', url: '/services/bniyat-atarim-haifa' },
  { title: 'בניית אתרים בנתניה', url: '/services/bniyat-atarim-netanya' },
  { title: 'בניית אתרים באור עקיבא', url: '/services/bniyat-atarim-or-akiva' },
  { title: 'בניית אתרים בבנימינה', url: '/services/bniyat-atarim-binyamina' },
  { title: 'בניית אתרים ביוקנעם', url: '/services/bniyat-atarim-yokneam' },
  { title: 'בניית אתרים בעפולה', url: '/services/bniyat-atarim-afula' },
];

export const FOOTER_CONTACT_LINKS: FooterLinkView[] = [
  { title: '0509159951', url: 'tel:0509159951', icon: 'phone' },
  { title: 'adiphoneseo@gmail.com', url: 'mailto:adiphoneseo@gmail.com', icon: 'envelope' },
  { title: 'זמיר 95, פרדס חנה', url: '', icon: 'map-marker' },
  {
    title: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61578707397365',
    icon: 'facebook',
    openInNewTab: true,
  },
  {
    title: 'WhatsApp',
    url: 'https://wa.me/972509159951?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA%20%D7%91%D7%A0%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8%D7%99%D7%9D%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%A9%D7%AA%D7%97%D7%96%D7%A8%D7%95%20%D7%90%D7%9C%D7%99',
    icon: 'whatsapp',
    openInNewTab: true,
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/shlomi-malfuf-709961221/',
    icon: 'linkedin',
    openInNewTab: true,
  },
];

export const FOOTER_COLUMNS: FooterColumnView[] = [
  { title: 'קישורים מהירים', kind: 'links', links: FOOTER_QUICK_LINKS },
  { title: 'השירותים שלנו', kind: 'services', links: FOOTER_SERVICE_LINKS },
  { title: 'אזורי שירות', kind: 'links', links: FOOTER_AREA_LINKS },
  { title: 'צור קשר', kind: 'contact', links: FOOTER_CONTACT_LINKS },
];

export function footerCopyrightLine(text?: string | null) {
  const year = new Date().getFullYear();
  if (text && text.trim()) {
    return text.replace(/\{year\}/g, String(year)).replace(/©\s*\d{4}/, `© ${year}`);
  }
  return `© ${year} ${FOOTER_COPYRIGHT_SUFFIX}`;
}

export function columnKind(title: string, links: FooterLinkView[]): FooterColumnView['kind'] {
  if (title === 'צור קשר' || links.some((link) => link.icon === 'phone' || link.icon === 'whatsapp')) {
    return 'contact';
  }
  if (title === 'השירותים שלנו') return 'services';
  return 'links';
}

export const HARDCODED_FOOTER: FooterView = {
  name: FOOTER_BRAND_NAME,
  description: FOOTER_DESCRIPTION,
  copyrightText: footerCopyrightLine(),
  columns: FOOTER_COLUMNS,
};

export const FOOTER_IMPORT = {
  logoAlt: FOOTER_BRAND_NAME,
  description: FOOTER_DESCRIPTION,
  copyrightText: `© {year} ${FOOTER_COPYRIGHT_SUFFIX}`,
  columns: FOOTER_COLUMNS.map((column) => ({
    title: column.title,
    links: column.links.map((link) => ({
      title: link.title,
      url: link.url,
      icon: link.icon || null,
      openInNewTab: Boolean(link.openInNewTab),
    })),
  })),
};
