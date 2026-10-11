import type { ReactNode } from 'react';
import type { HeroTheme } from './types';

type Props = {
  theme: HeroTheme;
  cityName?: string;
};

function FloatCard({ className, children }: { className: string; children: ReactNode }) {
  return <div className={`h3d-float ${className}`}>{children}</div>;
}

function HomeScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-laptop">
        <div className="h3d-laptop-lid">
          <div className="h3d-browser">
            <div className="h3d-chrome">
              <span />
              <span />
              <span />
              <div className="h3d-url">adi-phone.co.il</div>
            </div>
            <div className="h3d-browser-body">
              <div className="h3d-ui-hero" />
              <div className="h3d-orbit">
                <span>SEO</span>
                <span>אתרים</span>
                <span>PPC</span>
                <span>AI</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h3d-laptop-base" />
      </div>
      <div className="h3d-phone">
        <div className="h3d-phone-screen">
          <div className="h3d-phone-bar" />
          <div className="h3d-phone-block" />
          <div className="h3d-phone-block short" />
        </div>
      </div>
      <FloatCard className="h3d-float-a">בניית אתרים</FloatCard>
      <FloatCard className="h3d-float-b">קידום בגוגל</FloatCard>
      <FloatCard className="h3d-float-c">מנועי AI</FloatCard>
    </>
  );
}

function WebDevScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-laptop">
        <div className="h3d-laptop-lid">
          <div className="h3d-browser">
            <div className="h3d-chrome">
              <span />
              <span />
              <span />
              <div className="h3d-url">adi-phone.co.il</div>
            </div>
            <div className="h3d-browser-body">
              <div className="h3d-ui-hero" />
              <div className="h3d-ui-row">
                <div className="h3d-ui-card" />
                <div className="h3d-ui-card" />
                <div className="h3d-ui-card" />
              </div>
            </div>
          </div>
        </div>
        <div className="h3d-laptop-base" />
      </div>
      <div className="h3d-phone">
        <div className="h3d-phone-screen">
          <div className="h3d-phone-bar" />
          <div className="h3d-phone-block" />
          <div className="h3d-phone-block short" />
        </div>
      </div>
      <FloatCard className="h3d-float-a">אתר תדמית</FloatCard>
      <FloatCard className="h3d-float-b">דף נחיתה</FloatCard>
      <FloatCard className="h3d-float-c">חנות</FloatCard>
    </>
  );
}

function SeoScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-panel h3d-search-panel">
        <div className="h3d-search-bar">top webstak</div>
        <div className="h3d-serp">
          <div className="h3d-serp-item rise-1">
            <b>Top Webstak</b>
            <i>adi-phone.co.il</i>
          </div>
          <div className="h3d-serp-item rise-2">
            <b>בניית אתרים</b>
            <i>adi-phone.co.il/services</i>
          </div>
          <div className="h3d-serp-item rise-3">
            <b>קידום אתרים</b>
            <i>adi-phone.co.il/seo</i>
          </div>
        </div>
      </div>
      <div className="h3d-chart">
        <span className="bar b1" />
        <span className="bar b2" />
        <span className="bar b3" />
        <span className="bar b4" />
      </div>
      <FloatCard className="h3d-float-a">אורגני</FloatCard>
      <FloatCard className="h3d-float-b">Search Console</FloatCard>
    </>
  );
}

function PpcScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-ad-card ad-1">
        <em>מודעה</em>
        <b>Google Ads</b>
        <span>קליק → דף נחיתה</span>
      </div>
      <div className="h3d-ad-card ad-2">
        <em>מודעה</em>
        <b>Meta Ads</b>
        <span>קהל ממוקד</span>
      </div>
      <div className="h3d-funnel">
        <i />
        <i />
        <i />
      </div>
      <FloatCard className="h3d-float-a">קליק</FloatCard>
      <FloatCard className="h3d-float-c">פנייה</FloatCard>
    </>
  );
}

function AeoScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-chat chat-q">איפה בונים אתר לעסק מקומי?</div>
      <div className="h3d-chat chat-a">
        לפי adi-phone.co.il, Top Webstak בונה אתרים מפרדס חנה.
      </div>
      <div className="h3d-chat chat-cite">מקור: adi-phone.co.il</div>
      <FloatCard className="h3d-float-a">AEO</FloatCard>
      <FloatCard className="h3d-float-b">GEO</FloatCard>
    </>
  );
}

function EcommerceScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-product p1">
        <div className="swatch" />
        <b>מוצר</b>
      </div>
      <div className="h3d-product p2">
        <div className="swatch alt" />
        <b>מוצר</b>
      </div>
      <div className="h3d-cart">
        <div className="h3d-cart-body" />
        <div className="h3d-cart-handle" />
      </div>
      <FloatCard className="h3d-float-a">סליקה</FloatCard>
      <FloatCard className="h3d-float-c">עגלה</FloatCard>
    </>
  );
}

function WordpressScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-panel h3d-wp-panel">
        <div className="h3d-wp-bar">WordPress</div>
        <div className="h3d-wp-grid">
          <span>עמודים</span>
          <span>תוספים</span>
          <span>עיצוב</span>
          <span>חנות</span>
        </div>
      </div>
      <FloatCard className="h3d-float-a">CMS</FloatCard>
      <FloatCard className="h3d-float-b">Woo</FloatCard>
    </>
  );
}

function UiScene() {
  return (
    <>
      <div className="h3d-frame f1" />
      <div className="h3d-frame f2" />
      <div className="h3d-frame f3">
        <div className="h3d-ui-hero" />
        <div className="h3d-ui-row">
          <div className="h3d-ui-card" />
          <div className="h3d-ui-card" />
        </div>
      </div>
      <FloatCard className="h3d-float-a">UI</FloatCard>
      <FloatCard className="h3d-float-b">UX</FloatCard>
    </>
  );
}

function AppsScene() {
  return (
    <>
      <div className="h3d-phone phone-a">
        <div className="h3d-phone-screen">
          <div className="h3d-phone-bar" />
          <div className="h3d-phone-block" />
          <div className="h3d-phone-block short" />
        </div>
      </div>
      <div className="h3d-phone phone-b">
        <div className="h3d-phone-screen">
          <div className="h3d-phone-bar" />
          <div className="h3d-app-icons">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <FloatCard className="h3d-float-a">iOS</FloatCard>
      <FloatCard className="h3d-float-c">Android</FloatCard>
    </>
  );
}

function SoftwareScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-code">
        <div className="h3d-chrome">
          <span />
          <span />
          <span />
          <div className="h3d-url">app.ts</div>
        </div>
        <pre>
          {`function build() {\n  ship();\n}`}
        </pre>
      </div>
      <div className="h3d-window">
        <b>Dashboard</b>
        <div className="h3d-ui-row">
          <div className="h3d-ui-card" />
          <div className="h3d-ui-card" />
        </div>
      </div>
      <FloatCard className="h3d-float-b">API</FloatCard>
    </>
  );
}

function AiScene() {
  return (
    <>
      <div className="h3d-neural">
        <i className="n1" />
        <i className="n2" />
        <i className="n3" />
        <i className="n4" />
        <i className="n5" />
        <i className="n6" />
      </div>
      <FloatCard className="h3d-float-a">מודל</FloatCard>
      <FloatCard className="h3d-float-c">אוטומציה</FloatCard>
    </>
  );
}

function AnalyticsScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-chart tall">
        <span className="bar b1" />
        <span className="bar b2" />
        <span className="bar b3" />
        <span className="bar b4" />
        <span className="bar b5" />
      </div>
      <div className="h3d-donut" />
      <FloatCard className="h3d-float-a">GA4</FloatCard>
      <FloatCard className="h3d-float-b">המרות</FloatCard>
    </>
  );
}

function CloudScene() {
  return (
    <>
      <div className="h3d-cloud c1" />
      <div className="h3d-cloud c2" />
      <div className="h3d-server s1">
        <i />
        <i />
        <i />
      </div>
      <div className="h3d-server s2">
        <i />
        <i />
      </div>
      <FloatCard className="h3d-float-a">CDN</FloatCard>
      <FloatCard className="h3d-float-c">גיבוי</FloatCard>
    </>
  );
}

function LocalScene({ cityName }: { cityName?: string }) {
  return (
    <>
      <div className="h3d-map">
        <div className="h3d-pin" />
        <div className="h3d-city-card">{cityName || 'העיר'}</div>
      </div>
      <FloatCard className="h3d-float-a">מפה</FloatCard>
      <FloatCard className="h3d-float-c">עסק מקומי</FloatCard>
    </>
  );
}

function PricingScene() {
  return (
    <>
      <div className="h3d-price-card pc1">
        <b>דף נחיתה</b>
        <span>מ-2,500 ₪</span>
      </div>
      <div className="h3d-price-card pc2">
        <b>אתר תדמית</b>
        <span>מ-6,500 ₪</span>
      </div>
      <div className="h3d-price-card pc3">
        <b>חנות</b>
        <span>מ-12,000 ₪</span>
      </div>
    </>
  );
}

function AboutScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-about-card ac1">עדי פון</div>
      <div className="h3d-about-card ac2">שלומי</div>
      <FloatCard className="h3d-float-b">פרדס חנה</FloatCard>
    </>
  );
}

function ContactScene() {
  return (
    <>
      <div className="h3d-back-card" />
      <div className="h3d-mail">
        <div className="flap" />
        <div className="body" />
      </div>
      <div className="h3d-chat chat-q">שלום, אפשר הצעת מחיר?</div>
      <FloatCard className="h3d-float-a">050-9159951</FloatCard>
    </>
  );
}

function PortfolioScene() {
  return (
    <>
      <div className="h3d-frame f1" />
      <div className="h3d-frame f2" />
      <div className="h3d-frame f3" />
      <FloatCard className="h3d-float-a">תיק עבודות</FloatCard>
    </>
  );
}

function BlogScene() {
  return (
    <>
      <div className="h3d-article a1">
        <i />
        <b>מדריך SEO</b>
      </div>
      <div className="h3d-article a2">
        <i />
        <b>AEO / GEO</b>
      </div>
      <FloatCard className="h3d-float-c">בלוג</FloatCard>
    </>
  );
}

function ServicesScene() {
  return (
    <>
      <div className="h3d-orbit big">
        <span>SEO</span>
        <span>אתרים</span>
        <span>PPC</span>
        <span>AI</span>
        <span>חנות</span>
        <span>ענן</span>
      </div>
      <FloatCard className="h3d-float-b">השירותים</FloatCard>
    </>
  );
}

export default function Hero3DScene({ theme, cityName }: Props) {
  switch (theme) {
    case 'home':
      return <HomeScene />;
    case 'web-development':
      return <WebDevScene />;
    case 'seo':
      return <SeoScene />;
    case 'ppc':
      return <PpcScene />;
    case 'aeo-geo':
      return <AeoScene />;
    case 'ecommerce':
      return <EcommerceScene />;
    case 'wordpress':
      return <WordpressScene />;
    case 'ui-design':
      return <UiScene />;
    case 'apps':
      return <AppsScene />;
    case 'software':
      return <SoftwareScene />;
    case 'ai':
      return <AiScene />;
    case 'analytics':
      return <AnalyticsScene />;
    case 'cloud':
      return <CloudScene />;
    case 'local':
      return <LocalScene cityName={cityName} />;
    case 'pricing':
      return <PricingScene />;
    case 'about':
      return <AboutScene />;
    case 'contact':
      return <ContactScene />;
    case 'portfolio':
      return <PortfolioScene />;
    case 'blog':
      return <BlogScene />;
    case 'services':
      return <ServicesScene />;
    default:
      return <HomeScene />;
  }
}
