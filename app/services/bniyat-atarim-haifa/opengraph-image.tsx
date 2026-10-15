import { serviceOgImage, serviceOgContentType, serviceOgSize } from '@/lib/og/service-og-image';

export const alt = "בניית אתרים בחיפה | Top Webstak";
export const size = serviceOgSize;
export const contentType = serviceOgContentType;
export const runtime = 'nodejs';

export default function OpenGraphImage() {
  return serviceOgImage("בניית אתרים בחיפה");
}
