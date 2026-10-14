type TopStripProps = {
  text: string;
  backgroundColor: string;
  textColor: string;
  linkUrl?: string | null;
  linkText?: string | null;
};

export default function TopStrip({ text, backgroundColor, textColor, linkUrl, linkText }: TopStripProps) {
  return (
    <div
      className="relative z-[60] px-4 py-2 text-center text-sm"
      style={{ backgroundColor, color: textColor }}
    >
      <span>{text}</span>
      {linkUrl ? (
        <a href={linkUrl} className="mr-3 underline font-medium">
          {linkText || linkUrl}
        </a>
      ) : null}
    </div>
  );
}
