---
title: Servidor web
order: 6
---

# Nginx como servidor web

Ya nos hemos encargado de poder acceder al servidor remotamente, pero eso es solo para nosotros, queda la parte más importante, el poder ofrecer algún tipo de servicio _(como puede ser una página web)_.

Para ello, necesitamos un servidor web, que se encargará de gestionar las conexiones entrantes. Existen dos bastante famosos:

- [Apache](https://httpd.apache.org/)
- [Nginx](https://www.nginx.com/)

Nosotros usaremos Nginx por ser más moderno y más eficiente.

::: warning ATENCIÓN
En esta guía se utilizan varios ajustes que mejoran la seguridad del servidor, pero esto reduce la compatibilidad con dispositivos antiguos y navegadores desactualizados, que no podrán acceder a la página. Nosotros hemos decidido que es más importante garantizar la seguridad a la retrocompatibilidad, pero esto dependerá de cada caso.
:::

## Instalación y puesta en marcha

Nosotros hemos elegido instalar Nginx directamente en Debian, pero también se podría instalar dentro de un contenedor [Docker](./docker) si se prefiere esa opción. Una de las ventajas de instalarlo en un contenedor sería un cambio más fácil de versión o incluso el utilizar imágenes con módulos extra ya compilados como [esta](https://hub.docker.com/r/macbre/nginx-http3).

Para asegurarnos de tener la última versión siempre instalada, utilizaremos los repositorios de Nginx en vez de los del sistema operativo. Para añadirlos, podemos seguir los pasos de [su web](https://nginx.org/en/linux_packages.html#Debian).

Vamos a usar los paquetes **mainline** en lugar de los **stable**, la diferencia es que los primeros contienen las últimas novedades.

Una vez instalado, podemos iniciarlo y verificar que está funcionando correctamente:

```sh
sudo systemctl start nginx
sudo systemctl status nginx
```

Sin embargo, queda un último paso, abrir los puertos `80` y `443` tanto en el router como en el firewall, para el firewall escribimos:

```sh
sudo ufw allow 80
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
```

Estos son los puertos de HTTP y HTTPS (TCP y UDP para HTTP/3) respectivamente.

Vamos a toquetear un poco la configuración para las partes venideras de la guía. La configuración de Nginx se estructura en bloques. Concretamente la parte que tocaremos son los bloques `server`, que serán la configuración de cada uno de nuestros subdominios. Estos archivos de configuración se guardan en `/etc/nginx/conf.d/` y, por defecto, solo habrá un archivo llamado `default.conf`, vamos a cambiarle el nombre a `www.wupp.dev.conf`, ya que tendrá el bloque encargado de gestionar las conexiones con esa URL.

```sh
sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/www.wupp.dev.conf
```

Editamos el archivo buscando una línea que empiece por `server_name`:

```nginx
server_name wupp.dev www.wupp.dev;
```

Ahora dejamos que Nginx verifique la sintaxis del archivo y, si no hay problemas, lo reiniciamos:

```sh
sudo nginx -t
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
sudo nginx -s reload
```

## Habilitando _(y forzando)_ HTTPS

Ahora mismo podemos poner en el navegador [wupp.dev](http://wupp.dev/) y funcionará, pero la conexión no es segura :(

Eso es inadmisible, así que vamos a forzar a que todas las conexiones HTTP se redirijan a HTTPS. Hemos seguido [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04).

Vamos a utilizar Certbot, un software para gestionar los certificados de Let's Encrypt, que son [certificados TLS](https://www.cloudflare.com/es-es/learning/ssl/what-is-an-ssl-certificate/) gratuitos.

```sh
sudo apt install certbot python3-certbot-nginx
```

Generamos el certificado para nuestro dominio:

```sh
sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d wupp.dev -d www.wupp.dev
```

Hemos especificado `--key-type ecdsa` porque es más eficiente que RSA manteniendo el mismo nivel de seguridad y `--elliptic-curve secp384r1` porque es la curva recomendada actualmente para un buen equilibrio entre seguridad y rendimiento.

Y ya está, certbot se encarga de modificar la configuración del archivo `/etc/nginx/conf.d/www.wupp.dev.conf` para forzar el uso de HTTPS y para renovar automáticamente los certificados cuando vayan a expirar.

## Otras mejoras de seguridad

Aunque ya hemos asegurado que la conexión al servidor sea por HTTPS, aun quedan unos cuantos cambios por hacer para mejorar la seguridad.

Antes hemos mencionado que la configuración de Nginx se estructura en bloques, entre los que están los bloques de `server` donde iremos poniendo la configuración de nuestros subdominios. Todos estos bloques `server` están dentro de un bloque `http` en el archivo `/etc/nginx/nginx.conf`. Vamos a hacer unos cuantos cambios en ese archivo para mejorar la seguridad y el rendimiento. Así debería verse:

```nginx
user  nginx;

# Nginx crea automáticamente tantos workers como núcleos/hilos útiles vea en la máquina.
worker_processes  auto;

# Subimos el límite de ficheros abiertos por proceso para evitar quedarnos cortos con conexiones y ficheros.
# Ojo: esto tiene que cuadrar con el LimitNOFILE de systemd y con ulimit, si no, no sirve de mucho.
worker_rlimit_nofile  16384;

# Log de errores en modo "normal": suficiente para diagnosticar sin llenar el disco a lo tonto.
error_log  /var/log/nginx/error.log  error;

pid        /run/nginx.pid;

# ---------------------------------------------------------
# EVENTS: concurrencia / aceptación de conexiones
# ---------------------------------------------------------
events {
    # Conexiones simultáneas por worker. Para un servidor con poco tráfico, 1024 suele ir sobrado.
    worker_connections  1024;

    # En Linux, epoll es lo más eficiente para I/O. En muchos casos ya es el valor por defecto,
    # pero dejarlo explícito ayuda a evitar sorpresas.
    use epoll;
}

# ---------------------------------------------------------
# HTTP: configuración global para todos los vhosts
# ---------------------------------------------------------
http {
    # No enviamos la versión de Nginx en las respuestas.
    server_tokens off;

    # Tipos MIME para que Nginx sirva los Content-Type correctamente.
    include       /etc/nginx/mime.types;

    # Si algo no encaja con un MIME conocido, usamos este por defecto.
    default_type  application/octet-stream;

    # -------------------------
    # LOGS
    # -------------------------
    # Access log con timings.
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct=$upstream_connect_time '
                    'uht=$upstream_header_time urt=$upstream_response_time';

    # Buffer en el access log para escribir menos a disco.
    # flush=1m reduce I/O, pero si el servidor cae podríamos perder hasta 1 minuto de logs.
    access_log  /var/log/nginx/access.log  main  buffer=64k  flush=1m;

    # -------------------------
    # RED / I/O
    # -------------------------
    # sendfile acelera el servir archivos estáticos.
    sendfile on;

    # Optimiza el envío de respuestas grandes cuando usamos sendfile.
    tcp_nopush on;

    # Baja latencia en respuestas pequeñas (no espera a juntar paquetes).
    tcp_nodelay on;

    # Keep-alive para no rehacer conexiones todo el rato.
    # 15s es un buen punto medio entre latencia y consumo de recursos.
    keepalive_timeout  15s;
    keepalive_requests 10000;

    # Timeouts defensivos contra clientes lentos o que intentan consumir sockets.
    client_header_timeout  10s;
    client_body_timeout    60s;
    send_timeout           15s;

    # -------------------------
    # LÍMITES / BUFFERS DE REQUEST
    # -------------------------
    # Tamaño máximo de body. Mejor ajustarlo por vhost, pero este valor global es razonable.
    client_max_body_size  5m;

    # Si un cliente se queda colgado y expira, cortamos la conexión de forma más agresiva.
    reset_timedout_connection on;

    # -------------------------
    # CACHE DE METADATOS DE FICHEROS (estáticos)
    # -------------------------
    # Cachea stats/opens para servir estáticos más rápido (sin pasarnos: no esperamos tráfico masivo).
    open_file_cache max=1000 inactive=30s;

    # Revalida cada 30s: suficiente para no servir cosas viejas demasiado tiempo.
    open_file_cache_valid 30s;

    # Solo cachea si se ha pedido al menos 2 veces (evita llenar la cache con peticiones sueltas).
    open_file_cache_min_uses 2;

    # También cachea errores: útil si hay bots pidiendo rutas inexistentes.
    open_file_cache_errors on;

    # -------------------------
    # COMPRESIÓN: gzip
    # -------------------------
    gzip on;

    # Compresión moderada: buen ahorro sin poner en un aprieto a la CPU.
    gzip_comp_level 4;

    # No merece la pena comprimir respuestas demasiado pequeñas.
    gzip_min_length 256;

    # Importante para caches intermedias.
    gzip_vary on;

    # Comprime también respuestas proxied cuando toca.
    gzip_proxied expired no-cache no-store private auth;

    # Tipos típicos para gzip (texto y derivados).
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/x-javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml;

    # -------------------------
    # TLS (base global; ajustar por vhost)
    # -------------------------
    # QUIC/HTTP/3 necesita TLS 1.3. Y como no nos preocupa la retrocompatibilidad, no permitimos TLSv1.2.
    ssl_protocols TLSv1.3;

    # Que el cliente elija cipher suite.
    ssl_prefer_server_ciphers off;

    # Desactivamos session tickets: menos superficie de riesgo; a cambio, algo menos de reuso en algunos casos.
    ssl_session_tickets off;

    # 0-RTT desactivado: evita riesgos de replay. Solo activar a conciencia y por vhost.
    ssl_early_data off;

    # Habilitamos HTTP/2 por defecto.
    http2 on;

    # Quitamos cabeceras informativas típicas de apps/frameworks cuando actuamos como proxy/fastcgi.
    proxy_hide_header   X-Powered-By;
    fastcgi_hide_header X-Powered-By;
    fastcgi_hide_header X-Pingback;

    # -------------------------
    # WEBSOCKETS / UPGRADE (útil para varios servicios)
    # -------------------------
    # Esto se usa en los vhosts cuando hacemos proxy y necesitamos soportar Upgrade (WebSockets).
    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    # -------------------------
    # RATE LIMITING (aquí solo definimos zonas; se aplica en cada server/location)
    # -------------------------
    # Límite de conexiones simultáneas por IP (zona en memoria).
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;

    # Límite de requests por IP (ajustar por servicio si hace falta).
    limit_req_zone  $binary_remote_addr zone=req_limit_per_ip:10m rate=5r/s;

    # Respuesta estándar cuando limitamos (más claro que un 503).
    limit_conn_status 429;
    limit_req_status  429;

    # Vhosts.
    include /etc/nginx/conf.d/*.conf;
}
```

¿Cómo hemos decidido poner estas opciones? Pues buscando entre varias páginas recomendaciones. Aquí hay una lista de páginas que hemos consultado:
- [Generador de configuración SSL de Mozilla](https://ssl-config.mozilla.org/)
- [Recomendaciones de TLS de Mozilla](https://wiki.mozilla.org/Security/Server_Side_TLS)
- [Guía de HTTP de Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [Descripción de cada cabecera HTTP](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [Reporte de SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=cloud.wupp.dev)
- [Reporte de TLS Profiler](https://tlsprofiler.danielfett.de/)

Aun así, no hemos seguido las recomendaciones de cada página al pie de la letra, hemos escogido lo que más nos convenía. Y hemos consultado también con nuestro gran amigo ChatGPT para intentar ajustarlo a un nivel realista de tráfico y al hardware del servidor.

Después de esto, dentro de cada bloque `server` podremos o tendremos que hacer otros cambios, pero eso es algo específico que iremos viendo.

Un cambio que sí se puede hacer y que es útil si vamos a añadir varios subdominios (todos ellos con HTTPS), es crear un único bloque `server` que se encargue de redirigir todas las solicitudes HTTP a las respectivas HTTPS. Además, podemos dejarlo preparado para permitir la creación de los próximos certificados de subdominios. Creamos el archivo `/etc/nginx/conf.d/wupp.dev.conf` con el siguiente contenido:

```nginx
# ------------------------------------------------------------
# HTTP (80): ACME challenge + redirección global a HTTPS
# ------------------------------------------------------------
server {
    # Soporte para IPv4 e IPv6
    listen 80 default_server;
    listen [::]:80 default_server;

    # Cualquier subdomino
    server_name wupp.dev .wupp.dev;

    # Respuesta a ACME HTTP-01
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
        try_files $uri =404;
    }

    # Redirección global HTTP -> HTTPS para cualquier dominio/subdominio
    return 308 https://$host$request_uri;
}
```

No se nos debe olvidar crear el directorio `/var/www/letsencrypt` para que Certbot pueda usarlo al generar los certificados:

```sh
sudo mkdir -p /var/www/letsencrypt
sudo chown -R www-data:www-data /var/www/letsencrypt
```

Y así el archivo `/etc/nginx/www.wupp.dev.conf` quedaría más limpio:

```nginx
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

Un detalle importante al usar Certbot con la opción `--nginx` es que, además de crear el nuevo bloque con la redirección a HTTPS que ya no necesitamos, también añade automáticamente esta línea:

```nginx
include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
```

Si vemos el contenido de este archivo, nos daremos cuenta de un ligero problema:

```nginx
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
- Quitar esa línea para utilizar nuestra configuración.

Como nosotros no estábamos satisfechos con la configuración de Certbot, decidimos quitar esa línea y, para evitar que Certbot nos haga modificaciones en la configuración de Nginx al crear futuros certificados, no utilizamos la opción `--nginx` y en su lugar usamos la opción `--webroot` para generar los certificados, indicando el directorio `/var/www/letsencrypt` como raíz para la validación HTTP-01, que es justo el que hemos configurado en el bloque `server` que redirige HTTP a HTTPS.

::: warning ATENCIÓN
Si decidimos quitar la línea de inclusión del archivo de Certbot, debemos tener en cuenta que seremos nosotros los responsables de mantener la configuración segura y actualizada.
:::

Aunque ya hemos acabado de configurar Nginx, hay que tener en cuenta de que por ahora lo único que hace es servir archivos estáticos localizados en `/usr/share/nginx/html/`.

En un principio, nos dedicaremos a añadir servicios en subdominios, dejando `www` intacto, así que puede dejarse como una página web estática, retocando un poco su apariencia o puede configurarse como uno de los servicios, eso ya queda a elección de cada uno.

### Restringiendo autoridades de certificación

Entre la gran variedad de registros que podemos añadir a un dominio, está el Certificate Authority Authorization (CAA) con el que podemos indicar qué autoridades pueden crear certificados para el dominio y sus subdominios. Para configurarlo, simplemente añadimos el registro CAA bajo el dominio base `wupp.dev` y como destino indicamos `0 issue "letsencrypt.org"` para que solo se puedan crear certificados por Let's Encrypt, que es la única autoridad que vamos a usar.

Si planeamos usar certificados wildcard en el futuro, también debemos añadir otro registro CAA con `0 issuewild "letsencrypt.org"`.

## Habilitando HTTP/3

El soporte para HTTP/3 es relativamente reciente en Nginx y su documentación es más bien escasa. Por ejemplo, en cualquier guía que encontremos en internet, nos dirán que para habilitar HTTP/3 simplemente hay que añadir la línea `listen 443 quic reuseport;` en el bloque `server`, pero olvidan mencionar que la opción `reuseport` solo se puede usar en un bloque `server`, mientras que en los demás tendremos que usar solo `listen 443 quic;`. Esto me dio bastantes dolores de cabeza hasta que lo averigüé y quizá por todos los intentos la configuración final tiene cosas que no son estrictamente necesarias, pero funciona, ya lo actualizaré cuando tenga más claro qué es imprescindible y qué no.

Bueno y si da tantos problemas **¿por qué usarlo?** Pues porque HTTP/3 usa QUIC como protocolo de transporte, que a su vez usa UDP en lugar de TCP. Esto le permite reducir la latencia en conexiones con alta pérdida de paquetes y mejorar la velocidad de carga en conexiones con alta latencia, como las conexiones móviles.

Antes de nada, debemos asegurarnos de tener el puerto `443` abierto en el firewall y en el router, tanto para TCP como para UDP.

Tenemos que elegir un bloque `server` en el que añadir el `reuseport`, que en nuestro caso será en el archivo `/etc/nginx/conf.d/wupp.dev.conf`, donde también aprovecharemos para hacer una redirección de `wupp.dev` a `www.wupp.dev`. Añadimos el siguiente contenido:

```nginx
# ------------------------------------------------------------
# HTTPS (443): wupp.dev -> www.wupp.dev (HTTP/2 + HTTP/3)
# ------------------------------------------------------------
server {
    # Listeners HTTP/2 + HTTP/3
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    listen 443 quic reuseport default_server;
    listen [::]:443 quic reuseport default_server;

    server_name wupp.dev;

    # Cabecera para anunciar el uso de HTTP/3
    add_header Alt-Svc 'h3=":443"; ma=86400' always;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Certificado
    ssl_certificate /etc/letsencrypt/live/wupp.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wupp.dev/privkey.pem;

    # Redirección canónica a www
    return 308 https://www.wupp.dev$request_uri;
}
```

::: danger PELIGRO
Debes tener mucho cuidado al añadir `includeSubDomains` y `preload` a la cabecera de Strict-Transport-Security. Esto es algo que puede traerte problemitas si no conoces bien sus consecuencias. Para más información puedes consultar [esta página](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts).
:::

Con este cambio tendremos que quitar `wupp.dev` de la directiva `server_name` del archivo `/etc/nginx/conf.d/www.wupp.dev.conf`, ya que lo hemos movido.

Y en el resto de bloques `server` tendremos que tener los siguientes listeners junto con las cabeceras necesarias para anunciar HTTP/3 y, opcionalmente, HSTS:

```nginx
listen 443 ssl;
listen [::]:443 ssl;
listen 443 quic;
listen [::]:443 quic;
```

## Usando snippets

Tener que añadir esas cuatro líneas en cada bloque `server` puede ser un poco tedioso, así que podemos usar snippets para crear un archivo con esas líneas y luego incluirlo en cada bloque `server`.

Comenzamos creando el archivo `/etc/nginx/snippets/listen-http2-http3.conf` con el siguiente contenido:

```nginx
# HTTP/3
listen 443 quic;
listen [::]:443 quic;

# HTTP/2
listen 443 ssl;
listen [::]:443 ssl;

# Anuncia HTTP/3
add_header Alt-Svc 'h3=":443"; ma=86400' always;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

Luego, en cada bloque `server`, como puede ser `/etc/nginx/conf.d/www.wupp.dev.conf` cambiamos el `listen` por la inclusión del snippet, quedando así:

```nginx
server {
    server_name www.wupp.dev;

    include snippets/listen-http2-http3.conf;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    ssl_certificate /etc/letsencrypt/live/wupp.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wupp.dev/privkey.pem;
}
```

Quitamos también `include /etc/letsencrypt/options-ssl-nginx.conf` y `ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem` porque no queremos que se sobrescriban nuestros ajustes de TLS y el `dhparam` no es necesario con TLS 1.3.

## Cabeceras de seguridad base

Podemos crear otro snippet con unas cabeceras de seguridad base que luego podremos incluir en cada bloque `server`. Creamos el archivo `/etc/nginx/snippets/security-headers-base.conf` con el siguiente contenido:

```nginx
# Evita MIME sniffing.
add_header X-Content-Type-Options "nosniff" always;

# Anti-clickjacking básico.
add_header X-Frame-Options "SAMEORIGIN" always;

# Referrer razonable.
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Desactiva XSS filter legacy (obsoleto y a veces contraproducente).
add_header X-XSS-Protection "0" always;

# Cierra APIs por defecto.
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;

# Nada de policies raras tipo Flash/Adobe.
add_header X-Permitted-Cross-Domain-Policies "none" always;

# Aislamiento cross-origin.
add_header Cross-Origin-Opener-Policy "same-origin" always;

# Evita que otros sitios usen tus recursos cross-origin por defecto.
add_header Cross-Origin-Resource-Policy "same-origin" always;

# CSP base: bastante estricta, buena para webs normales.
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; img-src 'self' data: https:; font-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; upgrade-insecure-requests; block-all-mixed-content" always;
```

:::tip
Siempre que una página te esté dando problemas, culpa primero a la CSP (Content Security Policy). Suele ser el causante de todos los males.
:::

## Generando un certificado wildcard

Certbot permite generar certificados wildcard *(un certificado para gobernarlos a todos)* usando la opción `-d *.wupp.dev`, pero para ello es necesario usar el método de validación DNS, que requiere añadir registros TXT en la configuración del dominio.

Si se tiene el dominio en un proveedor que permita automatizar la creación de estos registros, como Cloudflare, esta opción puede ser interesante. En nuestro Namecheap no lo permitía, lo que motivó el cambio de nameservers a los de Cloudflare.

Comenzamos instalando el plugin de Cloudflare para Certbot:

```sh
sudo apt install python3-certbot-dns-cloudflare
```

Vamos al panel de Cloudflare y creamos un token de API con permisos para editar los DNS del dominio. Luego, creamos un archivo para guardarlo:

```sh
sudo mkdir -p /etc/letsencrypt/secrets
```

Dentro del archivo `/etc/letsencrypt/secrets/cloudflare.ini` guardamos el token:

```ini
dns_cloudflare_api_token = abcd1234
```

Y ajustamos los permisos:

```sh
sudo chmod 600 /etc/letsencrypt/secrets/cloudflare.ini
```

Antes de generar el certificado wildcard, vamos a eliminar cualquier certificado existente. Primero vemos los que hay:

```sh
sudo certbot certificates
```

::: danger PELIGRO
Borrar los certificados puede causar que los servicios que los usen dejen de funcionar. Asegúrate de que no haya ningún servicio usando el certificado antes de borrarlo o que no haya problema porque se interrumpa momentalmente el servicio.
:::

Y los eliminamos:

```sh
sudo certbot delete --cert-name wupp.dev
```

Ahora sí, generamos el certificado wildcard:

```sh
sudo certbot certonly --key-type ecdsa --elliptic-curve secp384r1 --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/secrets/cloudflare.ini -d wupp.dev -d '*.wupp.dev'
```

Finalmente podemos incluir estas líneas en `/etc/nginx/nginx.conf` para que todos los bloques `server` usen el certificado wildcard:

```nginx
ssl_certificate     /etc/letsencrypt/live/wupp.dev/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/wupp.dev/privkey.pem;
```

Y debemos borrar dichas líneas de cada bloque `server`.