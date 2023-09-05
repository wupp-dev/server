---
title: Resolución de dominios en initramfs
lang: es-ES
---

# Resolución de dominios en initramfs

De cuando Iván tuvo que enfrentarse a esta tarea sin apenas información en la web.

## Contexto histórico

**6 de septiembre de 2023.** Hasta entonces, el domino `wupp.dev` lo gestionábamos desde [FreeDNS](https://freedns.afraid.org/), pero alcanzamos el límite de 25 subdominios y decidimos gestionarlos desde [Namecheap](https://www.namecheap.com/), que era donde teníamos comprado el dominio. La transición fue bastante sencilla excepto por una cosa, la actualización automática de la IP en el dominio y sus subdominios.

FreeDNS tenía un enlace para actualizar la IP muy cómo que era `freedns.afraid.org/dynamic/update.php?id`, lo que nos permitía hacer un apaño a no poder resolver dominios en `initramfs` con esta tarea de `crontab`:

```
1,6,11,16,21,26,31,36,41,46,51,56 * * * * sleep 46 ; wget --no-check-certificate -O - "https://$(nslookup freedns.afraid.org 1.1.1.1 | awk '/^Address: / { print $2 }')/dynamic/update.php?id" > /tmp/freedns_@_wupp_dev.log 2>&1 &
```

Esto básicamente lo que hacía era sustituir `freedns.afraid.org` por la IP a la que apunta.

El problema al cambiar a Namecheap fue que ese truco dejó de servir, así que hubo que poner a funcionar la resolución de dominos.

## Primeros intentos

Al principio intenté buscar una alternativa más sencilla como especificarle a `wget` directamente los servidores DNS que usar, pero no existe ninguna opción para hacer eso.

Después probé a usar `curl`, para lo que hubo que crear un nuevo archivo `/usr/share/initramfs-tools/hooks/curl`:

```sh
#!/bin/sh -e
PREREQS=""
case $1 in
        prereqs) echo "${PREREQS}"; exit 0;;
esac
. /usr/share/initramfs-tools/hook-functions
copy_exec /usr/bin/curl /bin
```

Y ejecutar:

```sh
sudo chmod +x /usr/share/initramfs-tools/hooks/curl
sudo update-initramfs -u
```

Esto fue porque `curl` sí que tiene una opción para especificar los servidores DNS que utilizar, pero tampoco funcionó.

## El final

Por los foros leí que alguna persona había conseguido hacer funcionar la resolución copiando archivos que faltaban de librerías. También me encontré con la herramienta `strace` que te ayuda a investigar los errores en los comandos.

Añadí `strace` a `initramfs` como añadí `curl`, es decir, con el archivo `/usr/share/initramfs-tools/hooks/strace`:

```sh
#!/bin/sh -e
PREREQS=""
case $1 in
        prereqs) echo "${PREREQS}"; exit 0;;
esac
. /usr/share/initramfs-tools/hook-functions
copy_exec /usr/bin/strace /bin
```

Y ejecutando:

```sh
sudo chmod +x /usr/share/initramfs-tools/hooks/strace
sudo update-initramfs -u
```

Hecho esto me puse a investigar los archivos que buscaba (y no encontraba) `wget` con el comando `strace wget google.com` y esta es la lista de todos los archivos que buscaba:

```
/etc/resolv.conf
/etc/host.conf
/etc/hosts

/lib/x86_64-linux-gnu/tls//x86_64/libnss_dns.so.2
/lib/x86_64-linux-gnu/tls//libnss_dns.so.2
/lib/x86_64-linux-gnu/tls/x86_64/libnss_dns.so.2
/lib/x86_64-linux-gnu/tls/libnss_dns.so.2
/lib/x86_64-linux-gnu//x86_64/libnss_dns.so.2
/lib/x86_64-linux-gnu//libnss_dns.so.2
/lib/x86_64-linux-gnu/x86_64/libnss_dns.so.2
/lib/x86_64-linux-gnu/libnss_dns.so.2
/usr/lib/x86_64-linux-gnu/tls//x86_64/libnss_dns.so.2
/usr/lib/x86_64-linux-gnu/tls//libnss_dns.so.2
/usr/lib/x86_64-linux-gnu/tls/x86_64/libnss_dns.so.2
/usr/lib/x86_64-linux-gnu/tls/libnss_dns.so.2
/usr/lib/x86_64-linux-gnu//x86_64/libnss_dns.so.2
/usr/lib/x86_64-linux-gnu//libnss_dns.so.2
/usr/lib/x86_64-linux-gnu/x86_64/libnss_dns.so.2
/usr/lib/x86_64-linux-gnu/libnss_dns.so.2
/lib/tls//x86_64/libnss_dns.so.2
/lib/tls//libnss_dns.so.2
/lib/tls/x86_64/libnss_dns.so.2
/lib/tls/libnss_dns.so.2
/lib//x86_64/libnss_dns.so.2
/lib/x86_64/libnss_dns.so.2
/usr/lib/tls//x86_64/libnss_dns.so.2
/usr/lib/tls//libnss_dns.so.2
/usr/lib/tls/x86_64/libnss_dns.so.2
/usr/lib/tls/libnss_dns.so.2
/usr/lib//x86_64/libnss_dns.so.2
/usr/lib//libnss_dns.so.2
/usr/lib/x86_64/libnss_dns.so.2
/usr/lib/libnss_dns.so.2
```

La separación viene porque realmente todos los archivos del segundo bloque son el mismo pero en distintas posibles localizaciones, así que solo tenía que encontrar cuál de todos ellos era el que estaba en el ordenador cuando estaba encendido.

Tras encontrarlo, creé el archivo `/usr/share/initramfs-tools/hooks/dns` con:

```sh
#!/bin/sh -e

if [ "$1" = "prereqs" ]; then exit 0; fi
. /usr/share/initramfs-tools/hook-functions

cp /usr/lib/x86_64-linux-gnu/libnss_dns.so.2 $DESTDIR/usr/lib/x86_64-linux-gnu/libnss_dns.so.2
cp /etc/resolv.conf $DESTDIR/etc/resolv.conf
cp /etc/host.conf $DESTDIR/etc/host.conf
cp /etc/hosts $DESTDIR/etc/hosts
```

Y ejecuté nuevamente:

```sh
sudo chmod +x /usr/share/initramfs-tools/hooks/dns
sudo update-initramfs -u
```

Con esto ya funcionaba la resolución de dominios en `initramfs` y solo faltaba adaptar la tarea de `crontab` al nuevo enlace que era del tipo `https://dynamicdns.park-your-domain.com/update?host=@&domain=wupp.dev&password=passwd&ip=ip`. Este nuevo enlace tenía un problema y era que había que especificarle la nueva IP para el dominio, pero se pudo resolver gracias a la gran cantidad de páginas que permiten conseguir la IP pública (y especialmente a aquellas que te dan la IPv4) con un comando un poquito más complicado `wget --no-check-certificate -qO- ipinfo.io/ip -O - | xargs -I {} wget --no-check-certificate -qO- "https://dynamicdns.park-your-domain.com/update?host=@&domain=wupp.dev&password=passwd&ip={}"`.