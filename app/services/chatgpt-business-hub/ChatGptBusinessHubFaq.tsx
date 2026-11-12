'use client';

import { useState } from 'react';
import { FAQ } from './content';

export default function ChatGptBusinessHubFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section data-reveal className="px-4 py-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">שאלות נפוצות</h2>
        <div className="space-y-4">
          {FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-gray-900">{item.question}</span>
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen ? (
                  <div className="border-t border-gray-100 px-6 pb-5">
                    <p className="pt-4 leading-relaxed text-gray-700">{item.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
