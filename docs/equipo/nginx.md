---
title: Nginx como servidor web
lang: es-ES
---

# Nginx como servidor web

Ya nos hemos encargado de poder acceder al servidor remotamente, pero eso es solo para nosotros, queda la parte más importante, el poder ofrecer algún tipo de servicio *(como puede ser una página web)*.

Para ello, necesitamos un servidor web, que se encargará de gestionar las conexiones entrantes.

## Nginx

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione voluptates veritatis cumque mollitia commodi ullam atque rerum doloremque reiciendis obcaecati, excepturi dolorum illum facere possimus quisquam veniam voluptatum et beatae enim consectetur vero dolore tenetur inventore amet. Aspernatur, nulla tempora adipisci est modi ipsam laudantium. Blanditiis quidem iusto voluptate minima temporibus aperiam excepturi placeat. Quae aliquid molestiae quia autem dolore explicabo impedit necessitatibus fugit commodi placeat aspernatur suscipit atque dolorum itaque ab enim deleniti, libero asperiores tempora voluptatem hic! Consequuntur ullam quam a aliquid delectus tenetur sit earum enim, fugit ut. Laboriosam perferendis iste dolore delectus quisquam dolores quod magni!

## Docker

Para gestionar y ejecutar todos los servicios web, utilizaremos el maravilloso Docker. Este hermoso software te permite (a través de un plugin llamado Docker Compose) ejecutar una serie de mini-vm desde la terminal en base a un archivo de configuración llamado `docker-compose.yml`.

Aquí hay una guía de cómo instalar y configurar todo, pero si te quedas con dudas o quieres ver algo más a fondo, puedes visitar la [documentación oficial de Docker](https://docs.docker.com/).

**Cositas generales**: para seguir esta instalación tienes que ya haber [configurado lo básico del sistema operativo](./sistema-encriptado) (`apt` en realidad) y tener una terminal abierta. A parte, cualquier comando de `apt` se puede sustituir por su correspondiente `apt-get` (o `apt-cache`, pero que no vamos a usar realmente).

### TL;DR

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
$ sudo adduser -m docker
$ sudo groupadd docker
$ sudo usermod -aG docker docker
$ sudo cp ./home/docker/ /home/docker/
```

### Instalación

Gracias a estar en en inmejorable Debian, usaremos el magnífico comando `apt`. Nuestros queridos amigos de docker hace un tiempo cambiaron de los repositorios oficiales de apt a unos propios, y por tanto, **si ya tienes alguna versión de docker instalada** (llamadas `docker`, `docker.io` o `docker-engine`) toca eliminar los antiguos paquetes ejecutando lo siguiente:

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

### Docker Compose

¡Sigamos instalando! La maravilla que Docker Compose es vamos a instalarla como un plugin del Docker que ya hemos instalado. Venga que esta es facilita, ejecuta esto y listo:

```bash
$ sudo apt install docker-compose-plugin
```

De nuevo, si no confías lo suficiente en `apt`, comprueba que todo está bien ejecutando `docker compose version`.

### Usuario para Docker

Para ejecutar el inmejorable Docker vamos a crear un diferente usuario para ejecutar Docker, así mejoramos ligeramente la seguridad. Para que un usuario pueda ejecutar Docker sin tener que hacer `sudo` y ejecutarlo como _root_, hay que añadirlo al grupo _docker_. Desde tú usuario de administración con `sudo` aún instalado, vamos a ello entonces:

```bash
$ sudo adduser -m docker # Creación del usuario y su home en /home/docker
$ sudo groupadd docker # Creación del grupo docker
$ sudo usermod -aG docker docker # Añadir el usuario al grupo (sí, se llaman igual, tú confía)
```

### Archivos para Docker

Antes de cambiar al usuario `docker`, aún con el usuario de administrador copiaremos todos los contenidos de _\<repo_root\>/home/docker_ a la carpeta de _/home/docker_ en nuestro sistema (**importante hacerlo como el usuario administrador, con el usuario `docker` no nos dejará**). Aquí están los archivos de configuración de todos los servicios y el famoso `docker-compose.yml`. Así que, **encontrándonos en la carpeta del clon del repositorio del server**, ejecutamos:

```bash
$ sudo cp ./home/docker/ /home/docker/
```

### El `docker-compose.yml`

Por fin llegamos al famoso archivo. Este archivo incluye toda la configuración de los servicios a ejecutar con Docker y nos permite cómodamente iniciar todos. En la página de cada servicio se puede encontrar un extracto del contenido del `docker-compose.yml` para ese servicio concreto. Veamos la estructura de este archivo:

- **`version`:** algo importar'a intuyo, pero no creo que mucho así que está la 2 por que lo debí de ver por ahí con el primer servicio que puse y ahí se ha quedado.

- **`volumes`:** una forma integrada en docker para guardar archivos sin importar mucho donde se guardan estos, pero de forma que el programa pueda perdurar datos en forma de archivo, lo cual usaremos para caché o archivos que no sean de configuración o podramos requerir frecuentemente.

- **`services`:** esto es lo importante, aquí declaramos todos los contenedores que se han de crear, en donde se especifica la imagen (el contenedor/mini-vm a utilizar), los puertos que se exponen (mapeando `<EQUIPO>:<CONTENEDOR>`), variables de entorno (environment vars para quien sepa), la política de reinicio (será siempre _always_ o _unless-stopped_) y los volúmenes y mapeo de archivos y carpetas correspondientes.

Hay otro par de ajustes para este archivo (por ejemplo `networks`), pero no son relevantes para esta instalación y no se usan en ella, por tanto si quieres más información de estos lee la [documentación oficial de Docker Compose](https://docs.docker.com/compose/)

Lo dicho, según vayamos viendo los diferentes servicios se irán mostrando los extractos del archivo para el correspondiente servicio para que así podáis cómodamente seleccionar que servicios queréis. El archivo también se encuentra ampliamente documentado, por tanto con leer este documento debería de ser suficiente para entenderlo.
