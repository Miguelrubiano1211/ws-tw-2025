# 📚 Recursos Adicionales - Día 16: Deployment y DevOps

## 🎯 Propósito
Este archivo contiene recursos complementarios, referencias, herramientas y materiales de apoyo para profundizar en los conceptos de deployment y DevOps aplicados en el entrenamiento WorldSkills 2025.

---

## 📖 Documentación Oficial

### **Docker & Containerización**
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Multi-stage builds](https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds)

### **Nginx**
- [Nginx Official Documentation](https://nginx.org/en/docs/)
- [Nginx as Reverse Proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Nginx SSL/TLS Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)

### **SSL/TLS y Seguridad**
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot User Guide](https://certbot.eff.org/docs/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)

### **DNS y Dominios**
- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [DNS Records Explained](https://www.cloudflare.com/learning/dns/dns-records/)

---

## 🛠️ Herramientas Esenciales

### **Containerización y Orquestación**
```bash
# Docker Commands Cheat Sheet
docker build -t app:latest .
docker run -d --name app -p 3000:3000 app:latest
docker logs app
docker exec -it app /bin/bash

# Docker Compose Commands
docker-compose up -d
docker-compose down
docker-compose logs -f
docker-compose exec service_name bash
```

### **Nginx Configuration Templates**
```nginx
# Basic Reverse Proxy
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# SSL Configuration
server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... proxy headers
    }
}
```

### **Environment Variables Templates**
```bash
# Production .env template
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://mongo:27017/techstore
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12

# Frontend .env.production
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_CDN_URL=https://cdn.your-domain.com
REACT_APP_ENVIRONMENT=production
```

---

## 🔧 Scripts Útiles

### **Backup Script**
```bash
#!/bin/bash
# backup.sh - Automated backup script

# Database backup
echo "🔄 Backing up database..."
docker exec mongo mongodump --out /backup/$(date +%Y%m%d_%H%M%S)

# Files backup
echo "🔄 Backing up application files..."
tar -czf /backup/app_$(date +%Y%m%d_%H%M%S).tar.gz /opt/app

# Cleanup old backups (keep last 7 days)
find /backup -name "*.tar.gz" -mtime +7 -delete
find /backup -type d -mtime +7 -exec rm -rf {} +

echo "✅ Backup completed successfully"
```

### **Health Check Script**
```bash
#!/bin/bash
# health-check.sh - System health monitoring

echo "🏥 Health Check Report - $(date)"
echo "================================"

# Check disk space
echo "💾 Disk Usage:"
df -h | grep -E "/$|/var|/opt"

# Check memory usage
echo -e "\n🧠 Memory Usage:"
free -h

# Check running containers
echo -e "\n🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check application endpoints
echo -e "\n🌐 Application Health:"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3000
curl -s -o /dev/null -w "Backend API: %{http_code}\n" http://localhost:3001/api/health

# Check SSL certificate expiry
echo -e "\n🔐 SSL Certificate:"
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -dates 2>/dev/null | grep notAfter || echo "SSL certificate not found"
```

### **Deployment Script**
```bash
#!/bin/bash
# deploy.sh - Automated deployment script

set -e

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Build new images
echo "🏗️ Building new Docker images..."
docker-compose build

# Backup current database
echo "💾 Creating backup..."
./scripts/backup.sh

# Deploy with zero downtime
echo "📦 Deploying new version..."
docker-compose up -d

# Wait for health check
echo "🏥 Waiting for health check..."
sleep 30

# Verify deployment
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    
    # Cleanup old images
    docker image prune -f
else
    echo "❌ Deployment failed! Rolling back..."
    docker-compose down
    # Restore from backup if needed
    exit 1
fi
```

---

## 📊 Monitoring y Logging

### **Docker Logging Configuration**
```yaml
# docker-compose.yml logging section
version: '3.8'
services:
  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
  
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### **Application Monitoring Setup**
```javascript
// monitoring.js - Basic application monitoring
const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  };
  
  res.status(200).json(healthCheck);
});

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
```

---

## 🔐 Seguridad y Mejores Prácticas

### **Security Headers Checklist**
- ✅ HTTPS habilitado en toda la aplicación
- ✅ Security headers configurados (CSP, HSTS, etc.)
- ✅ Rate limiting implementado
- ✅ Input validation y sanitization
- ✅ Secrets management configurado
- ✅ Regular security updates

### **Docker Security Best Practices**
```dockerfile
# Dockerfile security improvements
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy and install dependencies as non-root
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔄 CI/CD Pipeline Examples

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: user/app:latest
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /opt/app
          docker-compose pull
          docker-compose up -d
```

---

## 📚 Lecturas Recomendadas

### **Libros**
- "The Phoenix Project" - Gene Kim, Kevin Behr, George Spafford
- "Continuous Delivery" - Jez Humble, David Farley
- "Docker Deep Dive" - Nigel Poulton
- "Site Reliability Engineering" - Google

### **Cursos Online**
- Docker Mastery: with Kubernetes +Swarm from a Docker Captain (Udemy)
- DevOps Engineer Master Class (Linux Academy)
- AWS Certified DevOps Engineer (AWS Training)

### **Blogs y Recursos**
- [Docker Blog](https://www.docker.com/blog/)
- [Nginx Blog](https://www.nginx.com/blog/)
- [DevOps.com](https://devops.com/)
- [The New Stack](https://thenewstack.io/)

---

## 🧪 Laboratorios de Práctica

### **Entorno de Pruebas Local**
```bash
# Setup local testing environment
mkdir devops-lab
cd devops-lab

# Create test application
npx create-react-app frontend
mkdir backend
cd backend && npm init -y
npm install express cors

# Create basic Express server
cat > index.js << 'EOF'
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});
EOF
```

### **Test Deployment Workflow**
1. **Local Development**: Desarrollar y probar localmente
2. **Containerization**: Crear Dockerfiles y docker-compose
3. **Local Testing**: Probar containers localmente
4. **Production Build**: Optimizar para producción
5. **Deployment**: Desplegar en servidor de pruebas
6. **Monitoring**: Verificar logs y métricas
7. **Scaling**: Probar escalado y load balancing

---

## 🏆 Criterios de Evaluación WorldSkills

### **Competencias Técnicas**
- **Docker**: Configuración multi-container (25%)
- **Nginx**: Reverse proxy y SSL (20%)
- **Security**: Headers y certificados (15%)
- **Monitoring**: Logs y health checks (15%)
- **Automation**: Scripts y CI/CD (15%)
- **Documentation**: Documentación técnica (10%)

### **Competencias Profesionales**
- Resolución de problemas en producción
- Optimización de recursos
- Seguridad en deployment
- Comunicación técnica efectiva

---

## 🎯 Proyectos de Portfolio

### **Proyecto Recomendado**
Crear un deployment completo de una aplicación full-stack con:
- Frontend React con optimizaciones
- Backend Express con API RESTful
- Base de datos MongoDB
- Nginx como reverse proxy
- SSL/TLS configurado
- Monitoring y logging
- CI/CD pipeline
- Documentación completa

---

*Este documento se actualiza continuamente con nuevos recursos y mejores prácticas en DevOps y deployment.*
