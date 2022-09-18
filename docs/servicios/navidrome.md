---
title: Navidrome
lang: es-ES
---

# Navidrome - Streaming de música

[Navidrome](https://navidrome.org) es un servicio basado en [Subsonic](http://www.subsonic.org/pages/index.jsp) que nos permite crear un servicio de streaming de música como Spotify o YouTube Music. De por sí, Subsonic es una plataforma diseñada para el streaming de tanto contenido de vídeo como de audio, pero Navidrome está diseñada específicamente para solo audio, dando mejor soporte para este pero manteniendo la compatibilidad con otros servicios que utilizan la [API de Subsonic](http://www.subsonic.org/pages/api.jsp).

::: details ¿Qué es una API? ¿Y para que me sirve que Navidrome use la de Subsonic?

Una API (Application Programming Interface) es un estándar de comunicación con un programa, es decir, una serie de reglas y formas que hace públicas un servicio para poder interactuar con él programáticamente desde otro. En este caso, Subsonic define una API para interactuar con los servidores de música que la implementen.

Que Navidrome implemente esta API estándar de Subsonic permite utilizar todas las aplicaciones y servicios compatibles con la API de Subsonic con nuestra instancia de Navidrome. La principal utilidad de esto es poder escuchar nuestra música desde una app nativa en nuestros dispositivos (como se explica [más adelante](#clientes-para-tus-dispositivos))
:::

## El `docker-compose.yaml`

Esto es el contenido a añadir al `docker-compose.yaml` para habilitar Navidrome:

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    user: ${NAVIDROME_UID}:${NAVIDROME_GID}
    restart: unless-stopped
    volumes:
      - ./navidrome-music:/music:ro
      - ./navidrome-data:/data:rw
    ports:
      - "4533:4533"
    environment:
      - ND_LOGLEVEL=info
      - ND_CONFIGFILE=/data/navidrome.toml
```

<!--@include: ../shared/servicios/puertos.md -->

Por comodidad, la mayoría de las opciones de configuración las pondremos en el archivo de configuración `navidrome.toml`, cuya ubicación se indica con la configuración `ND_CONFIGFILE` en referencia al sistema de archivos del contenedor.

Navidrome requiere que identifiques con user al propietario de las carpetas a las que están asociados los volúmenes con la opción `user` (la alternativa es ejecutarlo como _root_, cosa que está [áltamente desaconsejada por los propios autores](https://www.navidrome.org/docs/usage/security/#permissions)).

Este contenedor tiene dos volúmenes disponibles para asociar:

- `/music:ro`: En esta carpeta es donde Navidrome escaneará por archivos de música, así que aquí es donde tendrás que subir toda tu música etiquetada apropiadamente (más info de cómo etiquetarla [más adelante](#descargando-etiquetando-y-subiendo-música)). Dado que Navidrome solo necesita escanear tu música, no necesita modificarla para nada, y por tanto podemos (y debemos) marcar el volumen como _read-only_ añadiendo el `:ro` al final.

- `/data:rw`: aquí es donde Navidrome almacena toda su base de datos y el resto de datos que pueda necesitar, y en nuestro caso también el archivo de configuración `navidrome.toml`.Dado que Navidrome solo necesita modificar todos los archivos de esta carpeta, le añadimos `:rw` a este volumen al final para indicar que tiene permisos de _read-write_

## Variables de entorno

Esto es el contenido a añadir al `.env` para pasar a docker:

```
NAVIDROME_UID=1000
NAVIDROME_GID=1000
```

Aquí tenemos que cambiar `NAVIDROME_UID` y `NAVIDROME_GID` por el ID de usuario y el ID del grupo, respectivamente, al que pertenezcan las carpetas en nuestro sistema que hayamos asociado a los volúmenes. Para hacerlo más fácil y simple, recomendamos poner el usuario que usamos para docker (nuestro `dockeruser`) como propietario de los archivos, tanto como propietario individual como de grupo. Suponiendo que ya hayas creado las carpetas que has asociado a los volúmenes, puedes ejecutar los siguientes comandos para ajustar los permisos (cambiando `dockeruser` por el nombre de usuario que hayas decidido para usar docker):

```sh
# Carpeta para el volumen /music
$ sudo chown dockeruser /path/to/your/navidrome-music
$ sudo chgrp dockeruser /path/to/your/navidrome-music
# Carpeta para el volumen /data
$ sudo chown dockeruser /path/to/your/navidrome-data
$ sudo chgrp dockeruser /path/to/your/navidrome-data
```

Y ahora, para saber que ID de usuario y grupo tiene nuestro `dockeruser` y tenemos que poner en el `.env`, ejecutamos lo siguiente:

```sh
$ id dockeruser
```

## Configuración de Nginx

<!-- TODO Divide this in 2 subsections, without authentik SSO and with -->

La configuración de Nginx para Navidrome es la standard de reverse-proxy que usamos en otros servicios. Copia y pega el contenido en el archivo `/etc/nginx/conf.d/music.server.net.conf` (donde `server.net` es tu dominio y `music` el subdominio, que puedes cambiar a tu gusto):

```nginx
server {
    server_name music.server.net;

    location / {
        proxy_pass http://127.0.0.1:31401;
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $remote_addr;
        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection $http_connection;
    }
}
```

Y ahora ejecutamos _certbot_ para crear y configurar el dominio con HTTPS:

```sh
$ certbot --nginx -d music.server.net
```

<!--@include: ../shared/servicios/recordatorios-nginx.md-->

## Integración con Authentik

TODO

## Descargando, etiquetando y subiendo música

Para poder escuchar música a través de Navidrome, tenemos que proporcionársela nosotros mismos en forma de archivos de audio. Aquí se muestra una posible forma de realizar este proceso, aunque lo puedes hacer de una infinidad de formas. Al fin y al cabo se trata de que los archivos de audio de la música que quieras acaben el el volumen de música de Navidrome que hemos asignado previamente.

Antes de comenzar, crea una carpeta en tu ordenador para descargar la música y sincronizarla (si vas a seguir estos pasos, si prefieres hacerlo de otra forma eres libre de ello)

### Descarga

Para descargar la música, en un principio tenía pensado utilizar el conocido [youtube-dl](https://github.com/ytdl-org/youtube-dl), pero posteriormente cambié a utilizar un fork de este, llamado [yt-dlp](https://github.com/yt-dlp/yt-dlp). El funcionamiento es prácticamente igual (a efectos de nuestros comandos, igual). En mi caso, he descargado álbum por álbum desde YouTube Music, así que usé la funcionalidad de descargar playlists. El comando que he usado para descargar las playlists es el siguiente:

```sh
# Sustituye $url por la URL a la playlist/album a descargar
$ yt-dlp --extract-audio --audio -format m4a --output "%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" $url
```

Este comando hace básicamente lo siguiente: descarga y extrae el audio de todos los items de la playlist y los guarda en formato _m4a_.

::: warning IMPORTANTE COMPROBACIÓN

El formato de archivo _m4a_ proporciona en general mejor calidad que el _mp3_, pero Navidrome no soporta todos los encodings posibles de este archivo. Asegúrate de que los archivos que hemos descargado tengan codificación/encoding **AAC**, que lo puedes comprobar con el siguiente comando:

```sh
$ ffmpeg -i playlist_title/audio_file.m4a
```

Deberías de poder ver una línea que te indique que el archivo contiene un stream de audio con codificación AAC, parecido a esto:

```
Stream #0:0(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 207 kb/s (default)
```

:::

Para automatizar el proceso, puedes copiar y pegar este código en un archivo ejecutable por bash:

```sh
for url in $@; do
  echo -e "\x1b[1;34m**************************************************\n* STARTING" $url "\n**************************************************\x1b[0m"
  yt-dlp --extract-audio --audio-format m4a --output "%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" $url
  echo -e "\x1b[1;32m**************************************************\n* DOWNLOADED" $url "\n**************************************************\x1b[0m"
done
```

Este script te permite básicamente pasar varias URLs de playlists como parámetros, tal que así:

```sh
$ ./download_script.sh https://url.to/playlist1 https://url.to/playlist2 https://url.to/playlist3
```

### Etiquetado

Para etiquetar la música utilizaremos [MusicBrainz's Picard](https://picard.musicbrainz.org/). Al principio puede que resulte un poco confusa la interfaz y cómo trabajar con ella, pero en cuanto te acostumbras es una gozada. La ventaja de esta aplicación es que se conecta a la [base de datos de MusicBrainz](https://musicbrainz.org/doc/MusicBrainz_Database), la cual contiene una infinidad de registros de álbumes, artistas y canciones, con un montón de etiqueta y datos de ellos. De hecho, los propios creadores de Navidrome [recomiendan este editor](https://www.navidrome.org/docs/faq/#how-can-i-edit-my-music-metadata-id3-tags-how-can-i-renamemove-my-files).

Para etiquetar un album, lo primero que hacemos es darle a _Add Folder_ en Picard y seleccionamos la carpeta de ese album, lo que hará que aparezcan en el panel de la izquierda, bajo _Unclustered files_, todos los archivos de audio que hubiese en ese album. Ahora los seleccionamos y le damos a _Cluster_, lo que los agrupará bajo una "carpeta virtual" en _Clustered files_. Primero vamos a probar suerte, le damos a _Lookup_ seleccionando esta "carpeta virtual" que se a creado, y Picard debería de dar con el album correcto. Si no da con el album correcto (sale uno que no es o no sale ninguno), le podemos dar a _Lookup in Browser_, que abrirá en nuestro navegador una página de búsqueda para la base de datos de MusicBrainz. Cuando hayamos encontrado el album que buscamos, le damos a el botón/ilustración de tagger a la derecha del todo, y volvemos a Picard. Desde aquí arrastramos la "carpeta virtual" hasta el album a la derecha, ajustamos lo que queramos cambiar (**importante revisar la etiqueta _length_, que cambia muchas veces**) y le damos a _Save_ teniendo seleccionado el album, y a _Remove_ para quitarlo de Picard.

Si no te ha quedado claro (tampoco espero que sea el mejor tutorial del mundo sinceramente), la documentación de Navidrome sugiere [este tutorial](https://www.thedreaming.org/2020/11/22/musicbrainz-picard/), y si sigue sin quedarte claro, internet es tu amigo.

### Subida

Para subir la música hemos utilizado [Syncthing](https://syncthing.net/), un software de sincronización de archivos. Este software te permite sincronizar carpetas entre múltiples dispositivos. Para instalarlo, utiliza el método que prefieras de entre los que se encuentran en la [documentación](https://syncthing.net/downloads/). Tras haberlo instalado, vamos a configurarlo.

El primer paso es ejecutarlo en nuestro ordenador en el que hemos estado descargando la música a la vez que en el servidor remoto (desde una sesión de SSH), simplemente ejcutándolo desde la terminal como sigue (o de otra forma si vuestra instalación lo requiere):

```sh
# Run this both on your local and remote machine
$ syncthing
```

Para poder configurar Syncthing en el servidor remoto, tenemos que acceder a la interfaz web, lo cual haremos con el uso de las capacidades de port-forwarding de SSH con el siguiente comando (en vuestra máquina local):

```sh
$ ssh -L 8385:127.0.0.1:8384 -N admin@server.net -p 29945
```

Hecho esto, debes de entrar a ambas interfaces, y tras emparejarlas, tienes que configurar una carpeta a compartir en cada una. En tu ordenador, configúrala para solo enviar, mientras que en tu servidor debes de configurarla para solo recibir. De esta forma, mientras tengas `syncthing` ejecutándose en ambos, se enviarán los todos los archivos de tu ordenador al servidor.

## Integraciones externas

## Clientes para tus dispositivos

Estas son recomendaciones personales de clientes, que he encontrado con una interfaz fácil de usar y bonita, a parte de con todas las funcionalidades que puedes esperar. Hay una cantidad prácticamente infinita de ellos, especialmente en Android, en iOS todo el desarrollo se ve más capado por los altos costes de distribución; si no te gusta alguno de estos, busca algo que te vaya mejor.

::: details Y para tú portátil...

Usa la propia interfaz web

::: details Si realmente lo necesitas...

Internet es tu aliado

:::

### iOS

<AppCard class="margin-top" name="SubStreamer" image="../images/substreamer.png" summary="SubStreamer is a completely free app to use with any subsonic compatible music server (subsonic, airsonic, madsonic, navidrome, ampache etc). Your music when you want it, where you want it, online or offline." :links="[{store: 'app-store', url: 'https://apps.apple.com/us/app/substreamer/id1012991665'}]"></AppCard>

En iOS no hay tanto para elegir como en otras plataformas, debido principalmente al alto coste de desarrollo que tiene la plataforma. Lo mejor que he podido encontrar es `SubStreamer`. No me malinterpretéis, es increíble. Tiene un montón de funcionalidades y la interfaz es bastante cómoda y bonita. Desventaja: es código cerrado, pero no vas a encontrar mucho código abierto en iOS en cualquier caso, así que es lo que hay.

### Android

<AppCard class="margin-top" name="Subtracks" image="../images/subtracks.png" summary="Subtracks is an Android open source music streaming app for Subsonic-compatible servers (Subsonic, Navidrome, Airsonic, and more). It's designed to give you clean and convenient access to your music in the style of modern media players." :links="[{store: 'f-droid', url: 'https://f-droid.org/en/packages/com.subtracks/'}]"></AppCard>

En el campo de Android, hay una amplia cantidad de reproductores de código abierto, que son los que lógicamente deberíamos de instalar si hemos pasado por instalar nuestro propio servicio de streaming musical. Aunque hay reproductores con probablemente mayor velocidad y funcionalidades, personalmente me he decantado por `Subtracks`, que tiene una muy cómoda interfaz (que recuerda un poco a Spotify), lo cual es difícil encontrar, sin perder funcionalidades.

::: warning OJO, VERSIÓN 2.0 EN CAMINO

Ahora mismo igual te pueden faltar un par de cosas en esta app: gestión de la cola, gestión de playlists, reproducir todo de un artista, etc. Esto pronto será solventado, ya que el desarrollador está trabajando en la versión 2.0, pero tarda un poco dado que cambia completamente el lenguaje en la que esta está programada. Si quieres saber más, mira (este issue en el repo)[]

:::

`SubStramer` también está disponible en la Play Store, aunque funciona más lento que en iOS y por alguna razón conserva el estilo iOS. Ahora mismo tiene un mayor set de funcionalidades, y una especialmente chula son las radios y playlists auto-generadas. Por tanto, si realmente es algo que necesitas sí o sí, usa esa app mientras `Subtracks 2.0` se encuentra en desarrollo.
