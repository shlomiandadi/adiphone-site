export type LeadServiceOption = {
  value: string;
  label: string;
};

export const LEAD_SERVICE_OPTIONS: LeadServiceOption[] = [
  { value: 'web-development', label: 'בניית אתרים' },
  { value: 'wordpress', label: 'אתרי וורדפרס' },
  { value: 'ecommerce', label: 'חנויות אונליין' },
  { value: 'seo', label: 'קידום אורגני SEO' },
  { value: 'ppc', label: 'קידום ממומן PPC' },
  { value: 'social', label: 'ניהול סושיאל' },
  { value: 'ai-bots', label: 'בוטים AI' },
];

export function labelForLeadService(value: string): string {
  return LEAD_SERVICE_OPTIONS.find((option) => option.value === value)?.label || value;
}

export function defaultLeadMessage(serviceLabel: string): string {
  return `פנייה חדשה בנושא: ${serviceLabel}`;
}

export const LEAD_PLACEHOLDER_EMAIL = 'lead@adi-phone.co.il';
