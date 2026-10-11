import { metadata as aboutMetadata, viewport as aboutViewport } from './metadata';

export const metadata = aboutMetadata;
export const viewport = aboutViewport;

// sameAs: only profiles that are already linked from the site (footer).
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61578707397365';
const LINKEDIN_URL = 'https://www.linkedin.com/in/shlomi-malfuf-709961221/';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Top Webstak',
  alternateName: 'עדי פון תקשורת',
  url: 'https://adi-phone.co.il',
  email: 'adiphoneseo@gmail.com',
  telephone: '+972-50-9159951',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'זמיר 95',
    addressLocality: 'פרדס חנה-כרכור',
    addressCountry: 'IL',
  },
  sameAs: [FACEBOOK_URL, LINKEDIN_URL],
  // TODO(owner): add foundingDate, a public logo URL, and any additional VERIFIED
  // profiles (Google Business Profile, Instagram) once available — do not invent.
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'שלומי', // TODO(owner): full name + role (e.g. מייסד / מנהל) — kept minimal to avoid inventing.
  worksFor: { '@type': 'Organization', name: 'Top Webstak' },
  sameAs: [LINKEDIN_URL],
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
      {children}
    </>
  );
}
