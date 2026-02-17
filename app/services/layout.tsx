import { metadata as servicesMetadata, viewport as servicesViewport } from './metadata';

export const metadata = servicesMetadata;
export const viewport = servicesViewport;

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
