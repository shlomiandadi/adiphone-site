'use client';

import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">WebStudio</h3>
            <p className="text-gray-400">
              פתרונות דיגיטל מתקדמים לעסקים. בניית אתרים, קידום אתרים ופיתוח אפליקציות.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  שירותים
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                  פורטפוליו
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  צור קשר
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link href="/accessibility-statement" className="text-gray-400 hover:text-white transition-colors">
                  הצהרת נגישות
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">השירותים שלנו</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/web-development" className="text-gray-400 hover:text-white transition-colors">
                  בניית אתרים
                </Link>
              </li>
              <li>
                <Link href="/services/seo" className="text-gray-400 hover:text-white transition-colors">
                  קידום אתרים
                </Link>
              </li>
              <li>
                <Link href="/services/ui-design" className="text-gray-400 hover:text-white transition-colors">
                  עיצוב ממשק
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-apps" className="text-gray-400 hover:text-white transition-colors">
                  פיתוח אפליקציות
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">צור קשר</h3>
            <div className="mt-8 space-y-2">
              <p className="flex items-center">
                <FaPhone className="ml-2" />
                <a href="tel:0509159951" className="hover:text-white transition-colors">0509159951</a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="ml-2" />
                <a href="mailto:adiphoneseo@gmail.com" className="hover:text-white transition-colors">adiphoneseo@gmail.com</a>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="ml-2" />
                <span>זמיר 95, פרדס חנה</span>
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="https://www.facebook.com/profile.php?id=61578707397365" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} />
              </a>
              <a href="https://wa.me/972509159951?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%9F%20%D7%91%D7%A9%D7%99%D7%A8%D7%95%D7%AA%20%D7%91%D7%A0%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8%D7%99%D7%9D%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%A9%D7%AA%D7%97%D7%96%D7%A8%D7%95%20%D7%90%D7%9C%D7%99" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={24} />
              </a>
              <a href="https://www.linkedin.com/in/shlomi-malfuf-709961221/" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} WebStudio. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
} 