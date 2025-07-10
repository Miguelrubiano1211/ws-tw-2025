# 🌍 Ejercicio 5: Domain & DNS Configuration

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐  
**Prerrequisitos:** Ejercicio 4 completado (SSL/TLS Security)

## 🎯 Objetivos

- Configurar dominio personalizado para la aplicación
- Implementar DNS records optimizados
- Configurar subdominios para diferentes servicios
- Implementar CDN con Cloudflare
- Optimizar DNS para performance y seguridad

## 📋 Instrucciones

### **Paso 1: Configuración de Dominio Local (15 minutos)**

#### **1.1 Setup de Dominio Local para Testing**
Crear script `dns/setup-local-domain.sh`:

```bash
#!/bin/bash

# Script para configurar dominio local para testing

DOMAIN="techstore.local"
SUBDOMAINS=("www" "api" "admin" "cdn" "static" "monitoring")

echo "🌐 Configurando dominio local: $DOMAIN"

# Backup del archivo hosts original
if [ ! -f /etc/hosts.backup ]; then
    sudo cp /etc/hosts /etc/hosts.backup
    echo "📁 Backup de /etc/hosts creado"
fi

# Función para agregar entrada a hosts
add_to_hosts() {
    local subdomain=$1
    local full_domain="${subdomain}.${DOMAIN}"
    
    if [ "$subdomain" = "root" ]; then
        full_domain="$DOMAIN"
    fi
    
    # Verificar si ya existe
    if ! grep -q "$full_domain" /etc/hosts; then
        echo "127.0.0.1    $full_domain" | sudo tee -a /etc/hosts
        echo "✅ Agregado: $full_domain"
    else
        echo "⚠️  Ya existe: $full_domain"
    fi
}

# Agregar dominio principal
add_to_hosts "root"

# Agregar subdominios
for subdomain in "${SUBDOMAINS[@]}"; do
    add_to_hosts "$subdomain"
done

echo "🔍 Verificando configuración DNS local..."
for subdomain in "${SUBDOMAINS[@]}"; do
    full_domain="${subdomain}.${DOMAIN}"
    if ping -c 1 "$full_domain" &> /dev/null; then
        echo "✅ $full_domain resuelve correctamente"
    else
        echo "❌ $full_domain no resuelve"
    fi
done

# Verificar dominio principal
if ping -c 1 "$DOMAIN" &> /dev/null; then
    echo "✅ $DOMAIN resuelve correctamente"
else
    echo "❌ $DOMAIN no resuelve"
fi

echo "📋 Dominios configurados:"
echo "   Principal: https://$DOMAIN"
echo "   Frontend: https://www.$DOMAIN"
echo "   API: https://api.$DOMAIN"
echo "   Admin: https://admin.$DOMAIN"
echo "   CDN: https://cdn.$DOMAIN"
echo "   Static: https://static.$DOMAIN"
echo "   Monitoring: https://monitoring.$DOMAIN"
```

#### **1.2 Nginx Multi-Domain Configuration**
Crear `nginx/sites-available/multi-domain.conf`:

```nginx
# Configuración multi-dominio para TechStore

# Dominio principal - Frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name techstore.local www.techstore.local;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/techstore.local.crt;
    ssl_certificate_key /etc/nginx/ssl/techstore.local.key;
    include /etc/nginx/conf.d/ssl.conf;

    # Security Headers
    include /etc/nginx/conf.d/security-headers.conf;

    # Logging
    access_log /var/log/nginx/frontend_access.log detailed;
    error_log /var/log/nginx/frontend_error.log;

    # Frontend React App
    location / {
        proxy_pass http://frontend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache para SPA
        proxy_cache static_cache;
        proxy_cache_valid 200 1h;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Health check
    location /health {
        return 200 "Frontend OK";
        add_header Content-Type text/plain;
    }
}

# Subdominio API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.techstore.local;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/techstore.local.crt;
    ssl_certificate_key /etc/nginx/ssl/techstore.local.key;
    include /etc/nginx/conf.d/ssl.conf;

    # API-specific security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging específico para API
    access_log /var/log/nginx/api_access.log detailed;
    error_log /var/log/nginx/api_error.log;

    # Rate limiting para API
    limit_req zone=api burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;

    # API Routes
    location / {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # API-specific timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 30s;

        # CORS headers
        add_header Access-Control-Allow-Origin "https://techstore.local" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;

        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://techstore.local";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain charset=UTF-8";
            add_header Content-Length 0;
            return 204;
        }
    }

    # API Health check
    location /health {
        proxy_pass http://backend_api/health;
        access_log off;
    }

    # API Documentation
    location /docs {
        proxy_pass http://backend_api/docs;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Subdominio Admin
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.techstore.local;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/techstore.local.crt;
    ssl_certificate_key /etc/nginx/ssl/techstore.local.key;
    include /etc/nginx/conf.d/ssl.conf;

    # Enhanced security para admin
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;

    # IP Whitelist para admin (ejemplo)
    # allow 192.168.1.0/24;
    # allow 10.0.0.0/8;
    # deny all;

    # Rate limiting más estricto para admin
    limit_req zone=auth burst=5 nodelay;
    limit_conn conn_limit_per_ip 3;

    # Logging detallado para admin
    access_log /var/log/nginx/admin_access.log detailed;
    error_log /var/log/nginx/admin_error.log;

    # Admin interface
    location / {
        proxy_pass http://admin_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # No cache para admin
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
    }
}

# Subdominio CDN/Static
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cdn.techstore.local static.techstore.local;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/techstore.local.crt;
    ssl_certificate_key /etc/nginx/ssl/techstore.local.key;
    include /etc/nginx/conf.d/ssl.conf;

    # Logging mínimo para assets
    access_log /var/log/nginx/cdn_access.log;
    error_log /var/log/nginx/cdn_error.log;

    # Root para archivos estáticos
    root /var/www/static;

    # Cache agresivo para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif|mp4|webm)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # CORS para assets
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
        
        # Compression
        gzip_static on;
        brotli_static on;
        
        # Handle missing files
        try_files $uri =404;
    }

    # Images con optimización
    location /images/ {
        expires 6M;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept, Accept-Encoding";
        
        # WebP serving
        location ~* \.(png|jpe?g)$ {
            add_header Vary "Accept";
            try_files "${uri}.webp" $uri =404;
        }
    }

    # API para upload de assets
    location /upload {
        proxy_pass http://backend_api/upload;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Límites específicos para uploads
        client_max_body_size 50m;
        proxy_request_buffering off;
    }
}

# Subdominio Monitoring
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name monitoring.techstore.local;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/techstore.local.crt;
    ssl_certificate_key /etc/nginx/ssl/techstore.local.key;
    include /etc/nginx/conf.d/ssl.conf;

    # Autenticación básica para monitoring
    auth_basic "Monitoring Access";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # Logging para monitoring
    access_log /var/log/nginx/monitoring_access.log;
    error_log /var/log/nginx/monitoring_error.log;

    # Grafana
    location /grafana/ {
        proxy_pass http://grafana:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Prometheus
    location /prometheus/ {
        proxy_pass http://prometheus:9090/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Nginx status
    location /nginx-status {
        stub_status on;
        access_log off;
    }

    # Server info
    location /server-info {
        return 200 '{"server": "nginx", "version": "$nginx_version", "time": "$time_iso8601"}';
        add_header Content-Type application/json;
    }
}

# Redirección HTTP a HTTPS para todos los dominios
server {
    listen 80;
    listen [::]:80;
    server_name techstore.local *.techstore.local;
    
    # ACME challenge para Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect todo a HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

### **Paso 2: DNS Records Configuration (15 minutos)**

#### **2.1 DNS Zone File Template**
Crear `dns/techstore.local.zone`:

```dns
; DNS Zone file para techstore.local
; TTL por defecto: 1 hora
$TTL 3600

; Start of Authority (SOA) record
techstore.local. IN SOA ns1.techstore.local. admin.techstore.local. (
    2024011501  ; Serial number (YYYYMMDDNN)
    3600        ; Refresh (1 hour)
    1800        ; Retry (30 minutes)
    604800      ; Expire (1 week)
    86400       ; Minimum TTL (1 day)
)

; Name servers
techstore.local.        IN NS    ns1.techstore.local.
techstore.local.        IN NS    ns2.techstore.local.

; A records (IPv4)
techstore.local.        IN A     127.0.0.1
www.techstore.local.    IN A     127.0.0.1
api.techstore.local.    IN A     127.0.0.1
admin.techstore.local.  IN A     127.0.0.1
cdn.techstore.local.    IN A     127.0.0.1
static.techstore.local. IN A     127.0.0.1
monitoring.techstore.local. IN A 127.0.0.1

; AAAA records (IPv6) - opcional
techstore.local.        IN AAAA  ::1
www.techstore.local.    IN AAAA  ::1

; CNAME records (aliases)
assets.techstore.local. IN CNAME cdn.techstore.local.
images.techstore.local. IN CNAME cdn.techstore.local.
js.techstore.local.     IN CNAME cdn.techstore.local.
css.techstore.local.    IN CNAME cdn.techstore.local.

; MX records (email)
techstore.local.        IN MX 10 mail.techstore.local.
mail.techstore.local.   IN A     127.0.0.1

; TXT records
techstore.local.        IN TXT   "v=spf1 include:_spf.google.com ~all"
techstore.local.        IN TXT   "google-site-verification=your-verification-code"

; DMARC policy
_dmarc.techstore.local. IN TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@techstore.local"

; DKIM selector
default._domainkey.techstore.local. IN TXT "v=DKIM1; k=rsa; p=your-dkim-public-key"

; CAA records (Certificate Authority Authorization)
techstore.local.        IN CAA   0 issue "letsencrypt.org"
techstore.local.        IN CAA   0 issue "digicert.com"
techstore.local.        IN CAA   0 iodef "mailto:security@techstore.local"

; SRV records (services)
_http._tcp.techstore.local. IN SRV 0 5 80 techstore.local.
_https._tcp.techstore.local. IN SRV 0 5 443 techstore.local.

; Specific service records
_api._tcp.techstore.local. IN SRV 0 5 443 api.techstore.local.
_admin._tcp.techstore.local. IN SRV 0 5 443 admin.techstore.local.
```

#### **2.2 DNS Configuration Script**
Crear `dns/configure-dns.sh`:

```bash
#!/bin/bash

# Script para configurar DNS usando dnsmasq para testing local

DOMAIN="techstore.local"
DNSMASQ_CONF="/etc/dnsmasq.d/techstore.conf"

echo "🌐 Configurando DNS local con dnsmasq..."

# Instalar dnsmasq si no está instalado
if ! command -v dnsmasq &> /dev/null; then
    echo "📦 Instalando dnsmasq..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y dnsmasq
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install dnsmasq
    fi
fi

# Crear configuración de dnsmasq
echo "⚙️  Configurando dnsmasq..."
sudo tee $DNSMASQ_CONF > /dev/null << EOF
# TechStore local DNS configuration

# Listen only on localhost
listen-address=127.0.0.1

# Domain configuration
local=/$DOMAIN/
domain=$DOMAIN

# A records
address=/$DOMAIN/127.0.0.1
address=/www.$DOMAIN/127.0.0.1
address=/api.$DOMAIN/127.0.0.1
address=/admin.$DOMAIN/127.0.0.1
address=/cdn.$DOMAIN/127.0.0.1
address=/static.$DOMAIN/127.0.0.1
address=/monitoring.$DOMAIN/127.0.0.1

# Additional subdomains
address=/assets.$DOMAIN/127.0.0.1
address=/images.$DOMAIN/127.0.0.1
address=/js.$DOMAIN/127.0.0.1
address=/css.$DOMAIN/127.0.0.1
address=/mail.$DOMAIN/127.0.0.1

# Wildcard for any subdomain
address=/.$DOMAIN/127.0.0.1

# Cache settings
cache-size=1000
neg-ttl=3600

# Log queries (for debugging)
log-queries
log-facility=/var/log/dnsmasq.log
EOF

# Reiniciar dnsmasq
echo "🔄 Reiniciando dnsmasq..."
sudo systemctl restart dnsmasq
sudo systemctl enable dnsmasq

# Configurar resolver del sistema
echo "🔧 Configurando system resolver..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - modificar resolv.conf o systemd-resolved
    if systemctl is-active --quiet systemd-resolved; then
        sudo systemd-resolve --interface=lo --set-dns=127.0.0.1 --set-domain=$DOMAIN
    else
        # Backup y modificar resolv.conf
        sudo cp /etc/resolv.conf /etc/resolv.conf.backup
        echo "nameserver 127.0.0.1" | sudo tee /etc/resolv.conf.new > /dev/null
        cat /etc/resolv.conf.backup | sudo tee -a /etc/resolv.conf.new > /dev/null
        sudo mv /etc/resolv.conf.new /etc/resolv.conf
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - crear resolver
    sudo mkdir -p /etc/resolver
    echo "nameserver 127.0.0.1" | sudo tee /etc/resolver/$DOMAIN > /dev/null
fi

# Test DNS resolution
echo "🧪 Testing DNS resolution..."
for subdomain in "" "www" "api" "admin" "cdn" "static" "monitoring"; do
    if [ -z "$subdomain" ]; then
        test_domain="$DOMAIN"
    else
        test_domain="$subdomain.$DOMAIN"
    fi
    
    if nslookup "$test_domain" 127.0.0.1 &> /dev/null; then
        echo "✅ $test_domain resuelve correctamente"
    else
        echo "❌ Error resolviendo $test_domain"
    fi
done

echo "✅ Configuración DNS completada"
echo "📋 Dominios configurados:"
echo "   - techstore.local"
echo "   - www.techstore.local"
echo "   - api.techstore.local"
echo "   - admin.techstore.local"
echo "   - cdn.techstore.local"
echo "   - static.techstore.local"
echo "   - monitoring.techstore.local"
```

### **Paso 3: CDN Configuration (10 minutos)**

#### **3.1 Cloudflare-like Local CDN**
Crear `cdn/local-cdn-setup.sh`:

```bash
#!/bin/bash

# Setup de CDN local para testing y desarrollo

CDN_ROOT="/var/www/cdn"
STATIC_ROOT="/var/www/static"

echo "🚀 Configurando CDN local..."

# Crear directorios
sudo mkdir -p $CDN_ROOT/{images,js,css,fonts,videos}
sudo mkdir -p $STATIC_ROOT/{assets,uploads,cache}

# Configurar nginx para CDN
cat > /tmp/cdn.conf << 'EOF'
# Configuración CDN local
server {
    listen 80;
    server_name cdn.techstore.local static.techstore.local;
    
    root /var/www/cdn;
    
    # Logs específicos del CDN
    access_log /var/log/nginx/cdn_access.log;
    error_log /var/log/nginx/cdn_error.log;
    
    # Cache headers optimizados
    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # Compression
        gzip_static on;
        gzip_types text/css application/javascript;
        
        # CORS
        add_header Access-Control-Allow-Origin "*";
    }
    
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 6M;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept, Accept-Encoding";
        
        # WebP serving
        location ~* \.(png|jpe?g)$ {
            add_header Vary "Accept";
            try_files $uri.webp $uri =404;
        }
        
        # CORS para images
        add_header Access-Control-Allow-Origin "*";
    }
    
    location ~* \.(woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Fallback para archivos no encontrados
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

sudo mv /tmp/cdn.conf /etc/nginx/sites-available/cdn.conf
sudo ln -sf /etc/nginx/sites-available/cdn.conf /etc/nginx/sites-enabled/

# Assets de ejemplo
echo "📁 Creando assets de ejemplo..."

# CSS de ejemplo
cat > $CDN_ROOT/css/main.css << 'EOF'
/* TechStore Main CSS */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.btn {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: all 0.15s ease-in-out;
}

.btn-primary {
    color: #fff;
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
}
EOF

# JavaScript de ejemplo
cat > $CDN_ROOT/js/main.js << 'EOF'
// TechStore Main JavaScript
(function() {
    'use strict';
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', loadTime, 'ms');
                
                // Send to analytics (if implemented)
                if (window.analytics) {
                    window.analytics.track('Page Load Time', {
                        loadTime: loadTime,
                        url: window.location.href
                    });
                }
            }, 0);
        });
    }
    
    // Lazy loading de imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
})();
EOF

# Configurar permisos
sudo chown -R www-data:www-data $CDN_ROOT $STATIC_ROOT
sudo chmod -R 755 $CDN_ROOT $STATIC_ROOT

echo "✅ CDN local configurado"
echo "📍 Ubicación: $CDN_ROOT"
echo "🌐 URL: http://cdn.techstore.local"
```

#### **3.2 Asset Optimization Pipeline**
Crear `cdn/optimize-assets.sh`:

```bash
#!/bin/bash

# Pipeline de optimización de assets

SOURCE_DIR="$1"
OUTPUT_DIR="$2"

if [ -z "$SOURCE_DIR" ] || [ -z "$OUTPUT_DIR" ]; then
    echo "Usage: $0 <source_dir> <output_dir>"
    exit 1
fi

echo "🔧 Optimizando assets..."
echo "Source: $SOURCE_DIR"
echo "Output: $OUTPUT_DIR"

# Crear directorio de salida
mkdir -p "$OUTPUT_DIR"/{images,css,js}

# Optimizar imágenes con imagemin
if command -v imagemin &> /dev/null; then
    echo "🖼️  Optimizando imágenes..."
    
    # PNG optimization
    find "$SOURCE_DIR" -name "*.png" -exec imagemin {} --out-dir="$OUTPUT_DIR/images" \;
    
    # JPEG optimization
    find "$SOURCE_DIR" -name "*.jpg" -o -name "*.jpeg" -exec imagemin {} --out-dir="$OUTPUT_DIR/images" \;
    
    # WebP conversion
    find "$SOURCE_DIR" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | while read img; do
        filename=$(basename "$img")
        name="${filename%.*}"
        cwebp -q 85 "$img" -o "$OUTPUT_DIR/images/${name}.webp"
    done
fi

# Minificar CSS
if command -v cleancss &> /dev/null; then
    echo "🎨 Minificando CSS..."
    find "$SOURCE_DIR" -name "*.css" | while read css; do
        filename=$(basename "$css")
        cleancss -o "$OUTPUT_DIR/css/$filename" "$css"
    done
fi

# Minificar JavaScript
if command -v terser &> /dev/null; then
    echo "📜 Minificando JavaScript..."
    find "$SOURCE_DIR" -name "*.js" | while read js; do
        filename=$(basename "$js")
        terser "$js" -o "$OUTPUT_DIR/js/$filename" --compress --mangle
    done
fi

# Generar hash para cache busting
echo "🔨 Generando hashes para cache busting..."
find "$OUTPUT_DIR" -type f | while read file; do
    if [[ "$file" =~ \.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$ ]]; then
        hash=$(md5sum "$file" | cut -d' ' -f1 | cut -c1-8)
        dir=$(dirname "$file")
        filename=$(basename "$file")
        name="${filename%.*}"
        ext="${filename##*.}"
        
        # Crear versión con hash
        cp "$file" "$dir/${name}-${hash}.${ext}"
        
        echo "✅ $filename -> ${name}-${hash}.${ext}"
    fi
done

echo "✅ Optimización de assets completada"
```

### **Paso 4: DNS Performance & Security (5 minutos)**

#### **4.1 DNS Performance Testing**
Crear `dns/dns-performance-test.sh`:

```bash
#!/bin/bash

# Test de performance DNS

DOMAINS=("techstore.local" "www.techstore.local" "api.techstore.local" "admin.techstore.local")
DNS_SERVERS=("127.0.0.1" "8.8.8.8" "1.1.1.1" "208.67.222.222")

echo "🚀 Testing DNS Performance..."
echo "================================"

for domain in "${DOMAINS[@]}"; do
    echo "📍 Testing: $domain"
    
    for dns in "${DNS_SERVERS[@]}"; do
        echo -n "   DNS $dns: "
        
        # Medir tiempo de resolución
        start_time=$(date +%s%N)
        result=$(dig +short @$dns $domain 2>/dev/null)
        end_time=$(date +%s%N)
        
        if [ -n "$result" ]; then
            duration=$(( (end_time - start_time) / 1000000 ))
            echo "${duration}ms - IP: $result"
        else
            echo "FAILED"
        fi
    done
    echo ""
done

# Test de TTL
echo "⏰ TTL Analysis:"
for domain in "${DOMAINS[@]}"; do
    echo "   $domain:"
    dig +noall +answer $domain | awk '{print "     TTL: " $2 "s"}'
done

# Test de autoridad
echo ""
echo "🔍 Authority Check:"
dig +short NS techstore.local

echo ""
echo "✅ DNS Performance test completado"
```

## 🧪 Testing y Validación

### **1. Verificar Configuración de Dominios (3 minutos)**

```bash
# Test resolución DNS
./dns/setup-local-domain.sh

# Verificar todos los subdominios
for sub in "" "www" "api" "admin" "cdn" "static" "monitoring"; do
    domain="${sub:+$sub.}techstore.local"
    curl -I "https://$domain" -k
done
```

### **2. Test de CDN Performance (2 minutos)**

```bash
# Test de carga de assets
curl -I "http://cdn.techstore.local/css/main.css"
curl -I "http://cdn.techstore.local/js/main.js"

# Verificar headers de cache
curl -H "Accept: image/webp" "http://cdn.techstore.local/images/logo.png"
```

### **3. DNS Performance Test (3 minutos)**

```bash
# Ejecutar test de performance
./dns/dns-performance-test.sh

# Verificar propagación
dig techstore.local @127.0.0.1
dig api.techstore.local @127.0.0.1
```

## ✅ Criterios de Éxito

- [ ] **Dominio principal:** techstore.local funcionando
- [ ] **Subdominios:** Todos los subdominios configurados
- [ ] **DNS resolution:** < 50ms tiempo de resolución
- [ ] **CDN funcionando:** Assets servidos correctamente
- [ ] **SSL en subdominios:** Certificados válidos
- [ ] **Performance:** DNS TTL optimizado

## 🎯 Métricas DNS

- **DNS Resolution Time:** < 50ms
- **TTL Configuration:** 1h para registros dinámicos, 24h para estáticos
- **Cache Hit Ratio:** > 95%
- **Subdomain Response:** < 100ms
- **CDN Performance:** Assets < 200ms TTFB

## 📝 Entregables

1. **Dominio y subdominios** configurados y funcionando ✅
2. **DNS records** optimizados para performance ✅
3. **CDN local** configurado con optimización de assets ✅
4. **Multi-domain Nginx** configuration completa ✅
5. **DNS performance testing** implementado ✅

**¡Configuración DNS y CDN de nivel empresarial lista para WorldSkills! 🌍🏆**
