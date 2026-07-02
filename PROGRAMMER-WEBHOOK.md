# מדריך למתכנת — חיבור adi-phone.co.il ל-SEO Agent

מסמך זה מתאר את החיבור בין **SEO Agent** לאתר **Next.js** של adi-phone.co.il (פרויקט `adiphone-site`).

---

## סיכום מהיר

| צד | מה עושים |
|----|----------|
| **מתכנת** | Route קיים ב-`app/api/seo-agent/webhook/route.ts`, Secret ב-env, שמירה ל-Prisma/PostgreSQL |
| **משתמש** | מגדיר ב-SEO Agent: פלטפורמה Next.js, Webhook URL + Secret |
| **Secret** | אותה מחרוזת בדיוק בשני הצדדים |

---

## חלק א׳ — מה המתכנת חייב לעשות

### 1. API Route (כבר קיים)

```
app/api/seo-agent/webhook/route.ts
```

**URL סופי בפרודקשן:**

```
https://adi-phone.co.il/api/seo-agent/webhook
```

### 2. משתנה סביבה

```env
SEO_AGENT_WEBHOOK_SECRET=אותו-secret-שהמשתמש-מגדיר-ב-SEO-Agent
```

הגדרה ב-**Netlify** → Site configuration → Environment variables → Production.

### 3. אימות HMAC-SHA256

| כותרת | ערך |
|-------|-----|
| `Content-Type` | `application/json` |
| `User-Agent` | `SEO-Agent/1.0` |
| `X-SEO-Agent-Signature` | HMAC-SHA256 של גוף הבקשה הגולמי, מקודד hex |

```
signature = HMAC_SHA256(secret, rawBody).hexdigest()
```

- חשבו על הטקסט הגולמי **לפני** `JSON.parse`
- השוו עם `timingSafeEqual`
- חתימה לא תקינה → `401`

### 4. פרסור JSON ושמירה ב-DB

האתר שומר מאמרים בטבלת `Post` (Prisma). מיפוי שדות:

| שדה מ-SEO Agent | שדה ב-DB |
|-----------------|----------|
| `title` | `title` |
| `slug` | `slug` (ייחודי) |
| `content` | `content` (HTML) |
| `metaDescription` | `excerpt`, `metaDesc` |
| `seoTitle` | `metaTitle` |
| `status: "publish"` | `published: true` |
| `status: "draft"` | `published: false` |
| `ogImage` | `mainImage` |
| `images[].url` | `images[]` |

- אם `slug` כבר קיים → **עדכון** (upsert)
- קטגוריה ברירת מחדל: `seo`

### 5. תמונות

מגיעות כ-URL (לא base64):

```json
"images": [{ "url": "https://...", "alt": "...", "caption": "..." }]
```

האתר שומר את כתובות ה-URL ישירות (כמו שאר המאמרים). `ogImage` הופך ל-`mainImage`.

### 6. תגובת השרת

HTTP `200` + JSON:

```json
{
  "success": true,
  "url": "https://adi-phone.co.il/blog/my-slug",
  "id": "article-id-from-seo-agent",
  "postId": "cuid-from-database"
}
```

| שדה | שימוש |
|-----|-------|
| `url` | קישור למאמר באתר (מוצג למשתמש ב-SEO Agent) |
| `id` / `postId` | מזהה (אופציונלי) |

### 7. פריסה

- HTTPS חובה
- הגדירו `SEO_AGENT_WEBHOOK_SECRET` ב-Netlify
- אחרי שינוי env → **Trigger deploy**

---

## מבנה ה-Payload (JSON)

```typescript
{
  id: string;                    // מזהה ב-SEO Agent
  title: string;
  slug: string;
  content: string;               // HTML מלא + schema ב-<script>
  status: "draft" | "publish";
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  canonical?: string;
  schemaMarkup?: string;         // JSON-LD (גם מוטמע ב-content)
  images?: { url, alt, caption? }[];
  publishedAt?: string;          // ISO 8601
}
```

**חשוב:** אין `categories` / `tags` ב-Webhook. `content` כולל HTML מעוצב RTL + תג schema.

---

## בדיקה עם curl

```bash
# 1. הגדירו SECRET
SECRET="your-webhook-secret"
BODY='{"id":"test-1","title":"מאמר בדיקה","slug":"test-article","content":"<p>תוכן בדיקה</p>","status":"publish","seoTitle":"מאמר בדיקה","metaDescription":"תיאור קצר","ogTitle":"מאמר בדיקה","ogDescription":"תיאור OG"}'

# 2. חישוב חתימה (macOS/Linux)
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

# 3. שליחה
curl -X POST "https://adi-phone.co.il/api/seo-agent/webhook" \
  -H "Content-Type: application/json" \
  -H "X-SEO-Agent-Signature: $SIG" \
  -d "$BODY"
```

בדיקת חיים (GET):

```bash
curl https://adi-phone.co.il/api/seo-agent/webhook
```

---

## חלופה: Polling API

אם Webhook לא מתאים, SEO Agent תומך גם ב-Polling:

```
GET https://{seo-agent-host}/api/public/articles?siteId={SITE_ID}&status=published&limit=50
Authorization: Bearer {PUBLISH_API_KEY}
```

| שיטה | מתי להשתמש |
|------|------------|
| **Webhook** | מומלץ — פרסום מיידי |
| **Polling** | cron job שבודק מאמרים חדשים |

---

## מה המתכנת מחזיר למשתמש

| פריט | ערך |
|------|-----|
| Webhook URL | `https://adi-phone.co.il/api/seo-agent/webhook` |
| אישור Secret | "הגדרתי `SEO_AGENT_WEBHOOK_SECRET` ב-Netlify" |
| תבנית URL | `https://adi-phone.co.il/blog/{slug}` |

---

## מה המשתמש מגדיר ב-SEO Agent

1. פלטפורמה: **Next.js / React**
2. Webhook URL: `https://adi-phone.co.il/api/seo-agent/webhook`
3. **צור Secret** → העתקה גם ל-Netlify (`SEO_AGENT_WEBHOOK_SECRET`)
4. (אופציונלי) מפתח API ל-Polling
5. ברירת מחדל: טיוטה / פרסום מיידי
6. **שמור הגדרות פרסום**

---

## זרימת עבודה

```
משתמש לוחץ "פרסם" ב-SEO Agent
    → POST + X-SEO-Agent-Signature
    → האתר מאמת HMAC
    → שומר/מעדכן Post ב-PostgreSQL
    → מחזיר { success, url, id }
    → SEO Agent שומר publishedUrl ומציג למשתמש
```

---

## הערות טכניות

- Route ישן `app/api/seo-webhook/route.ts` מיועד לעדכון **מטא-SEO של עמודים** — לא למאמרים. אל תבלבלו ביניהם.
- מאמרים מוצגים ב: `/blog/{slug}`
- DB: Neon PostgreSQL דרך Prisma
