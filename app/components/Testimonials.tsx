import { GOOGLE_MAPS_REVIEWS_URL, GOOGLE_RATING, SITE_REVIEWS } from '../../lib/reviews';

const reviews = SITE_REVIEWS;

function Stars() {
  return (
    <p className="mb-3 text-amber-500" aria-label="5 כוכבים">
      ★★★★★
    </p>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {GOOGLE_RATING.ratingValue} ★ מ-<span className="tabular-nums" data-count={GOOGLE_RATING.reviewCount}>{GOOGLE_RATING.reviewCount}</span> ביקורות בגוגל
          </h2>
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-700 underline hover:text-blue-800"
          >
            לכל הביקורות בגוגל
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
          {reviews.map((review) => (
            <blockquote
              key={review.name}
              className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 text-right shadow-sm"
            >
              <Stars />
              <p className="mb-4 flex-grow text-gray-700 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer className="font-semibold text-gray-900">{review.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
