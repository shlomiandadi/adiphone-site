'use client';

type ChatbotHoneypotProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export default function ChatbotHoneypot({ id, value, onChange }: ChatbotHoneypotProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      <label htmlFor={id}>Company</label>
      <input
        id={id}
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
