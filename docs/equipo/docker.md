---
title: Docker
lang: es-ES
---

# Docker

Para gestionar y ejecutar todos los servicios web, utilizaremos el maravilloso Docker. Este hermoso software te permite (a través de un plugin llamado Docker Compose) ejecutar una serie de mini máquinas virtuales desde la terminal en base a un archivo de configuración llamado `docker-compose.yml`.

Aquí hay una guía de cómo instalar y configurar todo, pero si te quedas con dudas o quieres ver algo más a fondo, puedes visitar la [documentación oficial de Docker](https://docs.docker.com/).

**Cositas generales**: para seguir esta instalación tienes que ya haber [configurado lo básico del sistema operativo](./sistema-encriptado) (`apt` en realidad) y tener una terminal abierta. A parte, cualquier comando de `apt` se puede sustituir por su correspondiente `apt-get` (o `apt-cache`, pero que no vamos a usar realmente).

## TL;DR

Si vas con prisa o te da pereza leer, aunque no lo recomiendo para nada, copia y pega lo siguiente en tu terminal, dale a intro y que se haga la magia:

```bash
$ sudo apt remove docker docker-engine docker.io containerd runc
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
$ sudo adduser dockeruser
$ sudo usermod -aG docker dockeruser
```

## Instalación

Gracias a estar en el inmejorable Debian, usaremos el magnífico comando `apt`. Nuestros queridos amigos de docker hace un tiempo cambiaron de los repositorios oficiales de apt a unos propios, y por tanto, **si ya tienes alguna versión de docker instalada** (llamadas `docker`, `docker.io` o `docker-engine`) toca eliminar los antiguos paquetes ejecutando lo siguiente:

```bash
$ sudo apt remove docker docker-engine docker.io containerd runc
```

Antes de empezar con la instalación de Docker, hay unos pequeños requerimientos que instalar de apt: `ca-certificates`, `curl`, `gnupg`, `lsb-release`. Así que **asegúrate de tener esto instalado para seguir**.

Ahora que tenemos esto instalado, vamos a descargar la clave GPG oficial de Docker y configurar el repositorio de APT. Ejecuta los siguientes comandos:

```bash
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Y ahora sin más dilación instalemos docker:

```bash
$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io
```

Todo debería de estar bien, pero si eres muy tiquismiqui puedes probar a ejecutar `sudo docker run hello-world` o mirar la documentación si algo va mal. No debería de haber ningún problema con la compatibilidad de versiones, por lo menos por ahora, pero si llegase a haberlo pues ª.

## Docker Compose

¡Sigamos instalando! La maravilla de Docker Compose es qur vamos a instalarla como un plugin del Docker que ya hemos instalado. Venga que esta es facilita, ejecuta esto y listo:

```bash
$ sudo apt install docker-compose-plugin
```

De nuevo, si no confías lo suficiente en `apt`, comprueba que todo está bien ejecutando `docker compose version`.

## Usuario para Docker

::: tip RELATO

Cuando estaba en esto, que parecía muy simple, Debian decidió que se iba a poner en mi contra y no funcionar, así que tenéis la historia de como colapsé en [un relato](../relatos/usuario-docker) (si veis que la guía y los comandos han cambiado, es por lo ocurrido en ese relato).
:::

Vamos a crear un usuario diferente para ejecutar Docker, así mejoramos ligeramente la seguridad. Para que un usuario pueda ejecutar Docker sin tener que hacer `sudo` y ejecutarlo como _root_, hay que añadirlo al grupo _docker_. Desde tu usuario de administración con `sudo` aún instalado, vamos a ello entonces:

```bash
$ sudo adduser dockeruser # Creación del usuario y su home en /home/dockeruser
$ sudo passwd dockeruser # Tenemos que asignarle una contraseña (recomendación: que sea larga)
$ sudo usermod -aG docker dockeruser # Añadir el usuario al grupo
```

## Archivos para Docker

Antes de cambiar al usuario `dockeruser`, aún con el usuario de administrador, vamos a crear el archivo `/home/dockeruser/docker-compose.yml` con el siguiente contenido:

```yml
version: '3'

services:
  db:
    image: mariadb
    container_name: db
    restart: always
    command: --transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW
    environment:
      - MARIADB_USER=nextcloud
      - MARIADB_PASSWORD=pwd
      - MARIADB_DATABASE=nextcloud
    volumes:
      - ./db:/var/lib/mysql

  nextcloud:
    image: nextcloud:fpm
    container_name: nextcloud
    restart: always
    ports:
      - 9000:9000
    depends_on:
      - db
    volumes:
      - /var/www/nextcloud:/var/www/html
    environment:
      - MYSQL_HOST=db
      - NEXTCLOUD_TRUSTED_DOMAINS=cloud.wupp.dev
      - PHP_MEMORY_LIMIT=50G
      - PHP_UPLOAD_LIMIT=50G
```

Que es todo lo necesario para poner a funcionar el primero de los servicios, Nextcloud. ya lo veremos más adelante.

## El `docker-compose.yml`

Por fin llegamos al famoso archivo. Este archivo incluye toda la configuración de los servicios a ejecutar con Docker y nos permite cómodamente iniciar todos. En la página de cada servicio se puede encontrar un extracto del contenido del `docker-compose.yml` para ese servicio concreto. Veamos la estructura del archivo:

- **`version`:** algo importará intuyo, pero no creo que mucho así que está la 2 por que lo debí de ver por ahí con el primer servicio que puse y ahí se ha quedado. **Actualización:** Ahora Iván lo ha cambiado a la 3 por el mismo motivo.

- **`services`:** esto es lo importante, aquí declaramos todos los contenedores que se han de crear, en donde se especifica la imagen (el contenedor/mini-vm a utilizar), el nombre, la política de reinicio (será siempre _always_ o _unless-stopped_), un comando que ejecutar al iniciarse, los volúmenes para hacer los datos persistentes y los puertos que se exponen (mapeando `<EQUIPO>:<CONTENEDOR>`). Y esto son solo algunas de las cosas que se pueden especificar.

Te recomiendo que leas la [documentación oficial de Docker Compose](https://docs.docker.com/compose/) para saber cómo funciona exactamente el archivo.

Lo dicho, según vayamos viendo los diferentes servicios se irán mostrando los extractos del archivo para el correspondiente servicio para que así podáis cómodamente seleccionar que servicios queréis.