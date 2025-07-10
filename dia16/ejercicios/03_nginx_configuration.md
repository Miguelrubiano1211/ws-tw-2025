# 🌐 Ejercicio 3: Nginx Reverse Proxy Configuration

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐⭐  
**Prerrequisitos:** Ejercicios 1 y 2 completados (Docker y Production Builds)

## 🎯 Objetivos

- Configurar Nginx como reverse proxy avanzado
- Implementar load balancing para múltiples instancias
- Configurar caching estratégico y compresión
- Optimizar serving de assets estáticos
- Implementar rate limiting y security headers

## 📋 Instrucciones

### **Paso 1: Configuración Principal de Nginx (15 minutos)**

#### **1.1 Estructura de Configuración**
Crear directorio y archivos de configuración:

```bash
mkdir -p nginx/{conf.d,sites-available,sites-enabled,ssl,logs}
```

#### **1.2 Configuración Principal**
Crear `nginx/nginx.conf`:

```nginx
# Configuración principal de Nginx optimizada para producción
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

# Eventos y conexiones
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

# Configuración HTTP
http {
    # MIME types
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format personalizado
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    # Configuración de acceso
    access_log /var/log/nginx/access.log main;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Buffer sizes
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    client_max_body_size 10m;
    large_client_header_buffers 4 4k;

    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_requests 100;
    send_timeout 10;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;

    # Upstream definitions
    upstream backend_api {
        least_conn;
        server backend1:3001 max_fails=3 fail_timeout=30s;
        server backend2:3001 max_fails=3 fail_timeout=30s backup;
        keepalive 32;
    }

    upstream frontend_app {
        server frontend:80;
        keepalive 16;
    }

    # Cache paths
    proxy_cache_path /var/cache/nginx/api 
                     levels=1:2 
                     keys_zone=api_cache:10m 
                     max_size=1g 
                     inactive=60m 
                     use_temp_path=off;

    proxy_cache_path /var/cache/nginx/static 
                     levels=1:2 
                     keys_zone=static_cache:10m 
                     max_size=2g 
                     inactive=24h 
                     use_temp_path=off;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

#### **1.3 Configuración del Servidor Principal**
Crear `nginx/sites-available/techstore.conf`:

```nginx
# Configuración principal para TechStore
server {
    listen 80;
    listen [::]:80;
    server_name techstore.local www.techstore.local;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Root y index
    root /var/www/html;
    index index.html index.htm;

    # Logging específico del sitio
    access_log /var/log/nginx/techstore_access.log main;
    error_log /var/log/nginx/techstore_error.log;

    # === STATIC ASSETS OPTIMIZATION ===
    
    # Assets con cache largo (JS, CSS, fonts, images)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # Compression específica para assets
        gzip_static on;
        
        # CORS para fonts
        if ($request_filename ~* ^.*?\.(eot|ttf|woff|woff2)$) {
            add_header Access-Control-Allow-Origin "*";
        }
        
        # Fallback al frontend si no existe
        try_files $uri @frontend;
    }

    # HTML files - cache corto
    location ~* \.html$ {
        expires 5m;
        add_header Cache-Control "public, must-revalidate";
        add_header Vary "Accept-Encoding";
        try_files $uri @frontend;
    }

    # === API PROXY CONFIGURATION ===
    
    # API routes con rate limiting
    location /api/ {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        limit_conn conn_limit_per_ip 10;

        # Proxy configuration
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;

        # Cache configuration para API
        proxy_cache api_cache;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_bypass $http_cache_control;
        add_header X-Cache-Status $upstream_cache_status;

        # Headers para cache
        proxy_ignore_headers Cache-Control;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=600";
    }

    # Auth endpoints con rate limiting estricto
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        limit_conn conn_limit_per_ip 5;

        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # No cache para auth
        proxy_cache off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # === FRONTEND CONFIGURATION ===
    
    # Frontend React app
    location / {
        try_files $uri $uri/ @frontend;
    }

    # Fallback para SPA routing
    location @frontend {
        proxy_pass http://frontend_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Cache para SPA
        proxy_cache static_cache;
        proxy_cache_valid 200 1h;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # === HEALTH CHECKS ===
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Nginx status (solo desde localhost)
    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        allow ::1;
        deny all;
    }

    # === ERROR PAGES ===
    
    # Custom error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /404.html {
        root /var/www/error;
        internal;
    }
    
    location = /50x.html {
        root /var/www/error;
        internal;
    }

    # === SECURITY ===
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Deny access to backup files
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Robots.txt
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # Favicon
    location = /favicon.ico {
        log_not_found off;
        access_log off;
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
}
```

### **Paso 2: Load Balancing Avanzado (10 minutos)**

#### **2.1 Configuración Multi-Instancia**
Crear `nginx/conf.d/upstream.conf`:

```nginx
# Configuración avanzada de upstream para load balancing

# Backend API con múltiples estrategias
upstream backend_primary {
    # Estrategia: least_conn (menos conexiones)
    least_conn;
    
    # Servidores primarios
    server backend1:3001 weight=3 max_fails=3 fail_timeout=30s;
    server backend2:3001 weight=2 max_fails=3 fail_timeout=30s;
    server backend3:3001 weight=1 max_fails=3 fail_timeout=30s;
    
    # Servidor de backup
    server backend_backup:3001 backup weight=1;
    
    # Configuración de keepalive
    keepalive 32;
    keepalive_requests 100;
    keepalive_timeout 60s;
}

# Upstream específico para uploads
upstream backend_uploads {
    # Para uploads usar ip_hash para consistencia
    ip_hash;
    
    server backend1:3001 max_fails=2 fail_timeout=20s;
    server backend2:3001 max_fails=2 fail_timeout=20s;
    
    keepalive 16;
}

# Upstream para WebSockets
upstream backend_websockets {
    # Para WebSockets usar ip_hash
    ip_hash;
    
    server backend1:3001;
    server backend2:3001;
    
    # Configuración específica para WebSockets
    keepalive 8;
}

# Upstream para servicios de solo lectura
upstream backend_readonly {
    # Round robin para distribución uniforme
    server backend_read1:3001 weight=2;
    server backend_read2:3001 weight=2;
    server backend_read3:3001 weight=1;
    
    keepalive 16;
}

# Health check configuration
upstream backend_health {
    server backend1:3001;
    server backend2:3001;
    
    # Health check cada 30 segundos
    check interval=30000 rise=2 fall=3 timeout=5000 type=http;
    check_http_send "GET /health HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}
```

#### **2.2 Configuración de Routing Inteligente**
Crear `nginx/conf.d/smart_routing.conf`:

```nginx
# Configuración de routing inteligente basado en content-type y URL

# Map para determinar upstream basado en request
map $request_uri $backend_pool {
    default "backend_primary";
    ~^/api/upload backend_uploads;
    ~^/api/websocket backend_websockets;
    ~^/api/(products|categories|search) backend_readonly;
    ~^/api/health backend_health;
}

# Map para cache TTL basado en endpoint
map $request_uri $cache_ttl {
    default "10m";
    ~^/api/products "1h";
    ~^/api/categories "6h";
    ~^/api/auth "no-cache";
    ~^/api/user "5m";
}

# Map para rate limiting basado en endpoint
map $request_uri $rate_limit_zone {
    default "api";
    ~^/api/auth "login";
    ~^/api/upload "upload";
}

# Configuración de geo-blocking (ejemplo)
geo $geo_block {
    default 0;
    # Bloquear rangos específicos si es necesario
    # 10.0.0.0/8 1;
}

# Map para CORS específico por origen
map $http_origin $cors_origin {
    default "";
    ~^https?://(www\.)?techstore\.com$ "$http_origin";
    ~^https?://(www\.)?staging\.techstore\.com$ "$http_origin";
    ~^https?://localhost(:[0-9]+)?$ "$http_origin";
}
```

### **Paso 3: Caching Estratégico (10 minutos)**

#### **3.1 Configuración de Cache Avanzada**
Crear `nginx/conf.d/cache.conf`:

```nginx
# Configuración avanzada de caching

# Definición de zonas de cache
proxy_cache_path /var/cache/nginx/api
    levels=1:2
    keys_zone=api_cache:50m
    max_size=500m
    inactive=1h
    use_temp_path=off
    loader_threshold=300
    loader_files=200;

proxy_cache_path /var/cache/nginx/static
    levels=1:2
    keys_zone=static_cache:100m
    max_size=2g
    inactive=24h
    use_temp_path=off;

proxy_cache_path /var/cache/nginx/media
    levels=1:2
    keys_zone=media_cache:200m
    max_size=5g
    inactive=7d
    use_temp_path=off;

# Cache key personalizada
proxy_cache_key "$scheme$request_method$host$request_uri$is_args$args";

# Configuración de cache por ubicación
location ~* ^/api/(products|categories)/ {
    proxy_pass http://backend_readonly;
    
    # Cache configuration
    proxy_cache api_cache;
    proxy_cache_valid 200 302 1h;
    proxy_cache_valid 301 12h;
    proxy_cache_valid 404 5m;
    proxy_cache_valid any 1m;
    
    # Cache control headers
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_lock on;
    proxy_cache_lock_timeout 5s;
    
    # Cache bypass conditions
    proxy_cache_bypass $http_cache_control $cookie_nocache $arg_nocache;
    proxy_no_cache $http_cache_control $cookie_nocache $arg_nocache;
    
    # Headers
    add_header X-Cache-Status $upstream_cache_status always;
    add_header X-Cache-Key "$scheme$request_method$host$request_uri$is_args$args";
    
    # Proxy headers
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Cache para imágenes y media
location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    
    # Proxy cache para assets
    proxy_cache media_cache;
    proxy_cache_valid 200 1y;
    proxy_cache_valid 404 1h;
    
    # Serve from cache even if backend is down
    proxy_cache_use_stale error timeout invalid_header updating;
    
    try_files $uri @frontend;
}

# Cache purging endpoint (para CI/CD)
location ~* ^/cache-purge/(.*)$ {
    allow 127.0.0.1;
    allow 172.0.0.0/8;  # Docker networks
    deny all;
    
    proxy_cache_purge api_cache "$scheme$request_method$host/$1$is_args$args";
}
```

#### **3.2 Cache Warming Script**
Crear `nginx/scripts/cache-warm.sh`:

```bash
#!/bin/bash

# Script para pre-calentar cache de Nginx

echo "🔥 Iniciando cache warming para TechStore..."

# URLs críticas para pre-cargar
URLS=(
    "http://localhost/api/products"
    "http://localhost/api/categories"
    "http://localhost/api/products/featured"
    "http://localhost/api/products/bestsellers"
    "http://localhost/"
    "http://localhost/products"
    "http://localhost/categories"
)

# Headers para simular requests reales
HEADERS=(
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    "Accept-Language: es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3"
    "Accept-Encoding: gzip, deflate"
    "Connection: keep-alive"
)

# Función para hacer request con retry
make_request() {
    local url=$1
    local retries=3
    local delay=1
    
    for i in $(seq 1 $retries); do
        echo "📡 Warming: $url (attempt $i/$retries)"
        
        if curl -s -w "Status: %{http_code}, Time: %{time_total}s\n" \
               -H "User-Agent: Cache-Warmer/1.0" \
               -H "Cache-Control: no-cache" \
               "$url" > /dev/null; then
            echo "✅ Success: $url"
            break
        else
            echo "❌ Failed: $url (attempt $i)"
            sleep $delay
            delay=$((delay * 2))
        fi
    done
}

# Warm critical pages
echo "🌟 Warming critical pages..."
for url in "${URLS[@]}"; do
    make_request "$url"
    sleep 0.5
done

# Warm with different user agents
echo "📱 Warming with mobile user agent..."
for url in "${URLS[@]}"; do
    curl -s -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" \
         "$url" > /dev/null
done

# Warm API endpoints with pagination
echo "📄 Warming paginated content..."
for page in {1..5}; do
    make_request "http://localhost/api/products?page=$page&limit=12"
done

echo "✅ Cache warming completado!"

# Verificar cache status
echo "📊 Cache status:"
curl -s "http://localhost/nginx_status" 2>/dev/null || echo "Status endpoint not available"
```

### **Paso 4: Monitoreo y Logging (10 minutos)**

#### **4.1 Configuración de Logs Avanzada**
Crear `nginx/conf.d/logging.conf`:

```nginx
# Configuración avanzada de logging

# Log format para análisis detallado
log_format detailed '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   '"$http_x_forwarded_for" '
                   'rt=$request_time '
                   'uct="$upstream_connect_time" '
                   'uht="$upstream_header_time" '
                   'urt="$upstream_response_time" '
                   'cache="$upstream_cache_status" '
                   'host="$host"';

# Log format para JSON (para ELK stack)
log_format json_combined escape=json
    '{'
        '"time_local":"$time_local",'
        '"remote_addr":"$remote_addr",'
        '"remote_user":"$remote_user",'
        '"request":"$request",'
        '"status":"$status",'
        '"body_bytes_sent":"$body_bytes_sent",'
        '"request_time":"$request_time",'
        '"http_referrer":"$http_referer",'
        '"http_user_agent":"$http_user_agent",'
        '"http_x_forwarded_for":"$http_x_forwarded_for",'
        '"upstream_cache_status":"$upstream_cache_status",'
        '"upstream_response_time":"$upstream_response_time",'
        '"host":"$host",'
        '"server_name":"$server_name"'
    '}';

# Log format para performance monitoring
log_format performance '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $bytes_sent '
                      'rt=$request_time '
                      'uct="$upstream_connect_time" '
                      'uht="$upstream_header_time" '
                      'urt="$upstream_response_time" '
                      'cache="$upstream_cache_status" '
                      'gzip_ratio="$gzip_ratio"';

# Logging condicional para diferentes tipos de requests
map $request_uri $loggable {
    default 1;
    ~*\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ 0;
    ~/health 0;
    ~/nginx_status 0;
}

# Configuración específica de access logs
access_log /var/log/nginx/access.log detailed if=$loggable;
access_log /var/log/nginx/access.json json_combined if=$loggable;
access_log /var/log/nginx/performance.log performance;

# Error log con diferentes niveles
error_log /var/log/nginx/error.log warn;
```

#### **4.2 Script de Análisis de Logs**
Crear `nginx/scripts/log-analyzer.sh`:

```bash
#!/bin/bash

# Script para análisis de logs de Nginx

LOG_FILE="/var/log/nginx/access.log"
ERROR_LOG="/var/log/nginx/error.log"
DATE=$(date +%Y-%m-%d)

echo "📊 Análisis de logs de Nginx - $DATE"
echo "========================================"

# Top 10 IPs más activas
echo "🔝 Top 10 IPs más activas:"
awk '{print $1}' $LOG_FILE | sort | uniq -c | sort -nr | head -10

echo ""

# Top 10 páginas más visitadas
echo "📄 Top 10 páginas más visitadas:"
awk '{print $7}' $LOG_FILE | sort | uniq -c | sort -nr | head -10

echo ""

# Códigos de respuesta
echo "📈 Distribución de códigos de respuesta:"
awk '{print $9}' $LOG_FILE | sort | uniq -c | sort -nr

echo ""

# User agents más comunes
echo "🤖 Top 5 User Agents:"
awk -F'"' '{print $6}' $LOG_FILE | sort | uniq -c | sort -nr | head -5

echo ""

# Análisis de performance
echo "⚡ Análisis de performance:"
echo "Tiempo promedio de respuesta:"
awk '{if ($11 != "-") total += $11; count++} END {print total/count "s"}' $LOG_FILE

echo ""

# Cache hit ratio
echo "💾 Cache Statistics:"
echo "Cache Hits:"
grep -c "cache=\"HIT\"" $LOG_FILE || echo "0"
echo "Cache Misses:"
grep -c "cache=\"MISS\"" $LOG_FILE || echo "0"
echo "Cache Bypasses:"
grep -c "cache=\"BYPASS\"" $LOG_FILE || echo "0"

echo ""

# Errores recientes
echo "🚨 Errores recientes (últimas 10 líneas):"
tail -10 $ERROR_LOG

echo ""

# Requests por hora
echo "⏰ Requests por hora (hoy):"
grep "$(date +%d/%b/%Y)" $LOG_FILE | awk '{print $4}' | cut -d: -f2 | sort | uniq -c

echo ""
echo "✅ Análisis completado"
```

## 🧪 Testing y Validación

### **1. Verificar Configuración (3 minutos)**

```bash
# Test de configuración
nginx -t

# Reload configuración
docker-compose exec nginx nginx -s reload

# Verificar upstreams
curl -I http://localhost/health
```

### **2. Test de Load Balancing (5 minutos)**

```bash
# Test de distribución de carga
for i in {1..10}; do
  curl -H "X-Test-Request: $i" http://localhost/api/health
done

# Test de failover
docker-compose stop backend1
curl http://localhost/api/health
docker-compose start backend1
```

### **3. Verificar Caching (2 minutos)**

```bash
# Test de cache
curl -I http://localhost/api/products
curl -I http://localhost/api/products  # Debería ser HIT

# Verificar headers de cache
curl -H "Cache-Control: no-cache" http://localhost/api/products
```

## ✅ Criterios de Éxito

- [ ] **Nginx configurado:** Reverse proxy funcionando
- [ ] **Load balancing:** Distribución entre backends
- [ ] **Caching:** Hit ratio > 80%
- [ ] **Performance:** Response time < 100ms
- [ ] **Monitoring:** Logs estructurados funcionando
- [ ] **Security:** Headers y rate limiting activos

## 🎯 Métricas Objetivo

- **Throughput:** > 1000 req/s
- **Latency p95:** < 200ms
- **Cache hit ratio:** > 85%
- **Error rate:** < 0.1%
- **SSL score:** A+ (cuando SSL esté configurado)

## 📝 Entregables

1. **Nginx configuration** completa y optimizada ✅
2. **Load balancing** con failover ✅
3. **Caching strategy** implementada ✅
4. **Monitoring y logging** configurado ✅
5. **Performance testing** completado ✅

**¡Nginx reverse proxy de nivel producción listo para WorldSkills! 🚀**
