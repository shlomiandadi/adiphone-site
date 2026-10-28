"use client";
import { useEffect, useState, type ComponentType } from 'react';
import { lightboxImageUrl, responsiveAttributes } from '../../../lib/responsiveImage';

export default function ProjectGallery({
  name,
  description,
  images,
}: {
  name: string;
  description?: string;
  images: string[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [Lightbox, setLightbox] = useState<ComponentType<Record<string, unknown>> | null>(null);
  const [originalFallback, setOriginalFallback] = useState<Record<string, true>>({});

  const lightboxSrc = (src: string) => (originalFallback[src] ? src : lightboxImageUrl(src, 1600));

  const handleImageLoadError = (imageSrc: string) => {
    const original = images.find((img) => img === imageSrc || lightboxImageUrl(img, 1600) === imageSrc);
    if (!original || original === imageSrc || originalFallback[original]) return;
    setOriginalFallback((prev) => (prev[original] ? prev : { ...prev, [original]: true }));
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void import('react-image-lightbox/style.css');
    void import('react-image-lightbox').then((mod) => {
      if (!cancelled) {
        const Loaded = mod.default as unknown as ComponentType<Record<string, unknown>>;
        setLightbox(() => Loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (images.length === 0) return null;

  return (
    <div className="mb-8 [content-visibility:auto] [contain-intrinsic-size:auto_480px]">
      <h2 className="mb-4 text-xl font-semibold">גלריית תמונות</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <img
            key={i}
            alt={name + ' image ' + (i + 1)}
            width={480}
            height={270}
            className="aspect-video w-full cursor-pointer rounded-lg object-cover shadow transition-transform hover:scale-105"
            {...responsiveAttributes(img, {
              sizes: '(max-width: 768px) 50vw, 280px',
              widths: [320, 480, 640, 960],
              crop: { ar: '16:9' },
              fetchPriority: 'low',
            })}
            onClick={() => { setIndex(i); setOpen(true); }}
          />
        ))}
      </div>
      {open && Lightbox && (
        <Lightbox
          mainSrc={lightboxSrc(images[index])}
          nextSrc={lightboxSrc(images[(index + 1) % images.length])}
          prevSrc={lightboxSrc(images[(index + images.length - 1) % images.length])}
          onCloseRequest={() => setOpen(false)}
          onMovePrevRequest={() => setIndex((index + images.length - 1) % images.length)}
          onMoveNextRequest={() => setIndex((index + 1) % images.length)}
          imageTitle={name}
          imageCaption={description}
          enableZoom={true}
          onImageLoadError={handleImageLoadError}
        />
      )}
    </div>
  );
}
