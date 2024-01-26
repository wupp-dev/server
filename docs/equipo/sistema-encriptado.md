---
title: Instalación del SO encriptado
lang: es-ES
---

# Instalación del SO encriptado

Vamos a darle vida al cacharro ese que se hace llamar servidor. En esta sección instalaremos el sistema operativo con los discos encriptados y haremos un poco de configuración básica.

## Escogiendo y descargando el sistema operativo.

::: info
Para esta parte necesitarás:

- Un ordenador con internet.
- Un pendrive de unos **4GB** vacío o con archivos que no te importe perder.
- Una pantalla y teclado extra para el servidor.
  :::

Hay varias opciones para escoger como sistema operativo:

- [Debian](https://www.debian.org/).
- [Raspbian](https://www.raspbian.org/) _(para Raspberry)_.
- [Ubuntu Server](https://ubuntu.com/download/server).
- [Fedora Server](https://getfedora.org/en/server/).

Esos son solo algunos ejemplos, pero hay muchas opciones. En nuestro caso, el servidor tuvo instalado al principio Ubuntu Server, pero Lucas se puso tonto, así que ha habido que cambiarlo a **Debian**, que según él es mejor _(**Spoiler:** No ha probado Ubuntu Server)_.

::: danger PELIGRO
Toda persona que use Windows Server será perseguida y juzgada por sus crímenes contra la humanidad.
:::

### Descarga y preparación del instalador de Debian 11

Actualmente la versión de Debian del servidor es la 11, también llamada Bullseye. La forma más sencilla de instalarlo es descargar la ISO del principio de su [página de descarga](https://www.debian.org/download), ya que es un instalador muy ligero.

::: warning ADVERTENCIA
Esa ISO de Debian necesita que el servidor se pueda conectar a internet en el momento de la instalación, así que ten preparado el cable para conectarlo.
:::

Una vez descargada la ISO, tenemos que grabarla en el pendrive cosa que se puede hacer con [Balena Etcher](https://www.balena.io/etcher/).

Ese pendrive lo cogemos y lo enchufamos al servidor.

## Configuración de la BIOS del servidor

Antes de instalar el sistema operativo, tenemos que hacer unos retoques en la BIOS, así que enciende el servidor y accede a la BIOS _(si no sabes cómo, búscalo, porque cambia mucho de un ordenador a otro)_.

Aquí hay **dos cambios muy importantes** que hacer:

- **Desactivar**, si estuviera activado, el **Secure Boot**, ya que es algo de Windows y puede dar problemas para encender los ordenadores con Linux.
- Establecer una **contraseña de administrador** de la BIOS.

::: info
Puede que te encuentres con dos posibles contraseñas, la de **usuario** y la de **administrador**. La de usuario, si la creas, probablemente te la pida cada vez que el ordenador se encienda, cosa que no te conviene. La de administrador es la que nos interesa, que es la que se pide cuando se intenta acceder a la BIOS.
:::

Ahora hay que ir al apartado de **Boot** y cambiar el orden de inicio de los dispositivos para poner como primera opción el USB donde tenemos el instalador del sistema operativo.

Una opción que nos puede interesar es la llamada `Restore on AC/Power loss`, que podremos encontrar por el apartado Boot o en avanzado. Podemos dejarla en `Last State` o `Memory` dependiendo de como salga, pero lo que viene a significar es que si se fuera la luz estando el ordenador encendido y luego volviese, el ordenador se encendería de nuevo. Esto es interesante por si hay un apagón y quieres que el servidor vuelva a estar encendido en cuanto vuelva la luz.

Salimos guardando los cambios y el ordenador debería reiniciarse y mostrar el instalador del sistema.

## Instalación de Debian 11

Así se verá nuestro instalador:

![Instalador](../images/debian-inicio.png)

La instalación gráfica y la otra son prácticamente iguales, la diferencia es que en la gráfica puedes usar el ratón.

Primero tocará elegir el idioma y la distribución del teclado _(nosotros hemos elegido Español para mayor comodidad)_. Después se intentará conectar a internet y tocará poner unos cuantos datos:

1. El nombre de la máquina, como puede ser `server`
2. El nombre del dominio, que para nuestro servidor es `wupp.dev` _(si no tienes el dominio o no sabes qué es, puedes hacerte spolier mirando la sección de [Router y dominio](./router-dominio.html#dominio-%C2%BFque-es-y-para-que-sirve))_.
3. La contraseña para el usuario `root`. Esta contraseña tiene que ser **potente**, como de 20 caracteres, porque es la que permite hacer cualquier cambio en el sistema operativo.

::: tip TRUQUITO
Puedes generar, guardar y gestionar contraseñas cómodamente con [Bitwarden](https://bitwarden.com/).
:::

4. El nombre del usuario administrativo, por ejemplo, `admin` _(tanto para el nombre completo como para el nombre de usuario)_.

::: warning ADVERTENCIA
El usuario escogido en la guía es `admin`. Este nombre es de ejemplo y Debian no te dejará usarlo. Intenta escoger otro distinto que no sea tan fácil de averiguar.
:::

5. La contraseña para el usuario `admin`. Una contraseña que sea buena, aunque no es necesario que sea tan extensa como la de `root`.
6. Configuración del reloj, de chill.

Después de esto toca encriptar el disco de instalación.

### Encriptación del disco

Para no complicarnos la vida, aquí dejaremos que Debian haga la magia de gestionar las particiones porque si no nos tocaría sufrir mucho.

En el instalador, elegiremos el método de particionado **Guiado - utilizar todo el disco y configurar LVM cifrado**. Elegimos el disco donde queremos instalar el sistema operativo, que en nuestro caso es el SSD de 480GB y utilizamos como esquema de particionado **Todos los ficheros en una partición (recomendado para novatos)**.

Ahora, si aprecias tu tiempo y no tenías archivos altamente sensibles en el disco donde vas a instalar Debian, puedes elegir no borrar el disco, ya que tardaría un buen rato.

Tras eso, nos pedirá una **contraseña de cifrado** y esta sí que tiene que ser una tremenda contraseña. Igual o mejor que la del usuario `root`.

Ahora toca lo interesante. Le decimos que use todo el disco para el particionado y nos aparecerá una lista con las particiones que se van a crear.

![Particiones](../images/debian-particiones.png)

Las particiones más importantes son:

- Una partición donde irá **el sistema operativo y todos los datos**. Por defecto aparecerá con el sistema de archivos `ext4`, uno de los más comunes en Linux.
- Una partición de **intercambio _(SWAP)_**, que se utiliza como una ampliación de la RAM.
- Una partición `boot` que contiene los archivos necesarios para que el ordenador se encienda.

Se puede dejar tal y como está, pero nosotros hemos optado por usar `btrfs` en vez de `ext4` como sistema de archivos de la partición principal. Esto es por las grandes facilidades que da `btrfs` para hacer copias de seguridad del sistema al completo sin que ocupen casi espacio.

Por suerte, cambiar el sistema de archivos es relativamente fácil, solo hay que ir a la línea donde aparece la palabra `ext4`, pulsar \<Intro\> y en **Utilizar como** elegir el sistema `btrfs`. Salimos y ahora debería aparecer `btrfs` en vez de `ext4` como sistema de archivos. Finalizamos el particionado confirmando que se hagan los cambios elegidos y empezará la instalación del sistema operativo.

### Terminando la instalación

Una vez acabe la instalación, nos tocará configurar el gestor de paquetes, elegir una ubicación y un proxy si hace falta, pero se puede dejar todo por defecto y el proxy en blanco.

Ahora nos dejará elegir unos cuantos paquetes extra que instalar, estos son los cambios que hay que hacer:

::: warning ADVERTENCIA
Si no quieres que se te quede la cara de tonto que se me quedó a mí ya en dos ocasiones, recuerda que para desmarcar opciones hay que usar \<Espacio\> y no \<Intro\>, que como le des sin querer te toca repetir todo el proceso de instalación.
:::

- Quitar el entorno de escritorio. El servidor no lo necesitará allá donde vas a dejarlo.
- Añadir el servidor SSH, que nos permitirá conectarnos al servidor remotamente desde otro dispositivo para hacer cualquier gestión.

## Configuración básica y pequeñas mejoras

Encendemos el servidor, iniciamos sesión con el nombre de usuario que creamos, con su contraseña y ya estaría.

Lo primero que vamos a hacer, por comodidad, es instalar el paquete `sudo`, que nos permite hacer casi todo lo que hace el usuario `root` sin necesidad de cambiarnos a ese usuario, para ello escribimos los siguientes comandos:

```sh
su
# Contraseña:
apt install sudo
```

Ahora queda añadir al usuario que creamos durante la instalación como _sudoer_, para ello editamos el archivo `/etc/sudoers` y ponemos lo siguiente:

```sh
#
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.
#
# See the man page for details on how to write a sudoers file.
#
Defaults        env_reset
Defaults        mail_badpass
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# Host alias specification

# User alias specification

# Cmnd alias specification

# User privilege specification
root    ALL=(ALL:ALL) ALL
admin  ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "@include" directives:

@includedir /etc/sudoers.d
```

Donde `admin` será el usuario que creamos. Guardamos el archivo y ya podemos escribir `exit` para salirnos del usuario `root`. A partir de ahora lo normal será usar `sudo` para instalar cosas o editar archivos.

### Optimizando el disco SSD

::: danger PELIGRO
Ten cuidado con esta parte, ya que una configuración incorrecta puede causar que el ordenador deje de encenderse correctamente, con lo que tendrás que reiniciarlo en modo de recuperación, montar el sistema temporalmente y volver a cambiar la configuración.
:::

**Si tenemos el sistema operativo en un disco SSD SATA**, como es el caso, hay unos cambios que podemos hacer para mejorar el rendimiento y la durabilidad del disco, tenemos que editar `/etc/fstab`, concretamente la primera línea sin comentar, que debería ser la correspondiente al sistema de archivos `root`, añadiendo unas opciones extra para cuando se monte la partición:

```sh
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# systemd generates mount units based on this file, see systemd.mount(5).
# Please run 'systemctl daemon-reload' after making changes here.
#
# <file system>             <mount point>   <type>  <options>                                                                              <dump>  <pass>
/dev/mapper/server--vg-root /               btrfs   defaults,subvol=@rootfs,ssd,noatime,space_cache,commit=120,compress=zstd,discard=async 0       0
```

**Si tenemos el sistema operativo en un disco SSD NVME M.2**, como es el caso para el servidor de Minecraft, podemos mejorar el rendimiento editando `/etc/fstab`, concretamente la primera línea sin comentar, que debería ser la correspondiente al sistema de archivos `root`, añadiendo unas opciones extra para cuando se monte la partición:

```sh
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# systemd generates mount units based on this file, see systemd.mount(5).
# Please run 'systemctl daemon-reload' after making changes here.
#
# <file system>             <mount point>   <type>  <options>                                                                              <dump>  <pass>
/dev/mapper/mcserver--vg-root /               btrfs   defaults,subvol=@rootfs,compress=zstd:1,discard=async 0       0
```

El resto de líneas que haya debajo las dejamos intactas.

### Montando el disco grande al inicio

Como tenemos un disco duro de 4TB que vamos a usar para almacenar archivos, necesitamos que se desencripte también y se monte al encenderse el servidor, así que vamos a ello.

Si el disco es recién comprado, es probable que no tenga ninguna partición, así que habrá que crearla antes de poder hacer nada. Para ello, instalaremos GParted `apt install gparted` y lo primero que haremos es, si no tiene tabla de particiones, crear una tabla de particiones `gpt`.

Ahora podremos localizar el disco, que en este caso es `sdb1`.

```sh
$ lsblk
# NAME                    MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
# sda                       8:0    0 447,1G  0 disk
# ├─sda1                    8:1    0   512M  0 part  /boot/efi
# ├─sda2                    8:2    0   488M  0 part  /boot
# └─sda3                    8:3    0 446,2G  0 part
#   └─sda3_crypt          254:0    0 446,1G  0 crypt
#     ├─server--vg-root   254:1    0 445,1G  0 lvm   /var/lib/docker/btrfs
#     └─server--vg-swap_1 254:2    0   976M  0 lvm   [SWAP]
# sdb                       8:16   0   3,6T  0 disk
# └─sdb1                    8:17   0   3,6T  0 part
# sr0                      11:0    1  1024M  0 rom
```

Una vez hecho esto, si queremos encriptar el disco, tendremos que hacerlo desde la terminal, escribiendo `sudo cryptsetup luksFormat /dev/sdb1` y escribiendo la contraseña.

Ahora toca desencriptar el disco con `sudo cryptsetup luksOpen /dev/sdb1 vault` y escribiendo la contraseña. Volvemos a GParted y creamos una nueva partición que ocupe todo el volumen del disco y elegimos como sistema de archivos `btrfs`. Hecho esto, podemos desencriptar el disco.

Ya podemos hacer que el disco se desencripte y se monte al encenderse el ordenador :D

Lo primero es que se desencripte, para ello tendremos que añadir el disco a `/etc/crypttab`, pero como ese queremos que se desencripte solo sin tener que ponerle nosotros la contraseña, tendremos que crear un archivo que servirá como contraseña para desencriptar el disco.

```sh
sudo dd if=/dev/urandom of=/root/hdd_key bs=1024 count=4
sudo chmod 0400 /root/hdd_key
sudo cryptsetup luksAddKey /dev/sdb1 /root/hdd_key
```

Lo que acabamos de hacer es crear un archivo con caracteres aleatorios _(como una contraseña básicamente pero mucho más larga)_ y añadirlo como clave para desencriptar el disco duro, ya que LUKS nos permite tener varias claves.

Ahora hay que buscar la UUID del disco:

```sh
$ ls -l /dev/disk/by-uuid
# total 0
# lrwxrwxrwx 1 root root 10 ago 10 17:47 0053a965-9146-4e52-b842-0ba1a756c4c5 -> ../../sda3
# lrwxrwxrwx 1 root root 10 ago 10 17:47 1e28c433-5bf5-41e5-9708-5730bb18d0ef -> ../../dm-2
# lrwxrwxrwx 1 root root 10 ago 10 17:47 60e8d58f-cb05-47f1-85bc-38e5b0a05505 -> ../../sdb1
# lrwxrwxrwx 1 root root 10 ago 10 17:47 a3313b2a-fe80-4f3c-a384-bbce92fd4301 -> ../../dm-1
# lrwxrwxrwx 1 root root 10 ago 10 17:47 E283-990E -> ../../sda1
# lrwxrwxrwx 1 root root 10 ago 10 17:47 eb777051-9d3a-4bf9-a186-fdfcc9d5c9c0 -> ../../sda2
```

Que en este caso es `60e8d58f-cb05-47f1-85bc-38e5b0a05505`, así que vamos a editar `/etc/crypttab` añadiendo esta línea al final:

```sh
vault UUID=60e8d58f-cb05-47f1-85bc-38e5b0a05505 /root/hdd_key luks
```

Donde lo primero es el nombre que tendrá el volumen, lo segundo su UUID _(no olvidar comprobar que sea el correcto)_, lo tercero el archivo donde está la clave y lo cuarto especifica que utiliza LUKS.

Muy bien, con esto el disco se desencriptará al encenderse el servidor, solo nos queda añadirlo a `/etc/fstab` para que también se monte. Añadimos esta línea al final del archivo:

```sh
/dev/mapper/vault /mnt/vault btrfs defaults,nofail 0 0
```

Que hará que el disco se monte en `/mnt/vault` cuando se encienda el servidor. La opción `nofail` hace que, aunque no se pueda montar el disco, el ordenador se siga encendiendo en vez de fallar.

### Alternativa de montaje del disco grande

Hemos optado por mover toda la carpeta `/var` al disco duro grande por ser una carpeta donde se suelen almacenar logs y archivos más pesados. Para ello, vamos a montar directamente el disco grande en `/var`.

Empezamos copiando todo el contenido al disco duro con `sudo cp -rf /var/* /mnt/vault/`. Después modificamos `/etc/fstab` para cambiar el punto de montaje del disco duro de `/mnt/vault` a `/var` y tenemos que reiniciar _daemon_ de _systemclt_ con `sudo systemctl daemon-reload`. Ahora podemos mover la actual carpeta a una copia y mantenerla durante un tiempo prudencial `sudo mv /var /var.old`, creamos la nueva carpeta `sudo mkdir /var` y remontamos el disco duro con `sudo umount /mnt/vault` y `sudo mount /dev/mapper/vault`.

Si después de esto obtuviésemos un error al usar `apt` similar a:

```
/usr/bin/mandb: can't chmod /var/cache/man/CACHEDIR.TAG: Operation not permitted
/usr/bin/mandb: can't remove /var/cache/man/CACHEDIR.TAG: Permission denied
/usr/bin/mandb: fopen /var/cache/man/28371: Permission denied
```

Podemos solucionarlo con `chown -R man: /var/cache/man/` y `chmod -R 755 /var/cache/man/`.

También es posible que, después de eso, nos encontremos con que el servicio `lighdm` falla (posiblemente después de un reinicio). Lo podemos solucionar con `sudo chown -R lightdm:lightdm /var/lib/lightdm/` y `sudo chmod -R 755 /var/lib/lightdm/`.

Otra de las cosas que pueden ocurrir es que el servicio `binfmt-support` falle también después de un reinicio. Lo podemos solucionar con `mkdir /etc/systemd/system/binfmt-support.service.d` y creando el archivo `/etc/systemd/system/binfmt-support.service.d/override.conf` con:

```
[Unit]
RequiresMountsFor=/var
```

Que hará que el servicio se inicie una vez se haya montado la partición `/var`.
