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

export const metadata: Metadata = {
  description:
    'בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI לעסקים. סוכנות דיגיטל מפרדס חנה. ייעוץ חינם: 050-9159951.',
};

export default function Home() {
  return (
    <>
      <HomeSchema />
      <div className="overflow-hidden">
        <section className="hero-stage relative h-[80vh] min-h-[600px] overflow-hidden">
          <HeroVisualLoader />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/65 via-black/45 to-black/25">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-6">בניית וקידום אתרים לעסקים – Top Webstak</h1>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">סוכנות דיגיטל מפרדס חנה, מבית עדי פון תקשורת</h2>
                <p className="text-xl mb-8">אנחנו מספקים לעסקים בניית אתרים, קידום בגוגל (SEO), קמפיינים ממומנים וקידום במנועי AI</p>
                <Link href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
                  צור קשר
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-slide-in">
          <ProcessSteps />
        </section>

        <section className="animate-slide-in">
          <Technologies />
        </section>

        <section className="animate-slide-in">
          <Services />
        </section>

        <section className="animate-slide-in">
          <Portfolio />
        </section>

        <section className="animate-slide-in">
          <Team />
        </section>

        <section className="animate-slide-in">
          <Testimonials />
        </section>

        <section className="animate-slide-in">
          <HomeFAQ />
        </section>

        <section className="animate-slide-in">
          <Blog />
        </section>

        <section className="animate-slide-in">
          <Contact />
        </section>
      </div>
    </>
  );
}
