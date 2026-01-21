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