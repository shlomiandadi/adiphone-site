'use client';

import { useState, useEffect, useRef } from 'react';
import { FaListUl, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface DynamicTableOfContentsProps {
  content: string;
}

export default function DynamicTableOfContents({ content }: DynamicTableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // חילוץ כותרות מה-HTML
    const extractHeadingsFromHTML = (html: string) => {
      const headings: Heading[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag, index) => {
        const elements = doc.querySelectorAll(tag);
        elements.forEach((element) => {
          const text = element.textContent || '';
          const id = text.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          headings.push({
            id,
            text,
            level: index + 1
          });
        });
      });
      
      return headings;
    };

    const extractedHeadings = extractHeadingsFromHTML(content);
    setHeadings(extractedHeadings);

    // יצירת Intersection Observer לעקוב אחר הכותרות הנראות
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    // הוספת כל הכותרות לתצפית
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // מרווח מהחלק העליון
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <div className="sticky top-24 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-right font-semibold text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-200 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <span className="flex items-center gap-2">
              <FaListUl className="text-blue-600" />
              תוכן עניינים
            </span>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {isExpanded && (
            <nav className="p-4 max-h-96 overflow-y-auto">
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-right p-2 rounded transition-all duration-200 text-sm ${
                        activeId === heading.id
                          ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                      style={{ 
                        paddingRight: `${(heading.level - 1) * 16 + 12}px`,
                        fontSize: heading.level === 2 ? '14px' : heading.level === 3 ? '13px' : '12px'
                      }}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden">
        <div className="bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-right font-semibold text-gray-800 hover:bg-gray-50 transition-colors dark:text-white dark:hover:bg-gray-700"
          >
            <span className="flex items-center gap-2">
              <FaListUl className="text-blue-600" />
              תוכן עניינים
            </span>
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {isExpanded && (
            <nav className="px-4 pb-4 max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-right p-3 rounded transition-all duration-200 text-sm ${
                        activeId === heading.id
                          ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                      style={{ 
                        paddingRight: `${(heading.level - 1) * 12 + 12}px`,
                        fontSize: heading.level === 2 ? '15px' : heading.level === 3 ? '14px' : '13px'
                      }}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </>
  );
} 