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