---
title: Nginx como servidor web
lang: es-ES
---

# Nginx como servidor web

Ya nos hemos encargado de poder acceder al servidor remotamente, pero eso es solo para nosotros, queda la parte más importante, el poder ofrecer algún tipo de servicio *(como puede ser una página web)*.

Para ello, necesitamos un servidor web, que se encargará de gestionar las conexiones entrantes.

## Instalación y puesta en marcha

Para asegurarnos de tener la última versión siempre instalada, utilizaremos los repositorios de Nginx en vez de los del sistema operativo. Para añadirlos, podemos seguir los pasos de [su web](https://nginx.org/en/linux_packages.html#Debian), que para Debian son:

```
$ sudo apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
$ curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
$ gpg --dry-run --quiet --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
```

Con este último comando verificamos que la clave es la correcta, debería mostrarse lo siguiente:
```
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
uid                      nginx signing key <signing-key@nginx.com>
```

Nosotros hemos escogido usar los paquetes **mainline** en vez de los **stable**, la diferencia es que los primeros contienen las últimas novedades aunque pueden ser menos estables por tener características experimentales. Para añadir el repositorio mainline, utilizamos el siguiente comando:

```
$ echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/debian `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

```

Y ya ha llegado el momento de instalar Nginx:

```
$ sudo apt update
$ sudo apt install nginx
```

Una vez instalado, podemos iniciarlo y verificar que está funcionando correctamente:

```
$ sudo systemctl start nginx
$ sudo systemctl status nginx
```

Sin embargo, queda un último paso, permitir los puertos `80` y `443` tanto en el rotuer como en el firewall, para el firewall escribimos:

```
$ sudo ufw allow 80
$ sudo ufw allow 443
```

Estos son los puertos de HTTP y HTTPS respectivamente.

Vamos a hacer retocar un poco la configuración para las partes venideras de la guía. La configuración de Nginx se estructura en bloques. Concretamente la parte que tocaremos son los bloques `server`, que serán la configuración de cada uno de nuestros subdominios. Estos archvios de configuración se guardan en `/etc/nginx/conf.d/` y, por defecto, solo habrá un archivo llamado `default.conf`, vamos a cambiarle el nombre a `wupp.dev`, ya que tendrá el bloque encargado de gestionar las conexiones con esa URL.
```
$ mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/wupp.dev.conf
```

Editamos el archivo y buscamos una línea que empiece por `server_name`:
```
server_name wupp.dev www.wupp.dev;
```

Ahora verificamos que el archivo modificado verifique la sintáxis y reiniciamos el servicio de Nginx:
```
$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
$ sudo systemctl reload nginx
```

## Habilitando *(y forzando)* HTTPS

Ahora mismo podemos poner en el navegador [wupp.dev](http://wupp.dev/), pero la conexión no es segura :(

Eso es inadmisible, así que vamos a forzar a que todas las conexiones HTTP se redirijan a HTTPS. Hemos seguido [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04-es).

Vamos a utilizar Certbot, un software para gestionar los certificados de Let's Encrypt, que son [certificados de autoridad](https://es.wikipedia.org/wiki/Autoridad_de_certificaci%C3%B3n) gratuitos.
```
$ sudo apt install certbot python3-certbot-nginx
```

Generamos el certificado para nuestro dominio:
```
$ sudo certbot --nginx -d wupp.dev -d www.wupp.dev
```

Y ya está, certbot se encarga de modificar la configuración del archivo `/etc/nginx/conf.d/wupp.dev.conf` para forzar el uso de HTTPS y para renovar automáticamente los certificados cuando vayan a expirar.

## Otras mejoras de seguridad

--- POR HACER ---