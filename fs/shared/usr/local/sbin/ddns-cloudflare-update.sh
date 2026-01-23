#!/usr/bin/env bash
set -euo pipefail

: "${CF_API_TOKEN:?Falta CF_API_TOKEN}"
: "${ZONE_NAME:?Falta ZONE_NAME (ej: wupp.dev)}"

API="https://api.cloudflare.com/client/v4"
AUTH=(-H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json")

STATE_DIR="/var/lib/ddns-cloudflare"
OLD4_FILE="${STATE_DIR}/old_ipv4"
OLD6_FILE="${STATE_DIR}/old_ipv6"

mkdir -p "${STATE_DIR}"
chmod 700 "${STATE_DIR}"

# --- Detecta IP pública actual ---
NEW4="$(curl -4 -fsS https://api.ipify.org || true)"
NEW6="$(curl -6 -fsS https://api64.ipify.org || true)"

if [[ -z "${NEW4}" && -z "${NEW6}" ]]; then
  echo "No he podido detectar IPv4 ni IPv6 pública. Salgo."
  exit 1
fi

# --- Obtiene zone_id (por nombre) ---
ZONE_ID="$(
  curl -fsS "${AUTH[@]}" \
    "${API}/zones?name=${ZONE_NAME}&status=active" \
  | jq -r '.result[0].id // empty'
)"

if [[ -z "${ZONE_ID}" ]]; then
  echo "No encuentro la zona ${ZONE_NAME} en Cloudflare (zone_id vacío)."
  exit 1
fi

# Función: lista todos los DNS records (paginado) de un tipo
list_records_by_type() {
  local rtype="$1"
  local page=1
  while :; do
    local resp
    resp="$(curl -fsS "${AUTH[@]}" \
      "${API}/zones/${ZONE_ID}/dns_records?type=${rtype}&per_page=100&page=${page}")"

    echo "${resp}" | jq -c '.result[]'

    local total_pages
    total_pages="$(echo "${resp}" | jq -r '.result_info.total_pages // 1')"
    if (( page >= total_pages )); then
      break
    fi
    ((page++))
  done
}

# Función: actualiza un record preservando "proxied" y "ttl"
update_record() {
  local id="$1" type="$2" name="$3" content="$4" ttl="$5" proxied="$6"

  # ttl=1 significa "auto" (válido en Cloudflare). :contentReference[oaicite:3]{index=3}
  curl -fsS "${AUTH[@]}" -X PATCH \
    "${API}/zones/${ZONE_ID}/dns_records/${id}" \
    --data "$(jq -n \
      --arg type "$type" \
      --arg name "$name" \
      --arg content "$content" \
      --argjson ttl "$ttl" \
      --argjson proxied "$proxied" \
      '{type:$type,name:$name,content:$content,ttl:$ttl,proxied:$proxied}')" >/dev/null
}

# --- IPv4 (A) ---
if [[ -n "${NEW4}" ]]; then
  OLD4=""
  [[ -f "${OLD4_FILE}" ]] && OLD4="$(cat "${OLD4_FILE}" || true)"

  if [[ -n "${OLD4}" && "${OLD4}" != "${NEW4}" ]]; then
    echo "IPv4 cambia: ${OLD4} -> ${NEW4}. Actualizando A que apunten a la antigua..."

    mapfile -t A_RECS < <(
      list_records_by_type "A" \
      | jq -r --arg old "${OLD4}" 'select(.content == $old) | @base64'
    )

    for b64 in "${A_RECS[@]}"; do
      rec="$(echo "$b64" | base64 -d)"
      id="$(echo "${rec}" | jq -r '.id')"
      name="$(echo "${rec}" | jq -r '.name')"
      ttl="$(echo "${rec}" | jq -r '.ttl // 1')"
      proxied="$(echo "${rec}" | jq -r '.proxied // false')"

      update_record "${id}" "A" "${name}" "${NEW4}" "${ttl}" "${proxied}"
      echo "  OK A ${name} -> ${NEW4}"
    done
  else
    echo "IPv4: sin cambios (o no había estado previo)."
  fi

  # Guardamos estado
  echo -n "${NEW4}" > "${OLD4_FILE}"
  chmod 600 "${OLD4_FILE}"
fi

# --- IPv6 (AAAA) ---
if [[ -n "${NEW6}" ]]; then
  OLD6=""
  [[ -f "${OLD6_FILE}" ]] && OLD6="$(cat "${OLD6_FILE}" || true)"

  if [[ -n "${OLD6}" && "${OLD6}" != "${NEW6}" ]]; then
    echo "IPv6 cambia: ${OLD6} -> ${NEW6}. Actualizando AAAA que apunten a la antigua..."

    mapfile -t AAAA_RECS < <(
      list_records_by_type "AAAA" \
      | jq -r --arg old "${OLD6}" 'select(.content == $old) | @base64'
    )

    for b64 in "${AAAA_RECS[@]}"; do
      rec="$(echo "$b64" | base64 -d)"
      id="$(echo "${rec}" | jq -r '.id')"
      name="$(echo "${rec}" | jq -r '.name')"
      ttl="$(echo "${rec}" | jq -r '.ttl // 1')"
      proxied="$(echo "${rec}" | jq -r '.proxied // false')"

      update_record "${id}" "AAAA" "${name}" "${NEW6}" "${ttl}" "${proxied}"
      echo "  OK AAAA ${name} -> ${NEW6}"
    done
  else
    echo "IPv6: sin cambios (o no había estado previo)."
  fi

  # Guardamos estado
  echo -n "${NEW6}" > "${OLD6_FILE}"
  chmod 600 "${OLD6_FILE}"
fi

echo "DDNS Cloudflare: terminado."