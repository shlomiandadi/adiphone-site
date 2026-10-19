const RATIO = 1440 / 360;

type BrandLogoProps = {
  height?: number;
  loading?: 'eager' | 'lazy';
};

export default function BrandLogo({ height = 36, loading = 'eager' }: BrandLogoProps) {
  const width = Math.round(RATIO * height);

  return (
    <span className="brand-lockup" style={{ width, height }}>
      <img
        src="/brand/logo-horizontal-transparent.svg"
        alt="Top Webstak"
        width={width}
        height={height}
        className="brand-logo brand-logo--on-dark"
        decoding="async"
        loading={loading}
      />
      <img
        src="/brand/logo-horizontal-light.svg"
        alt="Top Webstak"
        width={width}
        height={height}
        className="brand-logo brand-logo--on-light"
        decoding="async"
        loading={loading}
      />
    </span>
  );
}
