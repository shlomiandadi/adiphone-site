import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { footerCopyrightLine, HARDCODED_FOOTER, withServiceAreaColumn, type FooterLinkView, type FooterView } from '../../lib/cms/footerData';
import BrandLogo from './BrandLogo';
import BusinessDetails from './BusinessDetails';

const SOCIAL_ICONS = {
  facebook: FaFacebook,
  whatsapp: FaWhatsapp,
  linkedin: FaLinkedin,
} as const;

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
  const socials = links.filter((link) => link.icon && link.icon in SOCIAL_ICONS);
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="mt-8 space-y-2">
        {details.map((link) => (
          <DetailRow key={link.id || `${link.icon}-${link.title}`} link={link} />
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        {socials.map((link) => {
          const Icon = SOCIAL_ICONS[link.icon as keyof typeof SOCIAL_ICONS];
          return (
            <a
              key={link.id || link.icon || link.title}
              href={link.url}
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {Icon ? <Icon size={24} /> : link.title}
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
      data={withServiceAreaColumn(withTerms(withDataDeletion(withWebsiteTadmit(cmsFooter || HARDCODED_FOOTER))))}
    />
  );
}
