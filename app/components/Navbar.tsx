'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobe, FaSearch, FaAd, FaCode, FaMobileAlt, FaRocket } from 'react-icons/fa';

const services = [
  { title: 'בניית אתרים', href: '/services/web-development', icon: FaGlobe },
  { title: 'קידום אתרים', href: '/services/seo', icon: FaSearch },
  { title: 'SEO אורגני', href: '/services/organic-seo', icon: FaRocket },
  { title: 'קידום ממומן', href: '/services/paid-promotion', icon: FaAd },
  { title: 'פיתוח תוכנה', href: '/services/software-development', icon: FaCode },
  { title: 'פיתוח אפליקציות', href: '/services/app-development', icon: FaMobileAlt }
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
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              <Link 
                href="/"
                className="block px-4 py-2 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ראשי
              </Link>
              
              <div className="space-y-1">
                <div className="px-4 py-2 text-base text-gray-700">שירותים</div>
                {services.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="block px-8 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <service.icon className="w-4 h-4" />
                      <span>{service.title}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link 
                href="/about"
                className="block px-4 py-2 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                אודות
              </Link>
              
              <Link 
                href="/contact"
                className="block px-4 py-2 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                צור קשר
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 