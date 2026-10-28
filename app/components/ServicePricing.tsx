'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import {
  PHONE_DISPLAY,
  packagesForService,
  whatsappUrl,
  type PricingPackage,
} from '../../lib/pricing';

interface ServicePricingProps {
  serviceType: string;
  heading?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function PackageCard({ pkg }: { pkg: PricingPackage }) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`relative flex h-full flex-col rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800 ${
        pkg.highlighted ? 'ring-2 ring-blue-600' : ''
      }`}
    >
      {pkg.highlighted && (
        <p className="mb-2 text-sm font-semibold text-blue-700">הבחירה הנפוצה לעסק מקומי</p>
      )}
      <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
      <p className="mb-1 text-3xl font-bold text-blue-700">
        {pkg.priceLabel} <span className="text-base font-medium text-gray-600 dark:text-gray-400">+ מע״מ</span>
      </p>
      <p className="mb-6 text-gray-600 dark:text-gray-400">{pkg.summary}</p>
      <ul className="mb-8 flex-1 space-y-3">
        {pkg.includes.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <FaCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href={whatsappUrl(pkg.whatsappText)}
        target="_blank"
        rel="noopener noreferrer"
        data-package-name={pkg.name}
        data-cta-location="pricing"
        className="mb-3 block rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-green-700"
      >
        וואטסאפ: {PHONE_DISPLAY}
      </a>
      <Link
        href="/contact"
        data-cta="true"
        data-package-name={pkg.name}
        data-cta-location="pricing"
        className="block rounded-lg bg-gray-100 px-6 py-3 text-center font-semibold text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      >
        השאירו פרטים
      </Link>
    </motion.div>
  );
}

function PricingPageLink({ className = '' }: { className?: string }) {
  return (
    <Link href="/pricing" className={`font-semibold text-blue-700 underline dark:text-blue-400 ${className}`}>
      מחירון בניית אתרים
    </Link>
  );
}

export default function ServicePricing({ serviceType, heading }: ServicePricingProps) {
  const plans = packagesForService(serviceType);
  const blockHeading = heading || 'מחירון בניית אתרים';

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            {blockHeading}
          </h2>
          {plans.length > 0 ? (
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              מחירי פתיחה מאושרים, לא כוללים מע״מ. הפירוט המלא, תוספות והשוואת חבילות נמצאים ב
              <PricingPageLink />.
            </p>
          ) : (
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              לשירות הזה נמסור הצעת מחיר אחרי שיחת אפיון. למחירי פתיחה של בניית אתרים ראו את{' '}
              <PricingPageLink />.
            </p>
          )}
        </motion.div>

        {plans.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className={`grid gap-8 ${
              plans.length === 1
                ? 'mx-auto max-w-md md:grid-cols-1'
                : plans.length === 2
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-2 xl:grid-cols-4'
            }`}
          >
            {plans.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {plans.length > 0
              ? 'המחיר הסופי נקבע לפי היקף הפרויקט. לפירוט מלא ולתוספות (תחזוקה, אחסון, תוכן ו-SEO):'
              : 'רוצים לראות כמה עולה לבנות אתר?'}
          </p>
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            למחירון בניית אתרים
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
