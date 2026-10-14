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
import AccessibilityBar from './components/AccessibilityBar';
import Script from 'next/script';
import CookieConsent from './components/CookieConsent';
import ChatbotWidget from './components/ChatbotWidget';
import AnalyticsTracker from './components/AnalyticsTracker';
import TopStrip from './components/TopStrip';
import { FALLBACK_LAYOUT_CMS, getLayoutCms } from '../lib/cms/layoutData';
import { GTM_CONTAINER_ID } from '../lib/cms/siteSettings';
import { GA4_MEASUREMENT_ID } from '../lib/tracking';

const heebo = Heebo({ 
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-heebo',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://adi-phone.co.il';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Top Webstak - בנייה וקידום אתרים מקצועיים | עדי פון תקשורת',
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
  const gtmId = cms.tracking.gtm || GTM_CONTAINER_ID;
  const pixelId = cms.tracking.pixel;

  return (
    <html lang="he" dir="rtl" className={`scroll-smooth ${heebo.variable}`}>
      <head>
        {/* Default deny until consent. This prevents accidental data collection before consent */}
        <Script id="gtag-default-consent" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'functionality_storage': 'denied',
              'security_storage': 'granted'
            });
          `}
        </Script>
        <BreadcrumbSchema />
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
        {/* End Google Tag Manager */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            if (!window.__TW_GA4_CONFIGURED) {
              window.__TW_GA4_CONFIGURED = true;
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                send_page_view: true,
                anonymize_ip: true,
                allow_google_signals: true,
                allow_ad_personalization_signals: false
              });
            }
          `}
        </Script>
        {pixelId ? (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        ) : null}
      </head>
      <body className={`${heebo.className} bg-white text-gray-900 min-h-screen flex flex-col antialiased selection:bg-blue-600/10 selection:text-blue-600`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <a href="#main-content" className="skip-to-main">
          דלג לתוכן הראשי
        </a>
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
            <Breadcrumbs cmsByPath={cms.breadcrumbs} />
          </div>
        </PageOffset>
        <main id="main-content" className="flex-grow w-full">
          {children}
        </main>
        <Footer cmsFooter={cms.footer} siteSettings={cms.siteSettings} />
        <FloatingButtons />
        <AccessibilityBar />
        <CookieConsent />
        <AnalyticsTracker />
        <ChatbotWidget />
      </body>
    </html>
  );
}
