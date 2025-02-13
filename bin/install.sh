#!/bin/bash

# Salir si ocurre algún error
set -e

# Preguntar por el dominio
read -p "Ingrese el dominio para configurar el VirtualHost (ej. ejemplo.com): " DOMAIN

# Verificar si el dominio no está vacío
if [[ -z "$DOMAIN" ]]; then
    echo "❌ Error: Debe ingresar un dominio válido."
    exit 1
fi

echo "✅ Instalando Apache y PHP en su última versión..."

# Actualizar el sistema
apt update -y && apt upgrade -y

# Instalar Apache
apt install -y apache2

# Instalar PHP (última versión disponible en repositorios)
apt install -y php libapache2-mod-php php-cli php-mbstring php-xml php-curl php-zip php-gd

# Habilitar módulos necesarios en Apache
a2enmod rewrite headers ssl

# Crear el directorio para el dominio
WEB_DIR="/var/www/$DOMAIN"
APP_DIR="$WEB_DIR/app"
mkdir -p "$APP_DIR"

# Crear el archivo index.php con el código proporcionado
cat > "$WEB_DIR/index.php" <<EOF
<?php
// Obtener el nombre del host
\$request_url = \$_SERVER['REQUEST_URI'];

// Determinar qué archivo HTML incluir basado en la URL solicitada
if (\$request_url == '/') {
    include 'app/index.html';
} else {
    include 'app/index.html';
}
?>
EOF

# Crear un archivo index.html dentro de la carpeta "app" con diseño bonito
cat > "$APP_DIR/index.html" <<EOF
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carpeta de Build</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Espacio para archivos del build</h1>
        <p>Coloque aquí los archivos generados en el build.</p>
    </div>
</body>
</html>
EOF

# Crear el archivo .htaccess en la raíz del dominio
cat > "$WEB_DIR/.htaccess" <<EOF
<IfModule mod_headers.c>
    # Establecer cacheo de un día para archivos estáticos
    <FilesMatch "\.(js|css|woff|woff2|ttf|eot|otf|ico|jpg|jpeg|png|svg|gif|webp)$">
        Header set Cache-Control "max-age=86400, public"
    </FilesMatch>

    # Establecer cacheo de un día para index.html (o cualquier archivo específico)
    <FilesMatch "\.(html|htm)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF

# Asignar permisos
chown -R www-data:www-data "$WEB_DIR"
chmod -R 755 "$WEB_DIR"

# Crear el archivo de configuración del VirtualHost
VHOST_CONF="/etc/apache2/sites-available/$DOMAIN.conf"

cat > "$VHOST_CONF" <<EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    DocumentRoot $WEB_DIR

    <Directory $WEB_DIR>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/$DOMAIN-error.log
    CustomLog \${APACHE_LOG_DIR}/$DOMAIN-access.log combined
</VirtualHost>
EOF

# Habilitar el nuevo VirtualHost
a2ensite "$DOMAIN.conf"

# Reiniciar Apache
systemctl restart apache2

echo "✅ Apache y PHP instalados y configurados correctamente."

# Instalar Certbot para SSL
echo "✅ Instalando Certbot para la generación de certificados SSL..."
apt install -y certbot python3-certbot-apache

# Obtener y configurar el certificado SSL con Certbot
echo "⚡ Configurando SSL con Certbot..."
certbot --apache --non-interactive --agree-tos --redirect --hsts --staple-ocsp --email admin@$DOMAIN -d "$DOMAIN"

# Reiniciar Apache
systemctl restart apache2

echo "🚀 Instalación completada. Su sitio está disponible en https://$DOMAIN"