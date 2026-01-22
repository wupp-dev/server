---
order: 1
---

# Bloqueo de SSH

De cuando Iván escogió no tener inteligencia estando lejos del servidor.

## Contexto histórico

**28 de julio de 2022.** El servidor, situado en Granada, estaba pendiente de casi toda configuración, solo tenía bien configurado Dropbear por si se reiniciaba o se iba la luz. El servidor de OpenSSH estaba aun en el puerto 22 y tenía activado el acceso por usuario y contraseña.

Iván, estando en Valencia y sabiendo que quedaba un mes al menos hasta que pasase por Granada, decidió que era buena idea cambiar el puerto de OpenSSH.

## La cagada

Primero se acordó de que tenía que abrir los puertos en el router, pero claro, para eso necesitaba configurar el servidor VNC _(de ahí surgió esa parte de la guía)_ para poder meterse con Firefox a la IP del router y abrir el nuevo puerto.

Esto le mantuvo ocupado todo el día, así que nos trasladamos al 29 de julio, donde se disponía, con los puertos abiertos en el router, a cambiar el puerto de SSH.

Cambia el puerto, reinicia el servicio SSH, cierra la conexión e intenta volver a conectarse pero no funciona.

**HOSTIA EL FIREWALL**

![Panik](../images/panik.png)

Efectivamente, se le había olvidado permitir el nuevo puerto de SSH en el firewall, así que no había manera de poder volver a conectarse al servidor hasta que fuese a Granada.

## El rescate

Pero, ¿y si no todo estaba perdido? Iván empezó a teorizar una posible forma de recuperar el servidor. Si el servidor se reiniciaba, se quedaría esperando a que se desencriptasen los discos duros con Dropbear, y Dropbear todavía estaba con el puerto 22, así que si desde ahí fuera capaz de editar la configuración de OpenSSH, podría recuperar el servidor. Solo necesitaba a alguien que reiniciase el servidor y ya podría hacer el resto del trabajo.

La persona que podía ir a reiniciar el servidor fue fácil de encontrar. Pero había que hacer pruebas para ver si efectivamente era posible recuperar el servidor desde ese punto.

### Entorno de pruebas

Preparar el entorno de pruebas fue fácil, pues ya tenía una máquina virtual con Debian que había usado para las capturas de la guía, solo tenía que hacer la poca configuración inicial que tenía el servidor y empezar a hacer pruebas.

### Primeros enfoques

Al principio, lo que intenté fue desencriptar y montar el disco manualmente desde initramfs para poder editar el archivo de configuración de OpenSSH.

Esto no dio buenos resultados porque el disco siempre se marcaba como ocupado y no dejaba montarlo.

### Ahondando en el funcionamiento de Linux

Como esto no funcionaba, tocaba entender mejor cómo funcionaba Initramfs y las fases en las que se divide, que viene bien explicado en la [wiki de Ubuntu](https://wiki.ubuntu.com/Initramfs).

Además, vi que por defecto el disco duro se montaba en solo lectura desde initramfs y, cuando seguía el proceso de arranque, ya se montaba escribible. Así que tenía que:

- Conseguir que initramfs montase el disco escribible.
- Conseguir que el, una vez montado, borrase el archivo de configuración de OpenSSH para que se regenerase el por defecto.

Este último enfoque resultó no ser válido, porque OpenSSH no regenera el archivo de configuración, simplemente deja de ejecutarse. Así que el enfoque cambió a borrar el archivo de configuración de UFW, que hace que deje de funcionar y, por tanto, que todos los puertos estén abiertos desde el servidor.

### Últimos intentos

Intenté modificar los scripts de inicio que se ejecutan después de desencriptar el disco para que montasen el disco en escritura y borrasen el archivo de configuración, pero por mucho que cambiaba los parámetros, parecía no afectar y seguía en solo lectura.

Finalmente, ya con pocas esperanzas, el 6 de agosto decidí cambiar ligeramente el enfoque y editar únicamente el archivo `/init`, que es el que se encarga de llamar a todos los scripts de inicio. Concretamente añadí estas líneas justo antes del comentario `# Move virtual filesystems over to the real filesystem`:

```sh
mount -w -t btrfs -o remount ${ROOT} ${rootmnt}
rm -f ${rootmnt}/etc/ufw/ufw.conf
unset ROOT
```

Borrando `unset ROOT` de más arriba, ya que esa variable contenía el nombre del disco duro con el sistema.

**Funcionó.** Y después de eso solo había que reinstalar y configurar de nuevo UFW.

::: danger PELIGRO
Esta técnica desactiva completamente el firewall del sistema. Solo debe usarse como último recurso de recuperación y restaurarse inmediatamente tras iniciar el sistema.
:::

### Recuperando el servidor

Sabiendo esto, solo hubo que esperar a que la persona encargada de reiniciar el servidor lo hiciese bajando y subiendo los plomos del piso.

Lo hizo y el servidor volvió a la vida :D

![Kalm](../images/kalm.png)