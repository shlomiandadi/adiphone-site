import { serviceOgImage, serviceOgContentType, serviceOgSize } from '@/lib/og/service-og-image';

export const alt = 'פרופיל עסקי ב-ChatGPT Business Hub | Top Webstak';
export const size = serviceOgSize;
export const contentType = serviceOgContentType;
export const runtime = 'nodejs';

export default function TwitterImage() {
  return serviceOgImage('פרופיל עסקי ב-ChatGPT Business Hub');
}
