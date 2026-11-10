import { metadata as aboutMetadata, viewport as aboutViewport } from './metadata';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';
import { GOOGLE_MAPS_REVIEWS_URL } from '../../lib/reviews';
import { PERSON_SAME_AS, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM, SOCIAL_LINKEDIN } from '../../lib/social';

export const generateMetadata = createSeoAgentGenerateMetadata('/about', aboutMetadata);
export const viewport = aboutViewport;

const ORGANIZATION_ID = 'https://adi-phone.co.il/#organization';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
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
  sameAs: [
    GOOGLE_MAPS_REVIEWS_URL,
    SOCIAL_FACEBOOK,
    SOCIAL_INSTAGRAM,
    SOCIAL_LINKEDIN,
  ],
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  // TODO(owner): השם המלא והתפקיד ממתינים לאישור הבעלים — לא לשנות את name או להוסיף jobTitle בלי אישור.
  name: 'שלומי',
  worksFor: { '@id': ORGANIZATION_ID },
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
