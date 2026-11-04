import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Services from './components/Services';
import ServiceAreas from './components/ServiceAreas';
import WebDevNicheHub from './components/WebDevNicheHub';
import Portfolio from './components/Portfolio';
import Team from './components/Team';
import Contact from './components/Contact';
import ProcessSteps from './components/ProcessSteps';
import Technologies from './components/Technologies';
import HomeSchema from './components/HomeSchema';
import FeaturedHomePosts from './components/FeaturedHomePosts';
import Testimonials from './components/Testimonials';
import Hero3D from './components/hero3d/Hero3D';
import HeroLogoMark from './components/logo3d/HeroLogoMark';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

const HomeFAQ = dynamic(() => import('./components/HomeFAQ'));
const Blog = dynamic(() => import('./components/Blog'));

const homeMetadata: Metadata = {
  description:
    'בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI לעסקים. סוכנות דיגיטל מפרדס חנה. ייעוץ חינם: 050-9159951.',
};

// Public homepage: ISR so origin HTML is not rebuilt on every Lighthouse/cold hit.
// CMS/admin writes already call revalidatePath('/'); 600s is the fallback window.
export const revalidate = 600;

export const generateMetadata = createSeoAgentGenerateMetadata('/', homeMetadata);

export default function Home() {
  return (
    <>
      <SeoAgentPageExtras path="/" />
      <HomeSchema />
      <div className="overflow-hidden">
        <Hero3D
          theme="home"
          mark={<HeroLogoMark />}
          title="בניית וקידום אתרים לעסקים – Top Webstak"
          extraHeading="סוכנות דיגיטל מפרדס חנה, מבית עדי פון תקשורת"
          subtitle="אנחנו מספקים לעסקים בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI"
          ctas={[{ href: '/contact', label: 'צור קשר' }]}
        />

        <section data-reveal>
          <ProcessSteps />
        </section>

        <section data-reveal>
          <Technologies />
        </section>

        <section data-reveal>
          <Services />
        </section>

        <WebDevNicheHub />

        <ServiceAreas includeExtraServices />

        <section data-reveal>
          <Portfolio />
        </section>

        <section data-reveal>
          <Team />
        </section>

        <section data-reveal>
          <Testimonials />
        </section>

        <section data-reveal>
          <HomeFAQ />
        </section>

        <section data-reveal>
          <FeaturedHomePosts />
          <Blog />
        </section>

        <section data-reveal>
          <Contact />
        </section>
      </div>
    </>
  );
}
