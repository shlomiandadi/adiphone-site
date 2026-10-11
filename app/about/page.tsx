'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake, FaHeart, FaCertificate } from 'react-icons/fa';
import Team from '../components/Team';
import Hero3D from '../components/hero3d/Hero3D';

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

const iconAnimation = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: { 
    scale: 1.1,
    rotate: [0, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.5
    }
  }
};

export default function AboutPage() {
  const values = [
    {
      icon: <FaUsers />,
      title: "לקוח במרכז",
      description: "אנחנו מאמינים שהצלחת הלקוח היא המפתח להצלחה שלנו. כל החלטה שאנחנו מקבלים מתחילה בשאלה - איך זה משרת את הלקוח?"
    },
    {
      icon: <FaLightbulb />,
      title: "חדשנות מתמדת",
      description: "אנחנו תמיד בחזית הטכנולוגיה, מחפשים דרכים חדשות לשפר ולייעל את הפתרונות שלנו."
    },
    {
      icon: <FaHandshake />,
      title: "שותפות אמיתית",
      description: "אנחנו לא רק ספקי שירות, אנחנו שותפים אמיתיים לדרך, מחויבים להצלחה המשותפת."
    },
    {
      icon: <FaHeart />,
      title: "איכות ללא פשרות",
      description: "כל פרויקט מקבל את מלוא תשומת הלב והמשאבים, עם דגש על איכות בכל פרט ופרט."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Hero3D
        theme="about"
        title="אודות החברה"
        subtitle="מובילים את המהפכה הדיגיטלית כבר למעלה מ-15 שנה"
        align="center"
        ctas={[
          { href: '/contact', label: 'צרו קשר' },
          { href: '/portfolio', label: 'תיק עבודות', variant: 'secondary' },
        ]}
      />

      {/* Mission Statement */}
      <section data-reveal className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
          >
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
              החזון שלנו
            </h2>
            <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700 dark:text-gray-200">
              אנחנו מאמינים שטכנולוגיה צריכה לשרת את האדם ולא להפך. המשימה שלנו היא להפוך את העולם הדיגיטלי לנגיש, יעיל ומועיל יותר עבור כולם.

              אנחנו מחויבים לספק פתרונות טכנולוגיים חדשניים שמשפרים את חיי היומיום של אנשים ועסקים, תוך שמירה על ערכי הליבה שלנו: מצוינות, יושרה ושירות.

              הצוות שלנו, המורכב ממומחים מובילים בתחומם, עובד ללא לאות כדי להביא את הפתרונות המתקדמים ביותר ללקוחותינו, תוך התאמה מדויקת לצרכיהם הייחודיים.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section data-reveal className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            הערכים שלנו
          </motion.h2>
          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                data-tilt
                className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-2xl dark:from-gray-800 dark:to-gray-700 dark:hover:from-blue-900 dark:hover:to-purple-900"
              >
                <motion.div
                  initial={false}
                  animate="visible"
                  whileHover="hover"
                  variants={iconAnimation}
                  className="mb-4 text-3xl text-blue-600 dark:text-blue-400"
                >
                  {value.icon}
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section data-reveal className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-16 dark:from-blue-900 dark:to-purple-900">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="text-center">
              <FaUsers className="mx-auto mb-4 text-4xl text-white" />
              <h3 className="mb-2 text-3xl font-bold text-white">500+</h3>
              <p className="text-lg text-white/90">לקוחות מרוצים</p>
            </div>
            <div className="text-center">
              <FaCertificate className="mx-auto mb-4 text-4xl text-white" />
              <h3 className="mb-2 text-3xl font-bold text-white">15+</h3>
              <p className="text-lg text-white/90">שנות ניסיון</p>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal>
        <Team />
      </section>

      {/* Who's behind the business + real links (facts only; TODOs for the owner) */}
      <section data-reveal className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            מי עומד מאחורי Top Webstak
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Top Webstak היא סוכנות דיגיטל מבית עדי פון תקשורת, הפועלת מפרדס חנה-כרכור
            (זמיר 95) ונותנת שירות לעסקים באזור ובפריסה ארצית מרחוק.
            {/* TODO(owner): הוסיפו כאן ביוגרפיה קצרה של הצוות (עדי פון, שלומי): שמות מלאים, תפקידים ושנות ניסיון בפועל — עובדות בלבד, ללא המצאות. */}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="tel:+972509159951"
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              חייגו: 050-9159951
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61578707397365"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/in/shlomi-malfuf-709961221/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 