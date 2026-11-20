export type ContactClickEventName = 'phone_click' | 'whatsapp_click' | 'email_click';

export function isWhatsAppHref(href: string) {
  const value = href.trim().toLowerCase();
  if (!value) return false;
  if (value.startsWith('whatsapp:')) return true;
  return /(?:^|\/\/|www\.)(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)(?:[:/?#]|$)|whatsapp\.com\/send/i.test(
    value
  );
}

export function isTelHref(href: string) {
  return href.trim().toLowerCase().startsWith('tel:');
}

export function isMailtoHref(href: string) {
  return href.trim().toLowerCase().startsWith('mailto:');
}

export function resolveContactClickEvent(href: string): ContactClickEventName | null {
  if (!href) return null;
  if (isTelHref(href)) return 'phone_click';
  if (isWhatsAppHref(href)) return 'whatsapp_click';
  if (isMailtoHref(href)) return 'email_click';
  return null;
}
