import WebsiteCheckForm from '../components/WebsiteCheckForm';
import { isolateLatinPhrases } from '../../lib/bidi';
import { PHONE_DISPLAY } from '../../lib/pricing';
import { WHATSAPP_BASE } from '../../lib/whatsapp';

const CHECKS = [
  {
    title: 'מהירות ומובייל',
    text: 'האם האתר נטען מהר מספיק בטלפון, והאם אפשר לפעול בו ביד אחת.',
  },
  {
    title: 'נראות בגוגל וב-AI',
    text: 'האם העסק ברור למנועי חיפוש ולמנועי AI — או שהאתר נעלם בתשובות.',
  },
  {
    title: 'חסמי המרה ולידים',
    text: 'מה עוצר פנייה: כפתור, טופס, וואטסאפ, או מסר שלא ברור מה לעשות.',
  },
];

export default function WebsiteCheckPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl" lang="he">
      <section className="bg-gradient-to-b from-[#03173A] to-[#02336E] px-4 pb-12 pt-10 text-white sm:pt-14">
        <div className="container mx-auto max-w-xl text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-100">Top Webstak · בדיקת אתר חינם</p>
          <h1 className="text-2xl font-black leading-snug sm:text-3xl">
            בדיקת אתר חינם תוך 24 שעות — 3 תקלות שמונעות ממך לידים
          </h1>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto grid max-w-xl gap-3">
          {CHECKS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-right shadow-sm"
            >
              <h2 className="mb-1 text-lg font-bold text-[#02336E]">{isolateLatinPhrases(item.title)}</h2>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{isolateLatinPhrases(item.text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="check-form" className="px-4 pb-12">
        <div className="container mx-auto max-w-xl rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-gray-900">השאירו פרטים לבדיקה</h2>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            שני שדות בלבד. נחזור אליכם עם הבדיקה — בלי התחייבות.
          </p>
          <WebsiteCheckForm />

          <a
            href={WHATSAPP_BASE}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="true"
            data-cta-location="hero"
            className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#25D366] px-4 py-3.5 text-center font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
          >
            וואטסאפ עכשיו · {PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </div>
  );
}
