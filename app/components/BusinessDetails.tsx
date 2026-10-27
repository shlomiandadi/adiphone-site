import {
  BUSINESS_ADDRESS,
  BUSINESS_LEGAL_NAME,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_HREF,
  BUSINESS_TRADE_NAME,
  BUSINESS_TRADEMARK_NOTE,
} from '../../lib/cms/footerData';

export default function BusinessDetails({ variant }: { variant: 'footer' | 'page' }) {
  const isFooter = variant === 'footer';
  const wrapClass = isFooter
    ? 'mt-4 text-xs leading-relaxed text-gray-400 space-y-1 text-center'
    : 'text-sm leading-relaxed text-gray-700 dark:text-gray-300 space-y-1';
  const phoneClass = isFooter
    ? 'hover:text-white transition-colors'
    : 'text-blue-600 hover:underline';

  return (
    <address className={`${wrapClass} not-italic`}>
      <p>שם משפטי: {BUSINESS_LEGAL_NAME}</p>
      <p>שם מסחרי: {BUSINESS_TRADE_NAME}</p>
      <p>כתובת: {BUSINESS_ADDRESS}</p>
      <p>
        טלפון:{' '}
        <a href={BUSINESS_PHONE_HREF} className={phoneClass} dir="ltr">
          {BUSINESS_PHONE_DISPLAY}
        </a>
      </p>
      <p>{BUSINESS_TRADEMARK_NOTE}</p>
    </address>
  );
}
