import Link from 'next/link';

/** Static hero mark. The canvas is attached later, and only on the homepage. */
export default function HeroLogoMark() {
  return (
    <div className="hero-logo3d">
      <Link href="/" prefetch={false} className="hero-logo3d-link">
        <img
          src="/brand/logo-horizontal-transparent.svg"
          alt="Top Webstak"
          width={1440}
          height={360}
          className="hero-logo3d-static"
          decoding="async"
          fetchPriority="low"
        />
      </Link>
    </div>
  );
}
