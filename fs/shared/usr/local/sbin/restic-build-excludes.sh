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