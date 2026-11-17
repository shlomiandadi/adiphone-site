import { SetBreadcrumbLeaf } from '../../components/BreadcrumbLeaf';
import PageBreadcrumbJsonLd from '../../components/PageBreadcrumbJsonLd';

export default function Project2() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SetBreadcrumbLeaf title="פרויקט 2" />
      <PageBreadcrumbJsonLd pathname="/portfolio/project2" leafTitle="פרויקט 2" />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            פרויקט 2
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            תוכן הפרויקט יוצג כאן בקרוב
          </p>
        </div>
      </div>
    </div>
  );
} 