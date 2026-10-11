import { getSeoAgentPageOverride } from './store';

function parseSchemaMarkup(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Injects override FAQ + JSON-LD for one path.
 * Renders nothing when the store has no override, so current pages stay unchanged.
 */
export async function SeoAgentPageExtras({ path }: { path: string }) {
  const override = await getSeoAgentPageOverride(path);
  if (!override) return null;

  const schema = override.schemaMarkup ? parseSchemaMarkup(override.schemaMarkup) : null;
  const faq = override.faq || [];

  if (!schema && faq.length === 0) return null;

  return (
    <>
      {schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ) : null}
      {faq.length > 0 ? (
        <section
          data-seo-agent-faq
          className="py-16 bg-gray-50"
          aria-labelledby="seo-agent-faq-title"
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2
              id="seo-agent-faq-title"
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
            >
              שאלות נפוצות
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="bg-white rounded-xl shadow-md border border-gray-100 px-6 py-5"
                >
                  <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
                    {item.question}
                  </summary>
                  <p className="pt-4 text-gray-600 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
