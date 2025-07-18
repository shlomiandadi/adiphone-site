'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTimes, FaSearch, FaTag, FaHome, FaCode, FaMobile, FaGlobe, FaChartLine, FaEnvelope, FaArrowLeft, FaBars, FaUsers, FaBlog, FaShoppingCart, FaPaintBrush } from 'react-icons/fa';
import React from 'react';
import SearchResult from './SearchResult';
import { navigation, promotions } from './navigation-data';
import { Fragment } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  MegaphoneIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  NewspaperIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';
import { IconType } from 'react-icons';

interface SubMenuItem {
  name: string;
  description: string;
  href: string;
  icon?: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon?: string;
  submenu?: SubMenuItem[];
}

const iconMap: { [key: string]: any } = {
  'home': FaHome,
  'globe': FaGlobe,
  'mobile': FaMobile,
  'chart-line': FaChartLine,
  'shopping-cart': FaShoppingCart,
  'paint-brush': FaPaintBrush,
  'code': FaCode,
  'users': FaUsers,
  'envelope': FaEnvelope,
  'blog': FaBlog,
  'search': FaSearch
};

function getIcon(iconName: string | undefined) {
  const iconMap: { [key: string]: IconType } = {
    home: FaHome,
    globe: FaGlobe,
    mobile: FaMobile,
    'chart-line': FaChartLine,
    'shopping-cart': FaShoppingCart,
    'paint-brush': FaPaintBrush,
    code: FaCode,
    users: FaUsers,
    envelope: FaEnvelope,
    blog: FaBlog,
  };

  return iconMap[iconName || ''] || FaCode;
}

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; href: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create a flat list of all pages for search
  const allPages = React.useMemo(() => {
    const pages = navigation.reduce((pages: { name: string; href: string }[], item) => {
      pages.push({ name: item.name, href: item.href });
      if (item.submenu) {
        pages.push(...item.submenu.map(sub => ({ 
          name: sub.name, 
          href: sub.href 
        })));
      }
      return pages;
    }, []);
    return pages;
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle click outside menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Handle click outside search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchOpen(false);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu scroll lock
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }, [isMenuOpen]);

  // Handle search input
  const handleSearchInput = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveIndex(-1);
    setShowSuggestions(true);

    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = allPages.filter(page =>
      page.name.toLowerCase().includes(query.toLowerCase()) ||
      page.href.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  }, [allPages]);

  // Handle suggestion selection
  const handleSelect = useCallback(async (suggestion: { name: string; href: string }) => {
    try {
      setSearchQuery('');
      setShowSuggestions(false);
      setIsSearchOpen(false);
      await router.push(suggestion.href);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [router]);

  // Handle search submit
  const handleSearchSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (searchQuery.trim() === '') return;

    try {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        await handleSelect(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        await handleSelect(suggestions[0]);
      }
    } catch (error) {
      console.error('Search submit error:', error);
    }
  }, [searchQuery, suggestions, activeIndex, handleSelect]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        handleSearchSubmit();
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Handle menu toggle
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Promotions Bar */}
      <div className="bg-blue-600 text-white py-2 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="marquee-container">
            <div className="marquee-content">
              {promotions.map((promo, index) => (
                <span key={index}>
                  <FaTag />
                  {promo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header className={`w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-b from-blue-900/90 to-blue-800/80'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className={`text-xl md:text-2xl font-bold transition-all duration-300 ${
                isScrolled ? 'text-blue-600' : 'text-white'
              } group-hover:scale-105 transform`}>
                WebStudio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-8 space-x-1 lg:space-x-2">
              {navigation.map((item) => (
                <div key={item.name} className="relative group px-2">
                  <Link
                    href={item.href || '#'}
                    className={`px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center hover:scale-105 transform ${
                      pathname === item.href || (item.href && pathname.startsWith(item.href + '/'))
                        ? isScrolled
                          ? 'text-blue-600'
                          : 'text-white bg-white/10 rounded-full'
                        : isScrolled
                        ? 'text-gray-900 hover:text-blue-600'
                        : 'text-white hover:bg-white/10 rounded-full'
                    }`}
                  >
                    {item.name}
                    {item.submenu && (
                      <svg 
                        className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:rotate-180" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        style={{ marginRight: '4px', marginLeft: '4px' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {item.submenu && (
                    <div className="absolute right-0 mt-2 w-[480px] bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 backdrop-blur-sm bg-opacity-90">
                      <div className="p-4 grid grid-cols-2 gap-3">
                        {item.submenu.map((subItem) => {
                          const Icon = getIcon(subItem.icon);
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`flex items-start p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] transform ${
                                pathname === subItem.href 
                                  ? 'bg-blue-50' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className={`p-2 rounded-lg transition-colors duration-300 ${
                                pathname === subItem.href
                                  ? 'text-blue-600 bg-blue-100'
                                  : 'text-gray-500 bg-gray-100'
                              }`}>
                                {Icon && <Icon className="w-5 h-5" />}
                              </div>
                              <div className="mr-3">
                                <div className={`text-sm font-medium ${
                                  pathname === subItem.href
                                    ? 'text-blue-600'
                                    : 'text-gray-900'
                                }`}>
                                  {subItem.name}
                                </div>
                                {subItem.description && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    {subItem.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <div className="relative search-container">
                <div ref={searchRef} className="relative">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="חיפוש באתר..."
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={handleKeyDown}
                        className={`w-40 lg:w-48 h-10 pr-10 pl-4 rounded-full transition-all duration-300 border-2 focus:w-56 lg:focus:w-64 search-input hover:shadow-md
                          ${isScrolled
                            ? 'bg-gray-100 border-gray-200 focus:border-blue-500'
                            : 'bg-white/10 border-transparent focus:bg-white focus:border-blue-500'
                          } focus:outline-none ${
                            isScrolled 
                              ? 'text-gray-900 placeholder-gray-500' 
                              : 'text-white placeholder-white/70 focus:text-gray-900'
                          }`}
                      />
                      <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
                      >
                        <FaSearch className={`transition-colors duration-300 ${
                          isScrolled
                            ? 'text-gray-400'
                            : 'text-white/70'
                        }`} size={16} />
                      </button>
                    </div>
                  </form>

                  {/* Search Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-[100]" onClick={() => setShowSuggestions(false)} />
                      <div 
                        className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[101] backdrop-blur-sm bg-opacity-90 animate-fadeIn"
                      >
                        {suggestions.map((suggestion, index) => (
                          <SearchResult
                            key={suggestion.href}
                            suggestion={suggestion}
                            isActive={index === activeIndex}
                            onSelect={() => handleSelect(suggestion)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Link
                href="/contact"
                className="group relative px-4 lg:px-6 py-2 lg:py-2.5 text-sm font-medium rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 hover:scale-105"
              >
                <span className="relative z-10">צור קשר</span>
                <FaEnvelope className="relative z-10 text-white group-hover:animate-bounce" size={16} />
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 transition-transform duration-300 hover:scale-110"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
            >
              {isMenuOpen ? (
                <FaTimes className={`transition-transform duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`} size={24} />
              ) : (
                <FaBars className={`transition-transform duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`} size={24} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto animate-slideIn"
        >
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-blue-600 animate-fadeIn">
                WebStudio
              </span>
              <button 
                onClick={toggleMenu}
                className="p-2 transition-transform duration-300 hover:scale-110"
                aria-label="סגור תפריט"
              >
                <FaTimes className="text-gray-900" size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSearchInput(searchQuery); }} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="חיפוש..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="w-full h-12 px-4 pr-10 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <FaSearch className="text-gray-500" size={18} />
                </button>
              </div>
            </form>

            <nav className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href || '#'}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                      pathname === item.href
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => !item.submenu && setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                            pathname === subItem.href
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/contact"
                className="block w-full px-4 py-3 text-center font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                צור קשר
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}