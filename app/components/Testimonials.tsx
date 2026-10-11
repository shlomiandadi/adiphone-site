const GOOGLE_MAPS_REVIEWS_URL =
  'https://www.google.com/maps/place/Top+webStak/@32.465799,34.952319,17z/data=!3m1!4b1!4m6!3m5!1s0x67bf58e7efcb5b51:0x3e583bedf92e1661!8m2!3d32.465799!4d34.952319!16s%2Fg%2F11thcjf6qd';

const reviews = [
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

function Stars() {
  return (
    <p className="mb-3 text-amber-500" aria-label="5 כוכבים">
      ★★★★★
    </p>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            5.0 ★ מ-<span className="tabular-nums" data-count="25">25</span> ביקורות בגוגל
          </h2>
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-700 underline hover:text-blue-800"
          >
            לכל הביקורות בגוגל
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 text-right shadow-sm"
            >
              <Stars />
              <p className="mb-4 flex-grow text-gray-700 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="font-semibold text-gray-900">{review.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
