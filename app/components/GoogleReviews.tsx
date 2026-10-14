import {
  CONTACT_PAGE_REVIEWS,
  GOOGLE_MAPS_REVIEWS_URL,
  GOOGLE_RATING,
} from '../../lib/reviews';

type Props = {
  reviews?: typeof CONTACT_PAGE_REVIEWS;
  heading?: string;
};

export default function GoogleReviews({
  reviews = CONTACT_PAGE_REVIEWS,
  heading = 'מה אומרים עלינו בגוגל',
}: Props) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 text-right">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{heading}</h2>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {GOOGLE_RATING.ratingValue} ★ מ-{GOOGLE_RATING.reviewCount} ביקורות בגוגל
        </p>
        <a
          href={GOOGLE_MAPS_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-700 underline hover:text-blue-800"
        >
          לכל הביקורות בגוגל
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <blockquote
            key={review.name}
            className="flex h-full flex-col rounded-xl bg-gray-50 p-4 text-right dark:bg-gray-700"
          >
            <p className="mb-2 text-amber-500" aria-label="5 כוכבים">
              ★★★★★
            </p>
            <p className="mb-3 flex-grow text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              &ldquo;{review.text}&rdquo;
            </p>
            <footer className="text-sm font-semibold text-gray-900 dark:text-white">{review.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
