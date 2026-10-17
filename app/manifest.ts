import type { MetadataRoute } from 'next';

const description =
  'בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI לעסקים. סוכנות דיגיטל מפרדס חנה. ייעוץ חינם: 050-9159951.';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Top Webstak - בנייה וקידום אתרים',
    short_name: 'Top Webstak',
    description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    lang: 'he',
    dir: 'rtl',
    background_color: '#010A26',
    theme_color: '#03173A',
    icons: [
      {
        src: '/icon-32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
