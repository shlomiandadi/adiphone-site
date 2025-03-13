#!/bin/bash

# צבעים להדפסה
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting deployment script for adi-phone.co.il${NC}"

# עדכון חבילות המערכת
echo -e "${GREEN}Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# התקנת Node.js
echo -e "${GREEN}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# התקנת כלי build
echo -e "${GREEN}Installing build tools...${NC}"
sudo apt-get install -y build-essential

# התקנת Nginx
echo -e "${GREEN}Installing Nginx...${NC}"
sudo apt-get install -y nginx

# התקנת Certbot
echo -e "${GREEN}Installing Certbot...${NC}"
sudo apt-get install -y certbot python3-certbot-nginx

# התקנת PM2
echo -e "${GREEN}Installing PM2...${NC}"
sudo npm install -g pm2

# יצירת תיקיות לפרויקט
echo -e "${GREEN}Creating project directories...${NC}"
sudo mkdir -p /var/www/adi-phone.co.il
sudo mkdir -p /var/www/api.adi-phone.co.il

# הגדרת הרשאות
echo -e "${GREEN}Setting up permissions...${NC}"
sudo chown -R $USER:$USER /var/www/adi-phone.co.il
sudo chown -R $USER:$USER /var/www/api.adi-phone.co.il

# הגדרת Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/adi-phone.co.il > /dev/null <<EOL
# Frontend
server {
    listen 80;
    server_name adi-phone.co.il www.adi-phone.co.il;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name adi-phone.co.il www.adi-phone.co.il;

    root /var/www/adi-phone.co.il;
    index index.html;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.adi-phone.co.il;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name api.adi-phone.co.il;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# הפעלת האתר ב-Nginx
echo -e "${GREEN}Enabling Nginx site...${NC}"
sudo ln -s /etc/nginx/sites-available/adi-phone.co.il /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# בדיקת תצורת Nginx
echo -e "${GREEN}Testing Nginx configuration...${NC}"
sudo nginx -t

# הפעלה מחדש של Nginx
echo -e "${GREEN}Restarting Nginx...${NC}"
sudo systemctl restart nginx

# הגדרת SSL
echo -e "${GREEN}Setting up SSL certificates...${NC}"
sudo certbot --nginx -d adi-phone.co.il -d www.adi-phone.co.il
sudo certbot --nginx -d api.adi-phone.co.il

# העתקת קבצי הפרויקט
echo -e "${GREEN}Copying project files...${NC}"
# Frontend
cd /var/www/adi-phone.co.il
git clone https://github.com/yourusername/adiphone-site.git .
npm install
npm run build

# Backend
cd /var/www/api.adi-phone.co.il
cp -r /path/to/your/server/* .
npm install

# יצירת קובץ .env לשרת
echo -e "${GREEN}Creating .env file for backend...${NC}"
cat > /var/www/api.adi-phone.co.il/.env <<EOL
DATABASE_URL="mongodb+srv://adiphone:5x5DBrdt8tCRx67@clustertest.tz78h.mongodb.net/myapp?retryWrites=true&w=majority&appName=Clustertest"
MONGODB_URI="mongodb+srv://adiphone:5x5DBrdt8tCRx67@clustertest.tz78h.mongodb.net/myapp?retryWrites=true&w=majority&appName=Clustertest"

JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=shlomiandadi@gmail.com
EMAIL_PASS=vqzf pcsn fpxl qiwa
EOL

# הפעלת השרתים עם PM2
echo -e "${GREEN}Starting servers with PM2...${NC}"
cd /var/www/adi-phone.co.il
pm2 start npm --name "frontend" -- start

cd /var/www/api.adi-phone.co.il
pm2 start npm --name "backend" -- start

# שמירת תצורת PM2
echo -e "${GREEN}Saving PM2 configuration...${NC}"
pm2 save

# הגדרת PM2 להפעלה בעת אתחול המערכת
echo -e "${GREEN}Setting up PM2 startup...${NC}"
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo -e "${BLUE}Deployment completed!${NC}"
echo -e "${BLUE}Please check the following:${NC}"
echo "1. Frontend: https://adi-phone.co.il"
echo "2. Backend: https://api.adi-phone.co.il"
echo "3. PM2 status: pm2 status"
echo "4. Nginx status: sudo systemctl status nginx" 