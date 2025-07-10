# 📊 Ejercicio 6: Production Monitoring & Logging

**Duración:** 45 minutos  
**Dificultad:** ⭐⭐⭐⭐⭐  
**Prerrequisitos:** Ejercicios 1-5 completados (Full stack deployment)

## 🎯 Objetivos

- Implementar monitoring completo con Prometheus y Grafana
- Configurar logging centralizado con ELK Stack
- Implementar alerting y notificaciones
- Configurar health checks y uptime monitoring
- Desarrollar dashboards para métricas de negocio

## 📋 Instrucciones

### **Paso 1: Prometheus & Grafana Setup (15 minutos)**

#### **1.1 Docker Compose para Monitoring**
Crear `monitoring/docker-compose.monitoring.yml`:

```yaml
version: '3.8'

services:
  # Prometheus - Metrics collection
  prometheus:
    image: prom/prometheus:latest
    container_name: techstore_prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/rules:/etc/prometheus/rules
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    networks:
      - monitoring_network
      - techstore_network

  # Grafana - Visualization
  grafana:
    image: grafana/grafana:latest
    container_name: techstore_grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel,grafana-clock-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - monitoring_network
    depends_on:
      - prometheus

  # Node Exporter - System metrics
  node_exporter:
    image: prom/node-exporter:latest
    container_name: techstore_node_exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring_network

  # Cadvisor - Container metrics
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.0
    container_name: techstore_cadvisor
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    devices:
      - /dev/kmsg
    privileged: true
    networks:
      - monitoring_network

  # Alertmanager - Alert handling
  alertmanager:
    image: prom/alertmanager:latest
    container_name: techstore_alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
      - '--web.external-url=http://localhost:9093'
    networks:
      - monitoring_network

  # Redis Exporter - Redis metrics
  redis_exporter:
    image: oliver006/redis_exporter:latest
    container_name: techstore_redis_exporter
    restart: unless-stopped
    ports:
      - "9121:9121"
    environment:
      - REDIS_ADDR=redis://redis:6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    networks:
      - monitoring_network
      - techstore_network
    depends_on:
      - redis

  # Custom App Metrics Exporter
  app_exporter:
    build:
      context: ./exporters/app-exporter
      dockerfile: Dockerfile
    container_name: techstore_app_exporter
    restart: unless-stopped
    ports:
      - "9200:9200"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - API_BASE_URL=http://backend:3001
    networks:
      - monitoring_network
      - techstore_network
    depends_on:
      - backend

volumes:
  prometheus_data:
    driver: local
  grafana_data:
    driver: local
  alertmanager_data:
    driver: local

networks:
  monitoring_network:
    driver: bridge
  techstore_network:
    external: true
```

#### **1.2 Configuración de Prometheus**
Crear `monitoring/prometheus/prometheus.yml`:

```yaml
# Configuración de Prometheus para TechStore
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'techstore-local'
    environment: 'production'

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

# Load rules once and periodically evaluate them
rule_files:
  - "rules/*.yml"

# Scrape configurations
scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter - System metrics
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node_exporter:9100']
    scrape_interval: 5s

  # cAdvisor - Container metrics
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
    scrape_interval: 5s

  # Redis metrics
  - job_name: 'redis'
    static_configs:
      - targets: ['redis_exporter:9121']

  # Application backend metrics
  - job_name: 'techstore-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 10s

  # Application custom metrics
  - job_name: 'techstore-app-metrics'
    static_configs:
      - targets: ['app_exporter:9200']
    scrape_interval: 30s

  # Nginx metrics (if nginx-prometheus-exporter is installed)
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx_exporter:9113']
    scrape_interval: 5s

  # Blackbox exporter for URL monitoring
  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - https://techstore.local
        - https://api.techstore.local/health
        - https://admin.techstore.local
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox_exporter:9115

# Remote write configuration (for long-term storage)
remote_write:
  - url: "http://victoriametrics:8428/api/v1/write"
    queue_config:
      max_samples_per_send: 10000
      batch_send_deadline: 5s
```

#### **1.3 Alerting Rules**
Crear `monitoring/prometheus/rules/techstore-alerts.yml`:

```yaml
# Alerting rules para TechStore
groups:
  - name: techstore.rules
    rules:
      # High CPU usage
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% for more than 5 minutes on {{ $labels.instance }}"

      # High memory usage
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 85% on {{ $labels.instance }}"

      # Disk space usage
      - alert: DiskSpaceUsage
        expr: (node_filesystem_size_bytes{fstype!="tmpfs"} - node_filesystem_free_bytes{fstype!="tmpfs"}) / node_filesystem_size_bytes{fstype!="tmpfs"} * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High disk usage detected"
          description: "Disk usage is above 85% on {{ $labels.instance }} mount {{ $labels.mountpoint }}"

      # Application down
      - alert: TechStoreBackendDown
        expr: up{job="techstore-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "TechStore Backend is down"
          description: "TechStore backend service has been down for more than 1 minute"

      # High response time
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="techstore-backend"}[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is above 500ms for more than 5 minutes"

      # High error rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{job="techstore-backend",status=~"5.."}[5m]) / rate(http_requests_total{job="techstore-backend"}[5m]) * 100 > 5
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5% for more than 5 minutes"

      # Database connection issues
      - alert: DatabaseConnectionIssues
        expr: mongodb_connections{state="current"} > mongodb_connections{state="available"} * 0.8
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High database connection usage"
          description: "MongoDB connection usage is above 80% of available connections"

      # SSL certificate expiry
      - alert: SSLCertificateExpiry
        expr: probe_ssl_earliest_cert_expiry - time() < 86400 * 30
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "SSL certificate expiring soon"
          description: "SSL certificate for {{ $labels.instance }} expires in less than 30 days"
```

#### **1.4 Custom App Metrics Exporter**
Crear `monitoring/exporters/app-exporter/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S exporter -u 1001

# Change to non-root user
USER exporter

EXPOSE 9200

CMD ["node", "index.js"]
```

Crear `monitoring/exporters/app-exporter/index.js`:

```javascript
const express = require('express');
const promClient = require('prom-client');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = 9200;

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'techstore'
});

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'techstore_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const businessMetrics = {
  totalUsers: new promClient.Gauge({
    name: 'techstore_total_users',
    help: 'Total number of registered users'
  }),
  
  totalProducts: new promClient.Gauge({
    name: 'techstore_total_products',
    help: 'Total number of products in catalog'
  }),
  
  totalOrders: new promClient.Gauge({
    name: 'techstore_total_orders',
    help: 'Total number of orders'
  }),
  
  dailyRevenue: new promClient.Gauge({
    name: 'techstore_daily_revenue',
    help: 'Daily revenue in dollars'
  }),
  
  activeUsersSessions: new promClient.Gauge({
    name: 'techstore_active_user_sessions',
    help: 'Number of active user sessions'
  }),
  
  cartAbandonmentRate: new promClient.Gauge({
    name: 'techstore_cart_abandonment_rate',
    help: 'Cart abandonment rate percentage'
  }),
  
  averageOrderValue: new promClient.Gauge({
    name: 'techstore_average_order_value',
    help: 'Average order value in dollars'
  }),
  
  inventoryLowStock: new promClient.Gauge({
    name: 'techstore_inventory_low_stock_items',
    help: 'Number of items with low stock'
  })
};

// Register custom metrics
register.registerMetric(httpRequestDuration);
Object.values(businessMetrics).forEach(metric => {
  register.registerMetric(metric);
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/techstore');
    console.log('Connected to MongoDB for metrics collection');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Collect business metrics
const collectBusinessMetrics = async () => {
  try {
    // Connect to database if not connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Get API base URL
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

    // Collect metrics from API endpoints
    const endpoints = [
      { path: '/api/metrics/users', metric: businessMetrics.totalUsers },
      { path: '/api/metrics/products', metric: businessMetrics.totalProducts },
      { path: '/api/metrics/orders', metric: businessMetrics.totalOrders },
      { path: '/api/metrics/revenue/daily', metric: businessMetrics.dailyRevenue },
      { path: '/api/metrics/sessions/active', metric: businessMetrics.activeUsersSessions }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${apiBaseUrl}${endpoint.path}`, {
          timeout: 5000,
          headers: {
            'User-Agent': 'TechStore-Metrics-Exporter/1.0'
          }
        });
        
        if (response.data && typeof response.data.value === 'number') {
          endpoint.metric.set(response.data.value);
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint.path}:`, error.message);
      }
    }

    // Calculate derived metrics
    try {
      // Cart abandonment rate (example calculation)
      const cartResponse = await axios.get(`${apiBaseUrl}/api/metrics/cart-abandonment`, { timeout: 5000 });
      if (cartResponse.data && typeof cartResponse.data.rate === 'number') {
        businessMetrics.cartAbandonmentRate.set(cartResponse.data.rate);
      }

      // Average order value
      const aovResponse = await axios.get(`${apiBaseUrl}/api/metrics/average-order-value`, { timeout: 5000 });
      if (aovResponse.data && typeof aovResponse.data.value === 'number') {
        businessMetrics.averageOrderValue.set(aovResponse.data.value);
      }

      // Low stock items
      const stockResponse = await axios.get(`${apiBaseUrl}/api/metrics/low-stock`, { timeout: 5000 });
      if (stockResponse.data && typeof stockResponse.data.count === 'number') {
        businessMetrics.inventoryLowStock.set(stockResponse.data.count);
      }

    } catch (error) {
      console.error('Error calculating derived metrics:', error.message);
    }

  } catch (error) {
    console.error('Error collecting business metrics:', error);
  }
};

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    // Collect fresh business metrics
    await collectBusinessMetrics();
    
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).end('Error generating metrics');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start metrics collection interval
setInterval(collectBusinessMetrics, 30000); // Every 30 seconds

// Start server
app.listen(port, () => {
  console.log(`TechStore metrics exporter listening on port ${port}`);
  console.log(`Metrics available at http://localhost:${port}/metrics`);
  
  // Initial metrics collection
  collectBusinessMetrics();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close();
  process.exit(0);
});
```

### **Paso 2: ELK Stack Logging (15 minutos)**

#### **2.1 Docker Compose para ELK**
Crear `logging/docker-compose.logging.yml`:

```yaml
version: '3.8'

services:
  # Elasticsearch - Log storage
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    container_name: techstore_elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
    ports:
      - "9201:9200"
      - "9301:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - logging_network

  # Kibana - Log visualization
  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    container_name: techstore_kibana
    restart: unless-stopped
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - SERVER_NAME=kibana.techstore.local
    volumes:
      - ./kibana/kibana.yml:/usr/share/kibana/config/kibana.yml
    networks:
      - logging_network
    depends_on:
      - elasticsearch

  # Logstash - Log processing
  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    container_name: techstore_logstash
    restart: unless-stopped
    ports:
      - "5044:5044"
      - "9600:9600"
    volumes:
      - ./logstash/config/logstash.yml:/usr/share/logstash/config/logstash.yml
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    environment:
      - "LS_JAVA_OPTS=-Xmx256m -Xms256m"
    networks:
      - logging_network
    depends_on:
      - elasticsearch

  # Filebeat - Log shipping
  filebeat:
    image: docker.elastic.co/beats/filebeat:8.5.0
    container_name: techstore_filebeat
    restart: unless-stopped
    user: root
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/log:/host/var/log:ro
      - filebeat_data:/usr/share/filebeat/data
    environment:
      - ELASTICSEARCH_HOST=elasticsearch:9200
      - KIBANA_HOST=kibana:5601
    networks:
      - logging_network
      - techstore_network
    depends_on:
      - elasticsearch
      - logstash

volumes:
  elasticsearch_data:
    driver: local
  filebeat_data:
    driver: local

networks:
  logging_network:
    driver: bridge
  techstore_network:
    external: true
```

#### **2.2 Configuración de Logstash**
Crear `logging/logstash/pipeline/techstore.conf`:

```ruby
# Logstash configuration para TechStore

input {
  beats {
    port => 5044
  }
  
  # Recibir logs directamente de aplicaciones
  tcp {
    port => 5000
    codec => json
    tags => ["tcp-input"]
  }
  
  # HTTP input para webhooks
  http {
    port => 8080
    codec => json
    tags => ["http-input"]
  }
}

filter {
  # Parse de logs de Nginx
  if [fileset][module] == "nginx" {
    if [fileset][name] == "access" {
      grok {
        match => { 
          "message" => '%{IPORHOST:remote_addr} - %{DATA:remote_user} \[%{HTTPDATE:time_local}\] "%{WORD:method} %{DATA:request} HTTP/%{NUMBER:http_version}" %{INT:status} %{INT:body_bytes_sent} "%{DATA:http_referer}" "%{DATA:http_user_agent}" "%{DATA:http_x_forwarded_for}" rt=%{NUMBER:request_time} uct="%{DATA:upstream_connect_time}" uht="%{DATA:upstream_header_time}" urt="%{DATA:upstream_response_time}" cache="%{DATA:cache_status}" host="%{DATA:host}"'
        }
      }
      
      date {
        match => [ "time_local", "dd/MMM/yyyy:HH:mm:ss Z" ]
      }
      
      mutate {
        convert => { 
          "status" => "integer"
          "body_bytes_sent" => "integer"
          "request_time" => "float"
        }
      }
      
      # Clasificar por status code
      if [status] >= 400 {
        mutate { add_tag => [ "error" ] }
      }
      
      if [status] >= 500 {
        mutate { add_tag => [ "server_error" ] }
      }
    }
  }
  
  # Parse de logs de aplicación Node.js
  if [container][name] =~ /backend/ {
    # Parse JSON logs de aplicación
    if [message] =~ /^\{.*\}$/ {
      json {
        source => "message"
      }
      
      # Agregar timestamp si no existe
      if ![timestamp] {
        mutate {
          add_field => { "timestamp" => "%{@timestamp}" }
        }
      }
      
      # Clasificar logs por nivel
      if [level] {
        mutate {
          add_tag => [ "level_%{level}" ]
        }
        
        if [level] == "error" {
          mutate { add_tag => [ "application_error" ] }
        }
      }
    }
  }
  
  # Parse de logs de MongoDB
  if [container][name] =~ /mongodb/ {
    grok {
      match => { 
        "message" => "%{TIMESTAMP_ISO8601:timestamp} %{WORD:severity} %{WORD:component} *\[%{DATA:context}\] %{GREEDYDATA:message_body}"
      }
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
  }
  
  # Enriquecimiento de datos
  mutate {
    add_field => { 
      "environment" => "production"
      "application" => "techstore"
    }
  }
  
  # GeoIP enrichment para IPs externas
  if [remote_addr] and [remote_addr] !~ /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.)/ {
    geoip {
      source => "remote_addr"
      target => "geoip"
    }
  }
  
  # User agent parsing
  if [http_user_agent] {
    useragent {
      source => "http_user_agent"
      target => "user_agent"
    }
  }
}

output {
  # Output principal a Elasticsearch
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "techstore-logs-%{+YYYY.MM.dd}"
    template_name => "techstore"
    template_pattern => "techstore-*"
    template => "/usr/share/logstash/templates/techstore-template.json"
  }
  
  # Output para errores críticos (alerting)
  if "error" in [tags] or "server_error" in [tags] or "application_error" in [tags] {
    elasticsearch {
      hosts => ["elasticsearch:9200"]
      index => "techstore-errors-%{+YYYY.MM.dd}"
    }
    
    # Enviar a sistema de alertas
    http {
      url => "http://alertmanager:9093/api/v1/alerts"
      http_method => "post"
      content_type => "application/json"
      format => "json"
      mapping => {
        "alerts" => [{
          "labels" => {
            "alertname" => "LogError"
            "severity" => "warning"
            "instance" => "%{host}"
            "job" => "logstash"
          }
          "annotations" => {
            "summary" => "Error detected in logs"
            "description" => "%{message}"
          }
        }]
      }
    }
  }
  
  # Debug output (solo para desarrollo)
  # stdout { codec => rubydebug }
}
```

#### **2.3 Configuración de Filebeat**
Crear `logging/filebeat/filebeat.yml`:

```yaml
# Filebeat configuration para TechStore

filebeat.inputs:
  # Docker container logs
  - type: container
    paths:
      - '/var/lib/docker/containers/*/*.log'
    processors:
      - add_docker_metadata:
          host: "unix:///var/run/docker.sock"
      - decode_json_fields:
          fields: ["message"]
          target: ""
          overwrite_keys: true

  # Nginx access logs
  - type: log
    enabled: true
    paths:
      - /host/var/log/nginx/access.log
      - /host/var/log/nginx/*_access.log
    fields:
      logtype: nginx_access
      service: nginx
    fields_under_root: true
    multiline.pattern: '^\d{4}-\d{2}-\d{2}'
    multiline.negate: true
    multiline.match: after

  # Nginx error logs
  - type: log
    enabled: true
    paths:
      - /host/var/log/nginx/error.log
      - /host/var/log/nginx/*_error.log
    fields:
      logtype: nginx_error
      service: nginx
    fields_under_root: true

  # System logs
  - type: log
    enabled: true
    paths:
      - /host/var/log/syslog
      - /host/var/log/auth.log
    fields:
      logtype: system
      service: system
    fields_under_root: true

# Processors
processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~

# Output configuration
output.logstash:
  hosts: ["logstash:5044"]

# Elasticsearch template settings
setup.template.settings:
  index.number_of_shards: 1
  index.codec: best_compression

# Kibana configuration
setup.kibana:
  host: "kibana:5601"

# Logging configuration
logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
  permissions: 0644

# Monitoring
monitoring.enabled: true
monitoring.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

### **Paso 3: Alerting & Notifications (10 minutos)**

#### **3.1 Configuración de Alertmanager**
Crear `monitoring/alertmanager/alertmanager.yml`:

```yaml
# Alertmanager configuration para TechStore

global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@techstore.com'
  smtp_auth_username: 'alerts@techstore.com'
  smtp_auth_password: 'your-smtp-password'

# Templates para notificaciones
templates:
  - '/etc/alertmanager/templates/*.tmpl'

# Routing de alertas
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
    # Alertas críticas van a múltiples canales
    - match:
        severity: critical
      receiver: 'critical-alerts'
      group_wait: 10s
      repeat_interval: 5m
    
    # Alertas de warning solo email
    - match:
        severity: warning
      receiver: 'warning-alerts'
      repeat_interval: 30m
    
    # Alertas específicas de base de datos
    - match_re:
        alertname: ^(DatabaseConnection|HighMemoryUsage).*
      receiver: 'database-alerts'

# Inhibition rules
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster', 'service']

# Receivers (canales de notificación)
receivers:
  # Default webhook
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://localhost:5001/webhook'
        send_resolved: true

  # Alertas críticas - múltiples canales
  - name: 'critical-alerts'
    email_configs:
      - to: 'admin@techstore.com'
        subject: '[CRITICAL] TechStore Alert: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Labels: {{ range .Labels.SortedPairs }}{{ .Name }}={{ .Value }} {{ end }}
          {{ end }}
        headers:
          Priority: 'urgent'
    
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts-critical'
        title: '[CRITICAL] TechStore Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
        color: 'danger'
    
    webhook_configs:
      - url: 'http://sms-gateway:8080/send'
        send_resolved: true

  # Alertas de warning
  - name: 'warning-alerts'
    email_configs:
      - to: 'monitoring@techstore.com'
        subject: '[WARNING] TechStore Alert: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          {{ end }}
    
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts-warning'
        title: '[WARNING] TechStore Alert'
        color: 'warning'

  # Alertas de base de datos
  - name: 'database-alerts'
    email_configs:
      - to: 'dba@techstore.com'
        subject: '[DB] TechStore Database Alert: {{ .GroupLabels.alertname }}'
        body: |
          Database Alert Details:
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Instance: {{ .Labels.instance }}
          {{ end }}
```

#### **3.2 Health Check System**
Crear `monitoring/health-check/health-monitor.js`:

```javascript
const axios = require('axios');
const cron = require('node-cron');

// Configuración de endpoints para monitorear
const endpoints = [
  {
    name: 'Frontend',
    url: 'https://techstore.local',
    timeout: 5000,
    expectedStatus: 200
  },
  {
    name: 'API Health',
    url: 'https://api.techstore.local/health',
    timeout: 3000,
    expectedStatus: 200
  },
  {
    name: 'Admin Panel',
    url: 'https://admin.techstore.local',
    timeout: 5000,
    expectedStatus: 200
  },
  {
    name: 'CDN',
    url: 'https://cdn.techstore.local/health',
    timeout: 3000,
    expectedStatus: 200
  }
];

// Métricas de salud
const healthMetrics = {
  totalChecks: 0,
  successfulChecks: 0,
  failedChecks: 0,
  averageResponseTime: 0,
  lastCheckTime: null
};

// Función para verificar un endpoint
async function checkEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(endpoint.url, {
      timeout: endpoint.timeout,
      validateStatus: (status) => status === endpoint.expectedStatus,
      headers: {
        'User-Agent': 'TechStore-Health-Monitor/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ ${endpoint.name}: OK (${responseTime}ms)`);
    
    return {
      name: endpoint.name,
      status: 'UP',
      responseTime,
      statusCode: response.status,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.log(`❌ ${endpoint.name}: FAILED (${responseTime}ms) - ${error.message}`);
    
    return {
      name: endpoint.name,
      status: 'DOWN',
      responseTime,
      error: error.message,
      statusCode: error.response?.status || 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Función principal de health check
async function performHealthCheck() {
  console.log(`\n🏥 Health Check - ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  
  const results = [];
  let totalResponseTime = 0;
  
  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
    totalResponseTime += result.responseTime;
    
    healthMetrics.totalChecks++;
    if (result.status === 'UP') {
      healthMetrics.successfulChecks++;
    } else {
      healthMetrics.failedChecks++;
    }
  }
  
  // Calcular métricas
  healthMetrics.averageResponseTime = totalResponseTime / endpoints.length;
  healthMetrics.lastCheckTime = new Date().toISOString();
  healthMetrics.uptime = (healthMetrics.successfulChecks / healthMetrics.totalChecks) * 100;
  
  // Resumen
  const failedEndpoints = results.filter(r => r.status === 'DOWN');
  const avgResponseTime = Math.round(healthMetrics.averageResponseTime);
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total endpoints: ${endpoints.length}`);
  console.log(`   UP: ${results.filter(r => r.status === 'UP').length}`);
  console.log(`   DOWN: ${failedEndpoints.length}`);
  console.log(`   Average response time: ${avgResponseTime}ms`);
  console.log(`   Overall uptime: ${healthMetrics.uptime.toFixed(2)}%`);
  
  // Enviar alertas si hay endpoints down
  if (failedEndpoints.length > 0) {
    await sendAlert(failedEndpoints);
  }
  
  // Enviar métricas a Prometheus
  await sendMetricsToPrometheus(results);
  
  return results;
}

// Función para enviar alertas
async function sendAlert(failedEndpoints) {
  const alertData = {
    alerts: failedEndpoints.map(endpoint => ({
      labels: {
        alertname: 'EndpointDown',
        severity: 'critical',
        instance: endpoint.name,
        job: 'health-check'
      },
      annotations: {
        summary: `${endpoint.name} is down`,
        description: `Health check failed for ${endpoint.name}: ${endpoint.error}`,
        runbook_url: 'https://docs.techstore.com/runbooks/endpoint-down'
      },
      startsAt: new Date().toISOString()
    }))
  };
  
  try {
    await axios.post('http://alertmanager:9093/api/v1/alerts', alertData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000
    });
    
    console.log(`🚨 Alert sent for ${failedEndpoints.length} failed endpoint(s)`);
  } catch (error) {
    console.error('Failed to send alert:', error.message);
  }
}

// Función para enviar métricas a Prometheus
async function sendMetricsToPrometheus(results) {
  const metrics = results.map(result => ({
    name: 'techstore_endpoint_up',
    labels: { endpoint: result.name },
    value: result.status === 'UP' ? 1 : 0
  }));
  
  // Agregar métricas de tiempo de respuesta
  results.forEach(result => {
    metrics.push({
      name: 'techstore_endpoint_response_time_seconds',
      labels: { endpoint: result.name },
      value: result.responseTime / 1000
    });
  });
  
  try {
    // Enviar a pushgateway o custom exporter
    await axios.post('http://app_exporter:9200/metrics/health', {
      metrics,
      timestamp: new Date().toISOString()
    }, {
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to send metrics:', error.message);
  }
}

// Endpoint para status
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    metrics: healthMetrics,
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', (req, res) => {
  res.json(healthMetrics);
});

// Iniciar servidor de health check
app.listen(8090, () => {
  console.log('Health Monitor running on port 8090');
});

// Programar health checks cada 30 segundos
cron.schedule('*/30 * * * * *', () => {
  performHealthCheck().catch(console.error);
});

// Health check inicial
performHealthCheck().catch(console.error);

console.log('🏥 TechStore Health Monitor started');
console.log('📋 Monitoring endpoints:', endpoints.map(e => e.name).join(', '));
```

### **Paso 4: Dashboards de Grafana (5 minutos)**

#### **4.1 Configuración de Datasources**
Crear `monitoring/grafana/datasources/prometheus.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    
  - name: Elasticsearch
    type: elasticsearch
    access: proxy
    url: http://elasticsearch:9200
    database: "techstore-logs-*"
    timeField: "@timestamp"
    
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
```

#### **4.2 Dashboard Principal**
Crear `monitoring/grafana/dashboards/techstore-overview.json`:

```json
{
  "dashboard": {
    "id": null,
    "title": "TechStore - Production Overview",
    "tags": ["techstore", "production"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "System Overview",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"techstore-backend\"}",
            "legendFormat": "Backend Status"
          },
          {
            "expr": "up{job=\"node-exporter\"}",
            "legendFormat": "System Status"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "green", "value": 1}
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"techstore-backend\"}[5m])",
            "legendFormat": "Requests/sec"
          }
        ]
      },
      {
        "id": 3,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job=\"techstore-backend\"}[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket{job=\"techstore-backend\"}[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "id": 4,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{job=\"techstore-backend\",status=~\"5..\"}[5m]) / rate(http_requests_total{job=\"techstore-backend\"}[5m]) * 100",
            "legendFormat": "Error Rate %"
          }
        ]
      },
      {
        "id": 5,
        "title": "Business Metrics",
        "type": "stat",
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
            "legendFormat": "Daily Revenue"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "10s"
  }
}
```

## 🧪 Testing y Validación

### **1. Verificar Stack de Monitoring (5 minutos)**

```bash
# Iniciar todos los servicios de monitoring
docker-compose -f monitoring/docker-compose.monitoring.yml up -d

# Verificar servicios
curl http://localhost:9090  # Prometheus
curl http://localhost:3000  # Grafana
curl http://localhost:9093  # Alertmanager
```

### **2. Test de Logging (3 minutos)**

```bash
# Iniciar ELK stack
docker-compose -f logging/docker-compose.logging.yml up -d

# Verificar Elasticsearch
curl http://localhost:9201/_cluster/health

# Verificar logs llegando
curl http://localhost:9201/techstore-logs-*/_search?size=10
```

### **3. Test de Alertas (2 minutos)**

```bash
# Simular alerta crítica
curl -X POST http://localhost:9093/api/v1/alerts \
  -H 'Content-Type: application/json' \
  -d '[{
    "labels": {
      "alertname": "TestAlert",
      "severity": "critical"
    },
    "annotations": {
      "summary": "Test alert for validation"
    }
  }]'
```

## ✅ Criterios de Éxito

- [ ] **Prometheus activo:** Métricas recolectándose correctamente
- [ ] **Grafana funcionando:** Dashboards mostrando datos
- [ ] **ELK Stack operacional:** Logs centralizados y visualizables
- [ ] **Alerting configurado:** Notificaciones funcionando
- [ ] **Health checks:** Monitoreo automático activo
- [ ] **Business metrics:** Métricas de negocio tracked

## 🎯 Métricas de Monitoring

- **Data retention:** 30 días Prometheus, 90 días Elasticsearch
- **Alert response time:** < 1 minuto
- **Dashboard load time:** < 3 segundos
- **Log ingestion rate:** > 1000 logs/segundo
- **Uptime monitoring:** 99.9% availability tracking

## 📝 Entregables

1. **Monitoring stack completo** con Prometheus/Grafana ✅
2. **Logging centralizado** con ELK Stack ✅
3. **Alerting system** con notificaciones multi-canal ✅
4. **Health check automation** con reporting ✅
5. **Business metrics tracking** y dashboards ✅

**¡Sistema de monitoring y logging de nivel enterprise listo para WorldSkills! 📊🏆**
