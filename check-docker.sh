#!/bin/bash

# Script de verificación rápida para Docker Compose
# WorldSkills 2025 - PHP/Laravel

echo "🔍 Verificando Docker Compose..."

# Verificar que Docker está funcionando
if ! docker --version &> /dev/null; then
    echo "❌ Docker no está instalado o funcionando"
    exit 1
fi

# Verificar que Docker Compose está funcionando
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose no está funcionando"
    echo "💡 Instala el plugin: sudo apt install docker-compose-plugin"
    exit 1
fi

echo "✅ Docker version: $(docker --version)"
echo "✅ Docker Compose version: $(docker compose version --short)"

# Verificar si hay un docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    echo "✅ Archivo docker-compose.yml encontrado"
    
    # Verificar sintaxis
    if docker compose config &> /dev/null; then
        echo "✅ Sintaxis de docker-compose.yml válida"
    else
        echo "❌ Error en la sintaxis de docker-compose.yml"
        docker compose config
        exit 1
    fi
else
    echo "⚠️ No se encontró docker-compose.yml en el directorio actual"
fi

echo ""
echo "🎯 Todo listo para usar 'docker compose' (sin guión)"
echo ""
echo "Comandos principales:"
echo "  docker compose up -d      # Iniciar servicios"
echo "  docker compose ps         # Ver estado"
echo "  docker compose logs -f    # Ver logs"
echo "  docker compose down       # Detener servicios"
