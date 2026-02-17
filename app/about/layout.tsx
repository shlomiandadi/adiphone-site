import { metadata as aboutMetadata, viewport as aboutViewport } from './metadata';

export const metadata = aboutMetadata;
export const viewport = aboutViewport;

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
