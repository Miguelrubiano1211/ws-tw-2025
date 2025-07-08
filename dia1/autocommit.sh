#!/bin/bash

# =============================================================================
# AUTOCOMMIT SCRIPT - BOOTCAMP WORLDSKILLS
# Automatización de Git para desarrollo rápido
# Autor: Tu Nombre
# Día 1: Introducción al bash scripting
# =============================================================================

# Configuración de colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración del script
SCRIPT_NAME="autocommit.sh"
VERSION="1.0.0"
AUTHOR="Tu Nombre"

# Función para mostrar banner
show_banner() {
    clear
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    AUTOCOMMIT SCRIPT - WORLDSKILLS${NC}"
    echo -e "${BLUE}    Día 1: Bash Scripting Básico${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}Versión: $VERSION${NC}"
    echo -e "${GREEN}Autor: $AUTHOR${NC}"
    echo -e "${GREEN}Fecha: $(date +'%Y-%m-%d %H:%M:%S')${NC}"
    echo ""
}

# Función para mostrar ayuda
show_help() {
    echo -e "${YELLOW}Uso: $SCRIPT_NAME [OPCIONES]${NC}"
    echo ""
    echo -e "${YELLOW}OPCIONES:${NC}"
    echo "  -h, --help              Muestra esta ayuda"
    echo "  -v, --version           Muestra la versión"
    echo "  -m, --message <msg>     Mensaje personalizado para el commit"
    echo "  -p, --push              Hacer push automático después del commit"
    echo "  -f, --force             Forzar add de todos los archivos"
    echo "  -s, --status            Mostrar solo el estado del repositorio"
    echo "  -l, --log               Mostrar últimos 5 commits"
    echo ""
    echo -e "${YELLOW}EJEMPLOS:${NC}"
    echo "  $SCRIPT_NAME                           # Commit automático"
    echo "  $SCRIPT_NAME -m \"Fix: corrección bug\"  # Commit con mensaje"
    echo "  $SCRIPT_NAME -p                        # Commit y push"
    echo "  $SCRIPT_NAME -f -m \"WIP: trabajo en progreso\" -p"
    echo ""
}

# Función para verificar si estamos en un repositorio git
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
        echo -e "${YELLOW}💡 Para inicializar un repositorio:${NC}"
        echo "   git init"
        echo "   git remote add origin <URL_DEL_REPOSITORIO>"
        exit 1
    fi
}

# Función para verificar el estado del repositorio
check_repo_status() {
    echo -e "${BLUE}📊 Estado del repositorio:${NC}"
    echo ""
    
    # Mostrar branch actual
    CURRENT_BRANCH=$(git branch --show-current)
    echo -e "${GREEN}🌿 Branch actual: $CURRENT_BRANCH${NC}"
    
    # Mostrar estado de archivos
    git status --porcelain > /tmp/git_status.txt
    
    if [ -s /tmp/git_status.txt ]; then
        echo -e "${YELLOW}📝 Archivos modificados:${NC}"
        while IFS= read -r line; do
            status=${line:0:2}
            file=${line:3}
            
            case $status in
                "M ") echo -e "  ${GREEN}✏️  Modificado: $file${NC}" ;;
                "A ") echo -e "  ${GREEN}➕ Agregado: $file${NC}" ;;
                "D ") echo -e "  ${RED}🗑️  Eliminado: $file${NC}" ;;
                "??") echo -e "  ${YELLOW}❓ Sin seguimiento: $file${NC}" ;;
                "R ") echo -e "  ${BLUE}🔄 Renombrado: $file${NC}" ;;
                *) echo -e "  ${YELLOW}📄 $file${NC}" ;;
            esac
        done < /tmp/git_status.txt
        rm /tmp/git_status.txt
        return 0
    else
        echo -e "${GREEN}✅ No hay cambios pendientes${NC}"
        rm /tmp/git_status.txt
        return 1
    fi
}

# Función para generar mensaje de commit automático
generate_commit_message() {
    local changes=$(git diff --name-only --cached)
    local new_files=$(git diff --name-only --cached --diff-filter=A)
    local modified_files=$(git diff --name-only --cached --diff-filter=M)
    local deleted_files=$(git diff --name-only --cached --diff-filter=D)
    
    local message=""
    local file_count=$(echo "$changes" | wc -l)
    
    if [ $file_count -eq 1 ]; then
        local file=$(echo "$changes" | head -1)
        local extension="${file##*.}"
        
        case $extension in
            "html") message="feat: actualizar página HTML - $file" ;;
            "css") message="style: actualizar estilos CSS - $file" ;;
            "js") message="feat: actualizar JavaScript - $file" ;;
            "md") message="docs: actualizar documentación - $file" ;;
            "sh") message="script: actualizar script bash - $file" ;;
            *) message="update: actualizar $file" ;;
        esac
    else
        if [ -n "$new_files" ]; then
            message="feat: agregar nuevos archivos"
        elif [ -n "$modified_files" ]; then
            message="update: actualizar múltiples archivos"
        elif [ -n "$deleted_files" ]; then
            message="remove: eliminar archivos"
        else
            message="update: cambios múltiples"
        fi
        
        message="$message ($file_count archivos)"
    fi
    
    # Agregar contexto del día del bootcamp
    message="$message - Día 1 WorldSkills"
    
    echo "$message"
}

# Función para mostrar últimos commits
show_recent_commits() {
    echo -e "${BLUE}📋 Últimos 5 commits:${NC}"
    echo ""
    git log --oneline -5 --decorate --color=always | while read line; do
        echo -e "  ${GREEN}📌 $line${NC}"
    done
    echo ""
}

# Función para realizar commit
do_commit() {
    local custom_message="$1"
    local force_add="$2"
    
    echo -e "${BLUE}🚀 Iniciando proceso de commit...${NC}"
    echo ""
    
    # Agregar archivos
    if [ "$force_add" = "true" ]; then
        echo -e "${YELLOW}📦 Agregando todos los archivos...${NC}"
        git add -A
    else
        echo -e "${YELLOW}📦 Agregando archivos modificados...${NC}"
        git add -u
        
        # Preguntar por archivos nuevos
        untracked_files=$(git ls-files --others --exclude-standard)
        if [ -n "$untracked_files" ]; then
            echo -e "${YELLOW}❓ Archivos sin seguimiento encontrados:${NC}"
            echo "$untracked_files" | while read file; do
                echo -e "  ${YELLOW}📄 $file${NC}"
            done
            echo ""
            read -p "¿Agregar archivos sin seguimiento? (y/N): " add_untracked
            if [[ $add_untracked =~ ^[Yy]$ ]]; then
                git add .
            fi
        fi
    fi
    
    # Verificar si hay cambios staged
    if ! git diff --cached --quiet; then
        # Generar o usar mensaje personalizado
        if [ -n "$custom_message" ]; then
            commit_message="$custom_message"
        else
            commit_message=$(generate_commit_message)
        fi
        
        echo -e "${GREEN}📝 Mensaje del commit: $commit_message${NC}"
        echo ""
        
        # Realizar commit
        if git commit -m "$commit_message"; then
            echo -e "${GREEN}✅ Commit realizado exitosamente${NC}"
            return 0
        else
            echo -e "${RED}❌ Error al realizar commit${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  No hay cambios para hacer commit${NC}"
        return 1
    fi
}

# Función para hacer push
do_push() {
    echo -e "${BLUE}🌐 Haciendo push al repositorio remoto...${NC}"
    
    # Verificar si hay remote configurado
    if ! git remote get-url origin > /dev/null 2>&1; then
        echo -e "${RED}❌ No hay repositorio remoto configurado${NC}"
        echo -e "${YELLOW}💡 Para configurar el remoto:${NC}"
        echo "   git remote add origin <URL_DEL_REPOSITORIO>"
        return 1
    fi
    
    # Hacer push
    current_branch=$(git branch --show-current)
    if git push origin "$current_branch"; then
        echo -e "${GREEN}✅ Push realizado exitosamente${NC}"
        return 0
    else
        echo -e "${RED}❌ Error al hacer push${NC}"
        echo -e "${YELLOW}💡 Si es la primera vez, intenta:${NC}"
        echo "   git push -u origin $current_branch"
        return 1
    fi
}

# Función para mostrar estadísticas
show_stats() {
    echo -e "${BLUE}📊 Estadísticas del repositorio:${NC}"
    echo ""
    
    # Número total de commits
    total_commits=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    echo -e "${GREEN}📈 Total de commits: $total_commits${NC}"
    
    # Número de archivos en el repositorio
    total_files=$(git ls-files | wc -l)
    echo -e "${GREEN}📁 Archivos en el repositorio: $total_files${NC}"
    
    # Último commit
    if [ "$total_commits" -gt 0 ]; then
        last_commit=$(git log -1 --format="%h - %s (%cr)" 2>/dev/null)
        echo -e "${GREEN}🕐 Último commit: $last_commit${NC}"
    fi
    
    # Contribuidores
    contributors=$(git shortlog -sn | wc -l)
    echo -e "${GREEN}👥 Contribuidores: $contributors${NC}"
    
    echo ""
}

# Función principal
main() {
    local custom_message=""
    local do_push=false
    local force_add=false
    local show_status_only=false
    local show_log_only=false
    
    # Procesar argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                echo "$SCRIPT_NAME versión $VERSION"
                exit 0
                ;;
            -m|--message)
                custom_message="$2"
                shift 2
                ;;
            -p|--push)
                do_push=true
                shift
                ;;
            -f|--force)
                force_add=true
                shift
                ;;
            -s|--status)
                show_status_only=true
                shift
                ;;
            -l|--log)
                show_log_only=true
                shift
                ;;
            *)
                echo -e "${RED}❌ Opción desconocida: $1${NC}"
                echo -e "${YELLOW}💡 Usa -h para ver la ayuda${NC}"
                exit 1
                ;;
        esac
    done
    
    # Mostrar banner
    show_banner
    
    # Verificar repositorio Git
    check_git_repo
    
    # Mostrar solo estado si se solicita
    if [ "$show_status_only" = true ]; then
        check_repo_status
        show_stats
        exit 0
    fi
    
    # Mostrar solo log si se solicita
    if [ "$show_log_only" = true ]; then
        show_recent_commits
        exit 0
    fi
    
    # Verificar estado del repositorio
    if check_repo_status; then
        echo ""
        
        # Confirmar antes de proceder
        if [ -z "$custom_message" ]; then
            read -p "¿Proceder con el commit automático? (Y/n): " confirm
            if [[ $confirm =~ ^[Nn]$ ]]; then
                echo -e "${YELLOW}⚠️  Operación cancelada${NC}"
                exit 0
            fi
        fi
        
        # Realizar commit
        if do_commit "$custom_message" "$force_add"; then
            echo ""
            
            # Hacer push si se solicita
            if [ "$do_push" = true ]; then
                do_push
            else
                echo -e "${YELLOW}💡 Para hacer push usa: $SCRIPT_NAME -p${NC}"
            fi
            
            echo ""
            show_stats
        fi
    else
        echo -e "${GREEN}✅ Repositorio limpio - No hay nada que hacer${NC}"
    fi
}

# Manejar interrupción (Ctrl+C)
trap 'echo -e "\n${YELLOW}⚠️  Operación cancelada por el usuario${NC}"; exit 130' INT

# Ejecutar función principal
main "$@"
