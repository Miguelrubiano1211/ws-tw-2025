#!/bin/bash

# WorldSkills 2025 - Script de Configuración Rápida del Entorno
# Día 1: Configuración PHP/Laravel/Docker

echo "🚀 Iniciando configuración del entorno WorldSkills 2025..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar el progreso
show_progress() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

show_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

show_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    show_error "No se encontró docker-compose.yml. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# 2. Verificar Docker
show_progress "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    show_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    show_error "Docker Compose plugin no está instalado. Por favor instala docker-compose-plugin primero."
    exit 1
fi

show_success "Docker y Docker Compose están instalados"

# 3. Verificar PHP
show_progress "Verificando PHP..."
if ! command -v php &> /dev/null; then
    show_warning "PHP no está instalado. Instalando PHP 8.2..."
    sudo apt update
    sudo apt install -y php8.2 php8.2-cli php8.2-common php8.2-curl \
    php8.2-gd php8.2-intl php8.2-mbstring php8.2-mysql \
    php8.2-opcache php8.2-readline php8.2-xml php8.2-zip \
    php8.2-pgsql php8.2-sqlite3 php8.2-bcmath php8.2-soap php8.2-xdebug
fi

PHP_VERSION=$(php -v | head -n 1 | cut -d " " -f 2 | cut -d "." -f 1,2)
if [[ "$PHP_VERSION" < "8.2" ]]; then
    show_error "Se requiere PHP 8.2 o superior. Versión actual: $PHP_VERSION"
    exit 1
fi

show_success "PHP $PHP_VERSION está instalado"

# 4. Verificar Composer
show_progress "Verificando Composer..."
if ! command -v composer &> /dev/null; then
    show_warning "Composer no está instalado. Instalando..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi

show_success "Composer está instalado"

# 5. Iniciar servicios Docker
show_progress "Iniciando servicios Docker..."
docker compose up -d

# Esperar a que los servicios estén listos
show_progress "Esperando a que los servicios estén listos..."
sleep 10

# Verificar que los servicios están corriendo
POSTGRES_STATUS=$(docker compose ps postgres | grep "Up" | wc -l)
MYSQL_STATUS=$(docker compose ps mysql | grep "Up" | wc -l)

if [ $POSTGRES_STATUS -eq 1 ]; then
    show_success "PostgreSQL está corriendo en puerto 5432"
else
    show_error "PostgreSQL no pudo iniciarse"
fi

if [ $MYSQL_STATUS -eq 1 ]; then
    show_success "MySQL está corriendo en puerto 3306"
else
    show_error "MySQL no pudo iniciarse"
fi

# 6. Crear proyecto Laravel si no existe
if [ ! -d "worldskills-app" ]; then
    show_progress "Creando proyecto Laravel..."
    composer create-project laravel/laravel worldskills-app
    cd worldskills-app
    
    # Configurar permisos
    chmod -R 755 storage bootstrap/cache
    
    # Generar key
    php artisan key:generate
    
    cd ..
    show_success "Proyecto Laravel creado en worldskills-app/"
else
    show_success "Proyecto Laravel ya existe"
fi

# 7. Mostrar información de conexión
echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Información de servicios:"
echo "================================"
echo "🐘 PostgreSQL: localhost:5432"
echo "   Database: worldskills_db"
echo "   User: postgres"
echo "   Password: password"
echo ""
echo "🐬 MySQL: localhost:3306"
echo "   Database: worldskills_db"
echo "   User: worldskills"
echo "   Password: password"
echo ""
echo "🔧 Adminer (DB Web Interface): http://localhost:8080"
echo "📧 Mailpit (Email Testing): http://localhost:8025"
echo ""
echo "🚀 Para iniciar el servidor Laravel:"
echo "   cd worldskills-app"
echo "   php artisan serve"
echo ""
echo "💡 Para ver los logs de Docker:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Para detener los servicios:"
echo "   docker compose down"
echo ""

# 8. Verificar extensiones de VS Code
if command -v code &> /dev/null; then
    show_progress "Verificando extensiones de VS Code..."
    
    # Lista de extensiones esenciales
    EXTENSIONS=(
        "bmewburn.vscode-intelephense-client"
        "onecentlin.laravel-blade"
        "ms-azuretools.vscode-docker"
        "eamodio.gitlens"
    )
    
    for ext in "${EXTENSIONS[@]}"; do
        if code --list-extensions | grep -q "$ext"; then
            show_success "Extensión $ext ya está instalada"
        else
            show_warning "Instalando extensión $ext..."
            code --install-extension "$ext"
        fi
    done
fi

echo ""
echo "✅ ¡Todo listo para comenzar el desarrollo!"
echo "📚 Revisa el archivo dia1/DIA1_DETALLADO.md para el plan completo del día"
