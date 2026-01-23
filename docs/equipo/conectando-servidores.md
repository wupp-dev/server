---
title: Conectando servidores
order: 9
---

# Conectando varios servidores

Llega un momento en el que un ordenador se queda corto, sobre todo si quieres usarlo para Minecraft. Así que nuestra solución fue añadir otro a la colección pero, ¿cómo conectamos ambos para que respondan bajo un mismo dominio?

## Introducción

Lo primero que tendremos que hacer con el nuevo ordenador es seguir toda esta guía para llegar a tenerlo en un punto usable. Eso sí, tendremos que escoger dos nuevos puertos para OpenSSH Server y Dropbear, pero por lo demás es todo igual hasta que llegamos a Nginx. Que no se nos olvide asignarle una IP local fija que, asumiremos que es `192.168.1.144`. Si hacemos referencia a la IP local del servidor principal, asumiremos también que es `192.168.1.133`.

## Nginx

Llegados a este punto, lo ideal sería tener un tercer ordenador (como una Raspberry) con Nginx para gestionar las conexiones y que simplemente haga de proxy inverso hacia los otros ordenadores, que tendrán los distintos servicios.

Como no nos sobra el dinero para tener todavía otro más, hemos optado por seguir usando el ordenador principal para gestionar las conexiones y que el de Minecraft simplemente se comunique con el otro y no con el exterior (salvo por el SSH).

### Internet <-> Servidor principal

Para empezar tenemos que configurar Nginx para que lo único que haga al recibir una solicitud que deba de ir al ordenador secundario sea gestionar la conexión HTTPS y comunicarse con el ordenador secundario. En nuestro caso queremos redirigir los subdominios `mc.wupp.dev` y `amp.wupp.dev` (entre otros) al servidor secundario para servir NamelessMC y el panel de control de Minecraft respectivamente.

El archivo de configuración de Nginx para los dos dominios debería de quedar igual. Este sería el de `amp.wupp.dev` por ejemplo:

```nginx
server {
    server_name amp.wupp.dev;

    location / {
        proxy_pass https://192.168.1.144;
        proxy_ssl_session_reuse on;
        proxy_ssl_verify off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/amp.wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/amp.wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

Aunque las opciones `proxy_ssl_session_reuse on;` y `proxy_ssl_verify off;` ya tienen esos valores por defecto, he preferido especificarlas para tenerlas más en cuenta. La primera lo que hace es reutilizar los parámetros del SSL handshake para que las conexiones requieran menos recursos al establecerse. La segunda le indica a Nginx que no debe indicar si el certificado del ordenador secundario es válido, pues utilizaremos uno *self-signed* para facilitar las cosas (y esos no se consideran válidos tal cual).

### Servidor principal <-> Servidor secundario

En el servidor secundario, a parte de instalar Nginx y configurarlo tal y como dice esta guía, hay que modificar `/etc/nginx/nginx.conf` para quitar todas las líneas de configuración de *OSCP stapling*, pues entre el ordenador principal y el secundario no será necesario usarlo.

Debian debería venir con un paquete llamado `ssl-cert` que genera un certificado *self-signed* al instalarse, así que también deberíamos tener un certificado en `/etc/ssl/certs/ssl-cert-snakeoil.pem` que será el que usaremos para que la conexión entre el servidor principal y el secundario pueda ser por HTTPS.

Para usarlo, simplemente debemos incluirlo en el archivo de configuración como si se tratase del certificado de certbot:

```nginx
listen 443 ssl;
ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
```

## Correo electrónico

Si nos hemos decidido a configurar un servidor de correo en el ordenador principal, se nos puede dar el caso en el que un servicio del ordenador secundario necesite mandar correos a través del servidor de correo que hayamos configurado.

Para asegurar que funcione correctamente, utilizaremos y configuraremos `exim4` en el servidor secundario. Empezamos instalándolo con `sudo apt-get install exim4-daemon-light` y pasamos a configurarlo editando `sudo nano /etc/exim4/update-exim4.conf.conf`. Para nuestro caso concreto:

```
# /etc/exim4/update-exim4.conf.conf
#
# Edit this file and /etc/mailname by hand and execute update-exim4.conf
# yourself or use 'dpkg-reconfigure exim4-config'
#
# Please note that this is _not_ a dpkg-conffile and that automatic changes
# to this file might happen. The code handling this will honor your local
# changes, so this is usually fine, but will break local schemes that mess
# around with multiple versions of the file.
#
# update-exim4.conf uses this file to determine variable values to generate
# exim configuration macros for the configuration file.
#
# Most settings found in here do have corresponding questions in the
# Debconf configuration, but not all of them.
#
# This is a Debian specific file

dc_eximconfig_configtype='satellite'
dc_other_hostnames='mcserver'
dc_local_interfaces='127.0.0.1 ; ::1'
dc_readhost='wupp.dev'
dc_relay_domains=''
dc_minimaldns='false'
dc_relay_nets=''
dc_smarthost='192.168.1.133:587'
CFILEMODE='644'
dc_use_split_config='false'
dc_hide_mailname='true'
dc_mailname_in_oh='true'
dc_localdelivery='mail_spool'
```

donde `192.168.1.133:587` es la IP local del ordenador principal y el puerto donde esté ESMTP con STARTTLS.

También editamos `sudo nano /etc/exim4/passwd.client`:

```
# password file used when the local exim is authenticating to a remote
# host as a client.
#
# see exim4_passwd_client(5) for more documentation
#
# Example:
### target.mail.server.example:login:password
*:admin@wupp.dev:passw
```

donde `admin@wupp.dev` y `passw` es un correo y su contraseña del ordenador principal.

Aplicamos los cambios con `sudo update-exim4.conf` y con `sudo /etc/init.d/exim4 restart`.

Esto nos permitirá que, mandando correos desde el servidor secundario a sí mismo al puerto 25, se redirijan al servidor principal y salgan desde allí.