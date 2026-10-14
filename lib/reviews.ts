export const GOOGLE_MAPS_REVIEWS_URL =
  'https://www.google.com/maps/place/Top+webStak/@32.465799,34.952319,17z/data=!3m1!4b1!4m6!3m5!1s0x67bf58e7efcb5b51:0x3e583bedf92e1661!8m2!3d32.465799!4d34.952319!16s%2Fg%2F11thcjf6qd';

export const GOOGLE_RATING = {
  ratingValue: '5.0',
  reviewCount: 25,
  bestRating: '5',
} as const;

export type SiteReview = {
  name: string;
  text: string;
};

/** Real Google reviews already shown on the homepage Testimonials component. */
export const SITE_REVIEWS: readonly SiteReview[] = [
  {
    name: 'רונית שפי וולפין',
    text: 'אלוף פתר לי תקלות באתר וגם סידר לי אימות רב מסר + תיבת דומיין מאומתת סוף סוף עלו לי אחוזי ההמרה ואני לא מגיע בדיוור לספאם',
  },
  {
    name: 'Sigalit hahami hahami',
    text: 'שירות אמין ומהיר לבניית אתר מדהים + דף נחיתה מתקדם תודה רבה',
  },
  {
    name: 'בני חבה',
    text: 'אליפות של שירות רמה גבוהה של בניית אתרים ורמה גבוה של קידום אורגני אין כמוכם',
  },
  {
    name: 'דפנה בורנשטיין',
    text: 'בנו לי אתר וביצעו לי אוטמציה לרב מסר + אימות בין רב מסר לתיבת המייל ויצרו לי משפך עסקי מעולה תודה רבה',
  },
  {
    name: 'כריסטינה סמיונוב',
    text: 'תודה רבה אלוף בניית אתר איכותית ומהירה',
  },
  {
    name: 'רונית חיימוב',
    text: 'תודה על שירות מושלם העברת אתר ללא פגיעה בתוכן הקמת תיבה עסקית ואטומציות עסקיות',
  },
] as const;

export const CONTACT_PAGE_REVIEWS = SITE_REVIEWS.slice(0, 3);
