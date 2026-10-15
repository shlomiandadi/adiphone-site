import { getSeoAgentPageOverride } from './store';

function parseSchemaMarkup(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isBreadcrumbList(node: unknown): boolean {
  if (!node || typeof node !== 'object') return false;
  const type = (node as { '@type'?: unknown })['@type'];
  return type === 'BreadcrumbList' || (Array.isArray(type) && type.includes('BreadcrumbList'));
}

/** Drop a stored BreadcrumbList so the layout keeps the single Hebrew list. */
function omitBreadcrumbList(schema: unknown): unknown | null {
  if (!schema || typeof schema !== 'object') return schema;
  if (isBreadcrumbList(schema)) return null;
  const record = schema as { '@graph'?: unknown };
  if (!Array.isArray(record['@graph'])) return schema;
  const graph = record['@graph'].filter((node) => !isBreadcrumbList(node));
  if (graph.length === 0) return null;
  return { ...record, '@graph': graph };
}

/**
 * Injects override FAQ + JSON-LD for one path.
 * Renders nothing when the store has no override, so current pages stay unchanged.
 */
export async function SeoAgentPageExtras({ path }: { path: string }) {
  const override = await getSeoAgentPageOverride(path);
  if (!override) return null;

  const parsed = override.schemaMarkup ? parseSchemaMarkup(override.schemaMarkup) : null;
  // This path already emits one Hebrew BreadcrumbList from the layout.
  const schema = path === '/services/website-tadmit' ? omitBreadcrumbList(parsed) : parsed;
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
