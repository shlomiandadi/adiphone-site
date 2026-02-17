import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Heebo } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import BreadcrumbSchema from './components/BreadcrumbSchema';
import FloatingButtons from './components/FloatingButtons';
import AccessibilityBar from './components/AccessibilityBar';
import Script from 'next/script';
import CookieConsent from './components/CookieConsent';
import ChatbotWidget from './components/ChatbotWidget';

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
  description: 'Top Webstak - פתרונות דיגיטליים מקצועיים לעסקים: פיתוח אתרים, קידום SEO, בניית חנויות אונליין, פיתוח אפליקציות, עיצוב UI/UX ושיווק דיגיטלי. צוות מומחים עם ניסיון של למעלה מ-15 שנה.',
  keywords: 'פיתוח אתרים, בניית אתרים, קידום אתרים, SEO, בניית חנויות, אפליקציות, שיווק דיגיטלי, Top Webstak, עדי פון תקשורת',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'Top Webstak',
    url: baseUrl,
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
            gtag('js', new Date());

            // Defer GA collection until consent given (analytics_storage = granted)
            gtag('config', 'G-QMC63HG6SD', { 'allow_ad_personalization_signals': false, 'anonymize_ip': true });
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
        <div className="pt-[6rem] md:pt-[7rem] bg-gray-50">
          <div className="container mx-auto px-4">
            <Breadcrumbs />
          </div>
        </div>
        <main id="main-content" className="flex-grow w-full">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <AccessibilityBar />
        <CookieConsent />
        <ChatbotWidget />
      </body>
    </html>
  );
}
