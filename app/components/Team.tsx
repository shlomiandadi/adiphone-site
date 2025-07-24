import Image from 'next/image';
import { FaCode, FaRobot, FaPalette, FaChartLine, FaLightbulb, FaMagic } from 'react-icons/fa';

const team = [
  {
    name: 'עדי פון',
    role: 'מנכ"לית ומנהלת קריאייטיב',
    skills: [
      { icon: FaPalette, text: 'עיצוב חווית משתמש' },
      { icon: FaChartLine, text: 'אנליטיקס ואופטימיזציה' },
      { icon: FaMagic, text: 'עיצובים דינמיים' }
    ],
    bio: 'מומחית בעיצוב חווית משתמש ואנליטיקס, עם יכולת ייחודית לשלב בין אסתטיקה לביצועים. מובילה את החזון היצירתי של החברה ומתמחה בפיתוח פתרונות דיגיטליים חדשניים.'
  },
  {
    name: 'שלומי ',
    role: 'מפתח Full Stack ומנהל פרויקטים',
    skills: [
      { icon: FaCode, text: 'פיתוח Full Stack' },
      { icon: FaRobot, text: 'AI ואוטומציה' },
      { icon: FaLightbulb, text: 'פתרונות מורכבים' }
    ],
    bio: 'מפתח Full Stack בעל ניסיון עשיר בפיתוח מערכות מורכבות, מתמחה באינטגרציית AI ואוטומציה. מוביל פרויקטים טכנולוגיים מאתגרים ומפתח פתרונות חדשניים.'
  }
];

export default function Team() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">הצוות שלנו</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="p-8">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {index === 0 ? (
                    <FaPalette className="w-8 h-8 text-blue-600" />
                  ) : (
                    <FaCode className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center group-hover:text-blue-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-4 text-center">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-6 text-center min-h-[80px]">
                  {member.bio}
                </p>
                <div className="space-y-3">
                  {member.skills.map((skill, skillIndex) => (
                    <div 
                      key={skillIndex}
                      className="flex items-center p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm mr-3">
                        <skill.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{skill.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 