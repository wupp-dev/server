---
order: 3
---

# MinIO - Almacenamiento S3

Minio es un servicio de almacenamiento de alto rendimiento compatible con el sistema de almacenamiento [S3](https://en.wikipedia.org/wiki/Amazon_S3). Está pensado para gestionar el almacenamiento de todos los demás servicios y así hacer más fácil su escalabilidad, pero todo eso es para cuando estamos hablando de muchos servicios en muchos ordenadores. ¿Entonces para qué necesitamos Minio en nuestro caso? Pues concretamente para el almacenamiento de copias de seguridad de Minecraft. Así que el resto de la página irá dedicada a configurar Minio para almacenar las copias de seguridad de Minecraft.

## Configuración de Docker

La configuración de Docker para Minio es relativamente sencilla, en el `docker-compose.yml` escribimos lo siguiente:

```yml
version: "3"

services:
  minio:
    image: minio/minio
    container_name: minio
    restart: always
    env_file: minio.env
    ports:
      - "9000:9000" # API
      - "9001:9001" # Console
    volumes:
      - /var/minio:/data
    command: minio server --address ':9000' --console-address ':9001' /data
```

Y creamos el archivo `minio.env` con el contenido:

```dotenv
MINIO_ROOT_USER=minio123
MINIO_ROOT_PASSWORD=minio456
```

Tras iniciar el contenedor con `docker compose up -d` la consola web será accesible a través de `127.0.0.1:9001`, pero si estamos conectados por SSH, tendremos que volver a conectarnos añadiendo los argumentos `-L 9000:127.0.0.1:9000 -L 9001:127.0.0.1:9001` para poder conectarnos poniendo esa dirección en el navegador. Otra opción es hacer el servicio accesible a través de la web.

## Nginx y subdominio

Como estamos usando el ordenador para Minecraft y nos planteamos usar Minio también en el otro ordenador, creamos los subdominios `mcminio.wupp.dev` y `web.mcminio.wupp.dev` para la API y la consola web respectivamente (no funcionará si intentamos usar el mismo subdominio para ambos) y configuramos Nginx en ambos servidores. Empezamos con esta configuración temporal en el servidor principal:

::: code-group

```nginx [mcminio.wupp.dev.conf]
  server {
    server_name mcminio.wupp.dev;

    root /var/www/html;
    index landing.html;

    location / {
        try_files $uri /landing.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }
```

```nginx [web.mcminio.wupp.dev.conf]
  server {
    server_name web.mcminio.wupp.dev;

    root /var/www/html;
    index landing.html;

    location / {
        try_files $uri /landing.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }
```
:::

Generamos los certificados con cerbot `sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d mcminio.wupp.dev` y `sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d web.mcminio.wupp.dev` y este se encargará de actualizar la configuración del archivo.

Ahora tenemos que que poner la configuración final en los dos archivos y en los dos servidores. Para el servidor principal:

::: code-group

```nginx [mcminio.wupp.dev.conf]
  server {
    server_name mcminio.wupp.dev;

    # Allow special characters in headers
    ignore_invalid_headers off;
    # Allow any size file to be uploaded.
    # Set to a value such as 1000m; to restrict file size to a specific value
    client_max_body_size 0;
    # Disable buffering
    proxy_buffering off;
    proxy_request_buffering off;

    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    location / {
        proxy_pass https://192.168.1.144;
        proxy_ssl_session_reuse on;
        proxy_ssl_verify off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        chunked_transfer_encoding off;
  proxy_connect_timeout 300;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/mcminio.wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/mcminio.wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }
```

```nginx [web.mcminio.wupp.dev.conf]
  server {
    server_name web.mcminio.wupp.dev;

    # Allow special characters in headers
    ignore_invalid_headers off;
    # Allow any size file to be uploaded.
    # Set to a value such as 1000m; to restrict file size to a specific value
    client_max_body_size 0;
    # Disable buffering
    proxy_buffering off;
    proxy_request_buffering off;

    add_header X-Permitted-Cross-Domain-Policies "none" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    location / {
        proxy_pass https://192.168.1.144;
        proxy_ssl_session_reuse on;
        proxy_ssl_verify off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
  proxy_connect_timeout 300;	
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/web.mcminio.wupp.dev/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/web.mcminio.wupp.dev/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }
```
:::

Y en el servidor secundario podemos usar únicamente un archivo `/etc/nginx/conf.d/mcminio.wupp.dev.conf`:

```nginx
upstream minio_s3 {
   server 127.0.0.1:9000;
}

upstream minio_console {
   server 127.0.0.1:9001;
}

server {
   listen 443 ssl;
   server_name mcminio.wupp.dev;
   ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
   ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_pass http://minio_s3; # This uses the upstream directive definition to load balance
   }
}

server {
   listen 443 ssl;
   server_name web.mcminio.wupp.dev;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-NginX-Proxy true;

      # This is necessary to pass the correct IP to be hashed
      real_ip_header X-Real-IP;

      proxy_connect_timeout 300;

      # To support websocket
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      chunked_transfer_encoding off;

      proxy_pass http://minio_console/; # This uses the upstream directive definition to load balance
   }
}
```

Tendremos también que modificar `minio.env` para añadir las siguientes lineas:

```dotenv
MINIO_SERVER_URL: "https://mcminio.wupp.dev"
MINIO_BROWSER_REDIRECT_URL: "https://web.mcminio.wupp.dev/"
```

## Configuración de Minio

Conectándonos a la consola web, ya sea por https://web.mcminio.wupp.dev o por la redirección de puertos de SSH nos aparecerá una pantalla de inicio de sesión donde introducir el usuario y la contraseña que pusimos en `minio.env`. Una vez hecho eso podremos pasar a configurar el propio Minio.

Empezamos creando una política, que definirá los permisos que le daremos al usuario para las copias de seguridad de AMP. Como nombre la política escribimos `Minecraft` y cambiamos el texto de la política por:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::amp-*",
                "arn:aws:s3:::amp-*/**"
            ]
        }
    ]
}
```

Que dará permisos de edición a todos los *buckets* que empiecen por *amp-*. Ahora creamos el usuario `ampuser` con la contraseña que queramos y le asignamos la política creada.

A partir de aquí, iremos creando *buckets* (con la configuración por defecto) cuyo nombre empiece por *amp-* como `amp-ads` o `amp-proxy` para los distintos servidores de Minecraft.

Cuando hayamos creado los buckets, vamos al apartado de usuarios, a `ampuser` y en *Service Accounts* creamos una clave de acceso y la guardamos, ya que será, junto con la clave secreta, las que usaremos para configurar las copias de seguridad dentro de AMP.