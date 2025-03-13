'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  { title: 'בניית אתרים', href: '/services/web-development' },
  { title: 'קידום אתרים', href: '/services/seo' },
  { title: 'SEO אורגני', href: '/services/organic-seo' },
  { title: 'קידום ממומן', href: '/services/paid-promotion' },
  { title: 'פיתוח תוכנה', href: '/services/software-development' },
  { title: 'פיתוח אפליקציות', href: '/services/app-development' }
];

export default function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              עדיפון
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
                        {service.title}
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
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 