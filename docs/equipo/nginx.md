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
$ sudo certbot --nginx -d wupp.dev -d www.wupp.dev
```

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
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_session_tickets off;
    ssl_prefer_server_ciphers off;
    
    # Enable HSTS with a 1 year duration
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```
¿Qué hace cada cambio?
- `add_header Allow "GET, POST, OPTIONS";`: Indica los métodos HTTP que están permitidos, lo que restringe la capacidad de un atacante para realizar solicitudes no autorizadas o peligrosas en el servidor web.
- `add_header X-Permitted-Cross-Domain-Policies "none" always;`: Impide que se compartan recursos con otros dominios. Esto es importante porque evita que un atacante pueda acceder a recursos del sitio web desde otro dominio.
- `add_header X-Content-Type-Options nosniff;`: Añade una cabecera HTTP para evitar que los navegadores intenten interpretar archivos con un tipo MIME incorrecto. De esta forma, se evita que un atacante pueda enviar un archivo malicioso disfrazado como un archivo seguro.
- `add_header X-Frame-Options SAMEORIGIN;`: Añade una cabecera HTTP para evitar ataques de "Clickjacking", que consisten en engañar al usuario para que haga clic en algo que no quiere haciendo uso de iframes. Al especificar "SAMEORIGIN", se permite que la página sólo sea enmarcada por otras páginas que se carguen desde el mismo origen.
- `add_header X-XSS-Protection "1; mode=block";`: Añade una cabecera HTTP para habilitar la protección contra ataques XSS (Cross-Site Scripting) en los navegadores que soportan esta cabecera. Al habilitar esta protección, se evita que un atacante pueda inyectar código malicioso en una página web.
- `add_header Referrer-Policy "strict-origin-when-cross-origin";`: Indica que se debe enviar información del referente solo para solicitudes desde el mismo origen y solicitudes de sitios de terceros que compartan el mismo origen. Esto ayuda a proteger la privacidad del usuario limitando la información que se comparte con sitios externos.
- `add_header Content-Security-Policy "default-src 'self';";`: Especifica que solo se permiten recursos desde el mismo origen que el sitio web Esto reduce el riesgo de ataques XSS (cross-site scripting). Esto tendremos que cambiarlo en el momento en el que usemos recursos de otras páginas como pueden ser fuentes de Google Fonts.
- `add_header Content-Security-Policy-Report-Only "default-src 'self';";`: La diferencia de esta con la anterior es que no bloquea los recursos, sino que reporta las violaciones de la política. En este caso no tiene utilidad, porque es más restrictiva la política anterior, pero igualmente la vamos a poner.
- `add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";`: Especifica las políticas de permisos para los dispositivos y sensores utilizados por el sitio web.
- El resto de `fastcgi_hide_header ...` ocultan qué software o tecnología se utiliza para ejecutar el servidor web, que puede ser utilizado por atacantes para encontrar vulnerabilidades en el servidor.
- `client_max_body_size 10m;`: Establece un límite de tamaño de solicitud máximo. Esto limita el tamaño de los datos que un usuario puede enviar en una sola solicitud para evitar ataques DDoS o intentos de cargar archivos muy grandes. Tendremos que cambiarlo dentro del bloque `server` para poder usar Nextcloud cómodamente.
- `limit_rate 8m;`: Evita que se descarguen una cantidad masiva de datos. También tendremos que modificarlo para Nextcloud.
- `server_tokens off;`: Desactiva la información de versión del servidor que se envía en las cabeceras HTTP. De esta forma, se oculta información sensible y se evita que los atacantes puedan aprovechar vulnerabilidades específicas de una versión determinada del servidor.
- `ssl_protocols TLSv1.2 TLSv1.3;`: Especifica que se deben utilizar los protocolos TLSv1.2 y TLSv1.3, que son versiones seguras y recomendadas de los protocolos SSL/TLS.
- `ssl_session_cache shared:le_nginx_SSL:10m`: Se pueden reutilizar las sesiones SSL que se han establecido previamente en una caché compartida llamada "le_nginx_SSL" con un tamaño de 10 megabytes. Esto puede reducir la carga en el servidor.
- `ssl_session_timeout 1440m;`: Indica que las sesiones SSL se mantienen en caché durante 1440 minutos. Después de ese tiempo, las sesiones SSL caducan y se eliminan de la caché.
- `ssl_session_tickets off;`: Los tickets son una forma de guardar las sesiones SSL para más tarde, pero es algo inseguro por naturaleza, así que se recomienda desactivarlo.
- `ssl_prefer_server_ciphers off;`: Esta opción es la recomendada si estamos limitando los protocolos a los más nuevos (TLSv1.2 y TLSv1.3), porque no tienen cifrados inseguros, así que se le permite escoger al cliente el que prefiera.
- `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";`: Instruye a los navegadores a acceder al sitio web solo a través de conexiones seguras (HTTPS) durante un año completo. La opción "includeSubDomains" extiende esta directiva a todos los subdominios y "preload" indica que el sitio web desea ser incluido en la lista HSTS pre-cargada de los navegadores, lo que acelera el proceso de carga de HTTPS en visitas posteriores.
- `sendfile on;`: Esta opción habilita el envío de archivos estáticos directamente desde el disco a través del sistema de archivos del kernel, lo que puede mejorar significativamente el rendimiento de la entrega de archivos estáticos.
- `tcp_nopush on;`: Esta opción habilita el modo TCP_NOPUSH que evita que los paquetes de datos pequeños se envíen de manera fragmentada y que los paquetes más grandes se envíen en bloques más grandes, lo que reduce la sobrecarga de envío.
- `tcp_nodelay on;`: Esta opción habilita el modo TCP_NODELAY que deshabilita la espera antes de enviar paquetes pequeños, lo que puede reducir la latencia en conexiones de red.
- `keepalive_timeout 65;`: Esta opción establece el tiempo máximo de espera para mantener una conexión TCP persistente con el cliente en segundos, lo que permite una reutilización más eficiente de las conexiones existentes y reduce la sobrecarga de establecimiento de conexiones en las solicitudes consecutivas.

::: danger PELIGRO
Debes tener mucho cuidado al añadir `preload` a la cabecera de Strict-Transport-Security. Esto es algo que puede provocar grandes dolores de cabeza si no se conocen bien sus consecuencias. Para más información puedes consultar [esta página](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts).
:::

¿Cómo hemos decidido poner estas opciones? Pues siendo sinceros, entre preguntarle a [ChatGPT](https://chat.openai.com) (que también ha hecho la explicación de qué hace cada cosa) y revisar [esta página](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

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

Aunque ya hemos acabado de configurar Nginx, hay que tener en cuenta de que por ahora lo único que hace es servir archivos estáticos localizados en `/usr/share/nginx/html/`.

En un principio, nos dedicaremos a añadir servicios en subdominios, dejando `www` intacto, así que puede dejarse como una página web estática, retocando un poco su apariencia o puede configurarse como uno de los servicios, eso ya queda a elección de cada uno.