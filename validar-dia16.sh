#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}    VALIDACIÓN DÍA 16: DEPLOYMENT Y DEVOPS       ${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# Contador de errores
ERRORS=0

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 - FALTANTE${NC}"
        ((ERRORS++))
    fi
}

# Función para verificar directorios
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/${NC}"
    else
        echo -e "${RED}❌ $1/ - FALTANTE${NC}"
        ((ERRORS++))
    fi
}

# Verificar estructura de directorios
echo -e "${YELLOW}📁 Verificando estructura de directorios...${NC}"
check_dir "dia16"
check_dir "dia16/ejercicios"
check_dir "dia16/proyectos"
check_dir "dia16/recursos"
echo ""

# Verificar archivos principales
echo -e "${YELLOW}📋 Verificando archivos principales...${NC}"
check_file "dia16/README.md"
check_file "dia16/CHECKLIST_DIA16.md"
echo ""

# Verificar ejercicios
echo -e "${YELLOW}🏋️ Verificando ejercicios (6 ejercicios)...${NC}"
check_file "dia16/ejercicios/01_docker_setup.md"
check_file "dia16/ejercicios/02_production_builds.md"
check_file "dia16/ejercicios/03_nginx_configuration.md"
check_file "dia16/ejercicios/04_ssl_security.md"
check_file "dia16/ejercicios/05_domain_dns.md"
check_file "dia16/ejercicios/06_monitoring_logging.md"
echo ""

# Verificar proyecto integrador
echo -e "${YELLOW}🚀 Verificando proyecto integrador...${NC}"
check_file "dia16/proyectos/proyecto_integrador.md"
echo ""

# Verificar recursos
echo -e "${YELLOW}📚 Verificando recursos adicionales...${NC}"
check_file "dia16/recursos/recursos_adicionales.md"
check_file "dia16/recursos/templates_configuracion.md"
echo ""

# Verificar documentación de completado
echo -e "${YELLOW}📝 Verificando documentación de completado...${NC}"
check_file "_docs/COMPLETADO_DIA16.md"
echo ""

# Verificar contenido de archivos principales
echo -e "${YELLOW}🔍 Verificando contenido de archivos...${NC}"

# Verificar README.md
if [ -f "dia16/README.md" ]; then
    if grep -q "12:00 PM - 6:00 PM" dia16/README.md; then
        echo -e "${GREEN}✅ README.md contiene horario correcto (12:00-18:00)${NC}"
    else
        echo -e "${RED}❌ README.md no contiene horario correcto${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "Deployment y DevOps" dia16/README.md; then
        echo -e "${GREEN}✅ README.md contiene título correcto${NC}"
    else
        echo -e "${RED}❌ README.md no contiene título correcto${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "Docker" dia16/README.md && grep -q "Nginx" dia16/README.md; then
        echo -e "${GREEN}✅ README.md contiene temas principales${NC}"
    else
        echo -e "${RED}❌ README.md no contiene todos los temas principales${NC}"
        ((ERRORS++))
    fi
fi

# Verificar ejercicios tienen estructura correcta
echo ""
echo -e "${YELLOW}🧪 Verificando estructura de ejercicios...${NC}"

for i in {1..6}; do
    file="dia16/ejercicios/0${i}_*.md"
    if ls $file 1> /dev/null 2>&1; then
        filename=$(ls $file)
        if grep -q "Objetivo" "$filename" && grep -q "Duración" "$filename"; then
            echo -e "${GREEN}✅ Ejercicio $i tiene estructura correcta${NC}"
        else
            echo -e "${RED}❌ Ejercicio $i no tiene estructura completa${NC}"
            ((ERRORS++))
        fi
    else
        echo -e "${RED}❌ Ejercicio $i no encontrado${NC}"
        ((ERRORS++))
    fi
done

# Verificar proyecto integrador
echo ""
echo -e "${YELLOW}🎯 Verificando proyecto integrador...${NC}"
if [ -f "dia16/proyectos/proyecto_integrador.md" ]; then
    if grep -q "TechStore" dia16/proyectos/proyecto_integrador.md; then
        echo -e "${GREEN}✅ Proyecto integrador tiene tema correcto (TechStore)${NC}"
    else
        echo -e "${RED}❌ Proyecto integrador no tiene tema correcto${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "Docker" dia16/proyectos/proyecto_integrador.md && grep -q "deployment" dia16/proyectos/proyecto_integrador.md; then
        echo -e "${GREEN}✅ Proyecto integrador contiene elementos de deployment${NC}"
    else
        echo -e "${RED}❌ Proyecto integrador no contiene elementos de deployment${NC}"
        ((ERRORS++))
    fi
fi

# Verificar checklist
echo ""
echo -e "${YELLOW}📋 Verificando checklist de evaluación...${NC}"
if [ -f "dia16/CHECKLIST_DIA16.md" ]; then
    if grep -q "Criterios de Evaluación" dia16/CHECKLIST_DIA16.md; then
        echo -e "${GREEN}✅ Checklist contiene criterios de evaluación${NC}"
    else
        echo -e "${RED}❌ Checklist no contiene criterios de evaluación${NC}"
        ((ERRORS++))
    fi
    
    if grep -q "Docker" dia16/CHECKLIST_DIA16.md && grep -q "Nginx" dia16/CHECKLIST_DIA16.md; then
        echo -e "${GREEN}✅ Checklist contiene tecnologías principales${NC}"
    else
        echo -e "${RED}❌ Checklist no contiene todas las tecnologías${NC}"
        ((ERRORS++))
    fi
fi

# Verificar recursos
echo ""
echo -e "${YELLOW}📚 Verificando recursos...${NC}"
if [ -f "dia16/recursos/recursos_adicionales.md" ]; then
    if grep -q "Docker" dia16/recursos/recursos_adicionales.md && grep -q "Nginx" dia16/recursos/recursos_adicionales.md; then
        echo -e "${GREEN}✅ Recursos adicionales contienen documentación técnica${NC}"
    else
        echo -e "${RED}❌ Recursos adicionales incompletos${NC}"
        ((ERRORS++))
    fi
fi

if [ -f "dia16/recursos/templates_configuracion.md" ]; then
    if grep -q "docker-compose" dia16/recursos/templates_configuracion.md; then
        echo -e "${GREEN}✅ Templates de configuración disponibles${NC}"
    else
        echo -e "${RED}❌ Templates de configuración incompletos${NC}"
        ((ERRORS++))
    fi
fi

# Verificar integración con otros días
echo ""
echo -e "${YELLOW}🔗 Verificando integración...${NC}"
if [ -f "dia16/README.md" ]; then
    if grep -q "Día 15" dia16/README.md; then
        echo -e "${GREEN}✅ README.md referencia días anteriores${NC}"
    else
        echo -e "${YELLOW}⚠️  README.md podría referenciar días anteriores${NC}"
    fi
fi

# Resultado final
echo ""
echo -e "${BLUE}==================================================${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡VALIDACIÓN COMPLETADA EXITOSAMENTE!${NC}"
    echo -e "${GREEN}✅ Día 16 está completo y listo para entrenamiento${NC}"
    echo -e "${GREEN}✅ Todos los archivos y estructura están presentes${NC}"
    echo -e "${GREEN}✅ Contenido verificado y correcto${NC}"
else
    echo -e "${RED}❌ VALIDACIÓN FALLÓ${NC}"
    echo -e "${RED}🚨 Se encontraron $ERRORS errores que deben corregirse${NC}"
    echo -e "${YELLOW}💡 Por favor revisa los elementos marcados arriba${NC}"
fi
echo -e "${BLUE}==================================================${NC}"

# Información adicional
echo ""
echo -e "${BLUE}📊 RESUMEN DEL DÍA 16:${NC}"
echo -e "${BLUE}Theme:${NC} Deployment y DevOps"
echo -e "${BLUE}Duración:${NC} 6 horas (12:00 PM - 6:00 PM)"
echo -e "${BLUE}Ejercicios:${NC} 6 ejercicios prácticos"
echo -e "${BLUE}Proyecto:${NC} TechStore Production Deployment"
echo -e "${BLUE}Tecnologías:${NC} Docker, Nginx, SSL/TLS, Monitoring"
echo -e "${BLUE}Prerequisitos:${NC} Día 15 (Performance Optimization)"
echo ""

exit $ERRORS
