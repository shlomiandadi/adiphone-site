import { metadata as portfolioMetadata, viewport as portfolioViewport } from './metadata';

export const metadata = portfolioMetadata;
export const viewport = portfolioViewport;

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
