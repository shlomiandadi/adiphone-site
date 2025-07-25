import { Suspense } from 'react';
import ClientHeader from './ClientHeader';

export default function Header() {
  return (
    <Suspense fallback={
      <div className="fixed top-0 left-0 right-0 z-50 bg-white h-20 shadow-lg">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="text-base font-bold text-blue-600 leading-tight">
            <div>Top Webstak</div>
            <div className="text-sm">בנייה וקידום אתרים</div>
            <div className="text-sm">(מבית עדי פון תקשורת)</div>
          </div>
        </div>
      </div>
    }>
      <ClientHeader />
    </Suspense>
  );
} 