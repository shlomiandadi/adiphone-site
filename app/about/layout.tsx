import { metadata as aboutMetadata, viewport as aboutViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { ORGANIZATION_SAME_AS, PERSON_SAME_AS } from '../../lib/social';

export const generateMetadata = createSeoAgentGenerateMetadata('/about', aboutMetadata);
export const viewport = aboutViewport;

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Top+webStak/@32.465799,34.952319,17z/data=!3m1!4b1!4m6!3m5!1s0x67bf58e7efcb5b51:0x3e583bedf92e1661!8m2!3d32.465799!4d34.952319!16s%2Fg%2F11thcjf6qd';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Top Webstak',
  alternateName: 'עדי פון תקשורת',
  url: 'https://adi-phone.co.il',
  logo: {
    '@type': 'ImageObject',
    url: 'https://adi-phone.co.il/logo.png',
    width: 1024,
    height: 1024,
  },
  email: 'adiphoneseo@gmail.com',
  telephone: '+972-50-9159951',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'זמיר 95',
    addressLocality: 'פרדס חנה-כרכור',
    addressCountry: 'IL',
  },
  sameAs: [...ORGANIZATION_SAME_AS, GOOGLE_MAPS_URL],
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'שלומי', // TODO(owner): full name + role (e.g. מייסד / מנהל) — kept minimal to avoid inventing.
  worksFor: { '@type': 'Organization', name: 'Top Webstak' },
  sameAs: [...PERSON_SAME_AS],
  // TODO(owner): add a Person entry for עדי פון once a public profile/link exists.
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <SeoAgentPageExtras path="/about" />
      {children}
    </>
  );
}
