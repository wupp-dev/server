---
title: Gestión remota
order: 5
---

# Gestión remota con SSH y VNC

Esta sección incluye todas las cosas que hay que hacer en el servidor antes de poder guardarlo, olvidarte de él y, con suerte, no volver a necesitar enchufarle un monitor y un teclado para gestionarlo.

## Breve introducción

Un servidor es un ordenador al que no quieres tenerle conectado ni un monitor ni un teclado _(el ratón no existe)_ porque no deberías tener que tocarlo directamente salvo para el mantenimiento físico y cambios en la UEFI o en el sistema operativo.

Pero sí que hay que conectarse a él habitualmente para instalar y desinstalar software y para configurarlo. Esto lo haremos desde otros dispositivos usando el protocolo _Secure Shell (SSH)_, que nos permitirá ejecutar comandos en el servidor, transferir archivos y otras cosas más chulas que veremos después. Todo ello con una conexión cifrada :D

Es aquí donde se nos plantea un gran problema: Cuando nos podemos conectar al servidor mediante SSH es cuando está encendido _(y con los discos desencriptados)_, pero ¿y si no estamos en casa y el ordenador se ha tenido que reiniciar o ha habido un apagón? Entonces el ordenador se quedaría esperando a que pusiéramos _(¡con un teclado!)_ la contraseña para desencriptar los discos y así poder seguir encendiéndose. Eso no mola. Deberíamos de poder desencriptar el ordenador remotamente también para no tener miedo.

Este problema lo resolveremos tras preparar el servidor para el uso habitual.

::: warning ADVERTENCIA
Aunque estoy seguro de que es por culpa del router que usamos. En nuestro caso, si el servidor no tiene ningún tipo de interacción a través de Internet durante unos minutos, el router deja de permitir conexiones a él. Para ahorrarnos el disgusto de intentar conectarnos y descubrir que el router no nos lo va a permitir porque el servidor haya estado "inactivo", tendremos que forzar una actividad periódica mínima (como hacer un ping) tanto cuando el ordenador esté encendido como cuando esté esperando a que se introduzca la contraseña para desencriptar los discos.
:::

## Uso habitual

Vamos a empezar dejando lista nuestra vía para poder gestionar remotamente el servidor cuando esté encendido.

Como lo elegimos a la hora de instalar Debian, el servidor ya viene con OpenSSH Server instalado, que por defecto se ejecuta en el puerto `22`.

::: info
Puedes elegir no usar el puerto 22 para SSH para evitar los ataques automatizados que intentan entrar en los servidores a través de ese puerto por defecto. Sin embargo, si realizas toda la configuración de esta página y limitas la autenticación al uso de claves públicas, no hay ningún problema en usar el puerto 22 salvo porque puedas tener algo más de "ruido" en los logs.
:::

Sin embargo, si intentamos conectarnos desde otro ordenador, no nos dejará, por dos motivos:

- Tenemos que abrir el puerto en el router *(si no lo hicimos antes)*.
- Tenemos que permitirlo en el firewall *(si tenemos uno)*.

Así que lo que hay que hacer es primero abrir el puerto SSH en el router y, si tenemos un firewall, permitirlo también. **Si no tenemos un firewall, vamos a instalarlo porque es necesario.** Para ello ejecutamos los siguientes comandos:

```sh
sudo apt install ufw
sudo ufw allow 22/tcp
sudo ufw enable
```

Donde `22` es el puerto de SSH y `tcp` el protocolo. Con esto ya tenemos el firewall configurado para aceptar conexiones SSH.

Ahora ya podríamos conectarnos al servidor desde otro ordenador utilizando la contraseña del usuario. Eso quiere decir que alguien (o algo) puede ponerse probar contraseñas a ver si acierta y compromete nuestro servidor, cosa que queremos evitar, así que vamos a utilizar la autenticación por clave pública.

![Conexión SSH](../images/conexion-ssh.jpg)

Para configurarla en el ordenador del que nos vayamos a conectar, seguiremos [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server). Además, tiene al final una parte de configuración que también se debe hacer y viene incluido más adelante en la guía.

## Reinicios y desencriptación del disco

Además de poder configurar el desencriptado automático descrito [aquí](/equipo/sistema-encriptado#desencriptando-el-sistema-automaticamente), tenemos que tener alguna forma de conectarnos y desencriptar el disco remotamente en caso de que el servidor se reinicie o se apague por cualquier motivo y el método automático falle.

Para ello, existe un paquete de Debian llamado `dropbear-initramfs` que nos va a permitir hacer justo lo que queremos. **¿Qué es lo que hace?** Pues para eso hay que entender un poco cómo se enciende un ordenador con Linux y los discos encriptados.

El disco duro realmente no está encriptado del todo, tiene una partición llamada boot que únicamente contiene la información necesaria para decirle al ordenador cuando se intenta encender cómo debe hacerlo. Aquí entra el sistema `initrd`, que son los archivos básicos que se cargan en la RAM cuando el ordenador se enciende y que, junto con el kernel de Linux, se ocupan de gestionar el encendido. Puedes ver una descripción más detallada en [esta página](https://wiki.ubuntu.com/Initramfs).

Teniendo en cuenta lo anterior, `dropbear-initramfs` es un software que permite que el servidor reciba conexiones SSH en esta fase del encendido, justo a tiempo para introducir la contraseña para desencriptar los discos.

Se instala como cualquier otro paquete normal y corriente escribiendo:

```sh
sudo apt install dropbear-initramfs
```

**¿Eso es todo?** Obviamente no, hay que configurarlo.

Vamos a editar el archivo de configuración, que está en `/etc/dropbear/initramfs/dropbear.conf` y vamos a descomentar y editar la línea:

```ssh-config
DROPBEAR_OPTIONS="-I 300 -j -k -p 2222 -s"
```

¿Qué significa esto?

- `-I 300` desconecta a quien en 300 segundos no ha realizado ninguna acción.
- `-j` deshabilita la redirección de puertos locales.
- `-k` deshabilita la redirección de puertos remotos.
- `-p 2222` indica que se ejecute en el puerto 2222. Es recomendable cambiarlo a otro puerto distinto al de OpenSSH Server para evitar conflictos.
- `-s` deshabilita la autenticación por contraseña.

Como indica el último parámetro, la autenticación por contraseña está deshabilitada, así que utilizaremos también las claves públicas que hayamos autorizado para OpenSSH Server, podemos copiarlas y hacer que los cambios tengan efecto con los comandos:

```sh
sudo cp /home/admin/.ssh/authorized_keys /etc/dropbear-initramfs/
sudo update-initramfs -u
```

::: warning ADVERTENCIA
Si en algún momento añades o modificar las claves autorizadas para conectarte a OpenSSH Server, recuerda copiar el archivo de nuevo y ejecutar `sudo update-initramfs -u` para que los cambios tengan efecto en Dropbear.
:::

Esto generará de nuevo en la partición `boot` los archivos de `initramfs` incluyendo los cambios que hemos hecho.

::: tip MINI-RELATO
Tras esto descubrí que si el ordenador permanecía mucho tiempo encendido sin que nadie se conectase para desencriptar los discos, dejaba de ser accesible a través de la IP pública o el dominio (aunque sí era posible acceder a través de la IP local). Al principio pensé que era porque había que configurar la IP fija en `initramfs`, pero al intentar hacerlo, como el router ya tenía fijada la IP, se hacían un lío y no funcionaba. Al final se solucionó al poner también ahí el dominio a actualizarse, que es justo lo que viene ahora en la guía.
:::

### ¿Y qué pasa con el dominio?

¿No podría ocurrir que, tras ese apagón o reinicio, la IP pública cambie? Pues sí, podría ocurrir. Y no nos conviene, así que vamos a asegurarnos de que el dominio se actualice correctamente.

Antes teníamos el script para actualizar la IP en `initramfs`, pero hemos decidido cambiar el enfoque por eso de no exponer el token con permisos de modificar el dominio en una partición sin cifrar.

Aun así, si quieres ver cómo estaba montado antes, puedes verlo en [este relato](../relatos/dyndns-namecheap).

El nuevo enfoque es usar un bot de Telegram que se encargue de mandar un mensaje con la IP pública a un grupo cada vez que el servidor se encienda. De esta forma, podemos conectarnos y desencriptarlo. Esto implica exponer el token del bot, pero es mucho menos peligroso que exponer el token con permisos para modificar los DNS del dominio y lo único que puede hacer es mandar mensajes por el grupo, ni siquiera leer los demás.

El primer paso para esto sería crear el bot de Telegram siguiendo [estas instrucciones](https://core.telegram.org/bots#how-do-i-create-a-bot). Apuntamos el token que nos da BotFather, que será algo como `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`.

Añadimos el bot al grupo donde queramos que mande los mensajes (sin hacerlo administrador) y, si el bot se llama `@chulo_bot`, mandaremos por el grupo el mensaje `/start@chulo_bot`. Tras eso, en el servidor ejecutamos el siguiente comando sustituyendo `<BOTToken>` por el token del bot:

```sh
curl -s "https://api.telegram.org/bot<BOTToken>/getUpdates"
```

Que nos devolverá algo como:

```json
{
  "ok": true,
  "result": [
    {
      "update_id": 405123456,
      "message": {
        "message_id": 1024,
        "from": {
          "id": 987654321,
          "is_bot": false,
          "first_name": "Perico",
          "last_name": "Palotes",
          "username": "palotes_perico"
        },
        "chat": {
          "id": -1009876543210,
          "title": "[SERVER] Avisos",
          "is_forum": true,
          "type": "supergroup"
        },
        "date": 1700000000,
        "text": "/start@chulo_bot",
        "entities": [
          {
            "offset": 0,
            "length": 16,
            "type": "bot_command"
          }
        ]
      }
    }
  ]
}
```

Y anotamos el ID del chat, que será un número negativo como `-1009876543210`.

Introducimos las siguientes variables en `/usr/share/initramfs-tools/telegram.env`:

```dotenv
BOT_TOKEN="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
CHAT_ID="-1009876543210"
SSH_PORT="1234"
LABEL="SERVER"
INTERVAL_MIN="15"
LOG_FILE="/tmp/telegram-notify.log"
```

Donde `SSH_PORT` es el puerto de Dropbear y `LABEL` es una etiqueta para identificar el servidor en el mensaje.

Ajustamos los permisos:

```sh
sudo chown root:root /usr/share/initramfs-tools/telegram.env
sudo chmod 600 /usr/share/initramfs-tools/telegram.env
```

Vamos a mandar el mensaje cada 15 minutos y crearemos 4 mensajes distintos, cada cual más agresivo. Comenzará por el primero y, cada vez que se vuelva a mandar pasará al siguiente hasta llegar al último, que será el que se mande a partir de entonces. Los mensajes serán estos:

```markdown
*SERVER*
☝️🤓 Mi IP es: `X.X.X.X`
🫦 Desbloquéame: `ssh -p 1234 root@X.X.X.X`
```

```markdown
*SERVER*
😐 Olvidón, sigo aquí esperando... Mi IP es: `X.X.X.X`
🔓 Desbloquéame ya: `ssh -p 1234 root@X.X.X.X`
```

```markdown
*SERVER*
🤨 ¿Aqué esperas? Mi IP es: `X.X.X.X`
🔓 Desbloquéame, que es para hoy: `ssh -p 1234 root@X.X.X.X`
```

```markdown
*SERVER*
😡 O me desbloqueas o tú y yo vamos a a tener un problema.
📌 IP: `X.X.X.X`
👉👉👉👉 `ssh -p 1234 root@X.X.X.X`
```

Vamos a crear el script `/usr/share/initramfs-tools/telegram-notify.sh` con el siguiente contenido:

```sh
#!/bin/sh
set -eu

ENV="/etc/telegram.env"
STATE_LEVEL="/tmp/telegram_nag_level"
STATE_LAST="/tmp/telegram_last_sent_uptime"
LOCKDIR="/tmp/telegram-notify.lock"

# Lock simple para evitar envíos dobles si coincide ejecución
mkdir "$LOCKDIR" 2>/dev/null || exit 0
trap 'rmdir "$LOCKDIR" 2>/dev/null || true' EXIT

# Carga configuración
[ -f "$ENV" ] && . "$ENV"

: "${BOT_TOKEN:?Falta BOT_TOKEN en $ENV}"
: "${CHAT_ID:?Falta CHAT_ID en $ENV}"
: "${SSH_PORT:=22}"
: "${LABEL:=SERVER}"
: "${INTERVAL_MIN:=15}"
: "${LOG_FILE:=/tmp/telegram-notify.log}"

# Normaliza intervalo
case "$INTERVAL_MIN" in
  ''|*[!0-9]*) INTERVAL_MIN="15" ;;
esac
[ "$INTERVAL_MIN" -lt 1 ] && INTERVAL_MIN="15"
INTERVAL_SEC=$((INTERVAL_MIN * 60))

# Uptime (segundos desde boot) -> mejor que hora real en initramfs
UP="$(cut -d' ' -f1 /proc/uptime 2>/dev/null || echo 0)"
UP="${UP%.*}"
case "$UP" in ''|*[!0-9]*) UP="0" ;; esac

# Decide si toca enviar
LAST="0"
[ -f "$STATE_LAST" ] && LAST="$(cat "$STATE_LAST" 2>/dev/null || echo 0)"
case "$LAST" in ''|*[!0-9]*) LAST="0" ;; esac

if [ "$LAST" -ne 0 ]; then
  DIFF=$((UP - LAST))
  [ "$DIFF" -lt "$INTERVAL_SEC" ] && exit 0
fi

# Nivel actual (1..4)
LEVEL="1"
[ -f "$STATE_LEVEL" ] && LEVEL="$(cat "$STATE_LEVEL" 2>/dev/null || echo 1)"
case "$LEVEL" in 1|2|3|4) : ;; *) LEVEL="1" ;; esac

# Obtén IPv4 pública (reintentos suaves)
IP=""
i=0
while [ "$i" -lt 6 ]; do
  IP="$(wget --no-check-certificate -qO- https://api.ipify.org 2>/dev/null || true)"
  [ -n "$IP" ] && break
  sleep 5
  i=$((i+1))
done

# Log helper
log() {
  # Log con uptime para que tenga sentido en initramfs
  printf '[uptime=%ss] %s\n' "$UP" "$*" >> "$LOG_FILE" 2>/dev/null || true
}

if [ -z "$IP" ]; then
  log "No pude obtener IPv4 pública (ipify)."
  exit 0
fi

# Mensajes (Markdown legacy)
case "$LEVEL" in
  1)
    TEXT="*${LABEL}*\\n☝️🤓 Mi IP es: \`${IP}\`\\n🫦 Desbloquéame: \`ssh -p ${SSH_PORT} root@${IP}\`"
    ;;
  2)
    TEXT="*${LABEL}*\\n😐 Olvidón, sigo aquí esperando... Mi IP es: \`${IP}\`\\n🔓 Desbloquéame ya: \`ssh -p ${SSH_PORT} root@${IP}\`"
    ;;
  3)
    TEXT="*${LABEL}*\\n🤨 ¿Aqué esperas? Mi IP es: \`${IP}\`\\n🔓 Desbloquéame, que es para hoy: \`ssh -p ${SSH_PORT} root@${IP}\`"
    ;;
  4)
    TEXT="*${LABEL}*\\n😡 O me desbloqueas o tú y yo vamos a a tener un problema.\\n📌 IP: \`${IP}\`\\n👉👉👉👉 \`ssh -p ${SSH_PORT} root@${IP}\`"
    ;;
esac

PAYLOAD="$(printf '{"chat_id":"%s","text":"%s","parse_mode":"Markdown","disable_web_page_preview":true}' "$CHAT_ID" "$TEXT")"

# Envía
RESP="$(wget --no-check-certificate -qO- \
  --header="Content-Type: application/json" \
  --post-data="$PAYLOAD" \
  "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" 2>/dev/null || true)"

case "$RESP" in
  *'"ok":true'*)
    log "Enviado OK (nivel=$LEVEL, ip=$IP)."
    ;;
  *)
    log "Fallo al enviar (nivel=$LEVEL, ip=$IP). Resp: ${RESP:-<vacío>}"
    ;;
esac

# Guarda último envío y sube nivel (hasta 4)
echo "$UP" > "$STATE_LAST" 2>/dev/null || true

if [ "$LEVEL" -lt 4 ]; then
  echo $((LEVEL+1)) > "$STATE_LEVEL" 2>/dev/null || true
else
  echo 4 > "$STATE_LEVEL" 2>/dev/null || true
fi

exit 0
```

Ajustamos los permisos:

```sh
sudo chown root:root /usr/share/initramfs-tools/telegram-notify.sh
sudo chmod +x /usr/share/initramfs-tools/telegram-notify.sh
```

Y creamos un hook para que se incluya en `initramfs`, creando el archivo `/usr/share/initramfs-tools/hooks/telegram-notify` con el contenido:

```sh
#!/bin/sh -e

if [ "$1" = "prereqs" ]; then exit 0; fi
. /usr/share/initramfs-tools/hook-functions

# Directorios destino
mkdir -p $DESTDIR/etc
mkdir -p $DESTDIR/usr/local/sbin

# Config + script
cp /usr/share/initramfs-tools/telegram.env       $DESTDIR/etc/telegram.env
cp /usr/share/initramfs-tools/telegram-notify.sh $DESTDIR/usr/local/sbin/telegram-notify.sh

chmod 600 $DESTDIR/etc/telegram.env
chmod 755 $DESTDIR/usr/local/sbin/telegram-notify.sh
```

Ajustamos los permisos:

```sh
sudo chmod +x /usr/share/initramfs-tools/hooks/telegram-notify
```

Ahora crearemos una tarea de `crontab` para ejecutar el script. El problema que nos encontramos para esto es que los comandos disponibles cuando estamos en `ìnitramfs` son muy pocos y no incluyen `crontab`. Concretamente, los comandos que hay disponibles son una versión reducida de [BusyBox](https://busybox.net/) y para poder usar `crontab` necesitamos la versión completa.

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

Escribimos `sudo chmod +x /usr/share/initramfs-tools/hooks/crontab` para hacer el archivo ejecutable y esto lo que hará es crear el directorio y copiar un archivo con la configuración de `crontab` que vamos a crear ahora mismo. Escribimos en `/usr/share/initramfs-tools/crontab` la siguiente línea para ejecutar el script:

```
* * * * * sleep 20 ; /usr/local/sbin/telegram-notify.sh >> /tmp/telegram-notify.cron.log 2>&1 &
```

Ajustamos los permisos:

```sh
sudo chown root:root /usr/share/initramfs-tools/crontab
sudo chmod 644 /usr/share/initramfs-tools/crontab
```

Aunque ya podemos usar `crontab` en `initramfs`, nos falta hacer que se empiece a ejecutar, así que tenemos que crear otro archivo que se encargue de iniciar `crond`, que ejecutará lo que haya en `crontab`. Ese archivo será `/usr/share/initramfs-tools/scripts/init-premount/crond` y tendrá este contenido:

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

## Resolviendo problemas

Un problema con el que nos podemos encontrar cuando intentamos conectarnos al servidor por SSH primero para desencriptar los discos y después para el uso normal, es que nos salta este error tras escribir `ssh admin@wupp.dev`:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ED25519 key sent by the remote host is
SHA256:I9TWN1skf97h/X9sJgevzZT1kZZQ9hFRQadccKljr7I.
Please contact your system administrator.
Add correct host key in /home/user/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /home/user/.ssh/known_hosts:2
  remove with:
  ssh-keygen -f "/home/user/.ssh/known_hosts" -R "wupp.dev"
Host key for wupp.dev has changed and you have requested strict checking.
Host key verification failed.
```

¿Qué es lo que ocurre? Pues que la IP a la que nos estamos conectando es la misma pero las claves públicas del servidor, que son las que se utilizan para verificar su identidad, son distintas. Esto el ordenador lo confunde _(por precaución)_ con un intento de suplantación de la identidad del servidor, cosa que sería muy peligrosa en caso de ser cierta. Por eso no nos deja conectarnos.

Para que nos deje conectarnos es tan sencillo como eliminar el archivo de `known_hosts` mencionado en el error, pero entonces cada vez que reiniciásemos el servidor tendríamos que estar eliminando ese archivo para poder conectarnos de nuevo y, si de verdad estuviesen intentando suplantar la identidad del servidor, no nos enteraríamos.

Por suerte, hay un apaño. Si ponemos Dropbear y OpenSSH Server en puertos distintos en el servidor, podemos utilizar una identidad distinta para cada puerto cuando nos conectemos.

## Reforzando la seguridad

Todavía tenemos que desactivar el acceso con usuario y contraseña por SSH, que es muy poco seguro, para restringir el acceso únicamente a las claves públicas permitidas. Vamos a modificar la configuración de OpenSSH pero, en lugar de modificar directamente `/etc/ssh/sshd_config`, vamos a crear un archivo nuevo en `/etc/ssh/sshd_config.d/` llamado `99-custom.conf`, que contendrá las líneas que queremos cambiar o añadir. De esta forma, si en el futuro actualizamos OpenSSH Server y se sobreescribe el archivo de configuración principal, no perderemos los cambios que hemos hecho.

Dentro de `/etc/ssh/sshd_config.d/99-custom.conf` introducimos las siguientes líneas:

```ssh-config
Port 22
PasswordAuthentication no
PermitRootLogin no
AllowUsers admin
X11Forwarding no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

Veamos qué significa cada línea:

- `Port 22` indica el puerto en el que se ejecuta OpenSSH Server.
- `PasswordAuthentication no` prohíbe los accesos con contraseña.
- `PermitRootLogin no` evita que se pueda acceder directamente al usuario `root`.
- `AllowUsers admin` es opcional pero recomendable, restringe los usuarios a los que se puede acceder directamente, se pueden poner varios separándolos por espacios.
- `X11Forwarding no` evita que se puedan ejecutar aplicaciones gráficas de forma remota, pues es algo que en un principio no vamos a usar.
- `KbdInteractiveAuthentication no` deshabilita otro método de autenticación que no vamos a usar.
- `PubkeyAuthentication yes` habilita la autenticación por clave pública.
- `AuthorizedKeysFile .ssh/authorized_keys` indica la ruta del archivo donde se encuentran las claves públicas autorizadas.

::: warning ADVERTENCIA
Antes de hacer efectivos los cambios, tenemos que asegurarnos de que existe el archivo `/home/admin/.ssh/authorized_keys` y que tiene las claves públicas de los dispositivos desde los que nos queramos conectar al servidor, porque si no están no podremos conectarnos.
:::

Además, si hemos cambiado el puerto, debemos asegurarnos de que:

- El nuevo puerto está abierto en el router.
- El nuevo puerto está permitido por el firewall. En el caso de UFW: `sudo ufw allow XXXX/tcp` donde `XXXX` es el nuevo puerto.

::: tip RELATO
Iván mientras cambiaba el puerto de OpenSSH _(desde un sitio lejano a la ubicación del servidor)_ se olvidó de permitir el nuevo puerto en el firewall y pasaron cosas malas, si quieres leer la historia completa puedes hacerlo [aquí](../relatos/bloqueo-ssh).
:::

Por último, hacemos efectivos los cambios reiniciando el servicio:

```sh
sudo systemctl restart ssh
```

Y ya deberíamos de poder conectarnos sin que nos pida la contraseña del usuario `admin`.

Podemos verificar que se ha deshabilitado el acceso por contraseña intentando conectarnos con `ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -p 2222 admin@wupp.dev`, que no nos debjará, o conectándonos con `ssh -vvv -p 2222 admin@wupp.dev` y buscando en la salida la línea `Authentications that can continue: publickey`, que indica que solo se permite la autenticación por clave pública.

## Virtual Network Computing (VNC)

¿Qué demonios es un VNC? Pues básicamente un entorno gráfico de escritorio remoto. Se utiliza para controlar remotamente otros ordenadores con un escritorio como si fuese realmente tu propio ordenador. ¿No acabamos de desactivar eso en la configuración del servidor SSH? Pues sí, pero vamos a usarlo de otra forma que es más segura y no necesita esa opción activada.

Nosotros seguimos [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-on-debian-10). Aunque puede haber algunos más actualizados como [este](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-on-debian-11).

Como detalles, no hemos establecido una contraseña para solo vista.

Aquí da igual cambiar o no el puerto por defecto, ya que no estará expuesto directamente a Internet.

::: danger PELIGRO
Ni se te ocurra exponer el puerto del VNC directamente a Internet. No hay que abrirlo en el router ni permitirlo en el firewall. Siempre hay que conectarse al VNC a través de un túnel SSH.
:::

En nuestro ordenador podemos instalar `xtightvncviewer` para conectarnos. Solo tendremos que conectarnos mediante SSH al servidor indicando que queremos redirigir el puerto 5901 de nuestro ordenador al 5901 del del servidor. Esto lo podemos hacer con `ssh -L 5901:127.0.0.1:5901 admin@wupp.dev`. Una vez estemos conectados, podemos ejecutar `xtightvncviewer` desde la terminal, conectarnos a `localhost:5901` y poner la contraseña del VNC.

En nuestro caso, al intentar conectarnos nos encontramos con el siguiente error:

![Fallo VNC](../images/fallo-vnc.png)

Por suerte, se solucionó instalando un paquete y reiniciando el servidor VNC:

```sh
sudo apt install dbus-x11
sudo systemctl restart vncserver@1
```

::: info
Es raro necesitar el servidor VNC, pero justo estoy escribiendo esta parte antes que la de configuración de servidor SSH porque necesito abrir unos puertos en el router y para eso necesito acceder con un navegador desde el servidor, porque no estoy en la misma red.
Como era de esperar, Debian no venía con navegador instalado, así que para poder usar uno con el VNC instalé Firefox con `sudo apt install firefox-esr`.
:::

## Embelleciendo

Cuando iniciamos sesión por SSH nos aparece un mensaje como este:

```
Linux server 5.10.0-21-amd64 #1 SMP Debian 5.10.162-1 (2023-01-21) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Mon May 24 01:23:45 2032 from 192.168.1.1
```

Que no es muy bonito la verdad, así que podemos hacer unos cambios para que quede un mensaje mucho más lindo.

1. Editamos `/etc/ssh/sshd_config.d/99-custom.conf` para añadir las siguientes líneas:

```ssh-config
PrintMotd no
PrintLastLog no
Banner none
```

2. Quitamos el resto del mensaje de bienvenida con `sudo truncate -s 0 /etc/motd`.
3. Editamos `/etc/pam.d/sshd` para asegurarnos de que las siguientes líneas están comentadas:

```ssh-config
# Print the message of the day upon successful login.
# This includes a dynamically generated part from /run/motd.dynamic
# and a static (admin-editable) part from /etc/motd.
#session    optional     pam_motd.so  motd=/run/motd.dynamic
#session    optional     pam_motd.so noupdate

# Print the status of the user's mailbox upon successful login.
#session    optional     pam_mail.so standard noenv # [1]
```

4. Instalamos `figlet`, `lolcat` y `wtmpdb` para tener colores, cabeceras personalizadas y la información de la última conexión `sudo apt update && sudo apt install figlet lolcat wtmpdb`.
5. Creamos el archivo `~/welcome_message.sh`:

```sh
#!/bin/bash

# Cabecera personalizada
echo "WUPP . DEV" | figlet | lolcat

# Última conexión
last_login=$(last -i -F $USER | head -n 2 | tail -n 1)
login_time=$(echo $last_login | awk '{print $5 " " $6 " " $7 " " $8}')
echo -e "\e[1;33mÚltima conexión:\e[0m" $login_time

# Información del uso del sistema
echo -e "\e[1;33mUso del CPU:\e[0m" $(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}')
echo -e "\e[1;33mUso de memoria:\e[0m" $(free -m | awk 'NR==2{printf "%.2f%%\t\t", $3*100/$2 }')

# Espacio en disco
echo -e "\e[1;33mEspacio en disco:\e[0m"
df -h | grep -vE '^tmpfs|udev' | awk '{print $1 "\t" $5 "\t" $6}' | column -t | lolcat

echo ""

```

6. Hacemos el archivo ejecutable `sudo chmod +x ~/welcome_message.sh` y lo añadimos a `~/.bashrc`:

```sh
# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# ...

# Add the welcome message
~/welcome_message.sh
```

7. Reiniciamos el servicio de SSH `sudo systemctl restart ssh`, nos desconectamos y nos volvemos a conectar para comprobar que funciona.
