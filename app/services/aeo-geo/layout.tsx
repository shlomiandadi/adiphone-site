import { metadata as pageMetadata, viewport as pageViewport } from './metadata';

export const metadata = pageMetadata;
export const viewport = pageViewport;

export default function AeoGeoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
