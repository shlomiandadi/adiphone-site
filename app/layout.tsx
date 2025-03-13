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

export const metadata: Metadata = {
  title: 'עדי פון - קידום ובנית אתרים',
  description: 'שירותי קידום אתרים מקצועיים, פיתוח אתרים, שיווק דיגיטלי ועוד',
  icons: {
    icon: '/favicon.ico',
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
        <BreadcrumbSchema />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QMC63HG6SD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QMC63HG6SD');
          `}
        </Script>
      </head>
      <body className={`${heebo.className} bg-white text-gray-900 min-h-screen flex flex-col antialiased selection:bg-blue-600/10 selection:text-blue-600`}>
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
      </body>
    </html>
  );
}
