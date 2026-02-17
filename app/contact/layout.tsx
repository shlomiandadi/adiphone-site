import { metadata as contactMetadata, viewport as contactViewport } from './metadata';

export const metadata = contactMetadata;
export const viewport = contactViewport;

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
