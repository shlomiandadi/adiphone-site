import { metadata as thankYouMetadata } from './page';

export const metadata = thankYouMetadata;

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
