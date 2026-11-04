import Link from 'next/link';
import { SERVICE_AREA_CARD_CLASS, SERVICE_AREA_ICON_CLASS } from '../../lib/service-area-card-styles';
import {
  WEB_DEV_NICHE_HUB_CARDS,
  WEB_DEV_NICHE_HUB_HEADING,
  WEB_DEV_NICHE_HUB_SUBTITLE,
} from '../../lib/web-dev-niche-hub';
import { BriefcaseIcon, CalculatorIcon, ClinicIcon } from './icons';

const ICONS = {
  briefcase: BriefcaseIcon,
  clinic: ClinicIcon,
  calculator: CalculatorIcon,
} as const;

export default function WebDevNicheHub() {
  return (
    <section className="bg-white py-16 pb-32 dark:bg-gray-900 md:pb-16" data-reveal aria-labelledby="web-dev-niche-hub-heading">
      <div className="container mx-auto px-4">
        <h2 id="web-dev-niche-hub-heading" className="mb-4 text-center text-3xl font-bold dark:text-white">
          {WEB_DEV_NICHE_HUB_HEADING}
        </h2>
        <p className="mb-10 text-center text-gray-600 dark:text-gray-300">{WEB_DEV_NICHE_HUB_SUBTITLE}</p>
        <ul className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {WEB_DEV_NICHE_HUB_CARDS.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <li key={card.href} className="min-w-0">
                <Link href={card.href} className={`${SERVICE_AREA_CARD_CLASS} items-start`}>
                  <span className={`${SERVICE_AREA_ICON_CLASS} mt-0.5`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-blue-700 underline dark:text-blue-400">{card.name}</span>
                    <span className="mt-2 block text-sm text-gray-600 dark:text-gray-300">{card.benefit}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}