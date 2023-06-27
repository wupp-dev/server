---
title: Nginx como servidor web
lang: es-ES
---

# Nginx como servidor web

Ya nos hemos encargado de poder acceder al servidor remotamente, pero eso es solo para nosotros, queda la parte más importante, el poder ofrecer algún tipo de servicio *(como puede ser una página web)*.

Para ello, necesitamos un servidor web, que se encargará de gestionar las conexiones entrantes. Existen dos bastante famosos:
- [Apache](https://httpd.apache.org/)
- [Nginx](https://www.nginx.com/)

Nosotros usaremos Nginx por ser más moderno y más eficiente.

::: warning ATENCIÓN
En esta guía se utilizan varios ajustes que mejoran la seguridad del servidor, pero esto reduce la compatibilidad con dispositivos antiguos y navegadores desactualizados, que no podrán acceder a la página. Nosotros hemos decidido que es más importante garantizar la seguridad a la retrocompatibilidad, pero esto dependerá de cada caso.
:::

## Instalación y puesta en marcha

Para asegurarnos de tener la última versión siempre instalada, utilizaremos los repositorios de Nginx en vez de los del sistema operativo. Para añadirlos, podemos seguir los pasos de [su web](https://nginx.org/en/linux_packages.html#Debian), que para Debian son:

```sh
$ sudo apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
$ curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
$ gpg --dry-run --quiet --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
```

Con este último comando verificamos que la clave es la correcta, debería mostrarse lo siguiente:
```sh
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

Nosotros hemos escogido usar los paquetes **mainline** en vez de los **stable**, la diferencia es que los primeros contienen las últimas novedades aunque pueden ser menos estables por tener características experimentales. Para añadir el repositorio mainline, utilizamos el siguiente comando:

```sh
$ echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/debian `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

```

Y ya ha llegado el momento de instalar Nginx:

```sh
$ sudo apt update
$ sudo apt install nginx
```

Una vez instalado, podemos iniciarlo y verificar que está funcionando correctamente:

```sh
$ sudo systemctl start nginx
$ sudo systemctl status nginx
```

Sin embargo, queda un último paso, abrir los puertos `80` y `443` tanto en el router como en el firewall, para el firewall escribimos:

```sh
$ sudo ufw allow 80
$ sudo ufw allow 443
```

Estos son los puertos de HTTP y HTTPS respectivamente.

Vamos a toquetear un poco la configuración para las partes venideras de la guía. La configuración de Nginx se estructura en bloques. Concretamente la parte que tocaremos son los bloques `server`, que serán la configuración de cada uno de nuestros subdominios. Estos archivos de configuración se guardan en `/etc/nginx/conf.d/` y, por defecto, solo habrá un archivo llamado `default.conf`, vamos a cambiarle el nombre a `www.wupp.dev`, ya que tendrá el bloque encargado de gestionar las conexiones con esa URL.
```sh
$ sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/www.wupp.dev.conf
```

Editamos el archivo buscando una línea que empiece por `server_name`:
```conf
server_name wupp.dev www.wupp.dev;
```

Ahora dejamos que Nginx verifique la sintaxis del archivo y, si no hay problemas, los reiniciamos:
```sh
$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
$ sudo nginx -s reload
```

## Habilitando *(y forzando)* HTTPS

Ahora mismo podemos poner en el navegador [wupp.dev](http://wupp.dev/), pero la conexión no es segura :(

Eso es inadmisible, así que vamos a forzar a que todas las conexiones HTTP se redirijan a HTTPS. Hemos seguido [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04-es).

Vamos a utilizar Certbot, un software para gestionar los certificados de Let's Encrypt, que son [certificados de autoridad](https://es.wikipedia.org/wiki/Autoridad_de_certificaci%C3%B3n) gratuitos.
```sh
$ sudo apt install certbot python3-certbot-nginx
```

Generamos el certificado para nuestro dominio:
```sh
$ sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d wupp.dev -d www.wupp.dev
```

Hemos especificado `--key-type ecdsa` porque 

Y ya está, certbot se encarga de modificar la configuración del archivo `/etc/nginx/conf.d/www.wupp.dev.conf` para forzar el uso de HTTPS y para renovar automáticamente los certificados cuando vayan a expirar.

## Otras mejoras de seguridad

Aunque ya hemos asegurado que la conexión al servidor sea por HTTPS, aun quedan unos cuantos cambios por hacer para mejorar la seguridad.

Antes hemos mencionado que la configuración de Nginx se estructura en bloques, entre los que están los bloques de `server` donde iremos poniendo la configuración de nuestros subdominios. Todos estos bloques `server` están dentro de un bloque `http` en el archivo `/etc/nginx/nginx.conf`. Vamos a hacer unos cuantos cambios en ese archivo para mejorar la seguridad. Así debería verse:
```conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    add_header Allow "GET, POST, OPTIONS";
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self';";
    add_header Content-Security-Policy-Report-Only "default-src 'self';";
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    fastcgi_hide_header X-Powered-By;
    fastcgi_hide_header Server;
    fastcgi_hide_header X-AspNet-Version;
    fastcgi_hide_header X-AspNetMvc-Version;
    fastcgi_hide_header X-Pingback;

    # Set client_max_body_size and limit_rate
    client_max_body_size 10m;
    limit_rate 8m;

    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      '"$http_referer" "$http_user_agent"';

    access_log  /var/log/nginx/access.log  main;

    # Disable server tokens in response headers
    server_tokens off;

    # Enable SSL/TLS
    ssl_protocols TLSv1.3;
    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_ecdh_curve secp384r1;
    
    # OSCP
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 208.67.222.222 208.67.220.220 valid=300s;
    resolver_timeout 5s;
    ssl_trusted_certificate /etc/letsencrypt/live/wupp.dev/chain.pem;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}

Para saber qué hace cada cambio, puedes buscarlo en la documentación de Nginx, porque por ahora me da pereza ponerlo aquí.

::: danger PELIGRO
Debes tener mucho cuidado al añadir `preload` a la cabecera de Strict-Transport-Security. Esto es algo que puede traerte problemitas si no conoces bien sus consecuencias. Para más información puedes consultar [esta página](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts).
:::

¿Cómo hemos decidido poner estas opciones? Pues buscando entre varias páginas recomendaciones. Aquí hay una lista de páginas que hemos consultado:
- [Generador de configuración SSL de Mozilla](https://ssl-config.mozilla.org/)
- [Recomendaciones de TLS de Mozilla](https://wiki.mozilla.org/Security/Server_Side_TLS)
- [Guía de HTTP de Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [Descripción de cada cabecera HTTP](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [Reportage de SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=cloud.wupp.dev)
- [Reportage de TLS Profiler](https://tlsprofiler.danielfett.de/)

Aun así, no hemos seguido las recomendaciones de cada página al pie de la letra, hemos escogido lo que más nos convenía.

Después de esto, dentro de cada bloque `server` podremos o tendremos que hacer otros cambios, pero eso es algo específico que iremos viendo.

Un cambio que sí se puede hacer y que es útil si vamos a añadir varios subdominios (todos ellos con HTTPS), es crear un único bloque `server` que se encargue de redirigir todas las solicitudes HTTP a las respectivas HTTPS. Podemos crear un archivo `/etc/nginx/conf.d/wupp.dev` con el siguiente contenido:
```conf
server {
    listen 80 default_server;
    server_name wupp.dev;
    return 301 https://$server_name$request_uri;
}
```

Y así el archivo `/etc/nginx/www.wupp.dev` quedaría más limpio:
```conf
server {
    server_name wupp.dev www.wupp.dev;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

Un detalle importante al usar Certbot es que añade automáticamente esta línea a cada bloque `server` para el que genera certificado:

```conf
include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
```

Si vemos el contenido de este archivo, nos daremos cuenta de un ligero problema:

```conf
# This file contains important security parameters. If you modify this file
# manually, Certbot will be unable to automatically provide future security
# updates. Instead, Certbot will print and log an error message with a path to
# the up-to-date file that you will need to refer to when manually updating
# this file. Contents are based on https://ssl-config.mozilla.org

ssl_session_cache shared:le_nginx_SSL:10m;
ssl_session_timeout 1440m;
ssl_session_tickets off;

ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
```

Este archivo nos está sobreescribiendo algunos ajustes que hemos hecho, pero advierte que si lo modificamos dejará de actualizarse junto con Certbot, así que tenemos dos opciones:
- Dejar simplemente que Certbot elija y actualice la configuración.
- Cambiarla nosotros y asegurarnos de mantenerla en un futuro si surge alguna nueva recomendación de seguridad.

Como nosotros no estamos satisfechos con la configuración actual de Certbot, hemos decidido cambiarla, quedando así:

```conf
# This file contains important security parameters. If you modify this file
# manually, Certbot will be unable to automatically provide future security
# updates. Instead, Certbot will print and log an error message with a path to
# the up-to-date file that you will need to refer to when manually updating
# this file. Contents are based on https://ssl-config.mozilla.org

ssl_protocols TLSv1.3;
ssl_session_cache shared:le_nginx_SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
ssl_ecdh_curve secp384r1;
ssl_stapling on;
ssl_stapling_verify on;
resolver 208.67.222.222 208.67.220.220 valid=300s;
resolver_timeout 5s;
ssl_trusted_certificate /etc/letsencrypt/live/wupp.dev/chain.pem;
```

:::info
Entre todas las cosas que hemos añadido está el OCSP Stapling, pero no está implementado en su totalidad, pues se puede añadir la etiqueta "OCSP Must-Staple" al certificado del servidor, pero no es algo esencial y habría que volver a generar todos los certificados de nuevo. Puedes ver más información [aquí](https://scotthelme.co.uk/ocsp-must-staple/).
:::

Aunque ya hemos acabado de configurar Nginx, hay que tener en cuenta de que por ahora lo único que hace es servir archivos estáticos localizados en `/usr/share/nginx/html/`.

En un principio, nos dedicaremos a añadir servicios en subdominios, dejando `www` intacto, así que puede dejarse como una página web estática, retocando un poco su apariencia o puede configurarse como uno de los servicios, eso ya queda a elección de cada uno.