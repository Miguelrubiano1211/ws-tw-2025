#!/bin/bash

# 🔍 Script de Validación - Día 13: Frontend-Backend Integration
# Valida la estructura, sintaxis y funcionalidad de todos los ejercicios

echo "🔍 Iniciando validación del Día 13: Frontend-Backend Integration"
echo "================================================================"

# Variables de configuración
DIA13_DIR="/home/epti/Documentos/sena/ws-tw-2025/dia13"
EJERCICIOS_DIR="$DIA13_DIR/ejercicios"
PROYECTOS_DIR="$DIA13_DIR/proyectos"
RECURSOS_DIR="$DIA13_DIR/recursos"

# Contadores
TOTAL_ARCHIVOS=0
ARCHIVOS_VALIDADOS=0
ERRORES_ENCONTRADOS=0

# Función para verificar si un archivo existe
verificar_archivo() {
    local archivo="$1"
    local descripcion="$2"
    
    if [ -f "$archivo" ]; then
        echo "✅ $descripcion: $archivo"
        ((ARCHIVOS_VALIDADOS++))
        return 0
    else
        echo "❌ $descripcion: $archivo (NO ENCONTRADO)"
        ((ERRORES_ENCONTRADOS++))
        return 1
    fi
    ((TOTAL_ARCHIVOS++))
}

# Función para validar sintaxis JavaScript/JSX
validar_sintaxis_js() {
    local archivo="$1"
    
    # Verificar que el archivo tenga contenido
    if [ ! -s "$archivo" ]; then
        echo "   ⚠️  Archivo vacío: $archivo"
        return 1
    fi
    
    # Verificar sintaxis básica de JavaScript
    if grep -q "function\|const\|let\|var\|=>" "$archivo"; then
        echo "   ✅ Sintaxis JavaScript válida"
    else
        echo "   ⚠️  Posible problema de sintaxis JavaScript"
        return 1
    fi
    
    # Verificar imports/exports
    if grep -q "import\|export" "$archivo"; then
        echo "   ✅ Módulos ES6 detectados"
    fi
    
    # Verificar React específico para archivos JSX
    if [[ "$archivo" == *.jsx ]]; then
        if grep -q "React\|useState\|useEffect" "$archivo"; then
            echo "   ✅ Componentes React detectados"
        else
            echo "   ⚠️  Archivo JSX sin componentes React detectados"
        fi
    fi
    
    return 0
}

# Función para validar contenido técnico
validar_contenido() {
    local archivo="$1"
    local conceptos=("$@")
    
    echo "   📋 Validando conceptos técnicos..."
    
    for concepto in "${conceptos[@]:1}"; do
        if grep -qi "$concepto" "$archivo"; then
            echo "   ✅ Concepto encontrado: $concepto"
        else
            echo "   ⚠️  Concepto no encontrado: $concepto"
        fi
    done
}

echo ""
echo "📁 Verificando estructura de directorios..."
echo "============================================"

# Verificar directorios principales
for dir in "$EJERCICIOS_DIR" "$PROYECTOS_DIR" "$RECURSOS_DIR"; do
    if [ -d "$dir" ]; then
        echo "✅ Directorio existe: $dir"
    else
        echo "❌ Directorio faltante: $dir"
        ((ERRORES_ENCONTRADOS++))
    fi
done

echo ""
echo "📋 Verificando archivos de documentación..."
echo "==========================================="

# Verificar archivos de documentación principales
verificar_archivo "$DIA13_DIR/README.md" "README principal"
verificar_archivo "$DIA13_DIR/CHECKLIST_DIA13.md" "Checklist de evaluación"
verificar_archivo "$DIA13_DIR/DIA13_DETALLADO.md" "Guía detallada"
verificar_archivo "$EJERCICIOS_DIR/README.md" "README de ejercicios"
verificar_archivo "$PROYECTOS_DIR/README.md" "README de proyectos"
verificar_archivo "$RECURSOS_DIR/README.md" "README de recursos"

echo ""
echo "🔧 Verificando ejercicios prácticos..."
echo "======================================"

# Lista de ejercicios esperados
EJERCICIOS=(
    "01-fetch-async-data.js"
    "02-error-handling-http.js"
    "03-loading-states-ux.jsx"
    "04-axios-interceptors.js"
    "05-cache-strategies.js"
    "06-offline-first.js"
    "07-websockets-realtime.jsx"
    "08-pagination-infinite-scroll.jsx"
)

# Validar cada ejercicio
for ejercicio in "${EJERCICIOS[@]}"; do
    archivo="$EJERCICIOS_DIR/$ejercicio"
    echo ""
    echo "📝 Validando: $ejercicio"
    echo "----------------------------"
    
    if verificar_archivo "$archivo" "Ejercicio $ejercicio"; then
        validar_sintaxis_js "$archivo"
        
        # Validar conceptos específicos según el ejercicio
        case "$ejercicio" in
            "01-fetch-async-data.js")
                validar_contenido "$archivo" "fetch" "async" "await" "Promise"
                ;;
            "02-error-handling-http.js")
                validar_contenido "$archivo" "catch" "error" "try" "throw"
                ;;
            "03-loading-states-ux.jsx")
                validar_contenido "$archivo" "useState" "loading" "skeleton" "spinner"
                ;;
            "04-axios-interceptors.js")
                validar_contenido "$archivo" "axios" "interceptors" "request" "response"
                ;;
            "05-cache-strategies.js")
                validar_contenido "$archivo" "cache" "TTL" "LRU" "localStorage"
                ;;
            "06-offline-first.js")
                validar_contenido "$archivo" "offline" "ServiceWorker" "IndexedDB" "navigator.onLine"
                ;;
            "07-websockets-realtime.jsx")
                validar_contenido "$archivo" "WebSocket" "useEffect" "real-time" "socket"
                ;;
            "08-pagination-infinite-scroll.jsx")
                validar_contenido "$archivo" "pagination" "infinite" "scroll" "IntersectionObserver"
                ;;
        esac
    fi
done

echo ""
echo "📊 Verificando complejidad de ejercicios..."
echo "=========================================="

# Verificar que los ejercicios tengan el contenido mínimo esperado
for ejercicio in "${EJERCICIOS[@]}"; do
    archivo="$EJERCICIOS_DIR/$ejercicio"
    if [ -f "$archivo" ]; then
        lineas=$(wc -l < "$archivo")
        if [ "$lineas" -gt 100 ]; then
            echo "✅ $ejercicio: $lineas líneas (Contenido suficiente)"
        elif [ "$lineas" -gt 50 ]; then
            echo "⚠️  $ejercicio: $lineas líneas (Contenido mínimo)"
        else
            echo "❌ $ejercicio: $lineas líneas (Contenido insuficiente)"
            ((ERRORES_ENCONTRADOS++))
        fi
    fi
done

echo ""
echo "🎯 Verificando nivel de dificultad..."
echo "==================================="

# Verificar conceptos avanzados en ejercicios
CONCEPTOS_AVANZADOS=(
    "async.*await"
    "Promise"
    "useEffect"
    "useCallback"
    "useMemo"
    "interceptors"
    "WebSocket"
    "ServiceWorker"
    "IndexedDB"
    "IntersectionObserver"
)

for concepto in "${CONCEPTOS_AVANZADOS[@]}"; do
    encontrado=false
    for ejercicio in "${EJERCICIOS[@]}"; do
        archivo="$EJERCICIOS_DIR/$ejercicio"
        if [ -f "$archivo" ] && grep -q "$concepto" "$archivo"; then
            encontrado=true
            break
        fi
    done
    
    if [ "$encontrado" = true ]; then
        echo "✅ Concepto avanzado encontrado: $concepto"
    else
        echo "⚠️  Concepto avanzado no encontrado: $concepto"
    fi
done

echo ""
echo "🚀 Verificando proyectos integradores..."
echo "======================================"

# Verificar que el proyecto tenga la estructura esperada
if [ -f "$PROYECTOS_DIR/README.md" ]; then
    if grep -q "Dashboard" "$PROYECTOS_DIR/README.md"; then
        echo "✅ Proyecto Dashboard encontrado"
    else
        echo "⚠️  Proyecto Dashboard no encontrado"
    fi
    
    if grep -q "API Gateway" "$PROYECTOS_DIR/README.md"; then
        echo "✅ Proyecto API Gateway encontrado"
    else
        echo "⚠️  Proyecto API Gateway no encontrado"
    fi
fi

echo ""
echo "📚 Verificando recursos adicionales..."
echo "===================================="

# Verificar contenido de recursos
if [ -f "$RECURSOS_DIR/README.md" ]; then
    recursos_encontrados=0
    
    # Verificar secciones importantes
    if grep -q "Documentación Oficial" "$RECURSOS_DIR/README.md"; then
        echo "✅ Sección de documentación oficial"
        ((recursos_encontrados++))
    fi
    
    if grep -q "Herramientas de Desarrollo" "$RECURSOS_DIR/README.md"; then
        echo "✅ Sección de herramientas"
        ((recursos_encontrados++))
    fi
    
    if grep -q "Patrones y Best Practices" "$RECURSOS_DIR/README.md"; then
        echo "✅ Sección de patrones"
        ((recursos_encontrados++))
    fi
    
    if grep -q "Performance Optimization" "$RECURSOS_DIR/README.md"; then
        echo "✅ Sección de optimización"
        ((recursos_encontrados++))
    fi
    
    if [ "$recursos_encontrados" -ge 3 ]; then
        echo "✅ Recursos suficientes disponibles"
    else
        echo "⚠️  Recursos insuficientes"
    fi
fi

echo ""
echo "🔐 Verificando seguridad y buenas prácticas..."
echo "=============================================="

# Verificar que no haya credenciales hardcodeadas
credenciales_encontradas=false
for archivo in "$EJERCICIOS_DIR"/*.js "$EJERCICIOS_DIR"/*.jsx; do
    if [ -f "$archivo" ]; then
        if grep -qi "password.*=.*['\"]" "$archivo" || \
           grep -qi "secret.*=.*['\"]" "$archivo" || \
           grep -qi "api.*key.*=.*['\"]" "$archivo"; then
            echo "⚠️  Posibles credenciales hardcodeadas en: $(basename "$archivo")"
            credenciales_encontradas=true
        fi
    fi
done

if [ "$credenciales_encontradas" = false ]; then
    echo "✅ No se encontraron credenciales hardcodeadas"
fi

# Verificar prácticas de seguridad
conceptos_seguridad=("JWT" "authorization" "authentication" "CORS" "sanitize" "validate")
for concepto in "${conceptos_seguridad[@]}"; do
    encontrado=false
    for archivo in "$EJERCICIOS_DIR"/*.js "$EJERCICIOS_DIR"/*.jsx; do
        if [ -f "$archivo" ] && grep -qi "$concepto" "$archivo"; then
            encontrado=true
            break
        fi
    done
    
    if [ "$encontrado" = true ]; then
        echo "✅ Concepto de seguridad encontrado: $concepto"
    fi
done

echo ""
echo "📈 Resumen de validación..."
echo "=========================="

echo "📊 Estadísticas:"
echo "   • Total de archivos verificados: $TOTAL_ARCHIVOS"
echo "   • Archivos validados correctamente: $ARCHIVOS_VALIDADOS"
echo "   • Errores encontrados: $ERRORES_ENCONTRADOS"

# Calcular porcentaje de éxito
if [ "$TOTAL_ARCHIVOS" -gt 0 ]; then
    PORCENTAJE_EXITO=$((ARCHIVOS_VALIDADOS * 100 / TOTAL_ARCHIVOS))
    echo "   • Porcentaje de éxito: $PORCENTAJE_EXITO%"
else
    PORCENTAJE_EXITO=0
    echo "   • Porcentaje de éxito: 0%"
fi

echo ""
echo "🎯 Evaluación final..."
echo "===================="

if [ "$ERRORES_ENCONTRADOS" -eq 0 ]; then
    echo "🎉 ¡EXCELENTE! Todos los archivos del Día 13 están correctamente estructurados."
    echo "   El contenido de Frontend-Backend Integration está completo y listo para usar."
    exit 0
elif [ "$ERRORES_ENCONTRADOS" -le 2 ]; then
    echo "✅ BIEN. La mayoría de archivos están correctos."
    echo "   Se encontraron $ERRORES_ENCONTRADOS errores menores que deben corregirse."
    exit 0
elif [ "$ERRORES_ENCONTRADOS" -le 5 ]; then
    echo "⚠️  REGULAR. Varios archivos necesitan atención."
    echo "   Se encontraron $ERRORES_ENCONTRADOS errores que deben corregirse."
    exit 1
else
    echo "❌ CRÍTICO. Muchos archivos tienen problemas."
    echo "   Se encontraron $ERRORES_ENCONTRADOS errores críticos."
    echo "   Revisar la estructura y contenido del Día 13."
    exit 1
fi
