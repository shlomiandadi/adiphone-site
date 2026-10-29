import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import {
  footerCopyrightLine,
  HARDCODED_FOOTER,
  withRequiredSocialLinks,
  withServiceAreaColumn,
  type FooterLinkView,
  type FooterView,
} from '../../lib/cms/footerData';
import BrandLogo from './BrandLogo';
import BusinessDetails from './BusinessDetails';

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'פייסבוק',
  instagram: 'אינסטגרם',
  linkedin: 'לינקדאין',
  x: 'איקס',
  whatsapp: 'וואטסאפ',
};

function SocialSvg({ name }: { name: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
  } as const;

  if (name === 'facebook') {
    return (
      <svg {...common}>
        <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.84c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.74-1.55 1.49v1.79h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z" />
      </svg>
    );
  }
  if (name === 'instagram') {
    return (
      <svg {...common}>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  if (name === 'linkedin') {
    return (
      <svg {...common}>
        <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6a2.5 2.5 0 0 1 2.48-2.5zM3 8.75h3.96V21H3zM9.34 8.75H13.1v1.67h.05c.52-.99 1.8-2.03 3.71-2.03 3.97 0 4.7 2.61 4.7 6.01V21H17.6v-5.45c0-1.3-.02-2.97-1.81-2.97-1.81 0-2.09 1.41-2.09 2.87V21H9.34z" />
      </svg>
    );
  }
  if (name === 'x') {
    return (
      <svg {...common}>
        <path d="M17.5 3h3.1l-6.77 7.74L22 21h-6.17l-4.83-6.31L5.7 21H2.58l7.24-8.28L2 3h6.33l4.36 5.77L17.5 3zm-1.09 16.2h1.72L7.67 4.7H5.83l10.58 14.5z" />
      </svg>
    );
  }
  if (name === 'whatsapp') {
    return (
      <svg {...common}>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.45 1.34 4.96L2 22l5.37-1.4a10 10 0 0 0 4.67 1.19h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.51 2 12.04 2zm5.76 14.05c-.24.67-1.4 1.28-1.94 1.36-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.24-.28.64-.41 1.03-.41.12 0 .23 0 .33.01.3.01.44-.08.69.53.24.62.83 2.14.9 2.3.08.16.13.35.02.56-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.37 1.46.3.14.47.12.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.76.83 2.06.98.3.15.5.22.57.35.08.12.08.71-.16 1.38z" />
      </svg>
    );
  }
  return null;
}

const DETAIL_ICONS = {
  phone: FaPhone,
  envelope: FaEnvelope,
  'map-marker': FaMapMarkerAlt,
} as const;

function DetailRow({ link }: { link: FooterLinkView }) {
  const Icon = DETAIL_ICONS[link.icon as keyof typeof DETAIL_ICONS];
  const content = (
    <>
      {Icon ? <Icon className="ml-2" /> : null}
      {link.url ? (
        <a href={link.url} className="hover:text-white transition-colors">
          {link.title}
        </a>
      ) : (
        <span>{link.title}</span>
      )}
    </>
  );
  return <p className="flex items-center">{content}</p>;
}

function LinkColumn({ title, links, services }: { title: string; links: FooterLinkView[]; services?: boolean }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className={services ? 'space-y-2 columns-1' : 'space-y-2'}>
        {links.map((link) => (
          <li key={link.id || `${link.title}-${link.url}`}>
            <Link href={link.url || '/'} prefetch={false} className="text-gray-400 hover:text-white transition-colors">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactColumn({ title, links }: { title: string; links: FooterLinkView[] }) {
  const details = links.filter((link) => !link.icon || link.icon in DETAIL_ICONS);
  const socials = links.filter((link) => link.icon && link.icon in SOCIAL_LABELS);
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="mt-8 space-y-2">
        {details.map((link) => (
          <DetailRow key={link.id || `${link.icon}-${link.title}`} link={link} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {socials.map((link) => {
          const icon = link.icon as string;
          const label = SOCIAL_LABELS[icon] || link.title;
          return (
            <a
              key={link.id || icon || link.title}
              href={link.url}
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={label}
            >
              <SocialSvg name={icon} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function FooterMarkup({ data }: { data: FooterView }) {
  return (
    <footer className="bg-gray-900 text-white" data-cta-location="footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <Link href="/" prefetch={false} className="mb-4 inline-block">
              <BrandLogo height={40} loading="lazy" />
            </Link>
            <h3 className="text-xl font-bold mb-4">{data.name}</h3>
            <p className="text-gray-400">{data.description}</p>
          </div>
          {data.columns.map((column) =>
            column.kind === 'contact' ? (
              <ContactColumn key={column.id || column.title} title={column.title} links={column.links} />
            ) : (
              <LinkColumn
                key={column.id || column.title}
                title={column.title}
                links={column.links}
                services={column.kind === 'services'}
              />
            )
          )}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <BusinessDetails variant="footer" />
          <p className="mt-4">{footerCopyrightLine(data.copyrightText)}</p>
        </div>
      </div>
    </footer>
  );
}

function withWebsiteTadmit(data: FooterView): FooterView {
  return {
    ...data,
    columns: data.columns.map((column) => {
      if (column.kind !== 'services') return column;
      if (column.links.some((link) => link.url === '/services/website-tadmit')) return column;
      const links = [...column.links];
      const index = links.findIndex((link) => link.url === '/services/web-development');
      const item = { title: 'אתרי תדמית לעסקים', url: '/services/website-tadmit' };
      if (index >= 0) links.splice(index + 1, 0, item);
      else links.unshift(item);
      return { ...column, links };
    }),
  };
}

function withDataDeletion(data: FooterView): FooterView {
  return {
    ...data,
    columns: data.columns.map((column) => {
      if (column.links.some((link) => link.url === '/data-deletion')) return column;
      const index = column.links.findIndex((link) => link.url === '/privacy-policy');
      if (index < 0) return column;
      const links = [...column.links];
      links.splice(index + 1, 0, { title: 'מחיקת נתונים', url: '/data-deletion' });
      return { ...column, links };
    }),
  };
}

function withTerms(data: FooterView): FooterView {
  return {
    ...data,
    columns: data.columns.map((column) => {
      if (column.links.some((link) => link.url === '/terms')) return column;
      const afterDeletion = column.links.findIndex((link) => link.url === '/data-deletion');
      const afterPrivacy = column.links.findIndex((link) => link.url === '/privacy-policy');
      const index = afterDeletion >= 0 ? afterDeletion : afterPrivacy;
      if (index < 0) return column;
      const links = [...column.links];
      links.splice(index + 1, 0, { title: 'תנאי שימוש', url: '/terms' });
      return { ...column, links };
    }),
  };
}

export default function Footer({ cmsFooter }: { cmsFooter?: FooterView | null }) {
  return (
    <FooterMarkup
      data={withRequiredSocialLinks(
        withServiceAreaColumn(withTerms(withDataDeletion(withWebsiteTadmit(cmsFooter || HARDCODED_FOOTER))))
      )}
    />
  );
}
