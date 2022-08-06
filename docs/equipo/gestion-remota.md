---
title: Gestión remota con SSH y VNC
lang: es-ES
---
# Gestión remota con SSH y VNC

Esta sección incluye todas las cosas que hay que hacer en el servidor antes de poder guardarlo, olvidarte de él y no volver a necesitar enchufarle un monitor y un teclado para gestionarlo.

## Breve introducción

Un servidor es un ordenador al que no quieres tenerle conectado ni un monitor ni un teclado *(el ratón no existe)* porque no deberías tener que tocarlo directamente salvo para el mantenimiento físico y cambios en la BIOS o en el sistema operativo.

Pero sí que hay que conectarse a él normalmente para instalar y desinstalar software y para configurarlo. Esto lo haremos desde otro ordenador usando el protocolo *Secure Shell (SSH)*, que nos permitirá ejecutar comandos en el servidor, transferir archivos y otras cosas más chulas que veremos después. Todo ello con una conexión cifrada :D

Es aquí donde se nos plantea un gran problema: Cuando nos podemos conectar al servidor mediante SSH es cuando está encendido *(y con los discos desencriptados)*, pero ¿y si no estamos en casa y el ordenador se ha tenido que reiniciar o ha habido un apagón? Entonces el ordenador se quedaría esperando a que pusiéramos *(¡con un teclado!)* la contraseña para desencriptar los discos y así poder seguir encendiéndose. Esto no mola. Deberíamos de poder desencriptar el ordenador remotamente también para no tener miedo.

Este problema lo resolveremos tras preparar el servidor para el uso habitual.

## Uso habitual

Vamos a empezar dejando lista nuestra vía para poder gestionar remotamente el servidor cuando esté encendido.

Como lo elegimos a la hora de instalar Debian, el servidor ya viene con OpenSSH Server instalado, que por defecto se ejecuta en el puerto `22`.

::: warning ADVERTENCIA
Es recomendable no usar el puerto 22 para SSH, porque, al ser el puerto por defecto, muchos ataques automatizados solo intentan conectarse a ese puerto, así que cambiándolo a otro nos ahorraremos posibles problemas. Quien quiera averiguar en qué puerto tenemos el SSH podrá hacerlo con un escaneo de puertos igualmente, pero ya tendrá que querer atacarte a ti en concreto.
:::

Sin embargo, si intentamos conectarnos desde otro ordenador, no nos dejará, por dos motivos:
- Tenemos que abrir el puerto en el router.
- Tenemos que permitirlo en el *firewall* *(si tenemos)*.

Así que lo que hay que hacer es primero abrir el puerto SSH en el router y, si tenemos un *firewall*, permitirlo también. **Si no tenemos un *firewall*, vamos a instalarlo porque es necesario.** Para ello ejecutamos los siguientes comandos:
```
$ sudo apt install ufw
$ sudo ufw allow 22/tcp
$ sudo ufw enable
```

Donde `22` es el puerto de SSH. Con esto ya tenemos el *firewall* configurado para aceptar conexiones SSH.

Con esto ya nos podríamos conectarnos al servidor desde otro ordenador, pero tendría que ser con la contraseña del usuario administrador, cosa que es poco segura, así que vamos a utilizar la autenticación por claves SSH.

Para configurarla en el ordenador del que nos vayamos a conectar, seguiremos [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server). Además, tiene al final una parte de configuración que también se debe hacer e incluiremos más adelante en el tutorial.

## Reinicios y desencriptación del disco

Por suerte para nosotros, existe un paquete de Debian llamado `dropbear-initramfs` que nos va a permitir hacer justo lo que queremos. **¿Qué es lo que hace?** Pues para eso hay que entender un poco cómo se enciende un ordenador con Linux y los discos encriptados.

El disco duro realmente no está encriptado del todo, tiene una partición llamada *boot* que únicamente contiene la información necesaria para decirle al ordenador cuando se intenta encender cómo debe hacerlo. Es decir, le dice al ordenador, entre otras cosas, que los discos están encriptados y que hay que introducir una contraseña para desencriptarlos. A esto se le llama `initramfs`, que son los archivos básicos que se cargan en la RAM cuando el ordenador se enciende y, junto con el kernel de Linux, se ocupan de gestionar el encendido.

Así, `dropbear-initramfs` es un software que permite que el servidor reciba conexiones SSH en esta fase del encendido, justo a tiempo para poner la contraseña para desencriptar los discos.

Y para instalarlo es muy sencillo, solo hay que irse a la terminal del servidor e instalarlo como un paquete normal y corriente escribiendo `sudo apt install dropbear-initramfs`. **¿Eso es todo?** Obviamente no, hay que configurarlo.

Vamos a editar el archivo de configuración, que está en `/etc/dropbear-initramfs/config` y vamos a descomentar y editar la línea:
```
DROPBEAR_OPTIONS="-I 300 -j -k -p 22 -s"
```

¿Qué significa esto?
- `-i 300` desconecta a quien se conecte si en 300 segundos no ha realizado ninguna acción.
- `-j` deshabilita la redirección de puertos locales.
- `-k` deshabilita la redirección de puertos remotos.
- `-p 22` indica que se ejecute en el puerto 22.
- `-s` Deshabilita la autenticación por contraseña.

Como indica el último parámetro, la autenticación por contraseña está deshabilitada, así que utilizaremos también las claves públicas que hayamos autorizado para OpenSSH Server, podemos copiarlas directamente con el comando:
```
sudo cp /home/user/.ssh/authorized_keys /etc/dropbear-initramfs/
```

Por útlimo, para que los cambios tengan efecto, tenemos que escribir `sudo update-initramfs -u`. Esto guardará de nuevo los archivos de `initramfs` incluyendo los cambios que hemos hecho.

## Resolviendo problemas

Un problema con el que nos encontramos cuando intentamos conectarnos al servidor por SSH primero para desencriptar los discos y después para el uso normal, es que nos salta este error:

```
$ ssh server@servermamadisimo.xyz
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
  ssh-keygen -f "/home/user/.ssh/known_hosts" -R "servermamadisimo.xyz"
Host key for servermamadisimo.xyz has changed and you have requested strict checking.
Host key verification failed.
```

¿Qué es lo que ocurre? Pues que la IP a la que nos estamos conectando es la misma pero las claves públicas del servidor, que son las que se utilizan para verificar su identidad, son distintas. Esto el ordenador lo confunde *(por precaución)* con un intento de suplantar la identidad del servidor, cosa que sería muy peligrosa en caso de ser cierta. Por eso no nos deja conectarnos.

Para que nos deje conectarnos es tan sencillo como eliminar el archivo de `known_hosts` mencionado en el error, pero entonces cada vez que reiniciásemos el servidor tendríamos que estar eliminando ese archivo para poder conectarnos de nuevo.

Por suerte, hay un apaño. Si ponemos Dropbear y OpenSSH Server en puertos distintos en el servidor, podemos utilizar una identidad distinta para cada puerto cuando nos conectemos.

::: danger PELIGRO
Una solución que se nos podría ocurrir es utilizar la misma clave pública y privada para Dropbear y para OpenSSH Server. Esto es una malísima idea porque la clave privada de OpenSSH Server es algo que quieres protejer más que a tu gato y, por otro lado, la de Dropbear se va a guardar en una parte desencriptada del sistema operativo, porque necesita usarse antes de desencriptar los discos, así que no está muy protegida.
:::

Lo primero para esto es utilizar un puerto distinto para OpenSSH Server al que usamos para Dropbear. Para ello, editamos el archivo `/etc/ssh/sshd_config` y descomentamos la línea `#Port 22` y cambiamos el número, quedando por ejemplo `Port 2222`.

*Nuevamente el puerto es de ejemplo y es recomendable cambiarlo a otro.*

Si ahora nos vamos a nuestro ordenador y editamos el archivo `/home/user/.ssh/known_hosts`

### Reforzando la seguridad

## Virtual Network Computing (VNC)

¿Qué mierdas es un VNC? Pues básicamente un entorno gráfico de escritorio remoto. Se utiliza para controlar remotamente otros ordenadores con un escritorio como si fuese realmente tu propio ordenador.

Hemos seguido [este tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-on-debian-10).

Como detalles, no hemos establecido una contraseña para solo vista.

Aquí da igual cambiar o no el puerto por defecto, ya que no estará expuesto directamente a internet.

En nuestro ordenador podemos instalar `xtightvncviewer` para conectarnos. Solo tendremos que conectarnos mediante SSH al servidor indicando que queremos redirigir el puerto 5901 de nuestro ordenador al 5901 del del servidor. Esto lo podemos hacer con `ssh -L 5901:127.0.0.1:5901 server@servermamadisimo.xyz`. Una vez estemos conectados, podemos ejecutar `xtightvncviewer` desde la terminal, conectarnos a `localhost:5901` y poner la contraseña del VNC.

En nuestro caso, al intentar conectarnos nos encontramos con el siguiente error:

![Fallo VNC](../images/fallo-vnc.png)

Por suerte, se solucionó instalando un paquete y reiniciando el servidor VNC:
```
$ sudo apt install dbus-x11
$ vncserver -kill :1
$ vncserver
```

::: info
Es raro necesitar el servidor VNC, pero justo estoy escribiendo esta parte antes que la de configuración de servidor SSH porque necesito abrir unos puertos en el router y para eso necesito acceder con un navegador desde el servidor.
Como era de esperar, Debian no venía con navegador instalado, así que para poder usar uno con el VNC instalamos Firefox con `sudo apt install firefox-esr`.
:::