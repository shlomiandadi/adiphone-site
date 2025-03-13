import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    title: 'פיתוח אתרים',
    description: 'בניית אתרים מותאמים אישית עם טכנולוגיות מתקדמות ועיצוב מודרני. אנו מתמחים בבניית אתרים רספונסיביים, מהירים ומאובטחים.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    link: '/services#web-development'
  },
  {
    title: 'קידום אורגני',
    description: 'שירותי SEO מקצועיים להגדלת החשיפה האורגנית שלך בגוגל. כולל מחקר מילות מפתח, אופטימיזציה טכנית ובניית קישורים.',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800',
    link: '/services#seo'
  },
  {
    title: 'קמפיינים ממומנים',
    description: 'ניהול קמפיינים ממומנים בגוגל ובפייסבוק. אנו מתמחים בבניית קמפיינים ממוקדים עם ROI גבוה.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    link: '/services#ppc'
  },
  {
    title: 'פתרונות AI',
    description: 'שילוב טכנולוגיות AI מתקדמות בעסק שלך. צ׳אטבוטים, אוטומציה, ומערכות המלצה חכמות.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    link: '/services#ai'
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">השירותים שלנו</h2>
          <p className="text-xl text-gray-600">פתרונות דיגיטל מקצה לקצה לעסק שלך</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index} className="block group h-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 flex flex-col h-full">
                <div className="relative w-full pt-[66.67%]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                  <span className="text-blue-600 group-hover:text-blue-700 inline-flex items-center font-medium mt-auto">
                    קרא עוד
                    <svg className="w-4 h-4 mr-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/services" 
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300"
          >
            לכל השירותים שלנו
            <svg className="w-5 h-5 mr-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 