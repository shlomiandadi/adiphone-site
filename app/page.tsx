import Link from 'next/link';
import type { Metadata } from 'next';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Blog from './components/Blog';
import Team from './components/Team';
import Contact from './components/Contact';
import ProcessSteps from './components/ProcessSteps';
import Technologies from './components/Technologies';
import HomeFAQ from './components/HomeFAQ';
import HomeSchema from './components/HomeSchema';
import Testimonials from './components/Testimonials';
import HeroVisualLoader from './components/HeroVisualLoader';
import { createSeoAgentGenerateMetadata, SeoAgentPageExtras } from '@/seo-agent-apply';

const homeMetadata: Metadata = {
  description:
    'בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI לעסקים. סוכנות דיגיטל מפרדס חנה. ייעוץ חינם: 050-9159951.',
};

export const generateMetadata = createSeoAgentGenerateMetadata('/', homeMetadata);

export default function Home() {
  return (
    <>
      <SeoAgentPageExtras path="/" />
      <HomeSchema />
      <div className="overflow-hidden">
        <section className="hero-stage">
          <div className="hero-stage-visual" data-parallax="0.12" aria-hidden="true">
            <HeroVisualLoader />
          </div>
          <div className="hero-stage-content bg-gradient-to-r from-black/65 via-black/45 to-black/25">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">בניית וקידום אתרים לעסקים – Top Webstak</h1>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">סוכנות דיגיטל מפרדס חנה, מבית עדי פון תקשורת</h2>
                <p className="text-xl mb-8">אנחנו מספקים לעסקים בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI</p>
                <Link href="/contact" data-cta="true" data-cta-location="hero" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  צור קשר
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section data-reveal>
          <ProcessSteps />
        </section>

        <section data-reveal>
          <Technologies />
        </section>

        <section data-reveal>
          <Services />
        </section>

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
          <Blog />
        </section>

        <section data-reveal>
          <Contact />
        </section>
      </div>
    </>
  );
}
