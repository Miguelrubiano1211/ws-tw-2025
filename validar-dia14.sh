#!/bin/bash

# 🧪 Script de Validación - Día 14: Testing y Quality Assurance
# Valida que todos los archivos y ejercicios estén completos

echo "🧪 Validando Día 14: Testing y Quality Assurance..."
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Función para verificar archivo
check_file() {
    local file="$1"
    local description="$2"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Función para verificar directorio
check_directory() {
    local dir="$1"
    local description="$2"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Función para verificar contenido de archivo
check_content() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "$file" ] && grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

echo -e "${YELLOW}📁 Verificando estructura de directorios...${NC}"
echo ""

# Verificar directorios principales
check_directory "dia14" "Directorio principal dia14"
check_directory "dia14/ejercicios" "Directorio de ejercicios"
check_directory "dia14/proyectos" "Directorio de proyectos"
check_directory "dia14/recursos" "Directorio de recursos"

echo ""
echo -e "${YELLOW}📋 Verificando archivos principales...${NC}"
echo ""

# Verificar archivos principales
check_file "dia14/README.md" "Archivo README principal"
check_file "dia14/CHECKLIST_DIA14.md" "Checklist de evaluación"
check_file "dia14/DIA14_DETALLADO.md" "Guía detallada del día"

echo ""
echo -e "${YELLOW}🧪 Verificando ejercicios...${NC}"
echo ""

# Verificar ejercicios
check_file "dia14/ejercicios/01_configuracion_testing.md" "Ejercicio 1: Configuración Testing"
check_file "dia14/ejercicios/02_unit_testing_jest.md" "Ejercicio 2: Unit Testing Jest"
check_file "dia14/ejercicios/03_react_component_testing.md" "Ejercicio 3: React Component Testing"
check_file "dia14/ejercicios/04_api_integration_testing.md" "Ejercicio 4: API Integration Testing"
check_file "dia14/ejercicios/05_code_quality_linting.md" "Ejercicio 5: Code Quality Linting"
check_file "dia14/ejercicios/06_performance_testing.md" "Ejercicio 6: Performance Testing"
check_file "dia14/ejercicios/07_accessibility_testing.md" "Ejercicio 7: Accessibility Testing"

echo ""
echo -e "${YELLOW}📝 Verificando proyectos...${NC}"
echo ""

# Verificar proyectos
check_file "dia14/proyectos/README.md" "Proyecto integrador principal"
check_file "dia14/proyectos/configuracion-testing.md" "Configuración de testing"

echo ""
echo -e "${YELLOW}📚 Verificando recursos...${NC}"
echo ""

# Verificar recursos
check_file "dia14/recursos/README.md" "Recursos principales"
check_file "dia14/recursos/evaluacion.md" "Guía de evaluación"

echo ""
echo -e "${YELLOW}🔍 Verificando contenido específico...${NC}"
echo ""

# Verificar contenido específico en archivos
check_content "dia14/README.md" "Testing y Quality Assurance" "Título correcto en README"
check_content "dia14/README.md" "Jest" "Menciona Jest en README"
check_content "dia14/README.md" "React Testing Library" "Menciona RTL en README"
check_content "dia14/README.md" "Playwright" "Menciona Playwright en README"
check_content "dia14/README.md" "ESLint" "Menciona ESLint en README"
check_content "dia14/README.md" "Lighthouse" "Menciona Lighthouse en README"

check_content "dia14/CHECKLIST_DIA14.md" "Testing Unitario" "Checklist incluye Testing Unitario"
check_content "dia14/CHECKLIST_DIA14.md" "Integration Testing" "Checklist incluye Integration Testing"
check_content "dia14/CHECKLIST_DIA14.md" "Component Testing" "Checklist incluye Component Testing"
check_content "dia14/CHECKLIST_DIA14.md" "Performance Testing" "Checklist incluye Performance Testing"
check_content "dia14/CHECKLIST_DIA14.md" "Accessibility Testing" "Checklist incluye Accessibility Testing"

# Verificar ejercicios tienen contenido apropiado
check_content "dia14/ejercicios/01_configuracion_testing.md" "jest.config.js" "Ejercicio 1 incluye configuración Jest"
check_content "dia14/ejercicios/02_unit_testing_jest.md" "describe" "Ejercicio 2 incluye sintaxis Jest"
check_content "dia14/ejercicios/03_react_component_testing.md" "render" "Ejercicio 3 incluye RTL"
check_content "dia14/ejercicios/04_api_integration_testing.md" "supertest" "Ejercicio 4 incluye Supertest"
check_content "dia14/ejercicios/05_code_quality_linting.md" "eslint" "Ejercicio 5 incluye ESLint"
check_content "dia14/ejercicios/06_performance_testing.md" "lighthouse" "Ejercicio 6 incluye Lighthouse"
check_content "dia14/ejercicios/07_accessibility_testing.md" "axe-core" "Ejercicio 7 incluye axe-core"

echo ""
echo -e "${YELLOW}📊 Verificando estructura de evaluación...${NC}"
echo ""

# Verificar estructura de evaluación
check_content "dia14/recursos/evaluacion.md" "Unit Testing.*25 puntos" "Evaluación incluye Unit Testing (25 puntos)"
check_content "dia14/recursos/evaluacion.md" "Integration Testing.*25 puntos" "Evaluación incluye Integration Testing (25 puntos)"
check_content "dia14/recursos/evaluacion.md" "Component Testing.*20 puntos" "Evaluación incluye Component Testing (20 puntos)"
check_content "dia14/recursos/evaluacion.md" "E2E Testing.*15 puntos" "Evaluación incluye E2E Testing (15 puntos)"
check_content "dia14/recursos/evaluacion.md" "Quality Assurance.*15 puntos" "Evaluación incluye Quality Assurance (15 puntos)"

echo ""
echo -e "${YELLOW}🎯 Verificando proyecto integrador...${NC}"
echo ""

# Verificar proyecto integrador
check_content "dia14/proyectos/README.md" "suite completa de testing" "Proyecto incluye suite completa"
check_content "dia14/proyectos/README.md" "e-commerce" "Proyecto es sobre e-commerce"
check_content "dia14/proyectos/README.md" "85% mínimo" "Proyecto requiere 85% coverage"
check_content "dia14/proyectos/README.md" "WCAG" "Proyecto incluye WCAG compliance"

# Verificar configuración de testing
check_content "dia14/proyectos/configuracion-testing.md" "jest.config.js" "Configuración incluye Jest"
check_content "dia14/proyectos/configuracion-testing.md" "eslintrc" "Configuración incluye ESLint"
check_content "dia14/proyectos/configuracion-testing.md" "prettier" "Configuración incluye Prettier"
check_content "dia14/proyectos/configuracion-testing.md" "playwright.config.js" "Configuración incluye Playwright"

echo ""
echo -e "${YELLOW}📚 Verificando recursos completos...${NC}"
echo ""

# Verificar recursos
check_content "dia14/recursos/README.md" "Jest.*https://jestjs.io" "Recursos incluyen documentación Jest"
check_content "dia14/recursos/README.md" "React Testing Library.*https://testing-library.com" "Recursos incluyen RTL"
check_content "dia14/recursos/README.md" "Playwright.*https://playwright.dev" "Recursos incluyen Playwright"
check_content "dia14/recursos/README.md" "ESLint.*https://eslint.org" "Recursos incluyen ESLint"
check_content "dia14/recursos/README.md" "Lighthouse.*https://developers.google.com" "Recursos incluyen Lighthouse"
check_content "dia14/recursos/README.md" "axe-core.*https://github.com/dequelabs/axe-core" "Recursos incluyen axe-core"

echo ""
echo "=================================================="
echo -e "${YELLOW}📊 RESUMEN DE VALIDACIÓN${NC}"
echo "=================================================="
echo -e "Total de verificaciones: ${YELLOW}$TOTAL_CHECKS${NC}"
echo -e "Verificaciones exitosas: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Verificaciones fallidas: ${RED}$FAILED_CHECKS${NC}"

# Calcular porcentaje
if [ $TOTAL_CHECKS -gt 0 ]; then
    PERCENTAGE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
    echo -e "Porcentaje de completitud: ${YELLOW}$PERCENTAGE%${NC}"
else
    PERCENTAGE=0
fi

echo ""

# Resultado final
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡VALIDACIÓN EXITOSA!${NC}"
    echo -e "${GREEN}✅ Día 14 está completo y listo para uso${NC}"
    echo ""
    echo -e "${YELLOW}📋 Componentes validados:${NC}"
    echo "• ✅ Estructura de directorios completa"
    echo "• ✅ Archivos principales (README, CHECKLIST, DETALLADO)"
    echo "• ✅ 7 ejercicios de testing implementados"
    echo "• ✅ Proyecto integrador completo"
    echo "• ✅ Recursos y documentación completos"
    echo "• ✅ Guía de evaluación detallada"
    echo "• ✅ Configuraciones de testing incluidas"
    echo ""
    echo -e "${GREEN}🎯 El Día 14 está preparado para:${NC}"
    echo "• Testing unitario con Jest"
    echo "• Testing de componentes con RTL"
    echo "• Integration testing con Supertest"
    echo "• E2E testing con Playwright"
    echo "• Quality assurance con ESLint/Prettier"
    echo "• Performance testing con Lighthouse"
    echo "• Accessibility testing con axe-core"
    echo "• CI/CD pipeline básico"
    echo ""
    exit 0
else
    echo -e "${RED}❌ VALIDACIÓN FALLIDA${NC}"
    echo -e "${RED}Se encontraron $FAILED_CHECKS errores que deben corregirse${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Elementos faltantes o con errores:${NC}"
    
    # Mostrar qué falta
    if [ ! -d "dia14" ]; then
        echo "• ❌ Falta directorio principal dia14"
    fi
    
    if [ ! -f "dia14/README.md" ]; then
        echo "• ❌ Falta README.md principal"
    fi
    
    if [ ! -f "dia14/CHECKLIST_DIA14.md" ]; then
        echo "• ❌ Falta checklist de evaluación"
    fi
    
    if [ ! -f "dia14/DIA14_DETALLADO.md" ]; then
        echo "• ❌ Falta guía detallada"
    fi
    
    # Verificar ejercicios faltantes
    EJERCICIOS_FALTANTES=0
    for i in {1..7}; do
        EJERCICIO_NUM=$(printf "%02d" $i)
        if [ ! -f "dia14/ejercicios/${EJERCICIO_NUM}_"*.md ]; then
            EJERCICIOS_FALTANTES=$((EJERCICIOS_FALTANTES + 1))
        fi
    done
    
    if [ $EJERCICIOS_FALTANTES -gt 0 ]; then
        echo "• ❌ Faltan $EJERCICIOS_FALTANTES ejercicios"
    fi
    
    if [ ! -f "dia14/proyectos/README.md" ]; then
        echo "• ❌ Falta proyecto integrador"
    fi
    
    if [ ! -f "dia14/recursos/README.md" ]; then
        echo "• ❌ Faltan recursos"
    fi
    
    if [ ! -f "dia14/recursos/evaluacion.md" ]; then
        echo "• ❌ Falta guía de evaluación"
    fi
    
    echo ""
    echo -e "${YELLOW}💡 Recomendaciones:${NC}"
    echo "1. Verifica que todos los archivos estén creados"
    echo "2. Revisa que el contenido sea apropiado para testing"
    echo "3. Asegúrate de que los ejercicios sean progresivos"
    echo "4. Confirma que los recursos incluyan documentación"
    echo "5. Valida que la evaluación sea comprehensiva"
    echo ""
    exit 1
fi
