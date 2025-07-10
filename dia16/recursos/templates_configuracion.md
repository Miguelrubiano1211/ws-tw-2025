# 🔧 Configuraciones de Template - Día 16

## Docker Compose Template para Full-Stack App

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3001
    depends_on:
      - backend
    networks:
      - app-network

  # Backend Express
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/techstore
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    networks:
      - app-network
    volumes:
      - ./uploads:/app/uploads

  # MongoDB Database
  mongo:
    image: mongo:6.0
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=techstore
    volumes:
      - mongo_data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    networks:
      - app-network

  # Nginx Reverse Proxy
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

  # Certbot for SSL
  certbot:
    image: certbot/certbot
    restart: unless-stopped
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  mongo_data:

networks:
  app-network:
    driver: bridge
```

## Nginx Configuration Template

```nginx
# nginx/conf.d/default.conf
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;
    
    # Frontend - React App
    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://frontend:3000;
    }
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

# Apply rate limiting to API
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... rest of API configuration
}

# Apply stricter rate limiting to login
location /api/auth/login {
    limit_req zone=login burst=3 nodelay;
    # ... rest of login configuration
}
```

## Dockerfile Templates

### Frontend Dockerfile (Production)

```dockerfile
# frontend/Dockerfile.prod
# Multi-stage build for React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile (Production)

```dockerfile
# backend/Dockerfile.prod
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nextjs:nodejs . .

# Create uploads directory
RUN mkdir -p uploads && chown nextjs:nodejs uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
```

## Environment Templates

### Production Environment (.env.production)

```bash
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=mongodb://mongo:27017/techstore

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=https://your-domain.com

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Email (if applicable)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### Frontend Environment (.env.production)

```bash
# API Configuration
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_CDN_URL=https://cdn.your-domain.com

# Environment
REACT_APP_ENVIRONMENT=production

# Analytics (if applicable)
REACT_APP_GA_TRACKING_ID=GA-XXXXXXXXX-X

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_OFFLINE=true

# Build Configuration
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
```

## Health Check Script

```javascript
// backend/healthcheck.js
const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3001,
  path: '/api/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.log('Health check failed:', err);
  process.exit(1);
});

request.end();
```

## SSL Setup Script

```bash
#!/bin/bash
# ssl-setup.sh - Automated SSL certificate setup

DOMAIN="your-domain.com"
EMAIL="your-email@example.com"

echo "🔐 Setting up SSL certificate for $DOMAIN"

# Create directories
mkdir -p certbot/conf
mkdir -p certbot/www

# Get SSL certificate
docker run -it --rm --name certbot \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

echo "✅ SSL certificate obtained successfully"
echo "🔄 Restarting nginx to apply SSL..."

# Restart nginx to apply SSL
docker-compose restart nginx

echo "✅ SSL setup completed!"
```

## Backup and Restore Scripts

```bash
#!/bin/bash
# backup-restore.sh - Database backup and restore utilities

backup_database() {
    echo "🔄 Creating database backup..."
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    
    docker exec mongo mongodump --db techstore --out /tmp/$BACKUP_NAME
    docker cp mongo:/tmp/$BACKUP_NAME ./backups/
    
    echo "✅ Backup created: ./backups/$BACKUP_NAME"
}

restore_database() {
    if [ -z "$1" ]; then
        echo "❌ Please provide backup name"
        echo "Usage: ./backup-restore.sh restore backup_20231201_120000"
        exit 1
    fi
    
    BACKUP_NAME=$1
    echo "🔄 Restoring database from $BACKUP_NAME..."
    
    docker cp ./backups/$BACKUP_NAME mongo:/tmp/
    docker exec mongo mongorestore --db techstore --drop /tmp/$BACKUP_NAME/techstore
    
    echo "✅ Database restored successfully"
}

case "$1" in
    "backup")
        backup_database
        ;;
    "restore")
        restore_database $2
        ;;
    *)
        echo "Usage: $0 {backup|restore} [backup_name]"
        exit 1
        ;;
esac
```

## Monitoring Configuration

```yaml
# monitoring/docker-compose.monitoring.yml
version: '3.8'

services:
  # Prometheus for metrics
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  # Grafana for visualization
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

*Estos templates proporcionan una base sólida para el deployment en producción y pueden adaptarse según las necesidades específicas del proyecto.*
