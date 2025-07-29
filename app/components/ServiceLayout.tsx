'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBox, FaCreditCard, FaRobot, FaChartLine, FaCheck, FaLightbulb, FaRocket, FaUsers, FaCog, FaHeart, FaSearch, FaLink, FaFileAlt, FaGoogle, FaShareAlt, FaBullseye, FaMobileAlt, FaPaintBrush, FaBolt, FaShieldAlt, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import TableOfContents from './TableOfContents';

interface ServiceLayoutProps {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  heroImage: string;
  features: Array<{
    title: string;
    description: string;
    icon: IconType;
  }>;
  benefits: string[];
  process: Array<{
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  portfolio: Array<{
    image: string;
    title: string;
    description: string;
    link: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    company: string;
  }>;
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

const iconMap: { [key: string]: IconType } = {
  search: FaSearch,
  cog: FaCog,
  link: FaLink,
  'file-text': FaFileAlt,
  google: FaGoogle,
  share: FaShareAlt,
  target: FaBullseye,
  chart: FaChartLine,
  mobile: FaMobileAlt,
  'paint-brush': FaPaintBrush,
  bolt: FaBolt,
  shield: FaShieldAlt
};

export default function ServiceLayout({
  title,
  subtitle,
  description,
  heroImage,
  features,
  benefits,
  process,
  faq,
  portfolio,
  testimonials
}: ServiceLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src={heroImage}
          alt={title}
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
              {title}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-xl text-white/90 md:text-2xl"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          {/* Mobile Table of Contents - At the top */}
          <div className="mb-8 lg:hidden">
            <TableOfContents />
          </div>
          
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
              >
                <div className="prose prose-lg mx-auto max-w-4xl dark:prose-invert prose-gray dark:prose-gray-600">
                  {description}
                </div>
              </motion.div>
            </div>
            
            {/* Desktop Table of Contents Sidebar */}
            <div className="hidden lg:block flex-shrink-0">
              <TableOfContents />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            היתרונות שלנו
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
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
                    <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            היתרונות שלנו
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-700"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={iconAnimation}
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

      {/* Process Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            תהליך העבודה שלנו
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {process.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative rounded-xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-2xl dark:from-gray-800 dark:to-gray-700"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={iconAnimation}
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

      {/* Portfolio Section */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            החנויות שבנינו מדברות בעד עצמן
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {portfolio.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-2xl dark:bg-gray-700"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.image}
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
                    href={item.link}
                    className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    לצפייה בחנות
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            מה לקוחות חושבים עלינו?
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-8"
          >
            {testimonials.map((testimonial, index) => (
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

      {/* FAQ Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
          >
            שאלות נפוצות
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-6"
          >
            {faq.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                className="rounded-lg bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg transition-all hover:shadow-xl dark:from-gray-800 dark:to-gray-700"
              >
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-600">{item.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-16 dark:from-blue-900 dark:to-purple-900">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-6 text-3xl font-bold text-white"
          >
            מוכנים להתחיל?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-8 text-xl text-white/90"
          >
            צרו איתנו קשר עוד היום ונעזור לכם להגשים את החזון שלכם
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
                href="/contact"
                className="inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-gray-800"
              >
                דברו איתנו
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 