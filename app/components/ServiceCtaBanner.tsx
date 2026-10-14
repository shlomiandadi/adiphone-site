import Image from 'next/image';
import Link from 'next/link';
import { PHONE_TEL, whatsappUrl } from '../../lib/pricing';
import { getServiceCta } from '../../lib/service-cta';

type Props = {
  title?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
  whatsappText?: string;
  serviceKey?: string;
};

export default function ServiceCtaBanner({
  title,
  text,
  image,
  imageAlt = 'פרויקט מהתיק שלנו',
  whatsappText,
  serviceKey,
}: Props) {
  const fallback = getServiceCta(serviceKey);
  const heading = title || fallback.title;
  const body = text || fallback.text;
  const waText = whatsappText || fallback.whatsappText;

  return (
    <section
      data-reveal
      data-cta-location="service-page"
      className="relative overflow-hidden px-4 py-16 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(1200px 600px at 80% 20%, rgba(56, 189, 248, 0.22), transparent 55%), radial-gradient(900px 500px at 10% 80%, rgba(37, 99, 235, 0.28), transparent 50%), linear-gradient(135deg, #071433 0%, #1e3a8a 42%, #2563eb 72%, #0b1f4d 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -left-16 top-10 hidden h-48 w-48 rounded-3xl border border-white/10 bg-white/5 blur-0 md:block"
        aria-hidden="true"
        style={{ transform: 'rotateX(18deg) rotateY(-24deg)' }}
      />
      <div className="relative container mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="text-center md:text-right">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mb-8 text-lg text-white/90">{body}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link
              href="/contact#contact-form"
              data-cta="true"
              data-cta-location="service-page"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-800 shadow-lg transition-colors hover:bg-blue-50"
            >
              קבעו שיחת ייעוץ
            </Link>
            <a
              href={whatsappUrl(waText)}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="true"
              data-cta-location="service-page"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              וואטסאפ עכשיו
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="sr-only"
            >
              חייגו לייעוץ
            </a>
          </div>
        </div>
        {image ? (
          <div className="relative mx-auto w-full max-w-md">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
              style={{ transform: 'perspective(1200px) rotateY(-12deg) rotateX(6deg)' }}
            >
              <div className="relative aspect-[16/10] w-full bg-slate-900">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 420px"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
