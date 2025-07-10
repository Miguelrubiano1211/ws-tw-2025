# 🏗️ Proyecto Integrador Día 16: TechStore Production Deployment

**Duración:** 60 minutos  
**Dificultad:** ⭐⭐⭐⭐⭐  
**Objetivo:** Deployment completo de la aplicación TechStore optimizada con CI/CD, monitoring y high availability

## 🎯 Objetivos del Proyecto

Realizar el deployment completo de la aplicación TechStore en un entorno de producción utilizando todas las tecnologías y configuraciones aprendidas en el Día 16:

- **Containerización completa** con Docker multi-stage
- **Load balancing** y reverse proxy con Nginx
- **SSL/TLS** con certificados automáticos
- **Multi-domain setup** con subdominios optimizados
- **Monitoring y alerting** completo
- **CI/CD pipeline** automatizado

## 📋 Especificaciones del Proyecto

### **Arquitectura de Producción**

```
┌─────────────────────────────────────────────────────────────┐
│                    TECHSTORE PRODUCTION                     │
├─────────────────────────────────────────────────────────────┤
│  Internet Traffic                                           │
│       ↓                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Nginx     │    │ Let's Encrypt│    │  Cloudflare │     │
│  │ Load Balancer│    │  SSL Certs  │    │     CDN     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│       ↓                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   React     │    │   Express   │    │  MongoDB    │     │
│  │  Frontend   │    │   Backend   │    │  Database   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│       ↓                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Prometheus  │    │   Grafana   │    │ ELK Stack   │     │
│  │ Monitoring  │    │ Dashboards  │    │   Logging   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### **Dominios y Subdominios**

- **Principal:** `techstore.com` - Frontend React
- **API:** `api.techstore.com` - Backend Express
- **Admin:** `admin.techstore.com` - Panel administrativo
- **CDN:** `cdn.techstore.com` - Assets estáticos
- **Monitoring:** `monitoring.techstore.com` - Grafana/Prometheus

## 🚀 Fase 1: Preparación del Entorno (15 minutos)

### **1.1 Estructura del Proyecto**
Crear la estructura completa del deployment:

```bash
# Crear estructura del proyecto
mkdir -p techstore-production/{
  frontend,
  backend,
  nginx,
  monitoring,
  logging,
  ssl,
  scripts,
  docs
}

cd techstore-production
```

### **1.2 Configuración de Variables de Entorno**
Crear `.env.production`:

```env
# Production Environment Variables

# Application
NODE_ENV=production
APP_NAME=TechStore
APP_VERSION=1.0.0
APP_URL=https://techstore.com

# Database
MONGODB_URI=mongodb://techstore_user:${MONGODB_PASSWORD}@mongodb:27017/techstore_prod?authSource=admin
MONGODB_PASSWORD=super_secure_mongo_password_2024

# JWT & Security
JWT_SECRET=ultra_secure_jwt_secret_256_bits_production_2024
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_PASSWORD=super_secure_redis_password_2024

# SSL/TLS
SSL_CERT_PATH=/etc/nginx/ssl/techstore.com.crt
SSL_KEY_PATH=/etc/nginx/ssl/techstore.com.key

# Monitoring
PROMETHEUS_URL=http://prometheus:9090
GRAFANA_ADMIN_PASSWORD=secure_grafana_admin_2024
ALERTMANAGER_URL=http://alertmanager:9093

# Logging
ELASTICSEARCH_URL=http://elasticsearch:9200
KIBANA_URL=http://kibana:5601

# External Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@techstore.com
SMTP_PASS=${SMTP_PASSWORD}

# CDN
CDN_URL=https://cdn.techstore.com
IMAGE_OPTIMIZATION_API=https://api.imagekit.io/v1/techstore

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
HOTJAR_ID=HOTJAR_SITE_ID

# Performance
CACHE_TTL=3600
API_RATE_LIMIT=1000
UPLOAD_MAX_SIZE=10485760

# Feature Flags
ENABLE_MONITORING=true
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
ENABLE_REDIS_CACHE=true
```

### **1.3 Docker Compose Maestro**
Crear `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  # Frontend React con Nginx
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.production
      target: production
    container_name: techstore_frontend_prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - REACT_APP_API_URL=https://api.techstore.com
      - REACT_APP_CDN_URL=https://cdn.techstore.com
    volumes:
      - ./nginx/frontend.conf:/etc/nginx/conf.d/default.conf
    networks:
      - frontend_network
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=80"

  # Backend Express.js
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.production
    container_name: techstore_backend_prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=${REDIS_URL}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./logs/backend:/app/logs
    networks:
      - backend_network
      - database_network
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=3001"

  # MongoDB Database
  mongodb:
    image: mongo:6.0
    container_name: techstore_mongodb_prod
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGODB_PASSWORD}
      MONGO_INITDB_DATABASE: techstore_prod
    volumes:
      - mongodb_data:/data/db
      - ./mongodb/init:/docker-entrypoint-initdb.d
      - ./mongodb/mongod.conf:/etc/mongod.conf
    networks:
      - database_network
    ports:
      - "27017:27017"
    command: ["mongod", "--config", "/etc/mongod.conf"]
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: techstore_redis_prod
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - database_network
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Load Balancer & Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: techstore_nginx_prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites-available:/etc/nginx/sites-available
      - ./nginx/sites-enabled:/etc/nginx/sites-enabled
      - ./ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
      - certbot_webroot:/var/www/certbot
    networks:
      - frontend_network
      - backend_network
      - monitoring_network
    depends_on:
      - frontend
      - backend
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=9113"

  # Certbot para SSL
  certbot:
    image: certbot/certbot
    container_name: techstore_certbot_prod
    volumes:
      - certbot_certs:/etc/letsencrypt
      - certbot_webroot:/var/www/certbot
      - ./ssl:/etc/nginx/ssl
    command: >
      sh -c "while :; do
        certbot renew --quiet --webroot --webroot-path=/var/www/certbot;
        sleep 12h;
      done"
    depends_on:
      - nginx

# Volumes
volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local
  certbot_certs:
    driver: local
  certbot_webroot:
    driver: local

# Networks
networks:
  frontend_network:
    driver: bridge
  backend_network:
    driver: bridge
  database_network:
    driver: bridge
  monitoring_network:
    external: true
```

## 🔧 Fase 2: Configuración de Servicios (20 minutos)

### **2.1 Frontend Production Build**
Crear `frontend/Dockerfile.production`:

```dockerfile
# Multi-stage build para React en producción
FROM node:18-alpine as build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build optimized production bundle
ENV NODE_ENV=production
RUN pnpm run build

# Production stage con Nginx optimizado
FROM nginx:alpine as production

# Install additional tools
RUN apk add --no-cache curl

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy optimized nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### **2.2 Backend Production Build**
Crear `backend/Dockerfile.production`:

```dockerfile
# Multi-stage build para Node.js backend
FROM node:18-alpine as build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install all dependencies including dev
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build/compile if needed (TypeScript, etc.)
RUN npm run build 2>/dev/null || echo "No build script found"

# Production stage
FROM node:18-alpine as production

# Install system dependencies
RUN apk add --no-cache \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --only=production --frozen-lockfile

# Copy built application
COPY --from=build /app/src ./src
COPY --from=build /app/dist ./dist 2>/dev/null || echo "No dist directory"

# Create uploads and logs directories
RUN mkdir -p uploads logs && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Expose port
EXPOSE 3001

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["pnpm", "start"]
```

### **2.3 Nginx Master Configuration**
Crear `nginx/nginx.conf`:

```nginx
# Nginx Master Configuration - Production TechStore

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

# Worker configuration
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Basic settings
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 100;
    types_hash_max_size 2048;
    server_tokens off;

    # Buffer settings
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    client_max_body_size 20m;
    large_client_header_buffers 4 4k;

    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml
        application/x-font-ttf
        application/vnd.ms-fontobject
        font/opentype;

    # Brotli compression (if module available)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;

    # Cache paths
    proxy_cache_path /var/cache/nginx/api levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;
    proxy_cache_path /var/cache/nginx/static levels=1:2 keys_zone=static_cache:10m max_size=2g inactive=24h;

    # Upstream definitions
    upstream backend_api {
        least_conn;
        server backend:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    upstream frontend_app {
        server frontend:80;
        keepalive 16;
    }

    # Include additional configurations
    include /etc/nginx/sites-enabled/*;

    # Default server (catch-all)
    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        return 444;
    }
}
```

## 📊 Fase 3: Monitoring y Logging Setup (15 minutos)

### **3.1 Inicializar Monitoring Stack**
```bash
# Iniciar stack de monitoring
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Verificar servicios de monitoring
docker-compose -f monitoring/docker-compose.monitoring.yml ps
```

### **3.2 Configurar Dashboards de Grafana**
Crear `monitoring/grafana/dashboards/techstore-production.json`:

```json
{
  "dashboard": {
    "id": null,
    "title": "TechStore Production - Complete Overview",
    "tags": ["techstore", "production", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Service Health",
        "type": "stat",
        "gridPos": {"h": 8, "w": 6, "x": 0, "y": 0},
        "targets": [
          {
            "expr": "up{job=\"techstore-backend\"}",
            "legendFormat": "Backend"
          },
          {
            "expr": "up{job=\"techstore-frontend\"}",
            "legendFormat": "Frontend"
          },
          {
            "expr": "up{job=\"mongodb\"}",
            "legendFormat": "Database"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {"mode": "thresholds"},
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "green", "value": 1}
              ]
            },
            "mappings": [
              {"type": "value", "value": "1", "text": "UP"},
              {"type": "value", "value": "0", "text": "DOWN"}
            ]
          }
        }
      },
      {
        "id": 2,
        "title": "Business Metrics",
        "type": "stat",
        "gridPos": {"h": 8, "w": 6, "x": 6, "y": 0},
        "targets": [
          {
            "expr": "techstore_total_users",
            "legendFormat": "Total Users"
          },
          {
            "expr": "techstore_total_orders",
            "legendFormat": "Total Orders"
          },
          {
            "expr": "techstore_daily_revenue",
            "legendFormat": "Daily Revenue ($)"
          }
        ]
      },
      {
        "id": 3,
        "title": "Request Rate & Response Time",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0},
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"techstore-backend\"}[5m])",
            "legendFormat": "Requests/sec"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job=\"techstore-backend\"}[5m]))",
            "legendFormat": "95th percentile latency"
          }
        ]
      },
      {
        "id": 4,
        "title": "System Resources",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8},
        "targets": [
          {
            "expr": "100 - (avg by(instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[2m])) * 100)",
            "legendFormat": "CPU Usage %"
          },
          {
            "expr": "(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100",
            "legendFormat": "Memory Usage %"
          }
        ]
      },
      {
        "id": 5,
        "title": "Error Rate",
        "type": "graph",
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8},
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"techstore-backend\",status=~\"5..\"}[5m]) / rate(http_requests_total{job=\"techstore-backend\"}[5m]) * 100",
            "legendFormat": "Error Rate %"
          }
        ]
      }
    ],
    "time": {"from": "now-1h", "to": "now"},
    "refresh": "30s"
  }
}
```

### **3.3 Configurar Alertas de Producción**
Crear `monitoring/prometheus/rules/production-alerts.yml`:

```yaml
groups:
  - name: techstore.production
    rules:
      # Critical: Service Down
      - alert: ServiceDown
        expr: up{job=~"techstore-.*"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.job }} service is down"
          description: "Service {{ $labels.job }} has been down for more than 1 minute"

      # Critical: High Error Rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{job="techstore-backend",status=~"5.."}[5m]) / rate(http_requests_total{job="techstore-backend"}[5m]) * 100 > 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% for more than 5 minutes"

      # Warning: High Response Time
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="techstore-backend"}[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"

      # Warning: Low Disk Space
      - alert: LowDiskSpace
        expr: (node_filesystem_size_bytes{fstype!="tmpfs"} - node_filesystem_free_bytes{fstype!="tmpfs"}) / node_filesystem_size_bytes{fstype!="tmpfs"} * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Low disk space"
          description: "Disk usage is {{ $value }}% on {{ $labels.instance }}"
```

## 🚀 Fase 4: Deployment y CI/CD (10 minutos)

### **4.1 Script de Deployment**
Crear `scripts/deploy.sh`:

```bash
#!/bin/bash

# TechStore Production Deployment Script

set -e

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Variables
DEPLOYMENT_ENV=${1:-production}
BUILD_VERSION=${BUILD_VERSION:-$(date +%Y%m%d%H%M%S)}
BACKUP_DIR="./backups/${BUILD_VERSION}"

log "🚀 Starting TechStore deployment to $DEPLOYMENT_ENV"
log "📦 Build version: $BUILD_VERSION"

# Pre-deployment checks
log "🔍 Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running"
fi

# Check if required environment files exist
if [ ! -f ".env.$DEPLOYMENT_ENV" ]; then
    error "Environment file .env.$DEPLOYMENT_ENV not found"
fi

# Check available disk space
AVAILABLE_SPACE=$(df . | awk 'NR==2 {print $4}')
if [ $AVAILABLE_SPACE -lt 5000000 ]; then
    warning "Low disk space available: ${AVAILABLE_SPACE}KB"
fi

success "Pre-deployment checks passed"

# Backup current deployment
log "💾 Creating backup of current deployment..."
mkdir -p $BACKUP_DIR

if docker-compose ps | grep -q "Up"; then
    log "Backing up database..."
    docker-compose exec -T mongodb mongodump --out /tmp/backup
    docker cp techstore_mongodb_prod:/tmp/backup $BACKUP_DIR/mongodb
    success "Database backup created"
fi

# Build new images
log "🔨 Building new Docker images..."

# Build backend
log "Building backend image..."
docker build -t techstore/backend:$BUILD_VERSION -f backend/Dockerfile.production ./backend
docker tag techstore/backend:$BUILD_VERSION techstore/backend:latest

# Build frontend
log "Building frontend image..."
docker build -t techstore/frontend:$BUILD_VERSION -f frontend/Dockerfile.production ./frontend
docker tag techstore/frontend:$BUILD_VERSION techstore/frontend:latest

success "Docker images built successfully"

# Update docker-compose with new image tags
log "📝 Updating docker-compose configuration..."
sed -i.bak "s/techstore\/backend:latest/techstore\/backend:$BUILD_VERSION/g" docker-compose.production.yml
sed -i.bak "s/techstore\/frontend:latest/techstore\/frontend:$BUILD_VERSION/g" docker-compose.production.yml

# Deploy new version
log "🚀 Deploying new version..."

# Deploy with zero-downtime using rolling update
docker-compose -f docker-compose.production.yml up -d --force-recreate --no-deps backend
sleep 10

# Health check for backend
log "🏥 Performing health check on backend..."
for i in {1..30}; do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        success "Backend health check passed"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Backend health check failed after 30 attempts"
    fi
    sleep 2
done

# Deploy frontend
docker-compose -f docker-compose.production.yml up -d --force-recreate --no-deps frontend
sleep 5

# Final health check
log "🏥 Performing final health checks..."
ENDPOINTS=(
    "http://localhost"
    "http://localhost/health"
    "http://localhost:3001/health"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -f "$endpoint" > /dev/null 2>&1; then
        success "✅ $endpoint is healthy"
    else
        warning "❌ $endpoint is not responding"
    fi
done

# Update monitoring
log "📊 Updating monitoring configuration..."
docker-compose -f monitoring/docker-compose.monitoring.yml up -d --force-recreate prometheus grafana

# Send deployment notification
log "📢 Sending deployment notification..."
curl -X POST http://localhost:9093/api/v1/alerts \
  -H 'Content-Type: application/json' \
  -d "[{
    \"labels\": {
      \"alertname\": \"DeploymentComplete\",
      \"severity\": \"info\",
      \"version\": \"$BUILD_VERSION\"
    },
    \"annotations\": {
      \"summary\": \"TechStore deployment completed\",
      \"description\": \"Version $BUILD_VERSION deployed successfully to $DEPLOYMENT_ENV\"
    }
  }]" || warning "Failed to send deployment notification"

# Performance test
log "⚡ Running performance tests..."
for i in {1..10}; do
    curl -w "@curl-format.txt" -o /dev/null -s "http://localhost" >> perf-test.log
done

AVERAGE_TIME=$(awk '{sum += $1} END {print sum/NR}' perf-test.log)
log "📈 Average response time: ${AVERAGE_TIME}ms"

# Cleanup
log "🧹 Cleaning up old images..."
docker image prune -f
docker volume prune -f

success "🎉 Deployment completed successfully!"
log "📋 Deployment Summary:"
log "   Version: $BUILD_VERSION"
log "   Environment: $DEPLOYMENT_ENV"
log "   Backup: $BACKUP_DIR"
log "   Average response time: ${AVERAGE_TIME}ms"
log "   🌐 Application: http://localhost"
log "   📊 Monitoring: http://localhost:3000"
log "   📊 Prometheus: http://localhost:9090"

# Save deployment info
cat > deployment-info.json << EOF
{
  "version": "$BUILD_VERSION",
  "environment": "$DEPLOYMENT_ENV",
  "deployedAt": "$(date -Iseconds)",
  "backupLocation": "$BACKUP_DIR",
  "averageResponseTime": "$AVERAGE_TIME",
  "services": {
    "frontend": "techstore/frontend:$BUILD_VERSION",
    "backend": "techstore/backend:$BUILD_VERSION"
  }
}
EOF

success "Deployment info saved to deployment-info.json"
```

## ✅ Validación y Testing

### **1. Smoke Tests**
```bash
# Test básico de conectividad
curl -I https://techstore.com
curl -I https://api.techstore.com/health
curl -I https://admin.techstore.com

# Test de SSL
openssl s_client -connect techstore.com:443 -servername techstore.com
```

### **2. Performance Tests**
```bash
# Load testing con Apache Bench
ab -n 1000 -c 10 https://techstore.com/

# Monitoring durante load test
watch curl -s http://localhost:9090/api/v1/query?query=rate(http_requests_total[1m])
```

### **3. Monitoring Validation**
```bash
# Verificar métricas en Prometheus
curl http://localhost:9090/api/v1/query?query=up

# Verificar dashboards en Grafana
curl -u admin:admin123 http://localhost:3000/api/dashboards/home
```

## 🏆 Criterios de Evaluación

### **Funcionalidad (40 puntos)**
- [ ] **Aplicación funcionando** en todos los dominios (10 pts)
- [ ] **API endpoints** respondiendo correctamente (10 pts)
- [ ] **Base de datos** conectada y operacional (10 pts)
- [ ] **Cache Redis** funcionando (10 pts)

### **Seguridad (25 puntos)**
- [ ] **SSL/TLS** configurado correctamente (10 pts)
- [ ] **Security headers** implementados (8 pts)
- [ ] **Rate limiting** funcionando (7 pts)

### **Performance (20 puntos)**
- [ ] **Response time** < 200ms (10 pts)
- [ ] **Load balancing** funcionando (5 pts)
- [ ] **Caching** optimizado (5 pts)

### **Monitoring (15 puntos)**
- [ ] **Métricas** recolectándose (8 pts)
- [ ] **Alertas** configuradas (7 pts)

## 📝 Entregables

1. **Aplicación desplegada** y funcionando en producción
2. **Documentación completa** del deployment
3. **Scripts de automatización** para CI/CD
4. **Configuración de monitoring** completa
5. **Plan de rollback** y recuperación

## 🎯 Resultado Esperado

Al completar este proyecto integrador, tendrás:

- ✅ **Aplicación TechStore** desplegada en producción
- ✅ **Arquitectura escalable** con load balancing
- ✅ **Seguridad de nivel enterprise** con SSL/TLS
- ✅ **Monitoring completo** con alerting
- ✅ **CI/CD pipeline** automatizado
- ✅ **Documentación técnica** completa

**¡Una aplicación production-ready que compite a nivel mundial! 🌍🏆**
