'use client';

import React from 'react';
import Image from 'next/image';

export default function Portfolio() {
  const projects = [
    {
      id: 1,
      title: 'אתר חנות אונליין',
      description: 'חנות אונליין מלאה עם מערכת תשלומים ומנהל תוכן',
      image: '/images/portfolio/project1.svg',
      category: 'פיתוח אתרים'
    },
    {
      id: 2,
      title: 'קמפיין קידום אורגני',
      description: 'הגדלת תנועה אורגנית ב-300% תוך 6 חודשים',
      image: '/images/portfolio/project2.svg',
      category: 'קידום אורגני'
    },
    {
      id: 3,
      title: 'קמפיין שיווק ממומן',
      description: 'הגדלת המרות ב-200% בקמפיין גוגל אדס',
      image: '/images/portfolio/project3.svg',
      category: 'שיווק ממומן'
    }
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">תיק עבודות</h1>
            <p className="text-xl max-w-3xl mx-auto">
              הנה כמה מהפרויקטים האחרונים שלנו. כל פרויקט מייצג את המקצועיות והאיכות שאנחנו מציעים
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm mb-4">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 