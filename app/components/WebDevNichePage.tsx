import Link from 'next/link';
import { PHONE_DISPLAY, PHONE_TEL } from '../../lib/local-website-building';
import { LEGAL_TRADE_NAME, buildNicheJsonLd, type WebDevNicheContent } from '../../lib/web-dev-niches';
import NicheHero from './niche-hero/NicheHero';
import ServiceCtaBanner from './ServiceCtaBanner';

type Props = {
  content: WebDevNicheContent;
};

export default function WebDevNichePage({ content }: Props) {
  const schema = buildNicheJsonLd(content);
  const cityLinks = content.relatedLinks.filter((link) => link.href.startsWith('/services/bniyat-atarim-'));
  const otherLinks = content.relatedLinks.filter((link) => !link.href.startsWith('/services/bniyat-atarim-'));

  return (
    <div className="min-h-screen bg-white text-base leading-relaxed text-gray-800" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <NicheHero
        theme={content.theme}
        title={content.h1}
        subtitle={content.subtitle}
        eyebrow={content.eyebrow}
        ctas={[
          { href: '/contact#contact-form', label: 'שיחת אפיון' },
          { href: `tel:${PHONE_TEL}`, label: `חייגו ${PHONE_DISPLAY}`, variant: 'secondary' },
        ]}
      />

      <main>
        <section className="px-4 py-16" aria-labelledby="niche-intro">
          <div className="container mx-auto max-w-3xl">
            <h2 id="niche-intro" className="mb-6 text-3xl font-bold text-gray-900">
              למי מיועד העמוד
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              {content.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-16" aria-labelledby="niche-problems">
          <div className="container mx-auto max-w-5xl">
            <h2 id="niche-problems" className="mb-10 text-center text-3xl font-bold text-gray-900">
              {content.problemsTitle}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {content.problems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16" aria-labelledby="niche-build">
          <div className="container mx-auto max-w-5xl">
            <h2 id="niche-build" className="mb-10 text-center text-3xl font-bold text-gray-900">
              {content.buildTitle}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {content.buildItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {content.extraSections.map((section, index) => (
          <section
            key={section.title}
            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} px-4 py-16`}
            aria-labelledby={`niche-extra-${index}`}
          >
            <div className="container mx-auto max-w-3xl">
              <h2 id={`niche-extra-${index}`} className="mb-6 text-3xl font-bold text-gray-900">
                {section.title}
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              {section.list ? (
                <ul className="mt-6 list-disc space-y-2 pr-6 text-lg text-gray-700">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}

        <section className="px-4 py-16" aria-labelledby="niche-process">
          <div className="container mx-auto max-w-5xl">
            <h2 id="niche-process" className="mb-10 text-center text-3xl font-bold text-gray-900">
              {content.processTitle}
            </h2>
            <ol className="grid gap-6 md:grid-cols-4">
              {content.process.map((step, index) => (
                <li key={step.title} className="rounded-2xl bg-gray-50 p-6 text-center shadow-sm">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-16" aria-labelledby="niche-trust">
          <div className="container mx-auto max-w-3xl">
            <h2 id="niche-trust" className="mb-6 text-3xl font-bold text-gray-900">
              {content.trustTitle}
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              {content.trustParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16" aria-labelledby="niche-local-seo">
          <div className="container mx-auto max-w-3xl">
            <h2 id="niche-local-seo" className="mb-6 text-3xl font-bold text-gray-900">
              {content.localSeoTitle}
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              {content.localSeoParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            {cityLinks.length ? (
              <p className="mt-6 text-lg text-gray-700">
                אזורי שירות שכבר יש להם עמוד באתר:{' '}
                {cityLinks.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 ? (index === cityLinks.length - 1 ? ' ו' : ', ') : null}
                    <Link href={link.href} className="font-semibold text-blue-700 underline underline-offset-2">
                      {link.label}
                    </Link>
                  </span>
                ))}
                .
              </p>
            ) : null}
          </div>
        </section>

        <section className="bg-gray-50 px-4 py-16" aria-labelledby="niche-faq">
          <div className="container mx-auto max-w-3xl">
            <h2 id="niche-faq" className="mb-10 text-center text-3xl font-bold text-gray-900">
              שאלות נפוצות
            </h2>
            <div className="space-y-4">
              {content.faq.map((item) => (
                <article key={item.question} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <nav className="px-4 pb-8" aria-label="קישורים פנימיים">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-gray-600">
              {otherLinks.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? ' · ' : null}
                  <Link href={link.href} className="text-blue-700 underline underline-offset-2">
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
            <p className="mt-6 text-sm text-gray-500">{LEGAL_TRADE_NAME}</p>
          </div>
        </nav>
      </main>

      <ServiceCtaBanner
        title={content.ctaTitle}
        text={content.ctaText}
        whatsappText={content.whatsappText}
        serviceKey="web-development"
      />
    </div>
  );
}
