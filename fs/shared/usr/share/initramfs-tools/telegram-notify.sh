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