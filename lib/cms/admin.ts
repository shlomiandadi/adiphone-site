import { NextResponse } from 'next/server';
import { requireAdminApiAuth } from '../adminAuth';
import { revalidateSitePaths } from '../revalidateContent';

export const CMS_ROLES = ['ADMIN', 'EDITOR'];

export async function requireCmsAdmin() {
  return requireAdminApiAuth({ role: CMS_ROLES });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function stamp() {
  const now = new Date();
  return { createdAt: now, updatedAt: now };
}

export function touch() {
  return { updatedAt: new Date() };
}

export function revalidateLayout() {
  revalidateSitePaths(['/'], true);
}

export const LIVE_SEO: Record<
  string,
  { page: string; path: string; title: string; description: string; keywords: string; ogTitle: string; ogDescription: string; canonicalUrl: string; robots: string }
> = {
  home: {
    page: 'home',
    path: '/',
    title: 'Top Webstak - בנייה וקידום אתרים מקצועיים | עדי פון תקשורת',
    description:
      'בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI לעסקים. סוכנות דיגיטל מפרדס חנה. ייעוץ חינם: 050-9159951.',
    keywords:
      'פיתוח אתרים, בניית אתרים, קידום אתרים, SEO, בניית חנויות, אפליקציות, שיווק דיגיטלי, Top Webstak, עדי פון תקשורת',
    ogTitle: 'Top Webstak - בנייה וקידום אתרים מקצועיים | עדי פון תקשורת',
    ogDescription:
      'פתרונות דיגיטליים מקצועיים לעסקים: פיתוח אתרים, קידום SEO, בניית חנויות אונליין, פיתוח אפליקציות ועוד.',
    canonicalUrl: 'https://adi-phone.co.il/',
    robots: 'index, follow',
  },
  about: {
    page: 'about',
    path: '/about',
    title: 'אודות Top Webstak – סוכנות דיגיטל מפרדס חנה | עדי פון',
    description:
      'למדו על Top Webstak - צוות מומחים עם למעלה מ-15 שנות ניסיון בפיתוח אתרים, קידום SEO ושיווק דיגיטלי. החזון, הערכים והצוות שלנו.',
    keywords: 'אודותינו, מי אנחנו, צוות, ניסיון, חזון, ערכים, Top Webstak, עדי פון תקשורת',
    ogTitle: 'אודות Top Webstak – סוכנות דיגיטל מפרדס חנה | עדי פון',
    ogDescription:
      'למדו על Top Webstak - צוות מומחים עם למעלה מ-15 שנות ניסיון בפיתוח אתרים, קידום SEO ושיווק דיגיטלי.',
    canonicalUrl: 'https://adi-phone.co.il/about',
    robots: 'index, follow',
  },
  services: {
    page: 'services',
    path: '/services',
    title: 'שירותי בניית וקידום אתרים לעסקים | Top Webstak',
    description:
      'גלו את כל השירותים הדיגיטליים שלנו: פיתוח אתרים, קידום SEO, בניית חנויות אונליין, פיתוח אפליקציות, עיצוב UI/UX, קמפיינים ממומנים ועוד. פתרונות מקצועיים להצלחת העסק שלכם.',
    keywords: 'שירותים, פיתוח אתרים, קידום אתרים, SEO, בניית חנויות, אפליקציות, עיצוב, שיווק דיגיטלי, Top Webstak',
    ogTitle: 'שירותי בניית וקידום אתרים לעסקים | Top Webstak',
    ogDescription:
      'גלו את כל השירותים הדיגיטליים שלנו: פיתוח אתרים, קידום SEO, בניית חנויות אונליין, פיתוח אפליקציות ועוד.',
    canonicalUrl: 'https://adi-phone.co.il/services',
    robots: 'index, follow',
  },
  portfolio: {
    page: 'portfolio',
    path: '/portfolio',
    title: 'תיק עבודות – אתרים וחנויות שבנינו | Top Webstak',
    description:
      'גלו את תיק העבודות שלנו - פרויקטים מוצלחים של פיתוח אתרים, בניית חנויות אונליין, אפליקציות מובייל ועוד. דוגמאות אמיתיות לעבודות מקצועיות.',
    keywords: 'תיק עבודות, פרויקטים, דוגמאות, אתרים, חנויות, אפליקציות, תיק פורטפוליו, Top Webstak',
    ogTitle: 'תיק עבודות – אתרים וחנויות שבנינו | Top Webstak',
    ogDescription:
      'גלו את תיק העבודות שלנו - פרויקטים מוצלחים של פיתוח אתרים, בניית חנויות אונליין, אפליקציות מובייל ועוד.',
    canonicalUrl: 'https://adi-phone.co.il/portfolio',
    robots: 'index, follow',
  },
  blog: {
    page: 'blog',
    path: '/blog',
    title: 'בלוג בניית וקידום אתרים – מדריכים וטיפים | Top Webstak',
    description:
      'בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי. למד על בניית אתרים, קידום בגוגל, עיצוב UX/UI ועוד.',
    keywords: 'בלוג, בניית אתרים, קידום אתרים, SEO, עיצוב אתרים, UX/UI, דיגיטל, Top Webstak',
    ogTitle: 'בלוג בניית וקידום אתרים – מדריכים וטיפים | Top Webstak',
    ogDescription:
      'בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי. למד על בניית אתרים, קידום בגוגל, עיצוב UX/UI ועוד.',
    canonicalUrl: 'https://adi-phone.co.il/blog',
    robots: 'index, follow',
  },
  contact: {
    page: 'contact',
    path: '/contact',
    title: 'צור קשר – הצעת מחיר לבניית אתר | Top Webstak',
    description:
      'צרו איתנו קשר עוד היום! מלאו את הטופס או התקשרו אלינו לקבלת הצעת מחיר מקצועית לשירותי פיתוח אתרים, קידום SEO ושיווק דיגיטלי. נחזור אליכם בהקדם.',
    keywords: 'צור קשר, פניה, טלפון, אימייל, הצעת מחיר, ייעוץ, Top Webstak',
    ogTitle: 'צור קשר – הצעת מחיר לבניית אתר | Top Webstak',
    ogDescription: 'צרו איתנו קשר עוד היום! מלאו את הטופס או התקשרו אלינו לקבלת הצעת מחיר מקצועית.',
    canonicalUrl: 'https://adi-phone.co.il/contact',
    robots: 'index, follow',
  },
};

export const FOOTER_IMPORT = {
  description: 'פתרונות דיגיטל מתקדמים לעסקים. בניית אתרים, קידום אתרים ופיתוח אפליקציות.',
  copyrightText: '© Top Webstak - בנייה וקידום אתרים (מבית עדי פון תקשורת). כל הזכויות שמורות.',
  columns: [
    {
      title: 'קישורים מהירים',
      links: [
        { title: 'דף הבית', url: '/' },
        { title: 'שירותים', url: '/services' },
        { title: 'פורטפוליו', url: '/portfolio' },
        { title: 'אודות', url: '/about' },
        { title: 'צור קשר', url: '/contact' },
        { title: 'מחירון', url: '/pricing' },
        { title: 'מדיניות פרטיות', url: '/privacy-policy' },
        { title: 'הצהרת נגישות', url: '/accessibility-statement' },
      ],
    },
    {
      title: 'השירותים שלנו',
      links: [
        { title: 'בניית אתרים', url: '/services/web-development' },
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
      ],
    },
    {
      title: 'אזורי שירות',
      links: [
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
      ],
    },
  ],
};
