# 🐳 Ejercicio 1: Docker Multi-Container Setup

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐  
**Prerrequisitos:** Aplicación full-stack del día anterior

## 🎯 Objetivos

- Containerizar aplicación React + Express + MongoDB
- Crear Docker Compose multi-contenedor
- Implementar networking entre contenedores
- Configurar volúmenes persistentes
- Optimizar builds con multi-stage

## 📋 Instrucciones

### **Paso 1: Crear Dockerfiles (15 minutos)**

#### **Frontend Dockerfile**
Crear `frontend/Dockerfile`:

```dockerfile
# Multi-stage build para React
FROM node:18-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de producción
RUN pnpm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración Nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
```

#### **Backend Dockerfile**
Crear `backend/Dockerfile`:

```dockerfile
# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm
RUN pnpm install --only=production

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar ownership de archivos
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Comando por defecto
CMD ["pnpm", "start"]
```

### **Paso 2: Configuración Nginx para React (5 minutos)**

Crear `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    
    # Configuración para React Router
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Configuración para assets estáticos
    location /static/ {
        root /usr/share/nginx/html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy para API calls
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
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

### **Paso 3: Docker Compose Configuration (15 minutos)**

Crear `docker-compose.yml` en la raíz:

```yaml
version: '3.8'

services:
  # Base de datos MongoDB
  mongodb:
    image: mongo:6.0
    container_name: techstore_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: techstore
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongodb/init-scripts:/docker-entrypoint-initdb.d
    networks:
      - techstore_network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Backend Express.js
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: techstore_backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3001
      MONGODB_URI: mongodb://admin:${MONGO_ROOT_PASSWORD}@mongodb:27017/techstore?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: http://localhost:3000
    ports:
      - "3001:3001"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - techstore_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Frontend React
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: techstore_frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - techstore_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis para caching (opcional)
  redis:
    image: redis:7-alpine
    container_name: techstore_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - techstore_network
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: techstore_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/sites-available:/etc/nginx/sites-available
      - ./nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - techstore_network

# Volúmenes nombrados
volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local

# Red personalizada
networks:
  techstore_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### **Paso 4: Variables de Entorno (5 minutos)**

Crear `.env`:

```env
# Database
MONGO_ROOT_PASSWORD=supersecretpassword123
MONGO_DATABASE=techstore

# JWT
JWT_SECRET=your-super-secret-jwt-key-256-bits-long

# Redis
REDIS_PASSWORD=redissecretpassword123

# App
NODE_ENV=production
PORT=3001

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=production
```

### **Paso 5: Scripts de Gestión (5 minutos)**

Crear `scripts/docker-commands.sh`:

```bash
#!/bin/bash

# Scripts para gestión de Docker

# Función para mostrar ayuda
show_help() {
    echo "Comandos disponibles:"
    echo "  start     - Iniciar todos los servicios"
    echo "  stop      - Detener todos los servicios"
    echo "  restart   - Reiniciar todos los servicios"
    echo "  logs      - Ver logs de todos los servicios"
    echo "  build     - Reconstruir todas las imágenes"
    echo "  clean     - Limpiar contenedores y volúmenes"
    echo "  status    - Ver estado de servicios"
}

# Función para iniciar servicios
start_services() {
    echo "🚀 Iniciando servicios TechStore..."
    docker-compose up -d
    echo "✅ Servicios iniciados"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:3001"
}

# Función para detener servicios
stop_services() {
    echo "🛑 Deteniendo servicios..."
    docker-compose down
    echo "✅ Servicios detenidos"
}

# Función para reiniciar servicios
restart_services() {
    echo "🔄 Reiniciando servicios..."
    docker-compose restart
    echo "✅ Servicios reiniciados"
}

# Función para ver logs
view_logs() {
    if [ -n "$2" ]; then
        docker-compose logs -f $2
    else
        docker-compose logs -f
    fi
}

# Función para reconstruir
rebuild_services() {
    echo "🔨 Reconstruyendo servicios..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    echo "✅ Servicios reconstruidos"
}

# Función para limpiar
clean_docker() {
    echo "🧹 Limpiando Docker..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    echo "✅ Limpieza completada"
}

# Función para ver estado
show_status() {
    echo "📊 Estado de servicios:"
    docker-compose ps
    echo ""
    echo "💾 Uso de volúmenes:"
    docker volume ls | grep techstore
}

# Main script
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        view_logs $@
        ;;
    build)
        rebuild_services
        ;;
    clean)
        clean_docker
        ;;
    status)
        show_status
        ;;
    *)
        show_help
        ;;
esac
```

## 🧪 Testing y Validación

### **1. Verificar Build (2 minutos)**

```bash
# Construir todas las imágenes
docker-compose build

# Verificar imágenes creadas
docker images | grep techstore
```

### **2. Iniciar Servicios (2 minutos)**

```bash
# Iniciar en modo detached
docker-compose up -d

# Verificar estado
docker-compose ps
```

### **3. Verificar Conectividad (1 minuto)**

```bash
# Test health checks
docker-compose exec backend curl http://localhost:3001/api/health
docker-compose exec frontend curl http://localhost:80

# Test comunicación entre servicios
docker-compose exec backend ping mongodb
docker-compose exec frontend ping backend
```

## ✅ Criterios de Éxito

- [ ] **Docker Compose funciona:** Todos los servicios up
- [ ] **Health checks OK:** Todos los servicios healthy
- [ ] **Networking:** Comunicación entre contenedores
- [ ] **Volúmenes:** Data persistente funcionando
- [ ] **Variables de entorno:** Configuración correcta
- [ ] **Performance:** Startup time < 2 minutos

## 🎯 Puntos Clave WorldSkills

1. **Multi-stage builds** para optimización
2. **Health checks** en todos los servicios
3. **Networking** personalizado y seguro
4. **Volume management** para persistencia
5. **Environment variables** para configuración
6. **Security best practices** (non-root users)

## 🚨 Troubleshooting

### **Problemas Comunes**

1. **Puerto ocupado:**
   ```bash
   sudo lsof -i :3000
   docker-compose down
   ```

2. **Problemas de permisos:**
   ```bash
   sudo chown -R $USER:$USER ./
   ```

3. **Memoria insuficiente:**
   ```bash
   docker system prune -f
   docker volume prune -f
   ```

## 📝 Entregables

1. **Archivos Docker configurados** ✅
2. **Docker Compose funcionando** ✅
3. **Servicios comunicándose** ✅
4. **Scripts de gestión** ✅
5. **Documentación de setup** ✅

**¡Aplicación completamente containerizada y lista para producción! 🚀**
