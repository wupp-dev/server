---
order: 6
title: DynDNS con Namecheap
---

# Actualizar la IP del servidor en Namecheap

*Esta es la configuración que usamos cuando teníamos el dominio gestionado con Namechap, antes de moverlo a Cloudflare.*

## Con el servidor encendido

Comenzamos creando el registro `A` o `A + Dynamic DNS Record` (funcionan igual) para el dominio y los subdominios.
![Registros A + Dynamic DNS Record de Namecheap](../images/namecheap-ddns.png)

::: info
Los registros A asocian un nombre de dominio con una dirección IPv4. En IPv6 se utilizan registros AAAA. Hay muchos más tipos de registros DNS, que puedes ver [aquí](https://www.cloudflare.com/learning/dns/dns-records/).
:::

Por desgracia, el programa que tiene disponible Namecheap es solo para Windows, pero igualmente existe la posibilidad de utilizar un enlace para actualizar la IP. Aun así, no utilizaremos directamente el enlace, ya que podemos aprovecharnos de la existencia de [este](https://github.com/nickjer/namecheap-ddns) repositorio.

Siguiendo su documentación vamos a instalarlo usando `cargo`, así que también tendremos que [instalar Rust](https://www.rust-lang.org/tools/install).

Una vez instalado Rust, ejecutamos `cargo install namecheap-ddns` y tendremos el ejecutable en `/home/admin/.cargo/bin/namecheap-ddns`.

Siguiendo nuevamente la documentación, vamos a crear un servicio de `systemd` para que se encargue de actualizar la IP del dominio y todos sus subdominios. Creamos el archivo `/etc/systemd/system/ddns-update.service`:

```ini
[Unit]
Description=Update DDNS records for Namecheap
After=nss-user-lookup.target
Wants=nss-user-lookup.target

[Service]
Type=simple
Environment=NAMECHEAP_DDNS_TOKEN=passwd
Environment=NAMECHEAP_DDNS_DOMAIN=wupp.dev
Environment=NAMECHEAP_DDNS_SUBDOMAIN=@,mc,www
ExecStart=/home/admin/.cargo/bin/namecheap-ddns
User=admin

[Install]
WantedBy=default.target
```

::: warning ADVERTENCIA
Si no escribimos el `@` al principio de `Environment=NAMECHEAP_DDNS_SUBDOMAIN`, no se nos actualizará el dominio base `wupp.dev`.
:::

Ejecutamos `sudo chmod 600 /etc/systemd/system/ddns-update.service` (esto evita que otros usuarios del sistema puedan leer el token) y creamos el archivo `/etc/systemd/system/ddns-update.timer`:

```ini
[Unit]
Description=Run DDNS update every 15 minutes
Requires=ddns-update.service

[Timer]
Unit=ddns-update.service
OnUnitInactiveSec=15m
AccuracySec=1s

[Install]
WantedBy=timers.target
```

Y ejecutamos los siguientes comandos para ponerlo en funcionamiento y comprobar que todo va bien:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now ddns-update.service ddns-update.timer
sudo journalctl -u ddns-update.service
```

## Cuando el servidor está esperando a ser desencriptado

El objetivo es crear una tarea de `crontab` para ir actualizando la IP cada cierto tiempo durante el encendido. El primer problema que nos encontramos para esto es que los comandos disponibles cuando estamos en `ìnitramfs` son muy pocos y no incluyen `crontab`. Concretamente, los comandos que hay disponibles son una versión reducida de [BusyBox](https://busybox.net/) y para poder usar `crontab` necesitamos la versión completa.

`initramfs` utiliza la versión de BusyBox que haya instalada en Debian, así que tenemos que cambiarla escribiendo `sudo apt install busybox-static`, que reemplazará a la anterior y se incluirá automáticamente en `initramfs`.

::: danger PELIGRO
Aunque seguramente no sea el caso, puede ser que al hacer esto se cree una incompatibilidad entre la nueva versión de BusyBox y el resto de componentes de `initramfs`, haciendo que el servidor no pueda encenderse, así que recomiendo hacer una copia de seguridad por si algo sale mal.
:::

Después de esto `crontab` ya estará disponible, pero no funcionará porque en `initramfs` el directorio donde se guarda por defecto el archivo con la configuración no existe. La forma de resolverlo es creando el archivo `/usr/share/initramfs-tools/hooks/crontab` con este contenido:

```sh
#!/bin/sh -e

if [ "$1" = "prereqs" ]; then exit 0; fi
. /usr/share/initramfs-tools/hook-functions

mkdir $DESTDIR/var
mkdir $DESTDIR/var/spool
mkdir $DESTDIR/var/spool/cron
mkdir $DESTDIR/var/spool/cron/crontabs
cp /usr/share/initramfs-tools/crontab $DESTDIR/var/spool/cron/crontabs/root
```

Escribimos `sudo chmod +x /usr/share/initramfs-tools/hooks/crontab` para hacer el archivo ejecutable y esto lo que hará es crear el directorio y copiar un archivo con la configuración de `crontab` que vamos a crear ahora mismo. Escribimos en `/usr/share/initramfs-tools/crontab` la línea necesaria para actualizar únicamente `wupp.dev`, ya que el resto de subdominios nos da igual que se actualicen ahora si no van a poder usarse porque el ordenador no está completamente encendido:

```
1,6,11,16,21,26,31,36,41,46,51,56 * * * * sleep 46 ; wget --no-check-certificate -qO- ipinfo.io/ip -O - | xargs -I {} wget --no-check-certificate -qO- "https://dynamicdns.park-your-domain.com/update?host=@&domain=wupp.dev&password=passwd&ip={}" > /tmp/dnsupdate.log 2>&1 &
```

Y restringimos los permisos del archivo escribiendo:

```sh
sudo chown root:root /usr/share/initramfs-tools/crontab
sudo chmod 600 /usr/share/initramfs-tools/crontab
```

::: warning ADVERTENCIA
Por mucho que hayamos restringido los permisos del archivo, se va a guardar en una partición que no está cifrada, así que cualquiera que pueda acceder al disco podrá ver el token y "secuestrar" nuestro dominio para redirigirlo a donde quiera. Tenlo en cuenta.
:::

Cada vez que ejecutemos `sudo update-initramfs -u` se volverá a crear el directorio y a copiar el archivo, con lo que también nos aseguraremos de que si cambiamos el archivo también se cambiará en `initramfs`, aunque no inmediatamente.

Sin embargo, aunque ya podemos usar `crontab` en `initramfs`, nos falta hacer que se empiece a ejecutar, así que tenemos que crear otro archivo que se encargue de iniciar `crond`, que ejecutará lo que haya en `crontab`. Ese archivo será `/usr/share/initramfs-tools/scripts/init-premount/crond` y tendrá este contenido:

```sh
#!/bin/sh
# Start crond

PREREQ="busybox"
prereqs()
{
        echo "$PREREQ"
}

case $1 in
prereqs)
        prereqs
        exit 0
        ;;
esac

. /scripts/functions

crond -l 2

exit 0
```

Que no se nos olvide hacer el archivo ejecutable escribiendo `sudo chmod +x /usr/share/initramfs-tools/scripts/init-premount/crond`.

Genial, ahora si probamos a reiniciar el ordenador nos encontraremos con otro problema, y es que la resolución de dominios no funciona. Podemos comprobarlo con un comando tan sencillo como `wget google.com`, que nos dará un error.

::: tip RELATO
La información que hay en Internet sobre cómo hacer funcionar la resolución de dominios en `initramfs` es casi nula, así que la forma en la que lo conseguimos fue con varias pruebas que puedes consultar [aquí](../relatos/dns-initramfs).
:::

Para arreglarlo, crearemos un último archivo `/usr/share/initramfs-tools/hooks/dns` con el contenido:

```sh
#!/bin/sh -e

if [ "$1" = "prereqs" ]; then exit 0; fi
. /usr/share/initramfs-tools/hook-functions

cp /usr/lib/x86_64-linux-gnu/libnss_dns.so.2 $DESTDIR/usr/lib/x86_64-linux-gnu/libnss_dns.so.2
cp /etc/resolv.conf $DESTDIR/etc/resolv.conf
cp /etc/host.conf $DESTDIR/etc/host.conf
cp /etc/hosts $DESTDIR/etc/hosts
```

Y lo hacemos ejecutable con `sudo chmod +x /usr/share/initramfs-tools/hooks/dns`. Hecho esto ejecutamos una última vez `sudo update-initramfs -u` y ya estaría.