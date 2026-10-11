'use client';

import React, { useState } from 'react';
import { ContactService } from '@prisma/client';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ContactService.OTHER,
    newsletter: true
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('שולח...');

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      setStatus('הטופס נשלח בהצלחה! נציג יצור איתך קשר בהקדם.');
      setFormData({ name: '', email: '', phone: '', message: '', service: ContactService.OTHER, newsletter: true });
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('אירעה שגיאה בשליחת הטופס. אנא נסה שוב או צור קשר בטלפון.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'service' ? value as ContactService : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">צור קשר</h1>
          <p className="text-xl max-w-2xl mx-auto">
            מוכנים להתחיל את הפרויקט הבא שלכם? צרו איתנו קשר ונחזור אליכם בהקדם
          </p>
        </div>
      </section>

      <section className="py-16">
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
                אנחנו מטפלים בפניות של בעלי עסקים שצריכים אתר תדמית, חנות, מערכת מותאמת, קידום אורגני או קידום במנועי AI. אין טופס ארוך: שם, טלפון, מייל ומה צריך – ונחזור אליכם לשיחת היכרות קצרה, בלי התחייבות.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                אם אתם באזור פרדס חנה, חדרה, קיסריה, זכרון יעקב או חיפה, אפשר גם לתאם פגישה. המפה למטה מציגה את הכתובת. שעות הפעילות הן א׳–ה׳, 9:00–18:00. אפשר להתקשר ל־<a href="tel:0509159951" className="text-blue-600 hover:underline">050-9159951</a> או לכתוב ל־<a href="mailto:adiphoneseo@gmail.com" className="text-blue-600 hover:underline">adiphoneseo@gmail.com</a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                השאירו פרטים להצעת מחיר
              </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  שם מלא
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  דוא"ל
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  טלפון
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  שירות
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={ContactService.WEB_DEVELOPMENT}>פיתוח אתרים</option>
                  <option value={ContactService.SEO}>קידום אתרים</option>
                  <option value={ContactService.PPC}>פרסום ממומן</option>
                  <option value={ContactService.OTHER}>אחר</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  הודעה
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div className="flex items-start space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  אני מעוניין/ת לקבל עדכונים, טיפים מקצועיים וחומרים שיווקיים על שירותי עדי פון תקשורת
                </label>
              </div>

              {status && (
                <div className={`p-4 rounded-lg text-center text-lg font-medium ${
                  status.includes('הצלחה') 
                    ? 'bg-green-100 text-green-700 border border-green-500' 
                    : status === 'שולח...'
                    ? 'bg-blue-100 text-blue-700 border border-blue-500'
                    : 'bg-red-100 text-red-700 border border-red-500'
                }`}>
                  {status}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isSubmitting ? 'שולח...' : 'שליחה'}
              </button>
            </form>
            </div>

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