'use client';

import { useState } from 'react';
import { homeFaqItems } from '../data/homeFaq';

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="home-faq-title">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 id="home-faq-title" className="text-3xl font-bold text-gray-900 mb-4">
            שאלות נפוצות
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            תשובות לשאלות הנפוצות ביותר על השירותים שלנו ב-Top WebStack
          </p>
        </div>

        <div className="space-y-4">
          {homeFaqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-shadow hover:shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-gray-900">{item.question}</span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <p className="pt-4 text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
