'use client';

import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

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
              <a href="https://www.facebook.com/profile.php?viewas=100000686899395&id=100090294429735&locale=he_IL" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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