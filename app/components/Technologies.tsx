'use client';

import { FaReact, FaNodeJs, FaPython, FaPhp, FaJava, FaAngular, FaVuejs, FaLaravel, FaWordpress, FaDocker } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiMongodb, SiPostgresql, SiMysql, SiDjango, SiSpring, SiNestjs } from 'react-icons/si';

const technologies = [
  { name: 'React', icon: FaReact, color: 'text-blue-500' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'text-gray-900 dark:text-white' },
  { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-600' },
  { name: 'Node.js', icon: FaNodeJs, color: 'text-green-600' },
  { name: 'Python', icon: FaPython, color: 'text-yellow-600' },
  { name: 'PHP', icon: FaPhp, color: 'text-purple-600' },
  { name: 'Java', icon: FaJava, color: 'text-red-600' },
  { name: 'Angular', icon: FaAngular, color: 'text-red-500' },
  { name: 'Vue.js', icon: FaVuejs, color: 'text-emerald-500' },
  { name: 'Laravel', icon: FaLaravel, color: 'text-red-500' },
  { name: 'WordPress', icon: FaWordpress, color: 'text-blue-500' },
  { name: 'Docker', icon: FaDocker, color: 'text-blue-500' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-400' },
  { name: 'MySQL', icon: SiMysql, color: 'text-blue-600' },
  { name: 'Django', icon: SiDjango, color: 'text-green-800' },
  { name: 'Spring', icon: SiSpring, color: 'text-green-500' },
  { name: 'NestJS', icon: SiNestjs, color: 'text-red-600' },
];

export default function Technologies() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">הטכנולוגיות שלנו</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            אנחנו עובדים עם מגוון רחב של טכנולוגיות מתקדמות כדי להתאים את הפתרון המושלם עבור העסק שלך
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <tech.icon className={`w-12 h-12 ${tech.color} mb-3 transition-transform duration-300 group-hover:scale-110`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 