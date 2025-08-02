'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheck, FaStar, FaRocket, FaCrown, FaGem, FaHeart, FaBolt, FaShieldAlt } from 'react-icons/fa';
import DynamicTableOfContents from '../components/DynamicTableOfContents';

interface PageData {
  id: string;
  title: string;
    slug: string;
  content: string;
  templateRelation: {
    name: string;
    description: string;
    sections: Section[];
  };
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  type: string;
  title: string;
  content: any;
  order: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const iconMap: { [key: string]: React.ReactNode } = {
  star: <FaStar className="w-8 h-8" />,
  check: <FaCheck className="w-8 h-8" />,
  heart: <FaHeart className="w-8 h-8" />,
  shield: <FaShieldAlt className="w-8 h-8" />,
  rocket: <FaRocket className="w-8 h-8" />,
  crown: <FaCrown className="w-8 h-8" />,
  gem: <FaGem className="w-8 h-8" />,
  bolt: <FaBolt className="w-8 h-8" />
};

const colorMap: { [key: string]: string } = {
  star: 'from-blue-500 to-blue-600',
  check: 'from-green-500 to-green-600',
  heart: 'from-red-500 to-red-600',
  shield: 'from-purple-500 to-purple-600',
  rocket: 'from-orange-500 to-orange-600',
  crown: 'from-yellow-500 to-orange-500',
  gem: 'from-purple-500 to-purple-600',
  bolt: 'from-blue-500 to-purple-600'
};

// פונקציה לחילוץ כותרות מ-HTML
const extractHeadings = (html: string) => {
  const headings: { id: string; text: string; level: number }[] = [];
  
  // יצירת DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag, index) => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach((element) => {
      const text = element.textContent || '';
      const id = text.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // הוספת ID לאלמנט
      element.id = id;
      
      headings.push({
        id,
        text,
        level: index + 1
      });
    });
  });
  
  return headings;
};

export default function DynamicPage({ params }: { params: { slug: string } }) {
  const [pageData, setPageData] = React.useState<PageData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch(`/api/pages?slug=${params.slug}`);
        if (!response.ok) {
          throw new Error('הדף לא נמצא');
        }
        const data = await response.json();
        setPageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'שגיאה בטעינת הדף');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [params.slug]);

  // הוספת IDs לכותרות אחרי שהתוכן נטען
  React.useEffect(() => {
    if (pageData) {
      // המתן קצת שהתוכן יטען
      const timer = setTimeout(() => {
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headingElements.forEach((element, index) => {
          if (!element.id) {
            const text = element.textContent || '';
            const id = text.toLowerCase().replace(/[^a-z0-9]/g, '-');
            element.id = id;
          }
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pageData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">הדף לא נמצא</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  const renderSection = (section: Section) => {
    const { type, content } = section;

    switch (type) {
      case 'hero':
          return (
          <section key={section.id} className="relative h-[60vh] min-h-[400px] w-full">
            <Image
              src={content.backgroundImage || '/images/hero-bg.jpg'}
              alt={content.title || 'Hero'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 dark:from-blue-900/90 dark:to-purple-900/90" />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="px-4">
                <motion.h1
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                >
                  {content.title || 'כותרת ראשית'}
                </motion.h1>
                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="text-xl text-white/90 md:text-2xl"
                >
                  {content.subtitle || 'תת כותרת'}
                </motion.p>
                {content.buttonText && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mt-8"
                  >
                    <Link
                      href={content.buttonLink || '/contact'}
                      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      {content.buttonText}
                    </Link>
                  </motion.div>
                )}
              </div>
                          </div>
          </section>
        );

      case 'content':
        return (
          <section key={section.id} className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto max-w-6xl">
              {/* Mobile Table of Contents - At the top */}
              {content.showTableOfContents && (
                <div className="mb-8 lg:hidden">
                  <DynamicTableOfContents content={content.content || ''} />
                </div>
              )}

              <div className="flex gap-8">
                {/* תוכן ראשי */}
                <div className="flex-1">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
                  >
                    {content.title && (
                      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                        {content.title}
                      </h2>
                    )}
                    
                    <div 
                      className="prose prose-lg mx-auto max-w-none dark:prose-invert prose-gray dark:prose-gray-600"
                      dangerouslySetInnerHTML={{ __html: content.content || '' }}
                    />
                  </motion.div>
                </div>
                
                {/* Desktop Table of Contents Sidebar */}
                {content.showTableOfContents && (
                  <div className="hidden lg:block flex-shrink-0">
                    <DynamicTableOfContents content={content.content || ''} />
                  </div>
                )}
              </div>
                </div>
          </section>
        );

      case 'features':
        return (
          <section key={section.id} className="bg-white px-4 py-16 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
              >
                {content.title || 'היתרונות שלנו'}
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
              >
                {content.features?.map((feature: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-2xl dark:from-gray-800 dark:to-gray-700 dark:hover:from-blue-900 dark:hover:to-purple-900"
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                      className="mb-4 text-3xl text-blue-600 dark:text-blue-400"
                    >
                      {iconMap[feature.icon] || <FaStar className="h-12 w-12 text-blue-600 dark:text-blue-400" />}
                    </motion.div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-600">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
                          </div>
          </section>
        );

      case 'benefits':
        return (
          <section key={section.id} className="bg-gray-50 px-4 py-16 dark:bg-gray-800">
            <div className="container mx-auto max-w-6xl">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
              >
                {content.title || 'היתרונות שלנו'}
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {content.benefits?.map((benefit: string, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.1 }}
                        className="mt-1 text-green-500 dark:text-green-400"
                      >
                        <FaCheck />
                      </motion.div>
                      <p className="text-lg text-gray-700 dark:text-gray-600">{benefit}</p>
                      </div>
                  </motion.div>
                    ))}
              </motion.div>
                  </div>
          </section>
        );

      case 'process':
        return (
          <section key={section.id} className="bg-white px-4 py-16 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
              >
                {content.title || 'תהליך העבודה שלנו'}
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
              >
                {content.steps?.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group relative rounded-xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-2xl dark:from-gray-800 dark:to-gray-700"
                  >
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.1 }}
                      className="mb-4 text-4xl font-bold text-blue-600/20 dark:text-blue-400/20"
                    >
                      {index + 1}
                    </motion.div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </motion.div>
                </div>
          </section>
        );

      case 'portfolio':
        return (
          <section key={section.id} className="bg-gray-50 px-4 py-16 dark:bg-gray-800">
            <div className="container mx-auto max-w-6xl">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
              >
                {content.title || 'העבודות שלנו'}
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {content.items?.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-700"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.image || '/images/portfolio/project1.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-600">
                        {item.description}
                      </p>
                      <Link
                        href={item.link || '#'}
                        className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        לצפייה בפרויקט
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={section.id} className="bg-white px-4 py-16 dark:bg-gray-900">
            <div className="container mx-auto max-w-4xl">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
              >
                {content.title || 'מה לקוחות חושבים עלינו?'}
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="space-y-8"
              >
                {content.testimonials?.map((testimonial: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800"
                  >
                    <blockquote className="mb-6 text-lg italic text-gray-700 dark:text-gray-500">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-600">
                          {testimonial.company}
                        </p>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          );

      case 'faq':
          return (
          <section key={section.id} className="bg-white px-4 py-16 dark:bg-gray-900">
            <div className="container mx-auto max-w-4xl">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
              >
                {content.title || 'שאלות נפוצות'}
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="space-y-6"
              >
                {content.questions?.map((faq: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.01 }}
                    className="rounded-lg bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-xl dark:from-gray-800 dark:to-gray-700"
                  >
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </motion.div>
                </div>
          </section>
        );

      case 'pricing':
        return (
          <section key={section.id} className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center mb-12"
              >
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                  {content.title || 'מחירון שירותים'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  בחרנו עבורכם את החבילות המתאימות ביותר לכל צורך ומטרה. 
                  כל חבילה כוללת תמיכה טכנית מלאה והדרכה מקצועית.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {content.plans?.map((plan: any, index: number) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`relative rounded-2xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800 ${
                      plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          הכי פופולרי
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${colorMap.star} text-white mb-4`}>
                        <FaStar className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          /{plan.period}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features?.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <FaCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => window.open('https://wa.me/972509159951?text=שלום! אני מעוניין בחבילה ' + plan.name, '_blank')}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-600 dark:text-white dark:hover:from-gray-600 dark:hover:to-gray-500'
                      }`}
                    >
                      התחל עכשיו
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mt-12 text-center"
              >
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  לא מצאתם את החבילה המתאימה? צרו איתנו קשר ונבנה עבורכם פתרון מותאם אישית
                </p>
                <button 
                  onClick={() => window.open('tel:0509159951', '_self')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  צרו קשר לקבלת הצעת מחיר מותאמת
                </button>
              </motion.div>
            </div>
          </section>
          );

      case 'cta':
          return (
          <section key={section.id} className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-16 dark:from-blue-900 dark:to-purple-900">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-6 text-3xl font-bold text-white"
              >
                {content.title || 'מוכנים להתחיל?'}
              </motion.h2>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mb-8 text-xl text-white/90"
              >
                {content.subtitle || 'צרו איתנו קשר עוד היום ונעזור לכם להגשים את החזון שלכם'}
              </motion.p>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={content.buttonLink || '/contact'}
                    className="inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-gray-800"
                  >
                    {content.buttonText || 'דברו איתנו'}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>
        );

      default:
        return null;
      }
    };

    return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {pageData.templateRelation?.sections?.sort((a, b) => a.order - b.order).map(renderSection)}
          </div>
    );
} 