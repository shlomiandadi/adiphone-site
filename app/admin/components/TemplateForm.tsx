'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaSave, FaEye, FaEdit } from 'react-icons/fa';

interface TemplateFormProps {
  onSubmit: (template: any) => void;
  initialData?: any;
}

interface Section {
  id: string;
  type: string;
  title: string;
  content: any;
  order: number;
}

export default function TemplateForm({ onSubmit, initialData }: TemplateFormProps) {
  const [templateName, setTemplateName] = useState(initialData?.name || '');
  const [templateDescription, setTemplateDescription] = useState(initialData?.description || '');
  const [sections, setSections] = useState<Section[]>(initialData?.sections || []);

  const sectionTypes = [
    { value: 'hero', label: 'באנר עליון', description: 'באנר עם כותרת, תת-כותרת ותמונה רקע' },
    { value: 'content', label: 'תוכן עיקרי', description: 'תוכן טקסטואלי עם כותרות ופסקאות' },
    { value: 'features', label: 'יתרונות', description: 'רשימת יתרונות עם אייקונים' },
    { value: 'benefits', label: 'היתרונות שלנו', description: 'רשימת יתרונות עם צ\'קמרקס' },
    { value: 'process', label: 'תהליך עבודה', description: 'שלבי תהליך העבודה' },
    { value: 'portfolio', label: 'פורטפוליו', description: 'עבודות לדוגמה' },
    { value: 'testimonials', label: 'המלצות', description: 'המלצות לקוחות' },
    { value: 'faq', label: 'שאלות נפוצות', description: 'שאלות ותשובות' },
    { value: 'pricing', label: 'מחירון', description: 'חבילות מחיר' },
    { value: 'cta', label: 'קריאה לפעולה', description: 'סקשן CTA' }
  ];

  const addSection = (type: string) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: sectionTypes.find(st => st.value === type)?.label || type,
      content: getDefaultContent(type),
      order: sections.length
    };
    setSections([...sections, newSection]);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          title: 'כותרת ראשית',
          subtitle: 'תת כותרת',
          backgroundImage: '/images/hero-bg.jpg',
          buttonText: 'צור קשר',
          buttonLink: '/contact'
        };
      case 'content':
        return {
          title: 'כותרת התוכן',
          content: '<p>תוכן הדף יופיע כאן...</p>'
        };
      case 'features':
        return {
          title: 'היתרונות שלנו',
          features: [
            { title: 'יתרון 1', description: 'תיאור היתרון', icon: 'star' },
            { title: 'יתרון 2', description: 'תיאור היתרון', icon: 'check' },
            { title: 'יתרון 3', description: 'תיאור היתרון', icon: 'heart' },
            { title: 'יתרון 4', description: 'תיאור היתרון', icon: 'shield' }
          ]
        };
      case 'benefits':
        return {
          title: 'היתרונות שלנו',
          benefits: [
            'יתרון ראשון',
            'יתרון שני',
            'יתרון שלישי',
            'יתרון רביעי',
            'יתרון חמישי',
            'יתרון שישי'
          ]
        };
      case 'process':
        return {
          title: 'תהליך העבודה שלנו',
          steps: [
            { title: 'שלב 1', description: 'תיאור השלב' },
            { title: 'שלב 2', description: 'תיאור השלב' },
            { title: 'שלב 3', description: 'תיאור השלב' },
            { title: 'שלב 4', description: 'תיאור השלב' }
          ]
        };
      case 'portfolio':
        return {
          title: 'העבודות שלנו',
          items: [
            { title: 'עבודה 1', description: 'תיאור העבודה', image: '/images/portfolio/project1.jpg', link: '#' },
            { title: 'עבודה 2', description: 'תיאור העבודה', image: '/images/portfolio/project2.jpg', link: '#' },
            { title: 'עבודה 3', description: 'תיאור העבודה', image: '/images/portfolio/project3.jpg', link: '#' }
          ]
        };
      case 'testimonials':
        return {
          title: 'מה לקוחות חושבים עלינו?',
          testimonials: [
            { quote: 'המלצה ראשונה', author: 'שם הלקוח', company: 'שם החברה' },
            { quote: 'המלצה שנייה', author: 'שם הלקוח', company: 'שם החברה' }
          ]
        };
      case 'faq':
        return {
          title: 'שאלות נפוצות',
          questions: [
            { question: 'שאלה ראשונה?', answer: 'תשובה לשאלה הראשונה' },
            { question: 'שאלה שנייה?', answer: 'תשובה לשאלה השנייה' }
          ]
        };
      case 'pricing':
        return {
          title: 'מחירון שירותים',
          plans: [
            {
              name: 'חבילה בסיסית',
              price: '₪1,000',
              period: 'חד פעמי',
              description: 'תיאור החבילה',
              features: ['תכונה 1', 'תכונה 2', 'תכונה 3'],
              popular: false
            },
            {
              name: 'חבילה מתקדמת',
              price: '₪2,000',
              period: 'חד פעמי',
              description: 'תיאור החבילה',
              features: ['תכונה 1', 'תכונה 2', 'תכונה 3', 'תכונה 4'],
              popular: true
            }
          ]
        };
      case 'cta':
        return {
          title: 'מוכנים להתחיל?',
          subtitle: 'צרו איתנו קשר עוד היום ונעזור לכם להגשים את החזון שלכם',
          buttonText: 'דברו איתנו',
          buttonLink: '/contact'
        };
      default:
        return {};
    }
  };

  const updateSection = (id: string, content: any) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id);
    if (index === -1) return;

    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: templateName,
      description: templateDescription,
      sections: sections.map((section, index) => ({ ...section, order: index }))
    });
  };

  const renderSectionEditor = (section: Section) => {
    const { type, content } = section;

    switch (type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת ראשית"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="תת כותרת"
              value={content.subtitle || ''}
              onChange={(e) => updateSection(section.id, { ...content, subtitle: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="URL תמונת רקע"
              value={content.backgroundImage || ''}
              onChange={(e) => updateSection(section.id, { ...content, backgroundImage: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="טקסט כפתור"
              value={content.buttonText || ''}
              onChange={(e) => updateSection(section.id, { ...content, buttonText: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="קישור כפתור"
              value={content.buttonLink || ''}
              onChange={(e) => updateSection(section.id, { ...content, buttonLink: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת התוכן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="תוכן הדף (HTML מותר)"
              value={content.content || ''}
              onChange={(e) => updateSection(section.id, { ...content, content: e.target.value })}
              className="w-full p-2 border rounded h-32"
            />
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.features?.map((feature: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="כותרת היתרון"
                  value={feature.title || ''}
                  onChange={(e) => {
                    const newFeatures = [...content.features];
                    newFeatures[index] = { ...feature, title: e.target.value };
                    updateSection(section.id, { ...content, features: newFeatures });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="תיאור היתרון"
                  value={feature.description || ''}
                  onChange={(e) => {
                    const newFeatures = [...content.features];
                    newFeatures[index] = { ...feature, description: e.target.value };
                    updateSection(section.id, { ...content, features: newFeatures });
                  }}
                  className="w-full p-2 border rounded"
                />
                <select
                  value={feature.icon || 'star'}
                  onChange={(e) => {
                    const newFeatures = [...content.features];
                    newFeatures[index] = { ...feature, icon: e.target.value };
                    updateSection(section.id, { ...content, features: newFeatures });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="star">כוכב</option>
                  <option value="check">צ\'ק</option>
                  <option value="heart">לב</option>
                  <option value="shield">מגן</option>
                  <option value="rocket">רקטה</option>
                  <option value="crown">כתר</option>
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newFeatures = [...(content.features || []), { title: '', description: '', icon: 'star' }];
                updateSection(section.id, { ...content, features: newFeatures });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף יתרון
            </button>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.benefits?.map((benefit: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="יתרון"
                  value={benefit || ''}
                  onChange={(e) => {
                    const newBenefits = [...content.benefits];
                    newBenefits[index] = e.target.value;
                    updateSection(section.id, { ...content, benefits: newBenefits });
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newBenefits = content.benefits.filter((_: string, i: number) => i !== index);
                    updateSection(section.id, { ...content, benefits: newBenefits });
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newBenefits = [...(content.benefits || []), ''];
                updateSection(section.id, { ...content, benefits: newBenefits });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף יתרון
            </button>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.steps?.map((step: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="כותרת השלב"
                  value={step.title || ''}
                  onChange={(e) => {
                    const newSteps = [...content.steps];
                    newSteps[index] = { ...step, title: e.target.value };
                    updateSection(section.id, { ...content, steps: newSteps });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="תיאור השלב"
                  value={step.description || ''}
                  onChange={(e) => {
                    const newSteps = [...content.steps];
                    newSteps[index] = { ...step, description: e.target.value };
                    updateSection(section.id, { ...content, steps: newSteps });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newSteps = [...(content.steps || []), { title: '', description: '' }];
                updateSection(section.id, { ...content, steps: newSteps });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף שלב
            </button>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.items?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="כותרת העבודה"
                  value={item.title || ''}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[index] = { ...item, title: e.target.value };
                    updateSection(section.id, { ...content, items: newItems });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="תיאור העבודה"
                  value={item.description || ''}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[index] = { ...item, description: e.target.value };
                    updateSection(section.id, { ...content, items: newItems });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL תמונה"
                  value={item.image || ''}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[index] = { ...item, image: e.target.value };
                    updateSection(section.id, { ...content, items: newItems });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="קישור"
                  value={item.link || ''}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[index] = { ...item, link: e.target.value };
                    updateSection(section.id, { ...content, items: newItems });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(content.items || []), { title: '', description: '', image: '', link: '#' }];
                updateSection(section.id, { ...content, items: newItems });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף עבודה
            </button>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.testimonials?.map((testimonial: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">
                <textarea
                  placeholder="המלצה"
                  value={testimonial.quote || ''}
                  onChange={(e) => {
                    const newTestimonials = [...content.testimonials];
                    newTestimonials[index] = { ...testimonial, quote: e.target.value };
                    updateSection(section.id, { ...content, testimonials: newTestimonials });
                  }}
                  className="w-full p-2 border rounded h-20"
                />
                <input
                  type="text"
                  placeholder="שם הלקוח"
                  value={testimonial.author || ''}
                  onChange={(e) => {
                    const newTestimonials = [...content.testimonials];
                    newTestimonials[index] = { ...testimonial, author: e.target.value };
                    updateSection(section.id, { ...content, testimonials: newTestimonials });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="שם החברה"
                  value={testimonial.company || ''}
                  onChange={(e) => {
                    const newTestimonials = [...content.testimonials];
                    newTestimonials[index] = { ...testimonial, company: e.target.value };
                    updateSection(section.id, { ...content, testimonials: newTestimonials });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newTestimonials = [...(content.testimonials || []), { quote: '', author: '', company: '' }];
                updateSection(section.id, { ...content, testimonials: newTestimonials });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף המלצה
            </button>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.questions?.map((faq: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="שאלה"
                  value={faq.question || ''}
                  onChange={(e) => {
                    const newQuestions = [...content.questions];
                    newQuestions[index] = { ...faq, question: e.target.value };
                    updateSection(section.id, { ...content, questions: newQuestions });
                  }}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="תשובה"
                  value={faq.answer || ''}
                  onChange={(e) => {
                    const newQuestions = [...content.questions];
                    newQuestions[index] = { ...faq, answer: e.target.value };
                    updateSection(section.id, { ...content, questions: newQuestions });
                  }}
                  className="w-full p-2 border rounded h-20"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newQuestions = [...(content.questions || []), { question: '', answer: '' }];
                updateSection(section.id, { ...content, questions: newQuestions });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף שאלה
            </button>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת הסקשן"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            {content.plans?.map((plan: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">
                <input
                  type="text"
                  placeholder="שם החבילה"
                  value={plan.name || ''}
                  onChange={(e) => {
                    const newPlans = [...content.plans];
                    newPlans[index] = { ...plan, name: e.target.value };
                    updateSection(section.id, { ...content, plans: newPlans });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="מחיר"
                  value={plan.price || ''}
                  onChange={(e) => {
                    const newPlans = [...content.plans];
                    newPlans[index] = { ...plan, price: e.target.value };
                    updateSection(section.id, { ...content, plans: newPlans });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="תקופה"
                  value={plan.period || ''}
                  onChange={(e) => {
                    const newPlans = [...content.plans];
                    newPlans[index] = { ...plan, period: e.target.value };
                    updateSection(section.id, { ...content, plans: newPlans });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="תיאור"
                  value={plan.description || ''}
                  onChange={(e) => {
                    const newPlans = [...content.plans];
                    newPlans[index] = { ...plan, description: e.target.value };
                    updateSection(section.id, { ...content, plans: newPlans });
                  }}
                  className="w-full p-2 border rounded"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={plan.popular || false}
                    onChange={(e) => {
                      const newPlans = [...content.plans];
                      newPlans[index] = { ...plan, popular: e.target.checked };
                      updateSection(section.id, { ...content, plans: newPlans });
                    }}
                  />
                  חבילה פופולרית
                </label>
                <div className="space-y-2">
                  <label>תכונות:</label>
                  {plan.features?.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="תכונה"
                        value={feature || ''}
                        onChange={(e) => {
                          const newPlans = [...content.plans];
                          const newFeatures = [...newPlans[index].features];
                          newFeatures[featureIndex] = e.target.value;
                          newPlans[index] = { ...plan, features: newFeatures };
                          updateSection(section.id, { ...content, plans: newPlans });
                        }}
                        className="flex-1 p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPlans = [...content.plans];
                          const newFeatures = newPlans[index].features.filter((_: string, i: number) => i !== featureIndex);
                          newPlans[index] = { ...plan, features: newFeatures };
                          updateSection(section.id, { ...content, plans: newPlans });
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newPlans = [...content.plans];
                      const newFeatures = [...(newPlans[index].features || []), ''];
                      newPlans[index] = { ...plan, features: newFeatures };
                      updateSection(section.id, { ...content, plans: newPlans });
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaPlus /> הוסף תכונה
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newPlans = [...(content.plans || []), {
                  name: '',
                  price: '',
                  period: '',
                  description: '',
                  features: [],
                  popular: false
                }];
                updateSection(section.id, { ...content, plans: newPlans });
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FaPlus /> הוסף חבילה
            </button>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="כותרת"
              value={content.title || ''}
              onChange={(e) => updateSection(section.id, { ...content, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="תת כותרת"
              value={content.subtitle || ''}
              onChange={(e) => updateSection(section.id, { ...content, subtitle: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="טקסט כפתור"
              value={content.buttonText || ''}
              onChange={(e) => updateSection(section.id, { ...content, buttonText: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="קישור כפתור"
              value={content.buttonLink || ''}
              onChange={(e) => updateSection(section.id, { ...content, buttonLink: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        );

      default:
        return <div>עורך לא זמין לסוג זה</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">יצירת תבנית חדשה</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">שם התבנית</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="לדוגמה: תבנית שירותים"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">תיאור התבנית</label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="תיאור קצר של התבנית"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">סקשנים</h3>
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addSection(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">הוסף סקשן...</option>
                {sectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">{section.title}</h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  {renderSectionEditor(section)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSave />
            שמור תבנית
          </button>
        </div>
      </form>
    </div>
  );
} 