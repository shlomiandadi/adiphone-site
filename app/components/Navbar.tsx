'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaSearch, FaAd, FaCode, FaMobileAlt, FaRocket, FaWordpress, FaShoppingCart, FaPaintBrush, FaChartLine, FaUsers, FaEnvelope } from 'react-icons/fa';
import SearchBar from './SearchBar';

const services = [
  { title: 'בניית אתרים', href: '/services/web-development', icon: FaGlobe },
  { title: 'קידום אתרים', href: '/services/seo', icon: FaSearch },
  { title: 'SEO אורגני', href: '/services/organic-seo', icon: FaRocket },
  { title: 'קידום ממומן', href: '/services/ppc', icon: FaAd },
  { title: 'פיתוח תוכנה', href: '/services/software-development', icon: FaCode },
  { title: 'פיתוח אפליקציות', href: '/services/mobile-apps', icon: FaMobileAlt },
  { title: 'אתרי וורדפרס', href: '/services/wordpress', icon: FaWordpress },
  { title: 'חנויות אינטרנט', href: '/services/ecommerce', icon: FaShoppingCart },
  { title: 'עיצוב ממשק', href: '/services/ui-design', icon: FaPaintBrush },
  { title: 'אנליטיקס', href: '/services/analytics', icon: FaChartLine }
];

export default function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              עדי פון תקשורת
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 mr-8">
            <div className="w-64">
              <SearchBar />
            </div>
            
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              ראשי
            </Link>
            
            <div className="relative" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
              <button className="text-gray-700 hover:text-blue-600 transition-colors">
                שירותים
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <service.icon className="w-4 h-4" />
                          <span>{service.title}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              אודות
            </Link>
            
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              צור קשר
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="px-4">
                <SearchBar />
              </div>

              <Link 
                href="/"
                className="flex items-center px-4 py-2.5 text-base text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaGlobe className="w-5 h-5 ml-2 text-gray-400" />
                ראשי
              </Link>
              
              <div className="space-y-2">
                <div className="px-4 py-2 text-base font-medium text-gray-900">שירותים</div>
                <div className="space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="flex items-center px-6 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <service.icon className="w-5 h-5 ml-2 text-gray-400" />
                      <span>{service.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                href="/about"
                className="flex items-center px-4 py-2.5 text-base text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUsers className="w-5 h-5 ml-2 text-gray-400" />
                אודות
              </Link>
              
              <Link 
                href="/contact"
                className="flex items-center px-4 py-2.5 text-base text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaEnvelope className="w-5 h-5 ml-2 text-gray-400" />
                צור קשר
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 