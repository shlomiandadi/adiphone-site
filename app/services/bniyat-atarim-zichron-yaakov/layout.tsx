import { metadata as pageMetadata, viewport as pageViewport } from './metadata';

export const metadata = pageMetadata;
export const viewport = pageViewport;

export default function BniyatAtarimZichronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
