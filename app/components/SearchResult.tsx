'use client';

import { FaHome, FaCode, FaMobileAlt, FaGlobe, FaChartLine, FaShoppingCart, FaPaintBrush, FaUsers, FaBlog, FaEnvelope } from 'react-icons/fa';

interface SearchResultProps {
  suggestion: {
    name: string;
    href: string;
    icon?: string;
  };
  isActive: boolean;
  onSelect: () => void;
}

const iconMap: { [key: string]: any } = {
  'home': FaHome,
  'globe': FaGlobe,
  'mobile': FaMobileAlt,
  'chart-line': FaChartLine,
  'shopping-cart': FaShoppingCart,
  'paint-brush': FaPaintBrush,
  'code': FaCode,
  'users': FaUsers,
  'envelope': FaEnvelope,
  'blog': FaBlog,
};

const getIconForPath = (href: string): string => {
  if (href === '/') return 'home';
  if (href.includes('wordpress')) return 'globe';
  if (href.includes('mobile') || href.includes('app')) return 'mobile';
  if (href.includes('seo') || href.includes('analytics') || href.includes('ppc')) return 'chart-line';
  if (href.includes('ecommerce')) return 'shopping-cart';
  if (href.includes('ui') || href.includes('design')) return 'paint-brush';
  if (href.includes('software') || href.includes('ai') || href.includes('cloud')) return 'code';
  if (href.includes('about')) return 'users';
  if (href.includes('blog')) return 'blog';
  if (href.includes('contact')) return 'envelope';
  return 'code';
};

export default function SearchResult({ suggestion, isActive, onSelect }: SearchResultProps) {
  const iconName = getIconForPath(suggestion.href);
  const Icon = iconMap[iconName];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-right px-4 py-3 transition-colors flex items-start gap-3 ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/50'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className={`p-2 rounded-lg transition-colors duration-300 ${
        isActive
          ? 'text-blue-600 bg-blue-100 dark:bg-blue-900'
          : 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className={`font-medium ${
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-900 dark:text-white'
        }`}>
          {suggestion.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {suggestion.href}
        </div>
      </div>
    </button>
  );
} 