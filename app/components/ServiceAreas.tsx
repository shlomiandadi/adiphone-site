import Link from 'next/link';
import { CITY_SERVICE_AREAS, EXTRA_SERVICE_AREA_LINKS } from '../../lib/service-areas';
import {
  SERVICE_AREA_CARD_CLASS,
  SERVICE_AREA_ICON_CLASS,
  SERVICE_AREA_PILL_CLASS,
} from '../../lib/service-area-card-styles';
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
              <Link href={city.href} className={`${SERVICE_AREA_CARD_CLASS} ${showBlurbs ? 'items-start' : 'items-center'}`}>
                <span className={`${SERVICE_AREA_ICON_CLASS} ${showBlurbs ? 'mt-0.5' : ''}`}>
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
                  className={SERVICE_AREA_PILL_CLASS}
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
