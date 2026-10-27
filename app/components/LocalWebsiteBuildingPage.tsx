import Link from 'next/link';
import { getSiteUrl, organizationLogo } from '../../lib/seo';
import { buildLocalBusinessJsonLd } from '../../lib/local-business-schema';
import { getPublishedPortfolioProjects } from '../../lib/website-projects';
import { getServiceCta } from '../../lib/service-cta';
import Hero3D from './hero3d/Hero3D';
import ServiceCtaBanner from './ServiceCtaBanner';
import {
  LOCAL_WEBSITE_PAGES,
  PHONE_DISPLAY,
  PHONE_TEL,
  PROVIDER_EMAIL,
  PROVIDER_LOCALITY,
  PROVIDER_NAME,
  PROVIDER_STREET,
  type LocalCityContent,
} from '../../lib/local-website-building';

type Props = {
  content: LocalCityContent;
};

export default async function LocalWebsiteBuildingPage({ content }: Props) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${content.path}`;
  const h1 = `בניית אתרים ב${content.cityName}`;
  const localCta = getServiceCta('local');
  const projects = await getPublishedPortfolioProjects('websites', 1);
  const projectImage = projects.find((project) => project.image && !project.image.endsWith('.svg'))?.image;
  const localBusinessSchema = buildLocalBusinessJsonLd({
    url: pageUrl,
    extraAreaServed: content.areaServed,
  });

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'בניית אתרים',
    name: content.serviceName,
    url: pageUrl,
    areaServed: content.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    provider: {
      '@type': 'ProfessionalService',
      name: PROVIDER_NAME,
      telephone: '+972-50-9159951',
      email: PROVIDER_EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: PROVIDER_STREET,
        addressLocality: PROVIDER_LOCALITY,
        addressCountry: 'IL',
      },
      url: siteUrl,
      logo: organizationLogo(siteUrl),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl" data-cta-location="service-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <Hero3D
        theme="local"
        title={h1}
        subtitle={content.heroLead}
        cityName={content.cityName}
        align="center"
        ctas={[
          { href: `tel:${PHONE_TEL}`, label: `חייגו עכשיו: ${PHONE_DISPLAY}` },
          { href: '/contact', label: 'לקבלת הצעת מחיר', variant: 'secondary' },
          { href: '/pricing', label: 'למחירון בניית אתרים', variant: 'secondary' },
        ]}
      />

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">{content.introTitle}</h2>
          {content.introParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mb-4 text-lg leading-relaxed text-gray-700">
              {paragraph}
            </p>
          ))}
          <p className="text-lg leading-relaxed text-gray-700">
            בין אם אתם צריכים{' '}
            <Link href="/services/website-tadmit" className="text-blue-700 underline">
              אתרי תדמית לעסקים
            </Link>
            ,{' '}
            <Link href="/services/ecommerce" className="text-blue-700 underline">
              חנות אונליין
            </Link>{' '}
            או{' '}
            <Link href="/services/wordpress" className="text-blue-700 underline">
              אתר וורדפרס
            </Link>
            , נבנה לכם נכס דיגיטלי שעובד בשבילכם. מחירי פתיחה שקופים ב
            <Link href="/pricing" className="text-blue-700 underline">
              מחירון בניית אתרים
            </Link>
            .
          </p>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">{content.localContextTitle}</h2>
          {content.localContextParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mb-4 text-lg leading-relaxed text-gray-700 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {content.typicalBusinessesTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.typicalBusinesses.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {content.includedTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.included.map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-right">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">{content.servingTitle}</h2>
          {content.servingParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mb-4 text-lg leading-relaxed text-gray-700 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section data-reveal className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">תהליך העבודה על בניית אתר ב{content.cityName}</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {content.process.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">בניית אתרים לפי אזור</h2>
          <p className="mb-6 text-lg text-gray-700">{content.areasIntro}</p>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {LOCAL_WEBSITE_PAGES.map((city) =>
              city.path === content.path ? (
                <span
                  key={city.path}
                  className="rounded-full bg-blue-700 px-4 py-2 font-semibold text-white shadow-sm"
                >
                  {city.name}
                </span>
              ) : (
                <Link
                  key={city.path}
                  href={city.path}
                  className="rounded-full bg-white px-4 py-2 text-blue-700 shadow-sm ring-1 ring-blue-100 transition-colors hover:bg-blue-50"
                >
                  בניית אתרים ב{city.name}
                </Link>
              )
            )}
          </div>
          {content.nearbyTowns.length > 0 && (
            <>
              <p className="mb-4 text-base text-gray-600">יישובים נוספים באזור השירות:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {content.nearbyTowns.map((town) => (
                  <span key={town} className="rounded-full bg-gray-50 px-4 py-2 text-gray-800 shadow-sm">
                    {town}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {content.extraSection && (
        <section data-reveal className="bg-blue-50 px-4 py-16">
          <div className="container mx-auto max-w-3xl text-right">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{content.extraSection.title}</h2>
            {content.extraSection.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mb-4 text-lg leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}
            <ul className="space-y-2">
              {content.extraSection.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-lg font-semibold text-blue-700 underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section data-reveal className="px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">שאלות נפוצות</h2>
          <div className="space-y-4">
            {content.faq.map((item) => (
              <div key={item.question} className="rounded-xl border border-gray-100 p-6 text-right shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-lg text-gray-700">
            למחירי פתיחה לדף נחיתה, אתר תדמית, חנות ומערכת:{' '}
            <Link href="/pricing" className="font-semibold text-blue-700 underline">
              מחירון בניית אתרים
            </Link>
            .{' '}
            לעמוד הארצי:{' '}
            <Link href="/services/web-development" className="font-semibold text-blue-700 underline">
              בניית אתרים
            </Link>
            {' '}ולעמוד{' '}
            <Link href="/services/website-tadmit" className="font-semibold text-blue-700 underline">
              בניית אתר תדמית
            </Link>
            .
          </p>
        </div>
      </section>

      <ServiceCtaBanner
        serviceKey="local"
        title={content.ctaTitle || localCta.title}
        text={`${content.ctaText} שיחת ייעוץ של 15 דקות – בחינם.`}
        whatsappText={`שלום, אשמח לקבוע שיחת ייעוץ לבניית אתר ב${content.cityName}.`}
        image={projectImage}
        imageAlt={`פרויקט אתר לעסק באזור ${content.cityName}`}
      />
    </div>
  );
}
