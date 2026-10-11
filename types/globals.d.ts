import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };

  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __TW_GA4_CONFIGURED?: boolean;
  }
} 