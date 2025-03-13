# Digital Agency Website

## התקנה והפעלה

### דרישות מקדימות
- Node.js 18 ומעלה
- MongoDB
- חשבון SMTP (למשל Gmail) לשליחת מיילים

### התקנה מקומית
1. התקן את הדיפנדנסיז:
```bash
npm install
```

2. צור קובץ `.env.local` והעתק את התוכן מ-`.env.example`
3. עדכן את המשתנים הסביבתיים בהתאם לפרטי החיבור שלך

### הפעלה בסביבת פיתוח
```bash
npm run dev
```

### בנייה והעלאה לשרת
1. בנה את הפרויקט:
```bash
npm run build
```

2. בדוק את הבילד:
```bash
npm run start
```

3. העלאה לשרת:
- העתק את כל הקבצים לשרת
- התקן את הדיפנדנסיז: `npm install --production`
- הגדר את משתני הסביבה בשרת
- הפעל את השרת עם PM2: `pm2 start npm --name "digital-agency" -- start`

### תצורת שרת מומלצת
- Ubuntu 20.04 LTS
- Nginx כ-reverse proxy
- PM2 לניהול תהליכים
- Let's Encrypt לתעודת SSL
- MongoDB Atlas לאחסון נתונים

### הגדרת Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### תחזוקה
- גיבוי אוטומטי של מסד הנתונים
- ניטור שרת עם PM2
- בדיקת לוגים: `pm2 logs digital-agency`
- עדכון גרסאות: `npm update`

### אבטחה
- וודא שכל הסיסמאות והמפתחות מאוחסנים כמשתני סביבה
- הגדר חומת אש (UFW)
- עדכן את מערכת ההפעלה והחבילות באופן קבוע
- הגדר HTTPS עם Let's Encrypt
- הגדר rate limiting ב-Nginx
