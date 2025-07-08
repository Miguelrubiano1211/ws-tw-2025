#!/bin/bash
# COMANDOS RÁPIDOS - WorldSkills 2025 PHP/Laravel
# Usar: source quick-commands.sh

# Aliases para Docker Compose (nuevo formato)
alias dcu="docker compose up -d"
alias dcd="docker compose down"
alias dcp="docker compose ps"
alias dcl="docker compose logs -f"
alias dcr="docker compose restart"
alias dcb="docker compose up -d --build"

# Aliases para Laravel
alias artisan="docker compose exec app php artisan"
alias tinker="docker compose exec app php artisan tinker"
alias migrate="docker compose exec app php artisan migrate"
alias fresh="docker compose exec app php artisan migrate:fresh --seed"

# Aliases para bases de datos
alias pgsql="docker compose exec postgres psql -U postgres -d worldskills_db"
alias mysql-connect="docker compose exec mysql mysql -u worldskills -p worldskills_db"

# Aliases para desarrollo
alias phpunit="docker compose exec app ./vendor/bin/phpunit"
alias composer-install="docker compose exec app composer install"
alias npm-install="docker compose exec app npm install"

# Funciones útiles
ws-logs() {
    if [ -z "$1" ]; then
        docker compose logs -f
    else
        docker compose logs -f $1
    fi
}

ws-exec() {
    if [ -z "$1" ]; then
        docker compose exec app bash
    else
        docker compose exec $1 bash
    fi
}

ws-reset() {
    echo "🔄 Reiniciando entorno completo..."
    docker compose down
    docker compose up -d --build
    docker compose exec app composer install
    docker compose exec app php artisan migrate:fresh --seed
    echo "✅ Entorno reiniciado"
}

ws-status() {
    echo "📊 Estado del entorno WorldSkills:"
    echo ""
    docker compose ps
    echo ""
    echo "🐘 PostgreSQL:"
    docker compose exec postgres pg_isready -U postgres
    echo ""
    echo "🐬 MySQL:"
    docker compose exec mysql mysqladmin ping -h localhost -u worldskills -ppassword
}

echo "✅ Comandos rápidos cargados para WorldSkills 2025"
echo ""
echo "Comandos disponibles:"
echo "  dcu          - docker compose up -d"
echo "  dcd          - docker compose down"
echo "  dcp          - docker compose ps"
echo "  dcl          - docker compose logs -f"
echo "  artisan      - php artisan (en container)"
echo "  migrate      - php artisan migrate"
echo "  ws-status    - Ver estado del entorno"
echo "  ws-reset     - Reiniciar todo el entorno"
