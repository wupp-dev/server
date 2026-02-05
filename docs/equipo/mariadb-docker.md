---
title: Base de datos
order: 7
---

# Configurando MariaDB con Docker

::: warning ATENCIÓN
Esta página está desactualizada y pendiente de revisión.
:::

Para empezar a ver cómo funciona el `docker-compose.yaml` y probar docker, vamos a configurar un contenedor de MariaDB, que servirá como base de datos para los diferentes servicios que soporten MySQL.

## Contenido de `docker-compose.yaml`

Aquí está el contenido a añadir al `docker-compose.yaml`:

```yaml
secrets:
  mariadb_root_password:
    external: true
  nextcloud_db_user:
    external: true
  nextcloud_db_password:
    external: true

services:
  db:
    image: mariadb:10.5
    restart: always
    volumes:
      - ./db:/var/lib/mysql
    secrets:
      - mariadb_root_password
      - nextcloud_db_user
      - nextcloud_db_password
    environment:
      - MARIADB_ROOT_PASSWORD_FILE=/run/secrets/mariadb_root_password
      - MARIADB_USER_FILE=/run/secrets/nextcloud_db_user
      - MARIADB_PASSWORD_FILE=/run/secrets/nextcloud_db_password
      - MARIADB_DATABASE=${NEXTCLOUD_DB_NAME:?nextcloud database name required}
```

::: info ¿POR QUÉ APARECE NEXTCLOUD?

La imagen del contenedor Docker de MariaDB nos permite crear una base de datos al iniciar el contenedor por primera vez. En este caso, como uno de los servicios principales del servidor es Nextcloud, hemos configurado aquí el contenedor para que cree la base de datos y el usuario para Nextcloud al iniciarse, y para más bases de datos las crearemos posteriormente antes de iniciar el otro servicio.
:::

## Gestión de secretos: `secrets`

Esta sección del `docker-compose.yaml` nos permite declarar los llamados _secrets_ (o secretos por su traducción al castellano). Estos son cadenas de texto que se crean con `docker secrets` o a través de un archivo, que Docker gestiona de una manera segura y nos sirve para reemplazar las variables de entorno que contengan datos más sensibles como contraseñas. Aunque estos secretos se pueden crear a través de un archivo indicándolo en el propio `docker-compose.yaml`, realizarlo de tal forma requiere tener la contraseña en texto plano en el sistema, por tanto vamos a crear los secretos a través de la terminal.

En el archivo `docker-compose.yaml` tenemos que declarar el nombre de los _secrets_ que vamos a usar en `secrets`. Estos se declaran indicando su nombre como miembro de `secrets`, i.e. añadiendo el nombre indentado debajo de `secrets` como se puede ver anteriormente y, dado que los vamos a crear manualmente con la CLI de Docker, tenemos que indicar `external: true` para cada uno.

Procedamos ahora a crear los diferentes _secrets_ que se necesitan. En los siguientes comandos, sustituye el texto entre `<>` (e.g. `<root_password>`) con lo que desees (que recomendamos que sea generado aleatoriamente) y guárdalo en un sitio seguro y que no vayas a perder:

```bash
$ echo "<root_password>" | docker secret create mariadb_root_password -
$ echo "<nextcloud_password>" | docker secret create nextcloud_db_password -
$ echo "<nextcloud_user>" | docker secret create nextcloud_db_user -
```

::: tip SUGERENCIA

Dado que estas contraseñas permiten acceder a todos los datos de Nextcloud y la de _root_ a **TODOS los datos de TODAS las bases de datos**, te recomendamos que sean bastante seguras, de más de 20 caracteres mínimo. El usuario de la base de datos también es recomendable generarlo aleatoriamente para así proveer más seguridad evitando que si alguien gana acceso a la contraseña pueda acceder
:::

## Variables de entorno

A lo largo del `docker-compose.yaml` vamos a utilizar múltiples variables de entorno para interpolar datos que no resultan tan privados, como el nombre de la base de datos. Las variables de entorno se cargan directamente de un archivo `.env` que se sitúe junto al `docker-compose.yaml`, aunque puede personalizarse para cada servicio usando la opción `env_file`. En nuestro caso, tenemos un [archivo de entorno de ejemplo en el repositorio](https://github.com/ComicIvans/server/blob/main/home/dockeruser/docker-compose.yml). Para proseguir, vamos a descargar este archivo y renombrarlo a `.env`:

```bash
# Sitúate donde tengas el archivo docker-compose, que debería de ser /home/<usuario-docker>
$ curl https://raw.githubusercontent.com/ComicIvans/server/main/home/dockeruser/.env.example -o .env
```

::: danger RECORDATORIO IMPORTANTE

El archivo `.env.example` es de ejemplo y público para cualquiera, así que antes de proseguir edita el archivo con tu editor favorito para que no tenga los mismos valores que el de ejemplo.
:::

En la siguiente sección indicaremos como usar estas variables de entorno en los diferentes servicios.

::: info MÁS INFORMACIÓN

Si te has quedado con la duda de por qué usamos _secrets_ y no variables de entorno, puedes leer más en [este artículo](https://blog.diogomonica.com//2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/) de la antigua coordinadora de seguridad en Docker.
:::

## El contenedor en sí: `services` > `db`

_**WIP**_

## Gestionando MariaDB con Adminer

```yaml
services:
  adminer:
    image: adminer
    restart: always
    ports:
      - 8088:8080
```
