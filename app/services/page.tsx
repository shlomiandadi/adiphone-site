'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaWordpress, FaShoppingCart, FaMobileAlt, FaPaintBrush, FaBullhorn, FaChartLine, FaCode, FaBrain, FaCloud, FaRobot } from 'react-icons/fa';
import { AGENCY_PROVIDER, SERVICES_HUB_ITEMS, buildServiceJsonLd } from '../../lib/service-schema';
import { absoluteUrl } from '../../lib/seo';
import { CITY_SERVICE_AREAS } from '../../lib/service-areas';
import Hero3D from '../components/hero3d/Hero3D';
import ServiceCtaBanner from '../components/ServiceCtaBanner';

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
      title: "בניית אתרים",
      description: "אתרי תדמית, דפי נחיתה וחנויות שנבנים כנכס דיגיטלי לעסק",
      icon: <FaCode className="w-8 h-8 text-blue-600" />,
      image: "/images/services/web-development.svg",
      link: "/services/web-development",
      features: ["אתר תדמית", "דף נחיתה", "חנות אונליין", "וורדפרס"]
    },
    {
      title: "אתרי תדמית לעסקים",
      description: "אתר שמציג את העסק, השירותים והדרך לפנות – בלי חנות ובלי מערכת",
      icon: <FaCode className="w-8 h-8 text-blue-600" />,
      image: "/images/services/web-development.svg",
      link: "/services/website-tadmit",
      features: ["עד 6–8 עמודים", "מותאם לנייד", "פנייה בוואטסאפ", "ניהול תוכן"]
    },
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
      link: "/services/software-development",
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
      title: "קידום במנועי AI (AEO/GEO)",
      description: "שהעסק יופיע בתשובות של ChatGPT, Google AI ו-Perplexity",
      icon: <FaRobot className="w-8 h-8 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=800",
      link: "/services/aeo-geo",
      features: ["מחקר שאלות", "תוכן בפורמט תשובה", "נתונים מובנים", "חיזוק זהות העסק"]
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

  const hubServiceSchema = buildServiceJsonLd({
    name: 'שירותי בניית וקידום אתרים לעסקים',
    description:
      'בניית אתרים, קידום בגוגל, חנויות אונליין, אפליקציות, עיצוב UI/UX, פיתוח תוכנה ופתרונות דיגיטל לעסקים.',
    path: '/services',
  });

  const hubCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'השירותים של Top Webstak',
    itemListElement: SERVICES_HUB_ITEMS.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      item: {
        '@type': 'Service',
        name: item.name,
        url: absoluteUrl(item.path),
        provider: AGENCY_PROVIDER,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubCatalogSchema) }} />
      <Hero3D
        theme="services"
        title="השירותים שלנו"
        subtitle="פתרונות דיגיטליים מקצועיים להצלחת העסק שלכם"
        align="center"
        ctas={[{ href: '/contact', label: 'צרו קשר' }]}
      />

      {/* Services Grid */}
      <div data-reveal className="container mx-auto px-4 py-16">
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
              data-tilt
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={service.link} className="block">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

      <section data-reveal className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">בניית אתרים לפי אזור</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          עמוד ייעודי לכל אזור שירות – בלי לחפש בתפריט העליון.
        </p>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CITY_SERVICE_AREAS.map((city) => (
            <li key={city.href}>
              <Link
                href={city.href}
                className="block rounded-xl border border-gray-100 bg-white p-5 text-right shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="font-semibold text-blue-700 underline dark:text-blue-400">{city.name}</span>
                <span className="mt-2 block text-sm text-gray-600 dark:text-gray-300">{city.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-lg text-gray-700 dark:text-gray-300">
          <Link href="/services/website-tadmit" className="font-semibold text-blue-700 underline">
            אתר תדמית לעסק
          </Link>
          {' · '}
          <Link href="/services/aeo-geo" className="font-semibold text-blue-700 underline">
            הופעה בתשובות של ChatGPT ו-Gemini
          </Link>
        </p>
      </section>

      <ServiceCtaBanner serviceKey="services" />
    </div>
  );
} 