import type { Metadata } from 'next';
import { absoluteUrl } from '../../../lib/seo';
import {
  ARTICLE_DESCRIPTION,
  ARTICLE_IMAGE_PATH,
  ARTICLE_OG_DESCRIPTION,
  ARTICLE_OG_TITLE,
  ARTICLE_PATH,
} from './article';

const imageUrl = absoluteUrl(ARTICLE_IMAGE_PATH);
const image = {
  url: imageUrl,
  width: 1200,
  height: 630,
  alt: ARTICLE_OG_TITLE,
};

export const metadata: Metadata = {
  title: { absolute: 'כמה עולה בניית אתר ב-2026? טווחי מחירים | Top Webstak' },
  description: ARTICLE_DESCRIPTION,
  keywords: 'כמה עולה בניית אתר, מחיר בניית אתר 2026, מחירון אתרים, אתר תדמית מחיר, דף נחיתה מחיר',
  alternates: {
    canonical: ARTICLE_PATH,
  },
  openGraph: {
    title: ARTICLE_OG_TITLE,
    description: ARTICLE_OG_DESCRIPTION,
    url: absoluteUrl(ARTICLE_PATH),
    type: 'article',
    locale: 'he_IL',
    siteName: 'Top Webstak',
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title: ARTICLE_OG_TITLE,
    description: ARTICLE_OG_DESCRIPTION,
    images: [imageUrl],
  },
};
