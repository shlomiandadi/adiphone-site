import './globals.css';
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
  icons: {
    icon: '/favicon.ico',
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            })(window,document,'script','dataLayer','GTM-NHQ4DRWX');
          `}
        </Script>
        {/* End Google Tag Manager */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QMC63HG6SD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            if (!window.__TW_GA4_CONFIGURED) {
              window.__TW_GA4_CONFIGURED = true;
              gtag('js', new Date());
              gtag('config', 'G-QMC63HG6SD', {
                send_page_view: true,
                anonymize_ip: true,
                allow_google_signals: true,
                allow_ad_personalization_signals: false
              });
            }
          `}
        </Script>
      </head>
      <body className={`${heebo.className} bg-white text-gray-900 min-h-screen flex flex-col antialiased selection:bg-blue-600/10 selection:text-blue-600`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-NHQ4DRWX"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <a href="#main-content" className="skip-to-main">
          דלג לתוכן הראשי
        </a>
        <Header />
        <WowEffects />
        <PageOffset>
          <div className="container mx-auto px-4">
            <Breadcrumbs />
          </div>
        </PageOffset>
        <main id="main-content" className="flex-grow w-full">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <AccessibilityBar />
        <CookieConsent />
        <AnalyticsTracker />
        <ChatbotWidget />
      </body>
    </html>
  );
}
