---
title: Nextcloud
lang: es-ES
---
# Nextcloud - Almacenamiento

Por fin llegó el momento de poner en marcha el primer servicio, y qué mejor elección que [Nextcloud](https://nextcloud.com/es/). Antes de empezar asegúrate de que tienes un subdominio creado para Nextcloud como `cloud.wupp.dev`.

## Configurando Docker

Partimos del documento `docker-compose.yml` que nos quedó en la sección de [Docker](../equipo/docker.md) al que vamos a hacer unos cuantos cambios que ahora comentaré:

```yml
version: '3'

services:
  db:
    image: mariadb
    container_name: db
    restart: always
    environment:
      - MARIADB_ROOT_PASSWORD=pwd
      - MARIADB_USER=nextcloud
      - MARIADB_PASSWORD=pwd
      - MARIADB_DATABASE=nextcloud
    volumes:
      - /var/lib/mysql:/var/lib/mysql
    command: --transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW

  redis:
    image: redis
    container_name: redis
    command: redis-server --requirepass pwd

  nextcloud:
    image: nextcloud:fpm
    container_name: nextcloud
    restart: always
    depends_on:
      - db
      - redis
    environment:
      - MYSQL_HOST=db
      - NEXTCLOUD_TRUSTED_DOMAINS=cloud.wupp.dev
      - REDIS_HOST=redis
      - REDIS_HOST_PORT=6379
      - REDIS_HOST_PASSWORD=pwd
      - PHP_MEMORY_LIMIT=50G
      - PHP_UPLOAD_LIMIT=50G
    ports:
      - 9000:9000
    volumes:
      - /var/www/nextcloud:/var/www/html

  cron:
    image: nextcloud:fpm
    container_name: cron
    restart: always
    depends_on:
      - db
      - redis
    volumes:
      - /var/www/nextcloud:/var/www/html
    entrypoint: /cron.sh
```

Lo primero que cabe destacar es que en este nuevo archivo, los usuarios y las contraseñas están directamente escritos. Esto no es una buena práctica de seguridad, pero para la guía lo vamos a dejar así, dejando claro que a la hora de implementarlo deberían usarse [secretos de docker](https://docs.docker.com/engine/swarm/secrets/). Una excepción que hemos hecho a esto es redis, que por unos cuantos problemas que nos ha dado lo hemos dejado sin contraseña.

Vamos a analizar un poco el documento, concretamente los servicios que hay declarados:
- `db`: Esta será la base de datos de Nextcloud, la línea que hay en `command` tiene opciones para un mejor rendimiento y escalabilidad. Luego en `environment` simplemente se establece la contraseña del usuario root y un usuario, contraseña y base de datos a crear, que serán Nextcloud. Por último, `volumes` permite que los datos guardados se conserven aunque el servicio se reinicie.
- `redis`: Es otra base de datos pero que en este caso Nextcloud utilizará para almacenar archivos en caché y así tener un mejor rendimiento. También se usará para gestionar los inicios de sesión. En `command` se especifica la contraseña.
- `nextcloud`: Tiene el mapeo de puertos `9000:9000` para que Nginx pueda redirigir las solicitudes PHP dentro del contenedor. Además, `depends_on` indica que tanto `db` como `redis` deben estar funcionando para que Nextcloud lo haga. Por último se hace igual que en `db` un mapeo de carpetas para conservar los datos y se establecen las variables de entorno para configurar Nextcloud.
- `cron`: Este contenedor es peculiar. Es necesario solo si planeas que Nextcloud lo vaya a usar más de una persona, para reducir la carga de trabajo del servidor. Lo único que hace es ejecutar puntualmente una tarea de `cron` dentro de los archivos de Nextcloud para hacer labores de mantenimiento y limpieza de forma automática.

Para que Nextcloud empiece a ejecutarse (aunque aun no podamos acceder) simplemente escribimos `docker compose up -d`.

## Configurando Nginx

Con el `docker-compose.yml` configurado, podemos pasar a configurar el subdominio para Nextcloud en Nginx. La mayor parte de la configuración la hemos tomado de [este ejemplo](https://github.com/nextcloud/docker/blob/master/.examples/docker-compose/insecure/postgres/fpm/web/nginx.conf), pero añadiendo HTTPS y cambiando unas cuantas cosas. Creamos el archivo `/etc/nginx/conf.d/cloud.wupp.dev.conf` con el contenido:

```conf
upstream nextcloud {
    server 127.0.0.1:9000;
}

# Set the `immutable` cache control options only for assets with a cache busting `v` argument
map $arg_v $asset_immutable {
    "" "";
    default "immutable";
}

server {
    server_name cloud.wupp.dev;

    # set max upload size
    client_max_body_size 50G;
    # unlimited download speed
    limit_rate 0;

    fastcgi_buffers 64 4K;

    # Enable gzip but do not remove ETag headers
    gzip on;
    gzip_vary on;
    gzip_comp_level 4;
    gzip_min_length 256;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
    gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/wasm application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;

    # The settings allows you to optimize the HTTP2 bandwitdth.
    # See https://blog.cloudflare.com/delivering-http-2-upload-speed-improvements/
    # for tunning hints
    client_body_buffer_size 512k;

    # HTTP response headers
    add_header X-Download-Options "noopen" always;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

    # Add .mjs as a file extension for javascript
    # Either include it in the default mime.types list
    # or include you can include that list explicitly and add the file extension
    # only for Nextcloud like below:
    include mime.types;
    types {
        application/javascript mjs;
    }

    # Path to the root of your installation
    root /var/www/nextcloud;

    # Specify how to handle directories -- specifying `/index.php$request_uri`
    # here as the fallback means that Nginx always exhibits the desired behaviour
    # when a client requests a path that corresponds to a directory that exists
    # on the server. In particular, if that directory contains an index.php file,
    # that file is correctly served; if it doesn't, then the request is passed to
    # the front-end controller. This consistent behaviour means that we don't need
    # to specify custom rules for certain paths (e.g. images and other assets,
    # `/updater`, `/ocm-provider`, `/ocs-provider`), and thus
    # `try_files $uri $uri/ /index.php$request_uri`
    # always provides the desired behaviour.
    index index.php index.html /index.php$request_uri;

    # Rule borrowed from `.htaccess` to handle Microsoft DAV clients
    location = / {
        if ( $http_user_agent ~ ^DavClnt ) {
            return 302 /remote.php/webdav/$is_args$args;
        }
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # Make a regex exception for `/.well-known` so that clients can still
    # access it despite the existence of the regex rule
    # `location ~ /(\.|autotest|...)` which would otherwise handle requests
    # for `/.well-known`.
    location ^~ /.well-known {
        # The rules in this block are an adaptation of the rules
        # in `.htaccess` that concern `/.well-known`.

        location = /.well-known/carddav { return 301 /remote.php/dav/; }
        location = /.well-known/caldav  { return 301 /remote.php/dav/; }

        location /.well-known/acme-challenge    { try_files $uri $uri/ =404; }
        location /.well-known/pki-validation    { try_files $uri $uri/ =404; }

        # Let Nextcloud's API for `/.well-known` URIs handle all other
        # requests by passing them to the front-end controller.
        return 301 /index.php$request_uri;
    }

    # Rules borrowed from `.htaccess` to hide certain paths from clients
    location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  { return 404; }
    location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console)                { return 404; }

    # Ensure this block, which passes PHP files to the PHP process, is above the blocks
    # which handle static assets (as seen below). If this block is not declared first,
    # then Nginx will encounter an infinite rewriting loop when it prepends `/index.php`
    # to the URI, resulting in a HTTP 500 error response.
    location ~ \.php(?:$|/) {
        # Required for legacy support
        rewrite ^/(?!index|remote|public|cron|core\/ajax\/update|status|ocs\/v[12]|updater\/.+|oc[ms]-provider\/.+|.+\/richdocumentscode\/proxy) /index.php$request_uri;

        fastcgi_split_path_info ^(.+?\.php)(/.*)$;
        set $path_info $fastcgi_path_info;

        try_files $fastcgi_script_name =404;

        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/html/$fastcgi_script_name;
        fastcgi_param PATH_INFO $path_info;
        fastcgi_param HTTPS on;

        fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice
        fastcgi_param front_controller_active true;     # Enable pretty urls
        fastcgi_pass nextcloud;

        fastcgi_intercept_errors on;
        fastcgi_request_buffering off;

        fastcgi_max_temp_file_size 0;
        fastcgi_read_timeout 600;
    }

    location ~ \.(?:css|js|svg|gif|png|jpg|ico|wasm|tflite|map)$ {
        try_files $uri /index.php$request_uri;
        expires 6M;         # Cache-Control policy borrowed from `.htaccess`
        access_log off;     # Optional: Don't log access to assets

        location ~ \.wasm$ {
            default_type application/wasm;
        }
    }

    location ~ \.woff2?$ {
        try_files $uri /index.php$request_uri;
        expires 7d;         # Cache-Control policy borrowed from `.htaccess`
        access_log off;     # Optional: Don't log access to assets
    }

    # Rule borrowed from `.htaccess`
    location /remote {
        return 301 /remote.php$request_uri;
    }

    location / {
        try_files $uri $uri/ /index.php$request_uri;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/cloud.wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/cloud.wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

Como puntos a destacar, se ha puesto un límite de cuerpo de 50GB para permitir que se suban archivos de hasta 50G en consonancia con la configuración de `docker-compose.yml`. Además, se ha quitado el límite de velocidad de transferencia.

También se vuelven a especificar todas las cabeceras HTTP a pesar de que las pusimos en el bloque `http` de Nginx, donde está contenido nuestro bloque actual. ¿Por qué? Porque las cabeceras HTTP definidas en un bloque superior solo se heredan al siguiente si en ese no hay ninguna cabecera definida y, en este caso, había que definir sí o sí cabeceras nuevas, así que hay que añadir las que se quieran conservar.

Por último (y este cambio es puñetero), como PHP se está ejecutando dentro de Docker, para PHP los archivos no están en `/var/www/nextcloud`, están en `/var/www/html`, así que hay que cambiarlo en `fastcgi_param SCRIPT_FILENAME` o, de lo contrario, el servidor solo devolverá un mensaje de "File not found". 

¡Ojo! Que no se nos olvide generar el certificado HTTPS para el subdominio `cloud.wupp.dev`. Después, comprobamos que el archivo está bien con `sudo nginx -t` y si lo está, lo recargamos con `sudo nginx -s reload`.

## Configurando Nextcloud

Una vez hecho esto, deberíamos de poder acceder a `cloud.wupp.dev` y nos aparecería la pantalla de configuración inicial de Nexcloud, donde debemos elegir un nombre de usuario y contraseña para la cuenta de administrador. Para la base de datos, elegimos "MySQL/MariaDB" y ponemos el nombre de usuario, contraseña y la base de datos para Nextcloud que pusimos en `docker-compose.yml`. Por último, para la dirección escribimos `db:3306`.

Ya habiendo instalado Nextcloud, podemos navegar por los ajustes y configurarlo, aunque también podemos hacerlo modificando los archivos de configuración como `/var/www/nextcloud/config/config.php`. Por ejemplo, podemos añadir estas líneas al final:

```php
'default_language' => 'es',
'default_locale' => 'es_ES',
'default_phone_region' => 'ES',
'bulkupload.enabled' => false,
```

Concretamente, la última línea ayuda a solucionar un [bug](https://github.com/nextcloud/desktop/issues/5094) que hay actualmente con el cliente de Nextcloud al tener la velocidad de subida ilimitada.

A parte de eso, como Nextcloud funciona con PHP, nos conviene modificar también la configuración de PHP. Y esto puede ser un poco lioso, porque en la imagen de docker que tenemos hay muchos archivos que modifican la configuración de PHP. Además, esos archivos no los podemos modificar directamente porque al reiniciar docker se borran. La solución es crear un nuevo archivo con las opciones que queremos cambiar y copiarlo dentro del contenedor de docker cada vez que se inicie.

Para empezar creamos el archivo `/var/www/nextcloud/manual-php.ini` y ponemos el siguiente contenido:

```ini
; Manual configuration for PHP
max_input_time = -1
max_execution_time = 172800
max_file_uploads = 10000
max_input_nesting_level = 128
max_input_vars = 10000
```

Estos valores se pueden ajustar al gusto de cada uno. Después, solo tendremos que añadir a `docker-compose.yml` la línea `/var/www/nextcloud/manual-php.ini:/usr/local/etc/php/conf.d/manual-php.ini` como volumen de Nextcloud y reiniciar los contenedores de docker.

Finalmente, podemos añadir un poco más de seguridad siguiendo [estas recomendaciones](https://docs.nextcloud.com/server/latest/admin_manual/installation/harden_server.html#setup-fail2ban) del manual de Nextcloud.