import React from 'react';

const defaultSteps = [
  {
    title: "פגישת ייעוץ",
    description: "נפגש לשיחת היכרות ונבין את הצרכים והמטרות של העסק שלך"
  },
  {
    title: "אפיון ותכנון",
    description: "נגבש אסטרטגיה דיגיטלית מותאמת אישית עבורך"
  },
  {
    title: "פיתוח ועיצוב",
    description: "נפתח ונעצב את הפתרון הדיגיטלי המושלם עבורך"
  },
  {
    title: "השקה וליווי",
    description: "נשיק את הפרויקט ונלווה אותך בכל שלב בדרך להצלחה"
  }
];

export default function ProcessSteps() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">תהליך העבודה שלנו</h2>
        <div className="relative">
          {/* Process Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {defaultSteps.map((step, index) => (
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
    </div>
  );
} 