import Link from 'next/link';
import { CITY_SERVICE_AREAS, EXTRA_SERVICE_AREA_LINKS } from '../../lib/service-areas';
import { MapPinIcon } from './icons';

type Props = {
  heading?: string;
  showBlurbs?: boolean;
  includeExtraServices?: boolean;
};

export default function ServiceAreas({
  heading = 'אזורי שירות',
  showBlurbs = false,
  includeExtraServices = false,
}: Props) {
  const cities = CITY_SERVICE_AREAS;
  const extras = includeExtraServices ? EXTRA_SERVICE_AREA_LINKS : [];

  return (
    <section className="py-16 bg-white dark:bg-gray-900" data-reveal>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">{heading}</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
          בניית אתרים לעסקים בשרון, בחוף הכרמל ובצפון — עמוד ייעודי לכל אזור.
        </p>
        <ul className={`grid gap-4 ${showBlurbs ? 'md:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {cities.map((city) => (
            <li key={city.href}>
              <Link
                href={city.href}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-right shadow-sm transition-colors hover:border-[#22DEFB] hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#02336E] text-[#22DEFB]">
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
          <p className="mt-8 text-center text-lg text-gray-700 dark:text-gray-300">
            {extras.map((item, index) => (
              <span key={item.href}>
                {index > 0 ? ' · ' : null}
                <Link href={item.href} className="font-semibold text-blue-700 underline dark:text-blue-400">
                  {item.name}
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
}
