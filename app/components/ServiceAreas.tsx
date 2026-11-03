import Link from 'next/link';
import { CITY_SERVICE_AREAS, EXTRA_SERVICE_AREA_LINKS } from '../../lib/service-areas';
import { MapPinIcon } from './icons';

type Props = {
  heading?: string;
  showBlurbs?: boolean;
  includeExtraServices?: boolean;
};

const cardClassName =
  'flex h-full min-h-[44px] items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-right shadow-sm transition-colors hover:border-[#22DEFB] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-900';

const iconClassName =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#02336E] text-[#22DEFB]';

export default function ServiceAreas({
  heading = 'אזורי שירות',
  showBlurbs = false,
  includeExtraServices = false,
}: Props) {
  const extras = includeExtraServices ? EXTRA_SERVICE_AREA_LINKS : [];

  return (
    <section className="bg-white py-16 dark:bg-gray-900" data-reveal>
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold dark:text-white">{heading}</h2>
        <p className="mb-10 text-center text-gray-600 dark:text-gray-300">
          בניית אתרים לעסקים בשרון, בחוף הכרמל ובצפון — עמוד ייעודי לכל אזור.
        </p>
        <ul className="grid grid-cols-2 items-stretch gap-4 lg:grid-cols-5">
          {CITY_SERVICE_AREAS.map((city) => (
            <li key={city.href} className="min-w-0">
              <Link href={city.href} className={`${cardClassName} ${showBlurbs ? 'items-start' : 'items-center'}`}>
                <span className={`${iconClassName} ${showBlurbs ? 'mt-0.5' : ''}`}>
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold text-blue-700 underline dark:text-blue-400">{city.name}</span>
                  {showBlurbs ? (
                    <span className="mt-2 block text-sm text-gray-600 dark:text-gray-300">{city.blurb}</span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {extras.length > 0 ? (
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {extras.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-gray-100 bg-gray-50 px-4 text-sm font-semibold text-blue-700 underline transition-colors hover:border-[#22DEFB] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-900"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
