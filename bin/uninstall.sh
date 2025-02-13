#!/bin/bash

# Salir si ocurre algún error
set -e

# Preguntar por el dominio a eliminar
read -p "Ingrese el dominio que desea eliminar (ej. ejemplo.com): " DOMAIN

# Verificar si el dominio no está vacío
if [[ -z "$DOMAIN" ]]; then
    echo "❌ Error: Debe ingresar un dominio válido."
    exit 1
fi

echo "⚠️ ADVERTENCIA: Este script eliminará Apache, PHP y toda la configuración relacionada con $DOMAIN."
read -p "¿Está seguro de continuar? (sí/no): " CONFIRM

# Convertir la respuesta a minúsculas para evitar problemas con mayúsculas
CONFIRM=$(echo "$CONFIRM" | tr '[:upper:]' '[:lower:]')

if [[ "$CONFIRM" != "sí" && "$CONFIRM" != "si" ]]; then
    echo "🚫 Operación cancelada."
    exit 0
fi

echo "✅ Desactivando y eliminando VirtualHost de $DOMAIN..."

# Desactivar y eliminar el VirtualHost
VHOST_CONF="/etc/apache2/sites-available/$DOMAIN.conf"
if [[ -f "$VHOST_CONF" ]]; then
    a2dissite "$DOMAIN.conf"
    rm -f "$VHOST_CONF"
fi

# Reiniciar Apache para aplicar cambios
systemctl reload apache2

echo "✅ Eliminando archivos del sitio en /var/www/$DOMAIN..."
rm -rf "/var/www/$DOMAIN"

echo "✅ Eliminando Apache, PHP y Certbot..."

# Detener y eliminar Apache
systemctl stop apache2
apt remove --purge -y apache2 apache2-utils apache2-bin apache2.2-common

# Eliminar configuraciones de Apache
rm -rf /etc/apache2 /var/www/html /var/log/apache2

# Detener y eliminar PHP
apt remove --purge -y php libapache2-mod-php php-cli php-mbstring php-xml php-curl php-zip php-gd

# Eliminar configuraciones de PHP
rm -rf /etc/php /var/lib/php

# Manejo seguro de Certbot y eliminación de certificados
if command -v certbot &> /dev/null; then
    if certbot certificates | grep -q "$DOMAIN"; then
        echo "✅ Revocando y eliminando certificados SSL para $DOMAIN..."
        certbot revoke --cert-name "$DOMAIN" --delete-after-revoke --non-interactive --quiet
        certbot delete --cert-name "$DOMAIN" --non-interactive --quiet
    else
        echo "⚠️ No se encontró un certificado para $DOMAIN en Certbot. Eliminando manualmente archivos de Let's Encrypt..."
        rm -rf "/etc/letsencrypt/live/$DOMAIN"
        rm -rf "/etc/letsencrypt/archive/$DOMAIN"
        rm -f "/etc/letsencrypt/renewal/$DOMAIN.conf"
    fi
    apt remove --purge -y certbot python3-certbot-apache
fi

# Eliminar configuraciones de Certbot
rm -rf /etc/letsencrypt /var/lib/letsencrypt /var/log/letsencrypt

echo "✅ Eliminando dependencias innecesarias..."
apt autoremove -y
apt autoclean -y

echo "✅ Eliminación completa. Su servidor está limpio."