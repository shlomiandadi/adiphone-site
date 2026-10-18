import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };

  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    __TW_GA4_CONFIGURED?: boolean;
    __TW_TAGS_LOADED?: boolean;
    __TW_PIXEL_LOADED?: boolean;
    __TW_AHREFS_LOADED?: boolean;
  }
} 