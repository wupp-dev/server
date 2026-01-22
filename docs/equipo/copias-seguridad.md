---
order: 10
---

# Copias de seguridad

Si le tienes algún tipo de aprecio a los datos y el tiempo que has invertido en el servidor, es necesario que hagas copias de seguridad periódicas de los datos más importantes.

Hay muchas formas de hacer copias de seguridad, que podemos dividir en dos grandes grupos:

- **Copias de seguridad locales:** en un dispositivo físico cerca del servidor (otro disco, USB, NAS...).
- **Copias de seguridad remotas:** en un servidor remoto o en la nube.

Lo ideal es combinar ambos tipos. Una regla común es la 3-2-1:

- Tener al menos **3 copias** de los datos importantes.
- En al menos **2 tipos** de almacenamiento distintos.
- Con al menos **1 copia** en una ubicación distinta (remota).

Además, conviene ajustar frecuencia y retención según lo importante que sea cada dato y cuánto cambie.

## Copias de seguridad locales

Esta parte está pendiente de redacción. Aquí podríamos hablar del uso de snapshots con Btrfs y copias en discos duros externos.

## Copias de seguridad remotas (Google Drive + restic)

Para las copias de seguridad remotas, una opción sencilla y gratuita es usar **Google Drive**, especialmente si tenemos Google Workspace, ya que ofrece una gran cantidad de espacio de almacenamiento.

Para ello, podemos usar la herramienta `rclone`, que permite sincronizar archivos y directorios con múltiples servicios de almacenamiento en la nube, incluyendo Google Drive. Junto a `rclone`, usaremos `restic`, una herramienta de copias de seguridad que soporta múltiples backends, incluyendo `rclone` y permite hacer copias cifradas.

Estas copias de seguridad son incrementales: aunque se hagan copias completas de los directorios que indiquemos, en cada ejecución solo se almacenan los cambios con respecto a copias anteriores. Los archivos que no han cambiado no se vuelven a subir ni a ocupar espacio adicional, ya que restic los detecta y reutiliza.

### Instalación

Comenzamos instalando ambas herramientas:

```sh
sudo apt update
sudo apt install restic rclone
```

### Configuración de rclone con Google Drive

*Hemos seguido [esta guía](https://rclone.org/drive/#making-your-own-client-id) para usar un Client ID propio (recomendado para mejor rendimiento y límites).*

Configuramos `rclone` para que pueda acceder a nuestra cuenta de Google Drive.

Comenzamos creando un proyecto en la [Google Cloud Console](https://console.cloud.google.com/) y habilitando la API de Google Drive para ese proyecto.

Después, tendremos que crear una «Pantalla de consentimiento de OAuth». En caso de estar en una organización de Google Workspace, en el público seleccionaremos «Interno» y, en caso contrario, «Usuarios externos».

Después, en la configuración de «Acceso a los datos», le damos a «Agregar o quitar permisos» y, en el recuadro de «Agrega permisos manualmente» pegamos lo siguiente:

```
https://www.googleapis.com/auth/docs,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/drive.metadata.readonly
```

Además de agregarlos a la tabla y actualizar, es importante **no olvidarse de darle al botón de guardar** que aparecerá en la parte inferior de la página.

![Creación del proyecto en Google Cloud Console](../images/google-cloud-scope.png)

Llegó el momento de crear el ID de cliente de OAuth. Volvemos a la sección de «APIs y servicios» y a «Credenciales»:

![Creación del proyecto en Google Cloud Console](../images/google-cloud-credentials.png)

Al crear el ID de cliente de OAuth indicaremos que se trata de una «App de escritorio» y anotamos el ID de cliente y el secreto. Además, si como público escogimos «Usuarios externos», tendremos que añadirnos como usuario de prueba.

Después, ejecutamos los siguientes comandos para iniciar la configuración de `rclone`:

```sh
sudo su
rclone config
```

Y vamos configurando todo según nos pregunta, teniendo en cuenta dos cosas:

+ Cuando nos pida iniciar sesión en el navegador, si estamos en un servidor remoto sin entorno gráfico, tendremos que copiar la URL que nos da `rclone` y pegarla en un navegador de nuestro ordenador. Además, tendremos que iniciar una segunda conexión ssh con el parámetro `-L 53682:localhost:53682` para redirigir el puerto y que la autenticación funcione.
+ Cuando nos pregunte si queremos configurar el acceso a un «Shared Drive», tendremos que responder que sí solo si queremos usar una de las unidades compartidas existentes para guardar los datos. En caso de no elegirla, los datos se guardarán en «Mi unidad».

Aquí hay un ejemplo configurando un acceso a una unidad compartida:

```
2026/01/22 14:04:17 NOTICE: Config file "/root/.config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n

Enter name for new remote.
name> gdrive

Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
...
Storage> drive

Option client_id.
Google Application Client Id
Setting your own is recommended.
See https://rclone.org/drive/#making-your-own-client-id for how to create your own.
If you leave this blank, it will use an internal key which is low performance.
Enter a value. Press Enter to leave empty.
client_id> blablabla.apps.googleusercontent.com

Option client_secret.
OAuth Client Secret.
Leave blank normally.
Enter a value. Press Enter to leave empty.
client_secret> ABCD-1234

Option scope.
Scope that rclone should use when requesting access from drive.
Choose a number from below, or type in your own value.
Press Enter to leave empty.
...
scope> 1

Option service_account_file.
Service Account Credentials JSON file path.
Leave blank normally.
Needed only if you want use SA instead of interactive login.
Leading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.
Enter a value. Press Enter to leave empty.
service_account_file>

Edit advanced config?
y) Yes
n) No (default)
y/n>

Use auto config?
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine

y) Yes (default)
n) No
y/n>

2026/01/22 14:05:26 NOTICE: Make sure your Redirect URL is set to "http://127.0.0.1:53682/" in your custom config.
2026/01/22 14:05:26 NOTICE: If your browser doesn't open automatically go to the following link: http://127.0.0.1:53682/auth?state=xyz
2026/01/22 14:05:26 NOTICE: Log in and authorize rclone for access
2026/01/22 14:05:26 NOTICE: Waiting for code...
2026/01/22 14:06:18 NOTICE: Got code
Configure this as a Shared Drive (Team Drive)?

y) Yes
n) No (default)
y/n> y

Option config_team_drive.
Shared Drive
Choose a number from below, or type in your own string value.
Press Enter for the default (1A2B3C4D5E6F7G8H9I0J).
...
config_team_drive> 7

Configuration complete.
Options:
- type: drive
- client_id: blablabla.apps.googleusercontent.com
- client_secret: ABCD-1234
- scope: drive
- token: {...}
- team_drive: 1A2B3C4D5E6F7G8H9I0J
- root_folder_id:
Keep this "gdrive" remote?
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d>

Current remotes:

Name                 Type
====                 ====
gdrive               drive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```

### Configuración de restic

Después, creamos la carpeta donde irán las copias de seguridad en Google Drive:

```sh
rclone mkdir gdrive:restic-backups
```

Generamos una contraseña segura para cifrar las copias de seguridad con `restic`:

```sh
install -m 0600 /dev/null /root/.restic-pass
openssl rand -hex 64 | tee /root/.restic-pass >/dev/null
```

::: warning ADVERTENCIA
Es muy importante guardar esta contraseña en un lugar seguro, ya que sin ella no podremos recuperar las copias de seguridad.
:::

Creamos las variables de entorno necesarias para `restic`:

```sh
install -m 0600 /dev/null /etc/restic.env
```

Y editamos el archivo para añadir las siguientes líneas:

```sh
RESTIC_REPOSITORY=rclone:gdrive:restic-backups
RESTIC_PASSWORD_FILE=/root/.restic-pass
```

Iniciamos el repositorio de `restic`:

```sh
set -a
. /etc/restic.env
set +a
restic init
```

### Exclusiones

Hay ciertos archivos y carpetas que no es necesario incluir en las copias de seguridad, como archivos temporales, cachés, logs, etc. Vamos a crear un generador de exclusiones para `restic`, para ello creamos `/usr/local/sbin/restic-build-excludes.sh` con el siguiente contenido:

```sh
#!/bin/bash
set -euo pipefail

OUT="/etc/restic-excludes.txt"
TMP="$(mktemp "${OUT}.tmp.XXXXXX")"
trap 'rm -f "$TMP"' EXIT

# Montajes permitidos (NO se excluyen).
# Por defecto: permitimos / y /var, ya que este último está montado en otro disco.
ALLOW_MOUNTS=(
  "/"
  "/var"
)

# --- 1) Base: rutas que no interesa respaldar (OJO, /mnt y /media las excluimos porque ahí no tenemos nada) ---
cat > "$TMP" <<'EOF'
# Pseudo-filesystems y runtime
/proc
/sys
/dev
/run
/tmp
/mnt
/media
/lost+found
/var/tmp
/var/cache
/var/run
/swapfile

# Docker (que no está en /var porque lo movimos)
/docker/btrfs
/docker/image
/docker/containers
/docker/buildkit
/docker/tmp
/docker/network

# Caches de usuarios
/home/**/.cache
/home/**/.npm
/home/**/.nvm
/home/**/.cargo
/home/**/.rustup
/home/**/.bun
/home/**/.pm2
/home/**/.local/share/pnpm/store

# PostgreSQL temporales típicos
**/pg_stat_tmp
**/pg_stat_tmp/**
**/postmaster.pid
EOF

# --- 2) Excluir puntos de montaje (excepto allowlist) ---
# Utilizamos findmnt si está disponible.
get_mount_targets() {
  if command -v findmnt >/dev/null 2>&1; then
    findmnt -rn -o TARGET
    return 0
  fi

  # Fallback: /proc/self/mountinfo (campo 5 = mount point)
  awk '{print $5}' /proc/self/mountinfo 2>/dev/null || true
}

is_allowed_mount() {
  local m="$1"
  for a in "${ALLOW_MOUNTS[@]}"; do
    if [[ "$m" == "$a" ]]; then
      return 0
    fi
  done
  return 1
}

# Añadimos mounts, uno por línea
while IFS= read -r mnt; do
  [[ -n "$mnt" ]] || continue

  # Normalizamos
  if [[ "$mnt" != "/" ]]; then
    mnt="${mnt%/}"
    [[ -n "$mnt" ]] || mnt="/"
  fi

  # No excluimos allowlist
  if is_allowed_mount "$mnt"; then
    continue
  fi

  # Evita duplicar lo ya listado en la base
  echo "$mnt" >> "$TMP"
done < <(get_mount_targets)

# --- 3) Limpieza: deduplicar, ordenar, eliminar líneas vacías y comentarios duplicados ---
{
  # Primero, comentarios (líneas que empiezan por #)
  grep -E '^\s*#' "$TMP" || true
  # Luego, rutas: quitamos comentarios, vacíos, deduplicamos y ordenamos
  grep -v -E '^\s*#' "$TMP" | awk 'NF' | sort -u
} > "${TMP}.clean"

mv -f "${TMP}.clean" "$TMP"

# --- 4) Permisos y escritura atómica final ---
chmod 600 "$TMP"
chown root:root "$TMP"
mv -f "$TMP" "$OUT"
```

::: warning AVISO
La lista de exclusiones es orientativa y puede variar según las necesidades de cada servidor. Es importante revisarla y ajustarla según los datos que se quieran respaldar.
:::

Ajustamos los permisos del script:

```sh
sudo chmod 0755 /usr/local/sbin/restic-build-excludes.sh
sudo chown root:root /usr/local/sbin/restic-build-excludes.sh
```

### Programación automática

Generamos el script de backup en `/usr/local/sbin/restic-backup.sh` con el siguiente contenido:

```sh
#!/bin/sh
set -e

# Carga variables
set -a
. /etc/restic.env
set +a

# Reconstruye excludes si existe el generador
if [ -x /usr/local/sbin/restic-build-excludes.sh ]; then
  /usr/local/sbin/restic-build-excludes.sh
fi

# Realizar la copia de seguridad
restic backup / --exclude-file=/etc/restic-excludes.txt

# Establece la política de retención:
# Mantiene como máximo una copia por día de los últimos 7 días.
# Después, una copia por semana de las últimas 4 semanas.
# Después, una copia por mes de los últimos 12 meses.
# Y, finalmente, una copia por año de los últimos 2 años.
restic forget \
  --keep-daily 7 \
  --keep-weekly 4 \
  --keep-monthly 12 \
  --keep-yearly 2 \
  --prune
```

Ajustamos los permisos del script:

```sh
sudo chmod 0750 /usr/local/sbin/restic-backup.sh
sudo chown root:root /usr/local/sbin/restic-backup.sh
```

Vamos a crear un servicio de systemd para ejecutar el script de backup. Creamos `/etc/systemd/system/restic-backup.service` con el siguiente contenido:

```ini
[Unit]
Description=Restic backup to Google Drive
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/restic-backup.sh
User=root
Group=root
NoNewPrivileges=true
PrivateTmp=true
```

Y un timer para ejecutarlo periódicamente, creando `/etc/systemd/system/restic-backup.timer` con el siguiente contenido:

```ini
[Unit]
Description=Daily restic backup

[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=30m

[Install]
WantedBy=timers.target
```

Finalmente, activamos e iniciamos el timer:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now restic-backup.timer
```

### Verificación de las copias

Podemos verificar el estado de las copias de seguridad con el siguiente comando:

```sh
set -a; . /etc/restic.env; set +a
restic snapshots
restic check
```

Y hacer una prueba de restauración para asegurarnos de que todo funciona correctamente. En este caso vamos a probar a restaurar la carpeta `/etc` en una ubicación temporal:

```sh
mkdir -p /tmp/restore-test
restic restore latest --target /tmp/restore-test --include /etc
```

::: tip RECOMENDACIÓN
Revisa periódicamente que las copias de seguridad se están realizando correctamente y haz pruebas de restauración para asegurarte de que los datos se pueden recuperar sin problemas.
:::