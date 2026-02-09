---
order: 3
---

# Instalación del SO encriptado

Vamos a darle vida al cacharro ese que se hace llamar servidor. En esta sección instalaremos el sistema operativo con los discos encriptados y haremos un poco de configuración básica.

## Escogiendo y descargando el sistema operativo.

::: info
Para esta parte necesitarás:

- Un ordenador con Internet.
- Un pendrive de unos **4GB** vacío o con archivos que no te importe perder.
- Una pantalla y teclado extra para el servidor.
:::

Hay varias opciones para escoger como sistema operativo:

- [Debian](https://www.debian.org/).
- [Raspberry Pi OS](https://www.raspberrypi.com/software/operating-systems/) _(para Raspberry)_.
- [Ubuntu Server](https://ubuntu.com/download/server).
- [Fedora Server](https://getfedora.org/en/server/).

Esos son solo algunos ejemplos, pero hay muchas opciones. En nuestro caso, el servidor tuvo instalado al principio Ubuntu Server, pero Lucas se puso tonto, así que hubo que cambiarlo a **Debian**, que según él es mejor _(**Spoiler:** No ha probado Ubuntu Server)_.

### Descarga y preparación del instalador de Debian

Actualmente la versión de Debian del servidor es la 13, también llamada Trixie. La forma más sencilla de instalarlo es descargar la ISO del principio de su [página de descarga](https://www.debian.org/download), ya que es un instalador muy ligero.

::: warning ADVERTENCIA
Esa ISO de Debian necesita que el servidor se pueda conectar a Internet en el momento de la instalación, así que ten preparado el cable para conectarlo.
:::

Una vez descargada la ISO, tenemos que grabarla en el pendrive cosa que se puede hacer con [Balena Etcher](https://www.balena.io/etcher/).

Ese pendrive lo cogemos y lo enchufamos al servidor.

## Configuración de la UEFI del servidor

Antes de instalar el sistema operativo, tenemos que hacer unos retoques en la UEFI (también conocida como la BIOS), así que enciende el servidor y accede a la UEFI _(si no sabes cómo, búscalo, porque cambia mucho de un ordenador a otro)_.

Aquí hay **dos cambios muy importantes** que hacer:

- **Activar**, si estuviera desactivado, el **Secure Boot**, ya que nos aportará un extra de seguridad.
- Establecer una **contraseña de administrador** de la UEFI.

::: info
Puede que te encuentres con dos posibles contraseñas, la de **usuario** y la de **administrador**. La de usuario, si la creas, probablemente te la pida cada vez que el ordenador se encienda, cosa que no te conviene. La de administrador es la que nos interesa, que es la que se pide cuando se intenta acceder a la UEFI.
:::

Una opción que nos puede interesar es la llamada `Restore on AC/Power loss`, que podremos encontrar por el apartado Boot o en avanzado. Podemos dejarla en `Last State` o `Memory` dependiendo de como salga, pero lo que viene a significar es que si se fuese la luz estando el ordenador encendido y luego volviese, el ordenador se encendería de nuevo. Esto es interesante por si hay un apagón y quieres que el servidor vuelva a estar encendido en cuanto vuelva la luz.

Salimos guardando los cambios y el ordenador debería reiniciarse y mostrar el instalador del sistema. Es posible que haya que seleccionar el pendrive como dispositivo de arranque manualmente, para ello habrá que pulsar una tecla concreta al encender el ordenador, como F12 o Esc, dependiendo del modelo.

## Instalación de Debian

Así se verá nuestro instalador *(si no lo han cambiado en las versiones posteriores)*:

![Instalador](../images/debian-inicio.png)

La instalación gráfica y la otra son prácticamente iguales, la diferencia es que en la gráfica puedes usar el ratón.

Primero tocará elegir el idioma y la distribución del teclado _(nosotros elegimos Español para mayor comodidad, aunque después cambiamos a Inglés)_. Después se intentará conectar a Internet y tocará poner unos cuantos datos:

1. El nombre de la máquina, como puede ser `server`
2. El nombre del dominio, que para nuestro servidor es `wupp.dev` _(si no tienes el dominio o no sabes qué es, puedes hacerte spolier mirando la sección de [Router y dominio](./router-dominio.html#dominio-%C2%BFque-es-y-para-que-sirve))_.
3. La contraseña para el usuario `root`. Esta contraseña tiene que ser **potente**, como de 20 caracteres, porque es la que permite hacer cualquier cambio en el sistema operativo.

::: tip TRUQUITO
Puedes generar, guardar y gestionar contraseñas cómodamente con [Bitwarden](https://bitwarden.com/).
:::

4. El nombre del usuario administrativo, por ejemplo, `admin` _(tanto para el nombre completo como para el nombre de usuario)_.

::: warning ADVERTENCIA
El usuario escogido en la guía es `admin`. Este nombre es de ejemplo y Debian no te dejará usarlo.
:::

5. La contraseña para el usuario `admin`. Una contraseña que sea buena, especialmente si vas a usar `sudo`, ya que sería equivalente a tener la contraseña de `root`.
6. Configuración del reloj, de chill.

Después de esto toca encriptar el disco de instalación.

### Encriptación del disco

Para no complicarnos la vida, aquí dejaremos que Debian haga la magia de gestionar las particiones porque si no nos tocaría sufrir mucho.

En el instalador, elegiremos el método de particionado **Guiado - utilizar todo el disco y configurar LVM cifrado**. Elegimos el disco donde queremos instalar el sistema operativo, que en nuestro caso es el SSD de 480GB y utilizamos como esquema de particionado **Todos los ficheros en una partición (recomendado para novatos)**.

Si, como en nuestro caso, disponemos de un disco duro mecánico de gran tamaño, puede ser interesante utilizarlo para montar la partición `/var`, que es donde se almacenan los logs, archivos temporales del sistema y donde guardaremos los datos de nuestros servicios, que pueden llegar a ser bastante grandes. Lo único a tener en cuenta es que docker también almacena las imágenes en `/var/lib/docker`, por lo que si se van a usar contenedores docker, es recomendable mover esa carpeta al SSD, ya que notaremos un gran cambio en el rendimiento de los contenedores. Nosotros hicimos el cambio a posteriori, estando documentado en [Moviendo /var a otro disco](../relatos/moviendo-var.html).

Ahora, si aprecias tu tiempo y no tenías archivos altamente sensibles en el disco donde vas a instalar Debian, puedes elegir no borrar el disco, ya que tardaría un buen rato.

Tras eso, nos pedirá una **contraseña de cifrado** y esta sí que tiene que ser una tremenda contraseña. Mejor que la de los usuarios.

Ahora toca lo interesante. Le decimos que use todo el disco para el particionado y nos aparecerá una lista con las particiones que se van a crear.

![Particiones](../images/debian-particiones.png)

Las particiones más importantes son:

- Una partición donde irá **el sistema operativo y todos los datos**. Por defecto aparecerá con el sistema de archivos `ext4`, uno de los más comunes en Linux.
- Una partición de **intercambio _(SWAP)_**, que se utiliza como una ampliación de la RAM.
- Una partición `boot` que contiene los archivos necesarios para que el sistema operativo arranque.

Se puede dejar tal y como está, pero nosotros hemos optado por usar `btrfs` en vez de `ext4` como sistema de archivos de la partición principal. Esto es por las grandes facilidades que da `btrfs` para hacer copias de seguridad del sistema al completo sin que ocupen casi espacio (snapshots).

Por suerte, cambiar el sistema de archivos es relativamente fácil, solo hay que ir a la línea donde aparece la palabra `ext4`, pulsar \<Intro\> y en **Utilizar como** elegir el sistema `btrfs`. Salimos y ahora debería aparecer `btrfs` en vez de `ext4` como sistema de archivos. Finalizamos el particionado confirmando que se hagan los cambios elegidos y empezará la instalación del sistema operativo.

### Terminando la instalación

Una vez acabe la instalación, nos tocará configurar el gestor de paquetes, elegir una ubicación y un proxy si hace falta, pero se puede dejar todo por defecto y el proxy en blanco.

Ahora nos dejará elegir unos cuantos paquetes extra que instalar, estos son los cambios que hay que hacer:

::: warning ADVERTENCIA
Si no quieres que se te quede la cara de tonto que se me quedó a mí ya en dos ocasiones, recuerda que para desmarcar opciones hay que usar \<Espacio\> y no \<Intro\>, que como le des sin querer te toca repetir todo el proceso de instalación.
:::

- Quitar el entorno de escritorio. El servidor no lo necesitará allá donde vas a dejarlo. _Salvo que vayas a configurar VNC o quieras terminar de configurarlo usando una interfaz gráfica._
- Añadir el servidor SSH, que nos permitirá conectarnos al servidor remotamente desde otro dispositivo para hacer cualquier gestión.

## Instalando sudo

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

## Añadiendo discos encriptados adicionales

Si queremos utilizar algún disco duro adicional encriptado, necesitamos que se desencripte también y se monte al encenderse el servidor, así que vamos a ello.

Vamos a asumir que tenemos el disco ya formateado en `btrfs` y encriptado con LUKS, así que utilzamos `lsblk` para identificarlo, que en este caso es `sdb1`.

```sh
lsblk
# NAME                    MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
# sda                       8:0    0 447,1G  0 disk
# ├─sda1                    8:1    0   512M  0 part  /boot/efi
# ├─sda2                    8:2    0   488M  0 part  /boot
# └─sda3                    8:3    0 446,2G  0 part
#   └─sda3_crypt          254:0    0 446,1G  0 crypt
#     └─server--vg-swap_1 254:2    0   976M  0 lvm   [SWAP]
# sdb                       8:16   0   3,6T  0 disk
# └─sdb1                    8:17   0   3,6T  0 part
# sr0                      11:0    1  1024M  0 rom
```

Lo primero es que se desencripte, para ello tendremos que añadir el disco a `/etc/crypttab`, pero como ese queremos que se desencripte solo sin tener que ponerle nosotros la contraseña, tendremos que crear un archivo que servirá como contraseña para desencriptar el disco.

```sh
sudo mkdir -p /etc/cryptsetup-keys.d
sudo dd if=/dev/urandom of=/etc/cryptsetup-keys.d/vault.key bs=1024 count=4
sudo chown -R root:root /etc/cryptsetup-keys.d
sudo chmod 0400 /etc/cryptsetup-keys.d/vault.key
sudo cryptsetup luksAddKey /dev/sdb1 /etc/cryptsetup-keys.d/vault.key
```

Lo que acabamos de hacer es crear un archivo con caracteres aleatorios _(como una contraseña básicamente pero mucho más larga)_ y añadirlo como clave para desencriptar el disco duro, ya que LUKS nos permite tener varias claves.

Ahora hay que buscar la UUID del disco:

```sh
ls -l /dev/disk/by-uuid
# total 0
# lrwxrwxrwx 1 root root 10 ago 10 17:47 0053a965-9146-4e52-b842-0ba1a756c4c5 -> ../../sda3
# lrwxrwxrwx 1 root root 10 ago 10 17:47 1e28c433-5bf5-41e5-9708-5730bb18d0ef -> ../../dm-2
# lrwxrwxrwx 1 root root 10 ago 10 17:47 60e8d58f-cb05-47f1-85bc-38e5b0a05505 -> ../../sdb1
# lrwxrwxrwx 1 root root 10 ago 10 17:47 a3313b2a-fe80-4f3c-a384-bbce92fd4301 -> ../../dm-1
# lrwxrwxrwx 1 root root 10 ago 10 17:47 E283-990E -> ../../sda1
# lrwxrwxrwx 1 root root 10 ago 10 17:47 eb777051-9d3a-4bf9-a186-fdfcc9d5c9c0 -> ../../sda2
```

Que en este caso es `60e8d58f-cb05-47f1-85bc-38e5b0a05505`, así que vamos a editar `/etc/crypttab` añadiendo esta línea al final:

```
vault UUID=60e8d58f-cb05-47f1-85bc-38e5b0a05505 /etc/cryptsetup-keys.d/vault.key luks,noauto,nofail,timeout=1min
```

Donde lo primero es el nombre que tendrá el volumen en `/dev/mapper/`, lo segundo su UUID, lo tercero el archivo donde está la clave y lo cuarto contiene las opciones. Las opciones `noauto`, `nofail` y `timeout=1min` evitan que el arranque falle si no se puede desencriptar el disco y que no se espere indefinidarmente hasta que el usuario desbloquee manualmente el disco (ya que lo desbloquearemos con un archivo de contraseña).

Muy bien, con esto el disco se podrá desencriptar al encenderse el servidor, solo nos queda añadirlo a `/etc/fstab` para que también se monte. Añadimos esta línea al final del archivo:

```
/dev/mapper/vault /mnt/vault btrfs defaults,nofail 0 0
```

Que hará que el disco se monte en `/mnt/vault` cuando se encienda el servidor. ¡Ojo! Debemos asegurarnos de que el punto de montaje existe o crearlo con `sudo mkdir -p /mnt/vault`.

## Optimizando discos

::: danger PELIGRO
Ten cuidado con esta parte, ya que una configuración incorrecta puede causar que el ordenador deje de encenderse correctamente, con lo que tendrás que reiniciarlo en modo de recuperación, montar el sistema temporalmente y volver a cambiar la configuración.
:::

**Si tenemos el sistema operativo en un disco SSD SATA**, como es el caso, hay unos cambios que podemos hacer para mejorar el rendimiento y la durabilidad del disco, tenemos que editar `/etc/fstab`, concretamente la primera línea sin comentar, que debería ser la correspondiente a la partición `root`, añadiendo unas opciones extra para cuando se monte:

```
/dev/mapper/server--vg-root / btrfs  defaults,subvol=@rootfs,ssd,noatime,space_cache=v2,compress=zstd:2,discard=async,commit=30 0 0
```

Aquí detallamos lo que hace cada opción:
- `ssd`: Fuerza el uso de heurísticas optimizadas para SSD *(normalmente btrfs ya lo detecta automáticamente)*.
- `noatime`: Evita actualizar la fecha de último acceso a los archivos, reduciendo escrituras innecesarias.
- `space_cache=v2`: Usa el formato moderno del space cache, recomendado y por defecto en kernels recientes.
- `compress=zstd:2`: Activa compresión ZSTD con un buen equilibrio entre velocidad y ratio de compresión para SSD SATA.
- `discard=async`: Habilita TRIM de forma asíncrona, mejorando el rendimiento y la longevidad del SSD.
- `commit=30`: Aumenta el intervalo de escritura de metadatos a 30 segundos, reduciendo escrituras a costa de un mayor riesgo ante cortes de energía.

**Si tenemos el sistema operativo en un disco SSD NVME M.2**, como es el caso para el servidor de Minecraft, podemos utilizar las mismas opciones pero cambiando `compress=zstd:1`. En NVMe, niveles bajos de compresión suelen ofrecer el mejor equilibrio para cargas intensivas.

Para los **discos duros mecánicos con btrfs**, como el que vamos a usar para la partición `/var`, podemos usar estas opciones al montarlo:

```
/dev/mapper/vault /var btrfs  defaults,noatime,space_cache=v2,compress=zstd:3,nofail 0 0
```

En HDD la compresión aporta más beneficios. Si el procesador lo permite, se puede subir a `5` o `7`, aunque `3` es un valor equilibrado y habitual.

El resto de líneas que haya las dejamos intactas.

## Desencriptando el sistema automáticamente

### Con TPM 2.0

Si tenemos un TPM 2.0 en el servidor, como es el caso del servidor de Minecraft, podemos hacer que el disco duro se desencripte automáticamente al encender el servidor sin necesidad de poner la contraseña.

Lo primero es verificar que el disco duro *(la partición donde está el sistema)* está encriptado con LUKS2, para ello usamos:

```
sudo cryptsetup luksDump /dev/sda3 | grep Version
```

Debería salir `Version: 2`, si no es así, nos tocará cambiarla desde un pendrive con un Linux live y ejecutar `sudo cryptsetup convert --type luks2 /dev/sda3`.

Ahora necesitamos instalar `clevis`:

```sh
sudo apt update
sudo apt install clevis clevis-tpm2 clevis-luks clevis-initramfs
```

Y enlazar el volumen LUKS con el TPM:

```sh
sudo clevis luks bind -d /dev/sda3 tpm2 '{"pcr_bank":"sha256","pcr_ids":"2,7,11,12,14"}'
```

Los PCRs usados son los siguientes:

- `2` **Hardware conectable (pluggable hardware):** Registra cambios en la enumeración de dispositivos detectados durante el arranque temprano (PCIe, USB, Thunderbolt, controladoras, NICs, HBAs, etc.). Cambia ante modificaciones físicas relevantes del sistema, lo que permite bloquear el arranque automático si se altera el hardware.
- `7` **Secure Boot policy:** Mide si Secure Boot está habilitado y qué claves UEFI (PK, KEK, db, dbx) están activas. Garantiza que el arranque solo se desbloquee si se mantiene la política de Secure Boot esperada.
- `11` **Imagen EFI del kernel y payload asociado:** Mide el binario EFI cargado por el cargador de arranque, incluyendo el kernel como PE y cualquier initrd embebido. Detecta manipulaciones del kernel sin verse afectado por actualizaciones normales en la mayoría de configuraciones estándar.
- `12` **Parámetros del kernel (cmdline):** Registra la línea de comandos del kernel. Protege frente a cambios en parámetros críticos (`init=`, `root=`, desactivación de mitigaciones, etc.), a costa de requerir la clave si se modifica la configuración de arranque.
- `14` **Shim y primeros componentes UEFI:** Mide el binario `shim` y el inicio de la cadena de confianza UEFI. Asegura que el proceso de arranque comienza desde componentes firmados y no manipulados.

Hay muchos más PCRs, pero se han seleccionado estos para equilibrar seguridad y estabilidad: el sistema se desencripta automáticamente en arranques normales, pero requiere la clave si se manipula el hardware, Secure Boot o la cadena de arranque, evitando bloqueos innecesarios por actualizaciones legítimas del sistema.

Ahora actualizamos el initramfs para que los cambios tengan efecto:

```sh
sudo update-initramfs -u -k all
```

Y verificamos:

```sh
sudo clevis luks list -d /dev/sda3
```

Con esto, al reiniciar el servidor, el disco debería desencriptarse automáticamente usando el TPM.

### Sin TPM 2.0

Si tenemos un TPM 1.2, podemos utilizar [esta release](https://github.com/oldium/clevis/releases/tag/v21_tpm1u7) de clevis que soporta TPM 1.2, pero a nosotros nos dio problemas el propio TPM, así que tomamos otro enfoque.

Aprovechando que que tenemos el servidor de Minecraft que sí se desencripta solo, creamos un servicio de systemd que, al iniciarse el servidor, use `ssh` para conectarse al servidor principal y desencripte el disco. Para ello, hay que haber configurado Dropbear en el servidor principal *(ver [Reinicios y desencriptación del disco](./gestion-remota.html#reinicios-y-desencriptacion-del-disco))* y tener añadida la clave del servidor de Minecraft para que se pueda conectar.

Con todo eso, creamos un archivo llamado `/usr/local/bin/auto_unlock_server.sh` con el siguiente contenido:

```sh
#!/bin/bash

# CONFIGURACIÓN
TARGET_IP="192.168.1.XXX"           # IP del servidor
TARGET_PORT="2222"                  # El puerto dropbear configurado en servidor
KEY_PATH="/root/.ssh/id_ed25519"    # Ruta a la clave privada para autenticación SSH
LUKS_PASSWORD="CONTRASEÑA_DE_LUKS"  # Cuidado con los caracteres especiales como $ o !

# COMPROBACIÓN DE PUERTO
# nc (netcat) verifica si el puerto está abierto. 
# -z: modo escaneo (sin enviar datos), -w 2: timeout de 2 segundos
if nc -z -w 2 "$TARGET_IP" "$TARGET_PORT"; then
    echo "El servidor está esperando desbloqueo. Intentando desbloquear..."

    # COMANDO DE DESBLOQUEO
    # Añade -o StrictHostKeyChecking=no si Dropbear está en el mismo puerto que OpenSSH
    printf '%s' "$LUKS_PASSWORD" | ssh -p "$TARGET_PORT" -i "$KEY_PATH" \
        -o ConnectTimeout=10 \
        -o UserKnownHostsFile=/dev/null \
        root@"$TARGET_IP" "cryptroot-unlock"
    
    if [ $? -eq 0 ]; then
        echo "Comando enviado correctamente."
    else
        echo "Fallo al enviar el comando de desbloqueo."
    fi
else
    echo "Puerto $TARGET_PORT cerrado o inalcanzable. El servidor probablemente ya está encendido o apagado."
fi
```

Nos aseguramos de que solo root pueda leerlo con `sudo chmod 700 /usr/local/bin/auto_unlock_server.sh`.

Y ahora creamos un servicio de systemd en `/etc/systemd/system/auto-unlock-server.service` con este contenido:

```ini
[Unit]
Description=Verificar y desbloquear servidor
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/bash /usr/local/bin/auto_unlock_server.sh
User=root
```

Y un temporizador en `/etc/systemd/system/auto-unlock-server.timer`:

```ini
[Unit]
Description=Ejecutar desbloqueo de servidor cada 5 minutos

[Timer]
# Ejecutar 1 minuto después de arrancar el servidor
OnBootSec=1min
# Ejecutar cada 5 minutos después de la última ejecución
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

Finalmente, activamos el servicio y el temporizador:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now auto-unlock-server.timer
```