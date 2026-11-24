import LeadForm from './LeadForm';

type Props = {
  formName: string;
  title?: string;
};

export default function LeadFormSection({
  formName,
  title = 'השאירו פרטים להצעת מחיר',
}: Props) {
  return (
    <section id="lead-form" data-reveal className="px-4 py-16">
      <div className="container mx-auto max-w-xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-6 text-center text-base font-medium text-gray-700 dark:text-gray-300">
          מענה תוך שעתיים בשעות הפעילות
        </p>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <LeadForm formName={formName} />
        </div>
      </div>
    </section>
  );
}
