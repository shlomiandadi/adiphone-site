'use client';

import { useEffect, useRef, useState } from 'react';

const MAP_SRC =
  'https://maps.google.com/maps?q=%D7%96%D7%9E%D7%99%D7%A8%2095%20%D7%A4%D7%A8%D7%93%D7%A1%20%D7%97%D7%A0%D7%94-%D7%9B%D7%A8%D7%9B%D7%95%D7%A8&hl=he&z=16&output=embed';

const MAP_TITLE = 'מפת Google – זמיר 95, פרדס חנה-כרכור';

/**
 * Same framed box as the previous eager iframe. The Maps document (and its JS)
 * is attached only once the box is near the viewport or the visitor taps it,
 * so the contact page does not pay for Maps on first paint.
 */
export default function LazyGoogleMap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || active) return;

    const show = () => setActive(true);

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) show();
        },
        { rootMargin: '300px' }
      );
      observer.observe(frame);
    } else {
      show();
    }

    frame.addEventListener('pointerdown', show);
    return () => {
      observer?.disconnect();
      frame.removeEventListener('pointerdown', show);
    };
  }, [active]);

  return (
    <div
      ref={frameRef}
      className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-lg"
      style={{ height: 360 }}
    >
      {active ? (
        <iframe
          title={MAP_TITLE}
          src={MAP_SRC}
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : null}
    </div>
  );
}
