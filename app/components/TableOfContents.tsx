'use client';

import { useState, useEffect, useRef } from 'react';
import { FaListUl, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // מציאת כל הכותרות בעמוד
    const headingElements = document.querySelectorAll('h2, h3, h4');
    const headingData: Heading[] = [];

    headingElements.forEach((element, index) => {
      const id = element.id || `heading-${index}`;
      element.id = id;
      
      headingData.push({
        id,
        text: element.textContent || '',
        level: parseInt(element.tagName.charAt(1)),
        element: element as HTMLElement
      });
    });

    setHeadings(headingData);

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
    headingElements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

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
        <div className="sticky top-24 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-right font-semibold text-gray-800 hover:bg-gray-50 transition-colors border-b border-gray-200"
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
                          ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
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
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-right font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
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
                          ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
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