'use client';

import { useState, useEffect, useRef, useCallback, useId } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaTimes, FaSearch, FaTag, FaHome, FaCode, FaMobile, FaGlobe, FaChartLine, FaEnvelope, FaBars, FaUsers, FaBlog, FaShoppingCart, FaPaintBrush } from 'react-icons/fa';
import React from 'react';
import SearchResult from './SearchResult';
import { navigation, promotions } from './navigation-data';
import { IconType } from 'react-icons';

interface SubMenuItem {
  name: string;
  description?: string;
  href: string;
  icon?: string;
}

const PHONE_DISPLAY = '050-9159951';
const PHONE_TEL = 'tel:+972509159951';

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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; href: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const isHome = pathname === '/';
  const overHero = isHome && !isScrolled;
  const lightText = overHero;

  const allPages = React.useMemo(() => {
    return navigation.reduce((pages: { name: string; href: string }[], item) => {
      pages.push({ name: item.name, href: item.href });
      if (item.submenu) {
        pages.push(...item.submenu.map((sub) => ({
          name: sub.name,
          href: sub.href,
        })));
      }
      return pages;
    }, []);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSearchExpanded(false);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const drawer = menuRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isMenuOpen]);

  const handleSearchInput = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveIndex(-1);
    setShowSuggestions(true);

    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = allPages.filter((page) =>
      page.name.toLowerCase().includes(query.toLowerCase()) ||
      page.href.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  }, [allPages]);

  const handleSelect = useCallback(async (suggestion: { name: string; href: string }) => {
    try {
      setSearchQuery('');
      setShowSuggestions(false);
      await router.push(suggestion.href);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [router]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
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

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const headerShell = overHero
    ? 'bg-transparent'
    : isScrolled
      ? 'bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl border-b border-slate-200/80'
      : 'bg-white border-b border-slate-200/80 shadow-sm';

  return (
    <div className="site-header fixed top-0 left-0 right-0 z-50" data-cta-location="header" data-contrast={lightText ? 'hero' : 'light'}>
      {overHero && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/30 to-transparent"
          aria-hidden="true"
        />
      )}
      {!isHome && (
        <div className={`bg-blue-600 text-white relative overflow-hidden transition-all duration-300 ${
          isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-2 opacity-100'
        }`}>
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
      )}

      <header className={`w-full transition-all duration-300 ${headerShell}`}>
        <nav className="max-w-[90rem] mx-auto px-3 sm:px-4 xl:px-8" aria-label="תפריט ראשי">
          <div className={`flex items-center gap-2 xl:gap-3 transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16 lg:h-[4.25rem]'
          }`}>
            <Link href="/" className="flex items-center group shrink-0 min-w-0">
              <div className={`header-logo font-bold transition-all duration-300 whitespace-nowrap ${
                isScrolled ? 'text-sm' : 'text-sm xl:text-base'
              }`}>
                <div>Top Webstak</div>
                <div className={`text-[11px] leading-tight font-medium ${
                  isScrolled ? 'hidden' : 'hidden xl:block'
                }`}>
                  בנייה וקידום אתרים
                </div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 flex-nowrap">
              {navigation.map((item) => {
                const current = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                return (
                  <div key={item.name} className="relative group shrink-0">
                    <Link
                      href={item.href || '#'}
                      aria-current={current ? 'page' : undefined}
                      aria-haspopup={item.submenu ? 'true' : undefined}
                      className="nav-link px-1.5 xl:px-2.5 py-2 text-[13px] xl:text-sm font-medium whitespace-nowrap transition-colors duration-300 flex items-center"
                    >
                      {item.name}
                      {item.submenu && (
                        <svg
                          className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                          style={{ marginRight: '4px', marginLeft: '4px' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    {item.submenu && (
                      <div className={`header-dropdown absolute right-0 top-full pt-2 z-50 ${
                        item.submenu.length > 6 ? 'w-[min(28rem,calc(100vw-2rem))]' : 'w-72'
                      }`}>
                        <div className="rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                          <div className={`p-3 grid gap-1 max-h-[70vh] overflow-y-auto ${
                            item.submenu.length > 6 ? 'grid-cols-2' : 'grid-cols-1'
                          }`}>
                            {item.submenu.map((subItem: SubMenuItem) => {
                              const Icon = getIcon(subItem.icon);
                              const subCurrent = pathname === subItem.href;
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={`flex items-start p-3 rounded-xl transition-colors duration-200 ${
                                    subCurrent ? 'bg-blue-50' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`p-2 rounded-lg ${
                                    subCurrent ? 'text-blue-600 bg-blue-100' : 'text-blue-600 bg-blue-50'
                                  }`}>
                                    {Icon && <Icon className="w-5 h-5" />}
                                  </div>
                                  <div className="mr-3">
                                    <div className={`dropdown-title text-sm font-medium ${
                                      subCurrent ? 'text-blue-700' : ''
                                    }`}>
                                      {subItem.name}
                                    </div>
                                    {subItem.description && (
                                      <p className="dropdown-desc mt-1 text-xs">
                                        {subItem.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
              <div ref={searchRef} className="relative">
                <button
                  type="button"
                  className={`header-fg inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    !isScrolled ? 'xl:hidden' : ''
                  } ${searchExpanded ? 'hidden' : ''} ${
                    lightText ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                  }`}
                  aria-label="חיפוש"
                  aria-expanded={searchExpanded}
                  onClick={() => setSearchExpanded(true)}
                >
                  <FaSearch size={15} />
                </button>
                <form
                  onSubmit={handleSearchSubmit}
                  className={searchExpanded ? 'block' : isScrolled ? 'hidden' : 'hidden xl:block'}
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="חיפוש..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      className={`w-32 2xl:w-40 h-9 pr-9 pl-3 rounded-full border text-sm focus:outline-none
                        ${lightText
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-[#071433] focus:border-blue-500'
                          : 'bg-slate-100 border-slate-200 text-[#071433] placeholder-slate-500 focus:border-blue-500'
                        }`}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label="חיפוש"
                    >
                      <FaSearch className="header-fg" size={14} />
                    </button>
                  </div>
                </form>

                {showSuggestions && suggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={() => { setShowSuggestions(false); setSearchExpanded(false); }} />
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[101]">
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

              <a
                href={PHONE_TEL}
                className={`header-fg inline-flex items-center gap-1.5 h-9 px-2 xl:px-3 text-sm font-medium rounded-full transition-colors duration-300 ${
                  lightText ? 'hover:bg-white/10' : 'hover:bg-blue-50'
                }`}
                aria-label={`התקשרו ${PHONE_DISPLAY}`}
              >
                <span aria-hidden="true">📞</span>
                <span className="hidden xl:inline" dir="ltr">{PHONE_DISPLAY}</span>
              </a>

              <Link
                href="/contact"
                data-cta="true"
                data-cta-location="header"
                className="inline-flex items-center px-3 xl:px-4 h-9 text-xs xl:text-sm font-semibold rounded-full text-white bg-gradient-to-l from-blue-800 via-blue-700 to-blue-600 shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                ייעוץ חינם
              </Link>
            </div>

            <button
              ref={menuButtonRef}
              className="lg:hidden p-2 ms-auto"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
            >
              {isMenuOpen ? (
                <FaTimes className="header-fg" size={24} />
              ) : (
                <FaBars className="header-fg" size={24} />
              )}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          tabIndex={isMenuOpen ? 0 : -1}
          aria-label="סגור תפריט"
          onClick={closeMenu}
        />
        <div
          ref={menuRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="תפריט נייד"
          inert={!isMenuOpen ? true : undefined}
          className={`mobile-drawer absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ${
            isMenuOpen ? 'mobile-drawer-open' : ''
          }`}
        >
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-base font-bold text-blue-600 leading-tight">
                <div>Top Webstak</div>
                <div className="text-sm">בנייה וקידום אתרים</div>
                <div className="text-sm">(מבית עדי פון תקשורת)</div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeMenu}
                className="p-2"
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
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#071433]" aria-label="חיפוש">
                  <FaSearch size={18} />
                </button>
              </div>
            </form>

            <nav className="space-y-1" aria-label="ניווט נייד">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href || '#'}
                    className={`block px-4 py-3 rounded-lg text-base font-medium ${
                      pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => !item.submenu && setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="pr-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-2 rounded-lg text-sm ${
                            pathname === subItem.href ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
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

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <a
                href={PHONE_TEL}
                className="block w-full px-4 py-3 text-center font-medium text-blue-700 bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                התקשרו {PHONE_DISPLAY}
              </a>
              <Link
                href="/contact"
                data-cta="true"
                data-cta-location="header"
                className="block w-full px-4 py-3 text-center font-semibold text-white rounded-lg bg-gradient-to-l from-blue-800 via-blue-700 to-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                ייעוץ חינם
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
