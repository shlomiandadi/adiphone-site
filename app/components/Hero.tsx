'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-pattern.svg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div 
            className="flex-1 text-center lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              פתרונות דיגיטליים
              <br />
              <span className="text-primary">מותאמים אישית</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mr-0">
              אנחנו מתמחים בבניית אתרים, אפליקציות ופתרונות דיגיטליים מתקדמים שיעזרו לעסק שלך לצמוח ולהתפתח
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-300 text-lg font-medium"
              >
                צור קשר
              </Link>
              <Link
                href="/services"
                className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white dark:text-white rounded-lg transition-colors duration-300 text-lg font-medium"
              >
                השירותים שלנו
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <Image
                src="/images/hero-illustration.svg"
                alt="Web Development Illustration"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">גלול למטה</span>
          <motion.div 
            className="w-1 h-8 bg-primary rounded-full"
            animate={{ 
              y: [0, 10, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
} 