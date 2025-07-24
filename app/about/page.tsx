'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake, FaRocket, FaHeart, FaCertificate, FaChartLine, FaGlobe } from 'react-icons/fa';
import Team from '../components/Team';

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
  const teamMembers = [
    {
      name: "דניאל כהן",
      role: "מנכ״ל ומייסד",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      description: "מוביל את החברה עם חזון ברור וניסיון של למעלה מ-15 שנה בתעשיית ההייטק."
    },
    {
      name: "מיכל לוי",
      role: "סמנכ״לית טכנולוגיות",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      description: "מומחית בפיתוח ואינטגרציה של מערכות מורכבות עם התמחות ב-AI ו-Big Data."
    },
    {
      name: "יוסי אברהם",
      role: "מנהל פיתוח עסקי",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
      description: "אחראי על פיתוח שווקים חדשים והרחבת פעילות החברה בארץ ובעולם."
    },
    {
      name: "רונית שרון",
      role: "מנהלת שיווק",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      description: "מובילה את אסטרטגיית השיווק והמיתוג של החברה עם דגש על חדשנות דיגיטלית."
    }
  ];

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

  const milestones = [
    {
      year: "2015",
      title: "הקמת החברה",
      description: "התחלנו את דרכנו עם חזון ברור לשנות את עולם הדיגיטל."
    },
    {
      year: "2017",
      title: "הרחבת השירותים",
      description: "הוספנו שירותי פיתוח אפליקציות ו-AI לסל המוצרים שלנו."
    },
    {
      year: "2019",
      title: "פריצה בינלאומית",
      description: "התחלנו לעבוד עם לקוחות מחו״ל והרחבנו את הפעילות הגלובלית."
    },
    {
      year: "2021",
      title: "מובילי שוק",
      description: "הפכנו למובילים בתחום הדיגיטל עם מאות פרויקטים מוצלחים."
    },
    {
      year: "2023",
      title: "חדשנות וצמיחה",
      description: "השקנו פתרונות AI חדשניים והרחבנו את צוות המומחים שלנו."
    }
  ];

  const stats = [
    { icon: <FaUsers />, number: "500+", label: "לקוחות מרוצים" },
    { icon: <FaRocket />, number: "1000+", label: "פרויקטים מוצלחים" },
    { icon: <FaCertificate />, number: "15+", label: "שנות ניסיון" },
    { icon: <FaGlobe />, number: "20+", label: "מדינות" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
          alt="About Us Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 dark:from-blue-900/90 dark:to-purple-900/90" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            >
              אודות החברה
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-xl text-white/90 md:text-2xl"
            >
              מובילים את המהפכה הדיגיטלית כבר למעלה מ-15 שנה
            </motion.p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
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
      <section className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            הערכים שלנו
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-2xl dark:from-gray-800 dark:to-gray-700 dark:hover:from-blue-900 dark:hover:to-purple-900"
              >
                <motion.div
                  initial="hidden"
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

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-16 dark:from-blue-900 dark:to-purple-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={iconAnimation}
                  className="mb-4 text-4xl text-white"
                >
                  {stat.icon}
                </motion.div>
                <h3 className="mb-2 text-3xl font-bold text-white">
                  {stat.number}
                </h3>
                <p className="text-lg text-white/90">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <Team />

      {/* Milestones Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            אבני דרך
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-6"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative rounded-lg bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-xl dark:from-gray-800 dark:to-gray-700"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white dark:bg-blue-800">
                      {milestone.year.slice(2)}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
} 