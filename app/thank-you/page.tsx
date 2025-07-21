import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תודה על פנייתך',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full mx-auto py-20 text-center bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">תודה!</h1>
        <p className="mb-8">הפנייה התקבלה ונחזור אליך בהקדם.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          חזרה לעמוד הבית
        </Link>
      </div>
    </div>
  );
} 