'use client';

import Hero3D from '../components/hero3d/Hero3D';
import LeadForm from '../components/LeadForm';
import GoogleReviews from '../components/GoogleReviews';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Hero3D
        theme="contact"
        title="צור קשר"
        subtitle="שיחת ייעוץ של 15 דקות – בחינם. ספרו מה העסק צריך ונחזור עם כיוון ברור, בלי התחייבות."
        align="center"
        ctas={[
          { href: 'tel:+972509159951', label: 'חייגו: 050-9159951' },
          { href: '#contact-form', label: 'לטופס יצירת קשר', variant: 'secondary' },
        ]}
      />

      <section id="contact-form" data-reveal className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                איך אפשר ליצור קשר
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                מחפשים שותף לבניית אתר, לקידום בגוגל או לחנות אונליין? Top Webstak, מבית עדי פון תקשורת, יושבת בזמיר 95 בפרדס חנה-כרכור ומלווה עסקים מהאזור ומהארץ. בעמוד הזה אפשר להשאיר פרטים להצעת מחיר, לחייג ישירות או לשלוח הודעת וואטסאפ.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                אין טופס ארוך: שם, טלפון וסוג השירות – ונחזור אליכם לשיחת היכרות קצרה, בלי התחייבות.
              </p>
              <p className="rounded-xl bg-blue-50 px-4 py-3 text-base font-semibold text-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
                מענה תוך שעתיים בשעות הפעילות (א׳–ה׳, 9:00–18:00)
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                אם אתם באזור פרדס חנה, חדרה, קיסריה, זכרון יעקב, נתניה או חיפה, אפשר גם לתאם פגישה. המפה למטה מציגה את הכתובת. אפשר להתקשר ל־<a href="tel:0509159951" className="text-blue-600 hover:underline">050-9159951</a> או לכתוב ל־<a href="mailto:adiphoneseo@gmail.com" className="text-blue-600 hover:underline">adiphoneseo@gmail.com</a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                השאירו פרטים להצעת מחיר
              </h2>
              <LeadForm formName="contact_page" />
            </div>

            <GoogleReviews />

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                איפה אנחנו נמצאים
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                זמיר 95, פרדס חנה-כרכור
              </p>
              <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
                <iframe
                  title="מפת Google – זמיר 95, פרדס חנה-כרכור"
                  src="https://maps.google.com/maps?q=%D7%96%D7%9E%D7%99%D7%A8%2095%20%D7%A4%D7%A8%D7%93%D7%A1%20%D7%97%D7%A0%D7%94-%D7%9B%D7%A8%D7%9B%D7%95%D7%A8&hl=he&z=16&output=embed"
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
