import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

// יצירת instance של Prisma רק פעם אחת
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const page = await prisma.page.findUnique({
      where: { 
        slug: params.slug,
        published: true 
      }
    });

    if (!page) {
      return {
        title: 'דף לא נמצא',
        description: 'הדף שחיפשת לא נמצא'
      };
    }

    return {
      title: page.metaTitle || page.title,
      description: page.metaDesc || page.excerpt || '',
      keywords: page.metaKeywords || '',
      openGraph: {
        title: page.metaTitle || page.title,
        description: page.metaDesc || page.excerpt || '',
        images: page.featuredImage ? [page.featuredImage] : [],
      }
    };
  } catch (error) {
    return {
      title: 'דף לא נמצא',
      description: 'הדף שחיפשת לא נמצא'
    };
  }
}

export default async function DynamicPage({ params }: PageProps) {
  try {
    // פענוח URL encoding
    const decodedSlug = decodeURIComponent(params.slug);
    
    const page = await prisma.page.findUnique({
      where: { 
        slug: decodedSlug,
        published: true 
      }
    });

    if (!page) {
      notFound();
    }

    // בחירת תבנית לפי סוג הדף
    const renderPageContent = () => {
      switch (page.template) {
        case 'SERVICE':
          return (
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Hero Section */}
              {(page.heroTitle || page.heroSubtitle || page.heroImage) && (
                <div className="mb-12 text-center">
                  {page.heroImage && (
                    <img 
                      src={page.heroImage} 
                      alt={page.heroTitle || page.title}
                      className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg mb-8"
                    />
                  )}
                  {page.heroTitle && (
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{page.heroTitle}</h1>
                  )}
                  {page.heroSubtitle && (
                    <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">{page.heroSubtitle}</p>
                  )}
                  {page.heroButtonText && page.heroButtonLink && (
                    <a 
                      href={page.heroButtonLink}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                    >
                      {page.heroButtonText}
                    </a>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
                {page.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">{page.excerpt}</p>
                )}
                {page.featuredImage && (
                  <img 
                    src={page.featuredImage} 
                    alt={page.title}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                  />
                )}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>

              {/* Service Features */}
              {page.serviceFeatures && page.serviceFeatures.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">תכונות השירות</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {page.serviceFeatures.map((feature: any, index: number) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md border">
                        {feature.icon && (
                          <div className="text-3xl text-blue-600 mb-4">
                            <i className={feature.icon}></i>
                          </div>
                        )}
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Benefits */}
              {page.serviceBenefits && page.serviceBenefits.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">יתרונות השירות</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {page.serviceBenefits.map((benefit: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );

        case 'ABOUT':
          return (
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Hero Section */}
              {(page.heroTitle || page.heroSubtitle || page.heroImage) && (
                <div className="mb-12 text-center">
                  {page.heroImage && (
                    <img 
                      src={page.heroImage} 
                      alt={page.heroTitle || page.title}
                      className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg mb-8"
                    />
                  )}
                  {page.heroTitle && (
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{page.heroTitle}</h1>
                  )}
                  {page.heroSubtitle && (
                    <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">{page.heroSubtitle}</p>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">{page.title}</h1>
                {page.excerpt && (
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mb-8">{page.excerpt}</p>
                )}
                {page.featuredImage && (
                  <div className="mb-8">
                    <img 
                      src={page.featuredImage} 
                      alt={page.title}
                      className="w-full max-w-2xl mx-auto h-96 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div 
                  className="prose prose-lg max-w-none text-center"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>

              {/* About Image */}
              {page.aboutImage && (
                <div className="mb-12">
                  <img 
                    src={page.aboutImage} 
                    alt="אודות"
                    className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Stats */}
              {page.aboutStats && page.aboutStats.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">הסטטיסטיקות שלנו</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {page.aboutStats.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        {stat.icon && (
                          <div className="text-4xl text-blue-600 mb-2">
                            <i className={stat.icon}></i>
                          </div>
                        )}
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members */}
              {page.teamMembers && page.teamMembers.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">הצוות שלנו</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {page.teamMembers.map((member: any, index: number) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                        {member.image && (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                          />
                        )}
                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                        <p className="text-blue-600 mb-3">{member.role}</p>
                        <p className="text-gray-600">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );

        case 'CONTACT':
          return (
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Hero Section */}
              {(page.heroTitle || page.heroSubtitle || page.heroImage) && (
                <div className="mb-12 text-center">
                  {page.heroImage && (
                    <img 
                      src={page.heroImage} 
                      alt={page.heroTitle || page.title}
                      className="w-full max-w-4xl mx-auto h-96 object-cover rounded-lg mb-8"
                    />
                  )}
                  {page.heroTitle && (
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">{page.heroTitle}</h1>
                  )}
                  {page.heroSubtitle && (
                    <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">{page.heroSubtitle}</p>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">{page.title}</h1>
                {page.excerpt && (
                  <p className="text-xl text-gray-600 text-center mb-8">{page.excerpt}</p>
                )}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>

              {/* Contact Info */}
              {page.contactInfo && (
                <div className="mb-12 bg-gray-50 p-8 rounded-lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">פרטי קשר</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {page.contactInfo.phone && (
                      <div className="text-center">
                        <div className="text-3xl text-blue-600 mb-2">
                          <i className="fas fa-phone"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">טלפון</h3>
                        <p className="text-gray-600">{page.contactInfo.phone}</p>
                      </div>
                    )}
                    {page.contactInfo.email && (
                      <div className="text-center">
                        <div className="text-3xl text-blue-600 mb-2">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">אימייל</h3>
                        <p className="text-gray-600">{page.contactInfo.email}</p>
                      </div>
                    )}
                    {page.contactInfo.address && (
                      <div className="text-center">
                        <div className="text-3xl text-blue-600 mb-2">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">כתובת</h3>
                        <p className="text-gray-600">{page.contactInfo.address}</p>
                      </div>
                    )}
                    {page.contactInfo.hours && (
                      <div className="text-center">
                        <div className="text-3xl text-blue-600 mb-2">
                          <i className="fas fa-clock"></i>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">שעות פעילות</h3>
                        <p className="text-gray-600">{page.contactInfo.hours}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">צור קשר</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">שם מלא</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">אימייל</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">הודעה</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      שלח הודעה
                    </button>
                  </form>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h2 className="text-2xl font-bold mb-4">מידע נוסף</h2>
                  <div 
                    className="prose prose-lg"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </div>
              </div>
            </div>
          );

        case 'LANDING':
          return (
            <div className="min-h-screen">
              {page.featuredImage && (
                <div className="relative h-96">
                  <img 
                    src={page.featuredImage} 
                    alt={page.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h1 className="text-5xl font-bold mb-4">{page.title}</h1>
                      {page.excerpt && (
                        <p className="text-xl max-w-2xl mx-auto">{page.excerpt}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="max-w-4xl mx-auto px-4 py-12">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          );

        default: // GENERAL
          return (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
                {page.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">{page.excerpt}</p>
                )}
                {page.featuredImage && (
                  <img 
                    src={page.featuredImage} 
                    alt={page.title}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                  />
                )}
              </div>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          );
      }
    };

    return (
      <main className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        {page.parent && (
          <div className="bg-gray-50 py-2">
            <div className="max-w-4xl mx-auto px-4">
              <nav className="text-sm">
                <ol className="flex items-center space-x-2 space-x-reverse">
                  <li>
                    <a href="/" className="text-blue-600 hover:text-blue-800">
                      דף הבית
                    </a>
                  </li>
                  <li className="text-gray-500">/</li>
                  <li>
                    <a href={`/${page.parent.slug}`} className="text-blue-600 hover:text-blue-800">
                      {page.parent.title}
                    </a>
                  </li>
                  <li className="text-gray-500">/</li>
                  <li className="text-gray-900">{page.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        )}

        {renderPageContent()}
      </main>
    );

  } catch (error) {
    console.error('Error loading page:', error);
    notFound();
  }
} 