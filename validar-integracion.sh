#!/bin/bash

# 🔍 Script de Validación: Día 12A + 12B
# Verifica que la división y estructura estén correctas

echo "🔍 Iniciando validación de integración Día 12A + 12B..."
echo "=================================================="

# Variables
DIA12A_PATH="dia12"
DIA12B_PATH="dia12b"
ERRORS=0

# Función para verificar archivos
check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        echo "✅ $description: $file"
    else
        echo "❌ $description: $file - NO ENCONTRADO"
        ((ERRORS++))
    fi
}

# Función para verificar directorios
check_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        echo "✅ $description: $dir/"
    else
        echo "❌ $description: $dir/ - NO ENCONTRADO"
        ((ERRORS++))
    fi
}

# Función para contar archivos
count_files() {
    local pattern="$1"
    local description="$2"
    
    local count=$(find . -path "$pattern" 2>/dev/null | wc -l)
    echo "📊 $description: $count archivos"
}

echo ""
echo "🗂️  VERIFICANDO ESTRUCTURA DE CARPETAS..."
echo "----------------------------------------"

# Verificar carpetas principales
check_directory "$DIA12A_PATH" "Día 12A"
check_directory "$DIA12B_PATH" "Día 12B"

# Verificar subcarpetas Día 12A
check_directory "$DIA12A_PATH/ejercicios" "Ejercicios 12A"
check_directory "$DIA12A_PATH/proyectos" "Proyectos 12A"
check_directory "$DIA12A_PATH/recursos" "Recursos 12A"

# Verificar subcarpetas Día 12B
check_directory "$DIA12B_PATH/ejercicios" "Ejercicios 12B"
check_directory "$DIA12B_PATH/proyectos" "Proyectos 12B"
check_directory "$DIA12B_PATH/recursos" "Recursos 12B"

echo ""
echo "📄 VERIFICANDO ARCHIVOS PRINCIPALES..."
echo "------------------------------------"

# Verificar archivos principales Día 12A
check_file "$DIA12A_PATH/README.md" "README 12A"
check_file "$DIA12A_PATH/CHECKLIST_DIA12.md" "Checklist 12A"
check_file "$DIA12A_PATH/DIA12_DETALLADO.md" "Detallado 12A"

# Verificar archivos principales Día 12B
check_file "$DIA12B_PATH/README.md" "README 12B"
check_file "$DIA12B_PATH/CHECKLIST_DIA12B.md" "Checklist 12B"
check_file "$DIA12B_PATH/DIA12B_DETALLADO.md" "Detallado 12B"
check_file "$DIA12B_PATH/VALIDACION_INTEGRACION.md" "Validación Integración"

echo ""
echo "🧪 VERIFICANDO EJERCICIOS..."
echo "----------------------------"

# Verificar ejercicios Día 12A
echo "📚 Día 12A - Ejercicios:"
for i in {1..5}; do
    file="$DIA12A_PATH/ejercicios/0$i-*.js"
    if ls $file 1> /dev/null 2>&1; then
        echo "✅ Ejercicio $i: $(ls $file | head -1)"
    else
        echo "❌ Ejercicio $i: NO ENCONTRADO"
        ((ERRORS++))
    fi
done

# Verificar ejercicios Día 12B
echo ""
echo "📚 Día 12B - Ejercicios:"
for i in {1..6}; do
    file="$DIA12B_PATH/ejercicios/0$i-*.js"
    if ls $file 1> /dev/null 2>&1; then
        echo "✅ Ejercicio $i: $(ls $file | head -1)"
    else
        echo "❌ Ejercicio $i: NO ENCONTRADO"
        ((ERRORS++))
    fi
done

echo ""
echo "🏗️  VERIFICANDO PROYECTOS..."
echo "-----------------------------"

# Verificar proyectos Día 12A
if [ -d "$DIA12A_PATH/proyectos/api-segura" ]; then
    echo "✅ Proyecto 12A: API Segura"
    count_files "$DIA12A_PATH/proyectos/api-segura/*" "Archivos del proyecto 12A"
else
    echo "❌ Proyecto 12A: NO ENCONTRADO"
    ((ERRORS++))
fi

# Verificar proyectos Día 12B
check_file "$DIA12B_PATH/proyectos/README.md" "README Proyectos 12B"
check_file "$DIA12B_PATH/proyectos/sistema-seguridad-avanzado.md" "Proyecto 12B"

echo ""
echo "📖 VERIFICANDO RECURSOS..."
echo "-------------------------"

check_file "$DIA12A_PATH/recursos/README.md" "Recursos 12A"
check_file "$DIA12B_PATH/recursos/README.md" "Recursos 12B"

echo ""
echo "🔍 VERIFICANDO SINTAXIS JAVASCRIPT..."
echo "------------------------------------"

# Verificar sintaxis de ejercicios 12A
echo "📝 Verificando sintaxis Día 12A..."
for file in $DIA12A_PATH/ejercicios/*.js; do
    if [ -f "$file" ]; then
        if node -c "$file" 2>/dev/null; then
            echo "✅ Sintaxis correcta: $(basename "$file")"
        else
            echo "❌ Error de sintaxis: $(basename "$file")"
            ((ERRORS++))
        fi
    fi
done

# Verificar sintaxis de ejercicios 12B
echo ""
echo "📝 Verificando sintaxis Día 12B..."
for file in $DIA12B_PATH/ejercicios/*.js; do
    if [ -f "$file" ]; then
        if node -c "$file" 2>/dev/null; then
            echo "✅ Sintaxis correcta: $(basename "$file")"
        else
            echo "❌ Error de sintaxis: $(basename "$file")"
            ((ERRORS++))
        fi
    fi
done

echo ""
echo "📊 ESTADÍSTICAS FINALES..."
echo "-------------------------"

# Contar archivos por tipo
count_files "$DIA12A_PATH/ejercicios/*.js" "Ejercicios JS 12A"
count_files "$DIA12B_PATH/ejercicios/*.js" "Ejercicios JS 12B"
count_files "$DIA12A_PATH/**/*.md" "Documentos MD 12A"
count_files "$DIA12B_PATH/**/*.md" "Documentos MD 12B"

echo ""
echo "🎯 RESUMEN DE VALIDACIÓN..."
echo "============================"

if [ $ERRORS -eq 0 ]; then
    echo "🎉 ¡VALIDACIÓN EXITOSA!"
    echo "✅ Todos los archivos y estructuras están correctos"
    echo "✅ La división del Día 12 en 12A y 12B es exitosa"
    echo "✅ Los ejercicios tienen sintaxis correcta"
    echo "✅ La estructura está lista para implementación"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Completar el Día 12A antes del 12B"
    echo "2. Usar el proyecto del 12A como base para el 12B"
    echo "3. Seguir el cronograma establecido"
    echo "4. Realizar testing completo de cada ejercicio"
else
    echo "⚠️  VALIDACIÓN CON ERRORES"
    echo "❌ Se encontraron $ERRORS errores"
    echo "🔧 Por favor, corrige los errores antes de continuar"
fi

echo ""
echo "🏆 PREPARACIÓN WORLDSKILLS:"
echo "- Tiempo total: 10.5 horas (12A: 5.5h + 12B: 5h)"
echo "- Ejercicios: 11 ejercicios prácticos"
echo "- Proyectos: 2 proyectos integradores"
echo "- Cobertura: Seguridad web completa"
echo ""
echo "=================================================="
echo "Validación completada: $(date)"

exit $ERRORS
