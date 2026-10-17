import { optimizedImageUrl } from './responsiveImage';

type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

/** next/image custom loader. Local files pass through; Cloudinary, Unsplash, and seo-agent images are resized. */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  return optimizedImageUrl(src, width, quality);
}
