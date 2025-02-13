# 🌐 Guía de Configuración del Servidor con Apache, PHP y Certbot

📅 **Última actualización:** 12 de Febrero del 2025  
🛠 **Autor:** Alonso Jiménez  

---

## 📌 Consideraciones Iniciales

Antes de iniciar la configuración, asegúrate de cumplir con los siguientes requisitos:

- ✅ **Apuntar el registro A (DNS record)** del dominio o subdominio a la **IP del nuevo servidor**.
- ✅ **Abrir los puertos 80 y 443** en el firewall del servidor.
- ✅ Tener acceso **administrador (root o sudo)** en el servidor.

---

## 🚀 Pasos a Seguir

### 🔹 1. Acceder al Servidor vía SSH

Ejecuta el siguiente comando desde tu terminal para conectarte al servidor:

````bash
ssh usuario@IP_DEL_SERVIDOR
````

📌 **Nota:**  
Reemplaza `usuario` por el nombre de tu usuario en el servidor y `IP_DEL_SERVIDOR` por la IP real del servidor.

---

### 🔹 2. Copiar o Crear el Archivo `install.sh`

El script de instalación `install.sh` se encuentra en el repositorio dentro de la ruta:

[📂 `bin/install.sh`](https://github.com/ajimmenezz-setpay/front-app/blob/main/bin/install.sh)

Para transferirlo al servidor, usa el siguiente comando desde tu máquina local:

````bash
scp install.sh usuario@IP_DEL_SERVIDOR:/ruta/destino/
````

---

### 🔹 3. Dar Permisos de Ejecución al Script

Ejecuta el siguiente comando para hacer que el script sea ejecutable:

````bash
sudo chmod +x install.sh
````

---

### 🔹 4. Ejecutar el Script de Instalación

Ejecuta el siguiente comando para iniciar la instalación:

````bash
sudo ./install.sh
````

Durante la ejecución, se te solicitará ingresar el **dominio o subdominio** a configurar.

---

## ✅ Resultado Esperado

Al finalizar la ejecución del script, el servidor tendrá:

- ✔️ **Apache** instalado y configurado con un **host virtual** para el subdominio.  
- ✔️ **PHP** instalado y configurado.  
- ✔️ **Certificado SSL** generado y firmado automáticamente con **Certbot**.  

---

## 🔎 Verificación Final

Para verificar que Apache está corriendo correctamente:

````bash
sudo systemctl status apache2
````

Para comprobar que el certificado SSL se ha generado correctamente:

````bash
sudo certbot certificates
````

Si todo está en orden, ¡tu sitio web ya estará listo y seguro! 🎉🚀  

---

## 🔧 Comandos Útiles

Si en el futuro necesitas renovar el certificado, ejecuta:

````bash
sudo certbot renew --dry-run
````

Para revisar los logs de Apache:

````bash
sudo journalctl -u apache2 --no-pager | tail -n 50
````

Si hay problemas con los puertos, revisa la configuración del firewall:

````bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
````

---

## 📝 Notas Adicionales

- Asegúrate de que el dominio está correctamente configurado en los registros **DNS**.
- Si tienes problemas con Certbot, revisa los permisos del directorio `/etc/letsencrypt/`.
- Revisa los logs de instalación en caso de fallos.

---

---

## 🔄 Proceso de Desinstalación

Si deseas eliminar la configuración del servidor, sigue estos pasos:

### 🔹 1. Copiar o Crear el Archivo `uninstall.sh`

El script de desinstalación `uninstall.sh` se encuentra en el repositorio dentro de la ruta:

[📂 `bin/uninstall.sh`](https://github.com/ajimmenezz-setpay/front-app/blob/main/bin/uninstall.sh)

Para transferirlo al servidor, usa el siguiente comando desde tu máquina local:

````bash
scp uninstall.sh usuario@IP_DEL_SERVIDOR:/ruta/destino/
````

---

### 🔹 2. Dar Permisos de Ejecución al Script

Ejecuta el siguiente comando para hacer que el script sea ejecutable:

````bash
sudo chmod +x uninstall.sh
````

---

### 🔹 3. Ejecutar el Script de Desinstalación

Ejecuta el siguiente comando para iniciar la desinstalación:

````bash
sudo ./uninstall.sh
````

Durante la ejecución, se te solicitará ingresar el **dominio o subdominio** que deseas eliminar.

---

## ✅ Resultado Esperado

Al finalizar la ejecución del script, el servidor quedará sin:

- ❌ **Apache** y su configuración para el dominio/subdominio.
- ❌ **PHP** y sus módulos asociados.
- ❌ **Certificado SSL** eliminado con **Certbot**.

---

## 🔎 Verificación Final

Para verificar que Apache ha sido eliminado correctamente:

````bash
dpkg -l | grep apache2
````

Para comprobar que no quedan certificados SSL en Certbot:

````bash
sudo certbot delete --cert-name dominio.com
````

Si todo está en orden, ¡el servidor ha sido limpiado exitosamente! 🚀  

---



---

## 🔄 Clonación del Repositorio y Construcción de la Aplicación

Una vez que el servidor ha sido configurado correctamente, el siguiente paso es clonar el repositorio desde **GitHub** y generar el build de la aplicación en la máquina local.

### 🔹 1. Clonar el Repositorio en la Máquina Local

Desde tu máquina local, clona el repositorio con el siguiente comando:

````bash
git clone https://github.com/ajimmenezz-setpay/front-app.git
````

📌 **Nota:** Este paso **NO** se realiza en el servidor. Solo en tu máquina local para compilar el código antes de subirlo.

---

### 🔹 2. Construir la Aplicación en la Máquina Local

Para compilar la aplicación antes de desplegarla en el servidor, sigue estos pasos en tu máquina local:

````bash
cd /ruta/del/repositorio
npm install  # Instalar dependencias
npm run build  # Generar el build de producción
````

---

### 🔹 3. Copiar el Build Generado al Servidor

Una vez finalizada la construcción del proyecto, transfiere los archivos resultantes al servidor usando **SCP**:

````bash
scp -r dist/* usuario@IP_DEL_SERVIDOR:/var/www/DOMINIO/app/
````

📌 **Nota:** Si tu proyecto usa otra herramienta de build como `yarn` o `vite`, asegúrate de ejecutar los comandos adecuados.

---

### 🔎 Verificación Final

Para confirmar que la aplicación se ha desplegado correctamente en el servidor, revisa los archivos en la carpeta de destino:

````bash
ls -lah /var/www/DOMINIO/app/
````

Si todo ha sido copiado correctamente, tu aplicación ya estará lista para ejecutarse en el servidor. 🚀  

---

## 📩 Contacto

👨‍💻 **Autor:** Alonso Jiménez  
📧 **Email:** alonso@setpay.mx  
🌍 **Repositorio en GitHub:** [Enlace al Repositorio](https://github.com/ajimmenezz-setpay/front-app)

---

