# 🔒 Ejercicio 4: SSL/TLS Security Implementation

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐⭐  
**Prerrequisitos:** Ejercicio 3 completado (Nginx configuration)

## 🎯 Objetivos

- Implementar HTTPS con certificados SSL/TLS
- Configurar Let's Encrypt para certificados automáticos
- Implementar security headers avanzados
- Configurar HSTS y OCSP stapling
- Optimizar configuración SSL para máxima seguridad

## 📋 Instrucciones

### **Paso 1: Configuración SSL/TLS Base (15 minutos)**

#### **1.1 Generar Certificados de Desarrollo**
Crear script `nginx/ssl/generate-dev-certs.sh`:

```bash
#!/bin/bash

# Script para generar certificados de desarrollo

SSL_DIR="/etc/nginx/ssl"
DOMAIN="techstore.local"

echo "🔐 Generando certificados SSL para desarrollo..."

# Crear directorio SSL si no existe
mkdir -p $SSL_DIR

# Generar clave privada
openssl genrsa -out $SSL_DIR/$DOMAIN.key 2048

# Generar certificado self-signed
openssl req -new -x509 -key $SSL_DIR/$DOMAIN.key \
    -out $SSL_DIR/$DOMAIN.crt \
    -days 365 \
    -subj "/C=CO/ST=Cundinamarca/L=Bogota/O=TechStore/OU=IT/CN=$DOMAIN" \
    -addext "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN,DNS:localhost,IP:127.0.0.1"

# Generar DH parameters para Perfect Forward Secrecy
openssl dhparam -out $SSL_DIR/dhparam.pem 2048

# Configurar permisos
chmod 600 $SSL_DIR/$DOMAIN.key
chmod 644 $SSL_DIR/$DOMAIN.crt
chmod 644 $SSL_DIR/dhparam.pem

echo "✅ Certificados generados:"
echo "   Key: $SSL_DIR/$DOMAIN.key"
echo "   Cert: $SSL_DIR/$DOMAIN.crt"
echo "   DH: $SSL_DIR/dhparam.pem"
```

#### **1.2 Configuración SSL en Nginx**
Crear `nginx/conf.d/ssl.conf`:

```nginx
# Configuración SSL/TLS optimizada para máxima seguridad

# SSL protocols y ciphers
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

# Perfect Forward Secrecy
ssl_dhparam /etc/nginx/ssl/dhparam.pem;

# SSL session optimization
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/techstore.local.crt;

# DNS resolver para OCSP
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# SSL buffer size optimization
ssl_buffer_size 4k;

# Preload SSL
ssl_early_data on;
```

#### **1.3 Server Block con HTTPS**
Actualizar `nginx/sites-available/techstore-ssl.conf`:

```nginx
# Redirection HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name techstore.local www.techstore.local;
    
    # ACME challenge para Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect todo el tráfico a HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Configuración HTTPS principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name techstore.local www.techstore.local;

    # === SSL CONFIGURATION ===
    ssl_certificate /etc/nginx/ssl/techstore.local.crt;
    ssl_certificate_key /etc/nginx/ssl/techstore.local.key;
    
    # Include configuración SSL global
    include /etc/nginx/conf.d/ssl.conf;

    # === SECURITY HEADERS ===
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' wss: https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
    
    # Additional security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), payment=(), usb=()" always;
    
    # Remove server signature
    server_tokens off;
    more_clear_headers Server;
    more_set_headers "Server: TechStore";

    # === LOGGING ===
    access_log /var/log/nginx/techstore_ssl_access.log detailed;
    error_log /var/log/nginx/techstore_ssl_error.log;

    # === STATIC ASSETS ===
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # Security headers para assets
        add_header X-Content-Type-Options "nosniff" always;
        add_header Access-Control-Allow-Origin "*";
        
        # Compression
        gzip_static on;
        brotli_static on;
        
        try_files $uri @frontend;
    }

    # === API CONFIGURATION ===
    location /api/ {
        # Rate limiting más estricto en HTTPS
        limit_req zone=api burst=15 nodelay;
        limit_conn conn_limit_per_ip 8;

        # Proxy pass con SSL headers
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;

        # SSL-specific headers
        proxy_set_header X-Forwarded-SSL on;
        proxy_set_header X-URL-Scheme https;

        # Timeouts optimizados para HTTPS
        proxy_connect_timeout 3s;
        proxy_send_timeout 8s;
        proxy_read_timeout 8s;

        # Security headers para API
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "DENY" always;
    }

    # === WEBSOCKET SUPPORT ===
    location /ws/ {
        proxy_pass http://backend_websockets;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket specific timeouts
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        
        # No caching para WebSockets
        proxy_cache off;
    }

    # === FRONTEND ===
    location / {
        try_files $uri $uri/ @frontend;
    }

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

        # Cache para SPA con HTTPS
        proxy_cache static_cache;
        proxy_cache_valid 200 30m;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # === SECURITY ENDPOINTS ===
    
    # Security.txt
    location = /.well-known/security.txt {
        return 200 "Contact: security@techstore.com\nExpires: 2024-12-31T23:59:59.000Z\nPreferred-Languages: en, es\nCanonical: https://techstore.local/.well-known/security.txt";
        add_header Content-Type text/plain;
    }

    # Certificate transparency
    location = /.well-known/ct-policy.txt {
        return 200 "Certificate Transparency Policy: https://techstore.local/ct-policy";
        add_header Content-Type text/plain;
    }

    # === ERROR PAGES ===
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
}
```

### **Paso 2: Let's Encrypt Automation (15 minutos)**

#### **2.1 Configuración de Certbot**
Crear `nginx/ssl/certbot-setup.sh`:

```bash
#!/bin/bash

# Script para configurar Let's Encrypt con Certbot

DOMAIN="techstore.com"
EMAIL="admin@techstore.com"
WEBROOT="/var/www/certbot"

echo "🔒 Configurando Let's Encrypt para $DOMAIN..."

# Crear directorio para ACME challenge
mkdir -p $WEBROOT

# Instalar certbot (en el contenedor o host)
if command -v apt-get &> /dev/null; then
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
elif command -v yum &> /dev/null; then
    yum install -y certbot python3-certbot-nginx
fi

# Obtener certificado inicial
certbot certonly \
    --webroot \
    --webroot-path=$WEBROOT \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN \
    -d www.$DOMAIN

# Configurar renovación automática
echo "📅 Configurando renovación automática..."

# Crear script de renovación
cat > /usr/local/bin/certbot-renew.sh << 'EOF'
#!/bin/bash

# Script de renovación de certificados
echo "🔄 Renovando certificados SSL..."

# Renovar certificados
certbot renew --quiet

# Recargar Nginx si los certificados se renovaron
if [ $? -eq 0 ]; then
    echo "✅ Certificados renovados exitosamente"
    nginx -s reload
    echo "🔄 Nginx recargado"
else
    echo "❌ Error renovando certificados"
    exit 1
fi

# Log de renovación
echo "$(date): Renovación de certificados completada" >> /var/log/certbot-renew.log
EOF

chmod +x /usr/local/bin/certbot-renew.sh

# Agregar cron job para renovación automática
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/local/bin/certbot-renew.sh") | crontab -

echo "✅ Let's Encrypt configurado"
echo "📋 Certificados ubicados en: /etc/letsencrypt/live/$DOMAIN/"
```

#### **2.2 Docker Compose con Certbot**
Crear `docker-compose.ssl.yml`:

```yaml
version: '3.8'

services:
  # Nginx con SSL
  nginx:
    image: nginx:alpine
    container_name: techstore_nginx_ssl
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites-available:/etc/nginx/sites-available
      - ./nginx/sites-enabled:/etc/nginx/sites-enabled
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/logs:/var/log/nginx
      - certbot_webroot:/var/www/certbot
      - certbot_certs:/etc/letsencrypt
    depends_on:
      - frontend
      - backend
    networks:
      - techstore_network
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"

  # Certbot para Let's Encrypt
  certbot:
    image: certbot/certbot
    container_name: techstore_certbot
    restart: no
    volumes:
      - certbot_webroot:/var/www/certbot
      - certbot_certs:/etc/letsencrypt
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - nginx
    command: >
      sh -c "while :; do
        certbot renew --quiet --webroot --webroot-path=/var/www/certbot;
        sleep 12h;
      done"

  # SSL Labs checker (herramienta de testing)
  ssl_checker:
    build:
      context: ./tools/ssl-checker
      dockerfile: Dockerfile
    container_name: techstore_ssl_checker
    volumes:
      - ./tools/ssl-checker/reports:/app/reports
    environment:
      - TARGET_DOMAIN=techstore.local
    profiles:
      - testing

volumes:
  certbot_webroot:
    driver: local
  certbot_certs:
    driver: local

networks:
  techstore_network:
    external: true
```

#### **2.3 SSL Health Check Tool**
Crear `tools/ssl-checker/Dockerfile`:

```dockerfile
FROM python:3.9-alpine

RUN pip install requests cryptography dnspython

WORKDIR /app

COPY ssl_health_check.py .

CMD ["python", "ssl_health_check.py"]
```

Crear `tools/ssl-checker/ssl_health_check.py`:

```python
#!/usr/bin/env python3
"""
SSL Health Check Tool para TechStore
Verifica la configuración SSL y genera reportes
"""

import ssl
import socket
import requests
import json
import datetime
from urllib.parse import urlparse

class SSLHealthChecker:
    def __init__(self, domain):
        self.domain = domain
        self.port = 443
        self.results = {}
    
    def check_certificate_validity(self):
        """Verificar validez del certificado"""
        try:
            context = ssl.create_default_context()
            with socket.create_connection((self.domain, self.port), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=self.domain) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Información del certificado
                    self.results['certificate'] = {
                        'subject': dict(x[0] for x in cert['subject']),
                        'issuer': dict(x[0] for x in cert['issuer']),
                        'version': cert['version'],
                        'serialNumber': cert['serialNumber'],
                        'notBefore': cert['notBefore'],
                        'notAfter': cert['notAfter'],
                        'subjectAltName': cert.get('subjectAltName', [])
                    }
                    
                    # Verificar expiración
                    expiry_date = datetime.datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    days_until_expiry = (expiry_date - datetime.datetime.now()).days
                    
                    self.results['expiry'] = {
                        'expires': cert['notAfter'],
                        'days_until_expiry': days_until_expiry,
                        'status': 'critical' if days_until_expiry < 7 else 'warning' if days_until_expiry < 30 else 'ok'
                    }
                    
                    return True
        except Exception as e:
            self.results['certificate_error'] = str(e)
            return False
    
    def check_ssl_configuration(self):
        """Verificar configuración SSL"""
        try:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((self.domain, self.port), timeout=10) as sock:
                with context.wrap_socket(sock) as ssock:
                    self.results['ssl_config'] = {
                        'protocol': ssock.version(),
                        'cipher': ssock.cipher(),
                        'compression': ssock.compression(),
                    }
                    return True
        except Exception as e:
            self.results['ssl_config_error'] = str(e)
            return False
    
    def check_headers(self):
        """Verificar security headers"""
        try:
            response = requests.get(f'https://{self.domain}', timeout=10, verify=False)
            headers = response.headers
            
            security_headers = {
                'Strict-Transport-Security': headers.get('Strict-Transport-Security'),
                'Content-Security-Policy': headers.get('Content-Security-Policy'),
                'X-Frame-Options': headers.get('X-Frame-Options'),
                'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
                'X-XSS-Protection': headers.get('X-XSS-Protection'),
                'Referrer-Policy': headers.get('Referrer-Policy'),
            }
            
            self.results['security_headers'] = security_headers
            
            # Scoring de security headers
            score = 0
            max_score = len(security_headers)
            for header, value in security_headers.items():
                if value:
                    score += 1
            
            self.results['security_score'] = {
                'score': score,
                'max_score': max_score,
                'percentage': round((score / max_score) * 100, 2)
            }
            
            return True
        except Exception as e:
            self.results['headers_error'] = str(e)
            return False
    
    def run_all_checks(self):
        """Ejecutar todas las verificaciones"""
        print(f"🔍 Verificando SSL para {self.domain}...")
        
        self.check_certificate_validity()
        self.check_ssl_configuration()
        self.check_headers()
        
        # Timestamp del reporte
        self.results['timestamp'] = datetime.datetime.now().isoformat()
        self.results['domain'] = self.domain
        
        return self.results
    
    def generate_report(self, output_file=None):
        """Generar reporte"""
        if not output_file:
            output_file = f"/app/reports/ssl_report_{self.domain}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"📋 Reporte generado: {output_file}")
        
        # Resumen en consola
        print("\n📊 Resumen del SSL Check:")
        print(f"Domain: {self.domain}")
        
        if 'expiry' in self.results:
            expiry = self.results['expiry']
            print(f"Certificado expira en: {expiry['days_until_expiry']} días ({expiry['status']})")
        
        if 'ssl_config' in self.results:
            config = self.results['ssl_config']
            print(f"Protocolo SSL: {config['protocol']}")
            print(f"Cipher: {config['cipher'][0] if config['cipher'] else 'N/A'}")
        
        if 'security_score' in self.results:
            score = self.results['security_score']
            print(f"Security Headers Score: {score['score']}/{score['max_score']} ({score['percentage']}%)")

if __name__ == "__main__":
    import os
    
    domain = os.getenv('TARGET_DOMAIN', 'techstore.local')
    checker = SSLHealthChecker(domain)
    results = checker.run_all_checks()
    checker.generate_report()
```

### **Paso 3: Security Headers Avanzados (10 minutos)**

#### **3.1 Configuración CSP Avanzada**
Crear `nginx/conf.d/security-headers.conf`:

```nginx
# Security Headers avanzados

# Content Security Policy más específica
map $request_uri $csp_policy {
    default "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://www.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' wss: https: https://api.techstore.com; media-src 'self' https:; object-src 'none'; child-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content;";
    
    ~^/admin "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';";
    
    ~^/api "default-src 'none'; connect-src 'self';";
}

# Permissions Policy (Feature Policy)
map $request_uri $permissions_policy {
    default "camera=(), microphone=(), geolocation=(), gyroscope=(), magnetometer=(), payment=(), usb=(), interest-cohort=()";
    ~^/checkout "camera=(), microphone=(), geolocation=(self), gyroscope=(), magnetometer=(), payment=(self), usb=(), interest-cohort=()";
}

# HSTS con subdomains y preload
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# Content Security Policy
add_header Content-Security-Policy $csp_policy always;

# Permissions Policy
add_header Permissions-Policy $permissions_policy always;

# Additional security headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Cross-Origin policies
add_header Cross-Origin-Embedder-Policy "require-corp" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;

# Server information hiding
server_tokens off;
more_clear_headers "Server" "X-Powered-By";
more_set_headers "Server: TechStore/1.0";

# Expect-CT for Certificate Transparency
add_header Expect-CT "max-age=86400, enforce, report-uri=\"https://techstore.com/ct-report\"" always;

# Clear potentially dangerous headers
more_clear_headers "X-AspNet-Version" "X-AspNetMvc-Version" "X-Powered-By";
```

#### **3.2 Rate Limiting Avanzado**
Crear `nginx/conf.d/rate-limiting.conf`:

```nginx
# Rate limiting avanzado por endpoint y tipo de usuario

# Zonas de rate limiting
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=20r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=search:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;

# Connection limiting
limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;
limit_conn_zone $server_name zone=conn_limit_per_server:10m;

# Rate limiting por user agent (bot detection)
map $http_user_agent $limit_bots {
    default 0;
    ~*(bot|crawler|spider|scraper) 1;
}

limit_req_zone $binary_remote_addr zone=bots:1m rate=1r/s;

# Geo-blocking para ataques conocidos
geo $geo_whitelist {
    default 0;
    127.0.0.1 1;
    10.0.0.0/8 1;
    172.16.0.0/12 1;
    192.168.0.0/16 1;
}

# Aplicación de rate limiting
location /api/auth/ {
    if ($limit_bots) {
        return 429 "Rate limit exceeded for bots";
    }
    
    limit_req zone=auth burst=3 nodelay;
    limit_conn conn_limit_per_ip 3;
    
    # Headers informativos
    add_header X-RateLimit-Limit "5 per minute" always;
    add_header X-RateLimit-Remaining $limit_req_remaining always;
    
    proxy_pass http://backend_api;
}

location /api/search/ {
    limit_req zone=search burst=10 nodelay;
    limit_conn conn_limit_per_ip 5;
    
    proxy_pass http://backend_api;
}

location /api/upload/ {
    limit_req zone=upload burst=1 nodelay;
    limit_conn conn_limit_per_ip 2;
    
    # Límite de tamaño específico para uploads
    client_max_body_size 10m;
    
    proxy_pass http://backend_api;
}

# Bot handling
location / {
    if ($limit_bots) {
        limit_req zone=bots burst=5 nodelay;
    }
    
    try_files $uri $uri/ @frontend;
}
```

### **Paso 4: SSL Testing y Monitoring (5 minutos)**

#### **4.1 Script de Testing SSL**
Crear `tools/ssl-test.sh`:

```bash
#!/bin/bash

# Script de testing completo para SSL

DOMAIN=${1:-"techstore.local"}
PORT=${2:-443}

echo "🔒 Testing SSL configuration para $DOMAIN:$PORT"
echo "================================================"

# Test 1: Conectividad básica
echo "1. Test de conectividad..."
if timeout 5 bash -c "</dev/tcp/$DOMAIN/$PORT"; then
    echo "✅ Puerto $PORT está abierto"
else
    echo "❌ No se puede conectar al puerto $PORT"
    exit 1
fi

# Test 2: Certificado
echo -e "\n2. Información del certificado..."
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:$PORT 2>/dev/null | \
openssl x509 -noout -dates -subject -issuer

# Test 3: Protocolo SSL/TLS
echo -e "\n3. Protocolos soportados..."
for protocol in ssl3 tls1 tls1_1 tls1_2 tls1_3; do
    result=$(echo | timeout 3 openssl s_client -$protocol -connect $DOMAIN:$PORT -servername $DOMAIN 2>&1)
    if echo "$result" | grep -q "Verify return code: 0"; then
        echo "✅ $protocol: Soportado"
    else
        echo "❌ $protocol: No soportado"
    fi
done

# Test 4: Cipher suites
echo -e "\n4. Cipher suites..."
echo | openssl s_client -connect $DOMAIN:$PORT -cipher 'ECDHE' 2>/dev/null | \
grep "Cipher is" | head -5

# Test 5: HSTS Headers
echo -e "\n5. Security headers..."
headers=$(curl -Iks https://$DOMAIN/)
echo "$headers" | grep -i "strict-transport-security" || echo "❌ HSTS no encontrado"
echo "$headers" | grep -i "content-security-policy" || echo "❌ CSP no encontrado"
echo "$headers" | grep -i "x-frame-options" || echo "❌ X-Frame-Options no encontrado"

# Test 6: OCSP Stapling
echo -e "\n6. OCSP Stapling..."
echo | openssl s_client -connect $DOMAIN:$PORT -status 2>/dev/null | \
grep -A 5 "OCSP response:"

# Test 7: Certificate transparency
echo -e "\n7. Certificate Transparency..."
echo | openssl s_client -connect $DOMAIN:$PORT 2>/dev/null | \
openssl x509 -noout -text | grep -A 5 "CT Precertificate SCTs"

echo -e "\n✅ SSL testing completado"
```

## 🧪 Testing y Validación

### **1. Verificar Configuración SSL (3 minutos)**

```bash
# Test configuración
nginx -t

# Verificar certificados
openssl x509 -in /etc/nginx/ssl/techstore.local.crt -text -noout

# Test SSL handshake
openssl s_client -connect techstore.local:443 -servername techstore.local
```

### **2. Test de Security Headers (2 minutos)**

```bash
# Verificar headers de seguridad
curl -Iks https://techstore.local/ | grep -i security

# Test específicos
curl -H "Host: techstore.local" https://localhost/ -k -I
```

### **3. SSL Labs Test (simulado) (3 minutos)**

```bash
# Ejecutar checker SSL
docker-compose --profile testing up ssl_checker

# Revisar reporte
cat tools/ssl-checker/reports/ssl_report_*.json
```

## ✅ Criterios de Éxito

- [ ] **HTTPS funcionando:** Certificados válidos instalados
- [ ] **Security headers:** Todos los headers implementados
- [ ] **SSL score:** A+ en SSL Labs (o equivalente)
- [ ] **HSTS implementado:** Máxima seguridad de transporte
- [ ] **Perfect Forward Secrecy:** Configurado correctamente
- [ ] **Rate limiting:** Funcionando por endpoint

## 🎯 Métricas de Seguridad

- **SSL Labs Score:** A+
- **Security Headers Score:** 100%
- **TLS Version:** 1.2 y 1.3 únicamente
- **Certificate validity:** > 30 días
- **HSTS max-age:** 1 año (31536000 segundos)

## 📝 Entregables

1. **SSL/TLS configurado** con certificados válidos ✅
2. **Security headers** implementados completamente ✅
3. **HSTS y OCSP stapling** configurados ✅
4. **Rate limiting avanzado** por endpoint ✅
5. **SSL monitoring** y testing automatizado ✅

**¡Configuración SSL/TLS de nivel bancario lista para WorldSkills! 🔒🏆**
