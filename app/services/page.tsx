'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaWordpress, FaShoppingCart, FaMobileAlt, FaPaintBrush, FaBullhorn, FaChartLine, FaCode, FaBrain, FaCloud } from 'react-icons/fa';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const iconAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 }
};

export default function ServicesPage() {
  const services = [
    {
      title: "קידום אתרים",
      description: "קידום אורגני מקצועי שמביא תוצאות אמיתיות",
      icon: <FaSearch className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800",
      link: "/services/seo",
      features: ["מחקר מילות מפתח", "אופטימיזציה טכנית", "בניית קישורים", "תוכן איכותי"]
    },
    {
      title: "בניית אתרי וורדפרס",
      description: "אתרים מקצועיים ומותאמים אישית בוורדפרס",
      icon: <FaWordpress className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
      link: "/services/wordpress",
      features: ["עיצוב מותאם אישית", "ביצועים מהירים", "אבטחה מתקדמת", "ממשק ניהול נוח"]
    },
    {
      title: "חנויות אינטרנט",
      description: "חנויות אונליין מתקדמות שמגדילות מכירות",
      icon: <FaShoppingCart className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      link: "/services/ecommerce",
      features: ["חווית קנייה מעולה", "ניהול מלאי", "שילוב סליקה", "אבטחת עסקאות"]
    },
    {
      title: "פיתוח אפליקציות",
      description: "אפליקציות מובייל חדשניות לכל הפלטפורמות",
      icon: <FaMobileAlt className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      link: "/services/mobile-apps",
      features: ["Cross-Platform", "UX/UI מתקדם", "ביצועים מהירים", "אבטחה מובנית"]
    },
    {
      title: "עיצוב ממשק משתמש",
      description: "עיצוב חוויות דיגיטליות מרהיבות",
      icon: <FaPaintBrush className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      link: "/services/ui-design",
      features: ["עיצוב ממוקד משתמש", "עיצוב רספונסיבי", "זהות מותג", "אינטראקציות חכמות"]
    },
    {
      title: "קמפיינים ממומנים",
      description: "ניהול קמפיינים שמביאים תוצאות מדידות",
      icon: <FaBullhorn className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      link: "/services/ppc",
      features: ["Google Ads", "מדיה חברתית", "רימרקטינג", "אופטימיזציה"]
    },
    {
      title: "אנליטיקס ומדידה",
      description: "ניתוח נתונים מתקדם לקבלת החלטות מבוססות מידע",
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      link: "/services/analytics",
      features: ["Google Analytics 4", "דוחות מותאמים", "מעקב המרות", "אופטימיזציה"]
    },
    {
      title: "פיתוח תוכנה",
      description: "פתרונות תוכנה מתקדמים ומותאמים אישית",
      icon: <FaCode className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      link: "/services/software",
      features: ["פיתוח מותאם", "ארכיטקטורה", "אבטחת מידע", "תחזוקה ותמיכה"]
    },
    {
      title: "פתרונות AI",
      description: "שילוב טכנולוגיות AI חדשניות בעסק שלכם",
      icon: <FaBrain className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      link: "/services/ai",
      features: ["צ'אטבוטים חכמים", "עיבוד שפה טבעית", "מערכות המלצה", "אוטומציה"]
    },
    {
      title: "שירותי ענן",
      description: "פתרונות ענן מתקדמים לעסקים צומחים",
      icon: <FaCloud className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      link: "/services/cloud",
      features: ["תשתיות ענן", "גיבוי ו-DR", "אבטחת מידע", "ניטור ותחזוקה"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              השירותים שלנו
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              פתרונות דיגיטליים מקצועיים להצלחת העסק שלכם
            </motion.p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={service.link} className="block">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      {service.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            מוכנים להתחיל?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            צרו איתנו קשר עוד היום ונעזור לכם להגשים את החזון הדיגיטלי שלכם
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              דברו איתנו
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 