'use client';

import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaLinkedin } from 'react-icons/fa';
import LeadForm from './LeadForm';

export default function Contact() {

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            צור קשר
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            שיחת ייעוץ של 15 דקות – בחינם, בלי התחייבות. ספרו מה העסק צריך: אתר, חנות, קידום או בוט, ונחזור עם כיוון ברור.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                פרטי קשר
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">טלפון</h4>
                    <a href="tel:0509159951" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">0509159951</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">אימייל</h4>
                    <p className="text-gray-600 dark:text-gray-300">adiphoneseo@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">כתובת</h4>
                    <p className="text-gray-600 dark:text-gray-300">זמיר 95, פרדס חנה</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <FaClock className="text-orange-600 dark:text-orange-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">שעות פעילות</h4>
                    <p className="text-gray-600 dark:text-gray-300">א-ה: 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                עקבו אחרינו
              </h3>
              
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a href="https://www.facebook.com/profile.php?id=61578707397365" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-white text-xl" />
                </a>
                <a href="https://wa.me/972509159951?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA%20%D7%91%D7%A0%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8%D7%99%D7%9D%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%A9%D7%AA%D7%97%D7%96%D7%A8%D7%95%20%D7%90%D7%9C%D7%99" className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="text-white text-xl" />
                </a>
                <a href="https://www.linkedin.com/in/shlomi-malfuf-709961221/" className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-colors" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-white text-xl" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 h-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full">
              <LeadForm formName="homepage_contact" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
