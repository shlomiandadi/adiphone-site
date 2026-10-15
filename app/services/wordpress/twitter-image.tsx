import { serviceOgImage, serviceOgContentType, serviceOgSize } from '@/lib/og/service-og-image';

export const alt = "בניית אתרי וורדפרס | Top Webstak";
export const size = serviceOgSize;
export const contentType = serviceOgContentType;
export const runtime = 'nodejs';

export default function TwitterImage() {
  return serviceOgImage("בניית אתרי וורדפרס");
}
