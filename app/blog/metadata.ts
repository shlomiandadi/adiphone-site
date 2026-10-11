import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'בלוג | Top Webstak - טיפים ומדריכים לבניית אתרים וקידום',
  description: 'בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי. למד על בניית אתרים, קידום בגוגל, עיצוב UX/UI ועוד.',
  keywords: 'בלוג, בניית אתרים, קידום אתרים, SEO, עיצוב אתרים, UX/UI, דיגיטל, Top Webstak',
  authors: [{ name: 'Top Webstak Team' }],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'בלוג | Top Webstak - טיפים ומדריכים לבניית אתרים וקידום',
    description: 'בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי. למד על בניית אתרים, קידום בגוגל, עיצוב UX/UI ועוד.',
    type: 'website',
    url: 'https://adi-phone.co.il/blog',
    images: [
      {
        url: 'https://res.cloudinary.com/dooxg35gj/image/upload/v1753685361/build_website_es36dq.png',
        width: 1200,
        height: 630,
        alt: 'בלוג Top Webstak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'בלוג | Top Webstak - טיפים ומדריכים לבניית אתרים וקידום',
    description: 'בלוג מקצועי עם טיפים, מדריכים ועדכונים מהעולם הדיגיטלי',
    images: ['https://res.cloudinary.com/dooxg35gj/image/upload/v1753685361/build_website_es36dq.png'],
  },
}; 