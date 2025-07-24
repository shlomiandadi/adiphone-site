'use client';

import React from 'react';
import Image from 'next/image';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface ServiceLayoutProps {
  title: string;
  description: string;
  heroImage: string;
  features: Feature[];
  content: string;
  processSteps: ProcessStep[];
  portfolioImages: string[];
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  title,
  description,
  heroImage,
  features,
  content,
  processSteps,
  portfolioImages
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">{description}</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>

      {/* Process Steps Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">תהליך העבודה שלנו</h2>
        <div className="relative">
          {/* Process Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Circle with number */}
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 relative z-10">
                  {index + 1}
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">הפרויקטים שלנו</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioImages.map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image}
                alt={`Portfolio ${index + 1}`}
                fill
                className="object-cover transition-transform hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל?</h2>
          <p className="text-xl mb-8">צרו איתנו קשר עוד היום ונעזור לכם להגשים את החזון שלכם</p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            דברו איתנו
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceLayout; 