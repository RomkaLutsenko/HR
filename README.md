<!-- app.service ================================================================ -->
[Unit]
Description=Next.js Application
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/client
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=3
User=root
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target


<!-- bot.service ================================================================ -->
[Unit]
Description=Telegram Bot
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/bot
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=3
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target


<!-- postgres.service ================================================================ -->
[Unit]
Description=PostgreSQL via docker-compose
After=network.target docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/srv/client
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target


<!-- Перезагрузка конфигурации Systemd: ================================================================ -->
sudo systemctl daemon-reload

<!-- Запуск сервисов: ================================================================ -->
sudo systemctl start app
sudo systemctl start bot
sudo systemctl start server
sudo systemctl start postgres

sudo systemctl restart app


<!-- Проверка статуса: ================================================================ -->
sudo systemctl status app
sudo systemctl status bot

<!-- Включение авто-запуска: ================================================================ -->
sudo systemctl enable next-app
sudo systemctl enable telegram-bot
sudo systemctl enable server


<!-- NGINX ========= -->
server {
    listen 443 ssl;
    server_name bazarok.ru www.bazarok.ru;

    ssl_certificate /srv/ssl/bazarok_ru.full.crt; # Укажите путь к сертификату
    ssl_certificate_key /srv/ssl/bazarok_ru.key; # Укажите путь к ключу

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /bot {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}