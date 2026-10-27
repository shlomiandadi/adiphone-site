import './globals.css';
import './components/hero3d/hero3d.css';
import type { Metadata, Viewport } from 'next';
import { Heebo } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import PageOffset from './components/PageOffset';
import WowEffects from './components/WowEffects';
import BreadcrumbSchema from './components/BreadcrumbSchema';
import FloatingButtons from './components/FloatingButtons';
import CookieConsent from './components/CookieConsent';
import DeferredTags from './components/DeferredTags';
import {
  DeferredAccessibilityBar,
  DeferredAnalyticsTracker,
  DeferredChatbotWidget,
} from './components/DeferredWidgets';
import TopStrip from './components/TopStrip';
import { FALLBACK_LAYOUT_CMS, getLayoutCms } from '../lib/cms/layoutData';
import { META_PIXEL_ID } from '../lib/thirdPartyTags';
import { GA4_MEASUREMENT_ID } from '../lib/tracking';

const heebo = Heebo({ 
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
  variable: '--font-heebo',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03173A',
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'בניית וקידום אתרים בפרדס חנה-כרכור | Top Webstak – עדי פון',
    template: '%s | Top Webstak',
  },
  description: 'בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI לעסקים. סוכנות דיגיטל מפרדס חנה. ייעוץ חינם: 050-9159951.',
  keywords: 'פיתוח אתרים, בניית אתרים, קידום אתרים, SEO, בניית חנויות, אפליקציות, שיווק דיגיטלי, Top Webstak, עדי פון תקשורת',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
    url: baseUrl,
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Top Webstak – בניית וקידום אתרים, מבית עדי פון תקשורת',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/og-default.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let cms = FALLBACK_LAYOUT_CMS;
  try {
    cms = await getLayoutCms();
  } catch (error) {
    console.warn('Root layout CMS fallback (DB unavailable):', error);
  }
  const gaId = cms.tracking.ga || GA4_MEASUREMENT_ID;
  const pixelId = cms.tracking.pixel || META_PIXEL_ID;

  return (
    <html lang="he" dir="rtl" className={`scroll-smooth ${heebo.variable}`}>
      <head>
        <script
          id="consent-bootstrap"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(document.cookie.indexOf('cookie_consent_v1=')!==-1){document.documentElement.classList.add('has-consent');}}catch(e){}})();window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','functionality_storage':'denied','security_storage':'granted'});`,
          }}
        />
        <BreadcrumbSchema />
      </head>
      <body className={`${heebo.className} bg-white text-gray-900 min-h-screen flex flex-col antialiased selection:bg-blue-600/10 selection:text-blue-600`}>
        <script
          id="a11y-restore"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var fs=localStorage.getItem('accessibility-fontSize');if(fs)document.documentElement.style.fontSize=fs+'px';var b=document.body;if(!b)return;if(localStorage.getItem('accessibility-highContrast')==='true')b.classList.add('high-contrast');if(localStorage.getItem('accessibility-highlightLinks')==='true')b.classList.add('highlight-links');var c=localStorage.getItem('accessibility-cursorSize');if(c)b.classList.add('cursor-'+c);}catch(e){}})();`,
          }}
        />
        <a href="#main-content" className="skip-to-main">
          דלג לתוכן הראשי
        </a>
        <CookieConsent />
        {cms.topStrip ? (
          <TopStrip
            text={cms.topStrip.text}
            backgroundColor={cms.topStrip.backgroundColor}
            textColor={cms.topStrip.textColor}
            linkUrl={cms.topStrip.linkUrl}
            linkText={cms.topStrip.linkText}
          />
        ) : null}
        <Header items={cms.headerMenu} />
        <WowEffects />
        <PageOffset>
          <div className="container mx-auto px-4">
            <Breadcrumbs />
          </div>
        </PageOffset>
        <main id="main-content" className="flex-grow w-full">
          {children}
        </main>
        <Footer cmsFooter={cms.footer} />
        <FloatingButtons />
        <DeferredAccessibilityBar />
        <DeferredTags gaId={gaId} pixelId={pixelId} />
        <DeferredAnalyticsTracker />
        <DeferredChatbotWidget />
      </body>
    </html>
  );
}
