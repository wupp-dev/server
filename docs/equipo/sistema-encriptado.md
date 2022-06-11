---
title: Instalación del SO encriptado
lang: es-ES
---
# Instalación del SO encriptado

Vamos a darle vida al cacharro ese que se hace llamar servidor. En esta sección instalaremos el sistema operativo con los discos encriptados y haremos un poco de configuración básica.

## Escogiendo y descargando el sistema operativo.

::: info
Para esta parte necesitarás:
- Un ordenador con internet.
- Un pendrive de unos **4GB** vacío o con archivos que no te importe perder.
- Una pantalla y teclado extra para el servidor.
:::

Hay varias opciones para escoger como sistema operativo:
- [Debian](https://www.debian.org/).
- [Raspbian](https://www.raspbian.org/) *(para Raspberry)*.
- [Ubuntu Server](https://ubuntu.com/download/server).
- [Fedora Server](https://getfedora.org/en/server/).

Esos solo algunos ejemplos, pero hay muchas opciones. En nuestro caso, el servidor tuvo instalado al principio Ubuntu Server, pero a Lucas le causaba un gran rechazo, así que se ha cambiado a **Debian**, que según él es mejor.

::: danger PELIGRO
Toda persona que use Windows Server será perseguida y juzgada por sus crímenes contra la humanidad.
:::

### Descarga y preparación del instalador de Debian 11

Actualmente la versión de Debian del servidor es la 11, también llamada Bullseye. La forma más sencilla de instalarlo es descargar la ISO del principio de su [página de descarga](https://www.debian.org/download), ya que es un instalador muy ligero.

::: warning ADVERTENCIA
Esa ISO de Debian necesita que el servidor se pueda conectar a internet en el momento de la instalación, así que ten preparado el cable para conectarlo.
:::

Una vez descargada la ISO, tenemos que grabarla en el pendrive:
- Si estás en **Windows**, puedes hacerlo con [Rufus](https://rufus.ie/en/).
- Si estás en **Linux**, puedes hacerlo con [Balena Etcher](https://www.balena.io/etcher/).

Ese pendrive lo cogemos y lo enchufamos al servidor.

## Configuración básica de la BIOS del servidor

Antes de instalar el sistema operativo, tenemos que hacer unos retoques en la BIOS, así que enciende el servidor y accede a la BIOS *(si no sabes cómo, búscalo, porque cambia mucho de un ordenador a otro)*.

Aquí hay **dos cambios muy importantes** que hacer:
- **Desactivar**, si estuviera activado, el **Secure Boot**, ya que es algo de Windows y puede dar problemas para encender los ordenadores con Linux.
- Establecer una **contraseña de administrador** de la BIOS.

::: info
Puede que te encuentres con dos posibles contraseñas, la de **usuario** y la de **administrador**. La de usuario, si la creas, probablemente te la pida cada vez que el ordenador se encienda, cosa que no te conviene. La de administrador es la que nos interesa, que es la que se pide cuando se intenta acceder a la BIOS.
:::

Ahora hay que ir al apartado de **Boot** y cambiar el orden de inicio de los dispositivos para poner como primera opción el USB donde tenemos el instalador del sistema operativo.

Salimos guardando los cambios y el ordeandor debería reiniciarse y mostrar el instalador del sistema.

## Instalación de Debian 11

Así debería verse nuestro instalador:

![Instalador](../images/debian-inicio.png)

La instalación gráfica y la otra son prácticamente iguales, la diferencia es que en la gráfica podrías usar el ratón.

Primero tocará elegir el idioma y la distribución del teclado *(nosotros hemos elegido Español para mayor comodidad)*. Después se intentará conectar a internet y tocará poner unos cuantos datos:
1. El nombre de la máquina, como puede ser `server`
2. El nombre del dominio, que para nuestro servidor es `servermamadisimo.xyz` *(si no tienes el dominio o no sabes qué es, puedes hacerte spolier mirando la sección de [Router y dominio](./router-dominio.html#dominio-%C2%BFque-es-y-para-que-sirve))*.
3. La contraseña para el usuario `root`. Esta contraseña tiene que ser **potente**, como de 20 caracteres, porque es la que permite hacer cualquier cambio.

::: tip TRUQUITO
Puedes generar, guardar y gestionar contraseñas cómodamente con [Bitwarden](https://bitwarden.com/).
:::

4. El nombre del usuario administrativo, como puede ser `admin` *(tanto para el nombre completo como para el nombre de usuario)*.

::: warning ADVERTENCIA
El usuario escogido en la guía es `admin`. Este nombre es de ejemplo y Debian no te dejará usarlo. Intenta escoger otro distinto que no sea tan fácil de averiguar.
:::

5. La contraseña para el usuario `admin`. Una contraseña que sea buena, aunque no es necesario que sea tan extensa como la de `root`.
6. Configuración del reloj, de chill.

Después de esto toca poner una encriptación en el disco de instalación.

### Encriptación en los discos

Para no complicarnos la vida, aquí dejaremos que Debian haga la magia de gestionar las particiones porque si no nos tocaría sufrir mucho.

En el instalador, elegiremos el método de particionado **Guiado - utilizar todo el disco y configurar LVM cifrado**. Elegimos el disco donde queremos instalar el sistema operativo, que en nuestro caso es la SSD de 480GB y utilizamos como esquema de particionado **Todos los ficheros en una partición (recomendado para novatos)**.

Ahora, si aprecias tu tiempo y no tenías archivos altamente sensibles en el disco donde vas a instalar Debian, puedes elegir no borrar el disco, ya que tardaría un buen rato.

Tras eso, nos pedirá una **contraseña de cifrado** y esta sí que tiene que ser una tremenda contraseña. Igual o mejor que la del usuario `root`.

Ahora toca lo interesante. Le decimos que use todo el disco para el particionado y nos aparecerá una lista con las particiones que se van a crear.

![Particiones](../images/debian-particiones.png)

Las particiones más importantes son:
- Una partición donde irá **el sistema operativo y todos los datos**. Por defecto aparecerá con el sistema de archivos `ext4`, uno de los más comunes en Linux.
- Una partición de **intercambio *(SWAP)***, que se utiliza como una ampliación de la RAM.
- Una partición `boot` para que el ordenador se pueda encender.

Se puede dejar tal y como está, pero nosotros hemos optado por usar `btrfs` en vez de `ext4` como sistema de archivos de la partición principal. Esto es por las grandes facilidades que da `btrfs` para hacer copias de seguridad del sistema al completo sin que ocupen casi espacio.

Por suerte, cambiar el sistema de archivos es relativamente fácil, solo hay que ir a la línea donde aparece la palabra `ext4`, pulsar \<Intro\> y en **Utilizar como** elegir el sistema `btrfs`. Salimos y ahora debería aparecer `btrfs` en vez de `ext4` como sistema de archivos. Finalizamos el particionado confirmando que se hagan los cambios elegidos y empezará la instalación del sistema operativo.

### Terminando la instalación

Una vez acabe la instalación, nos tocará configurar el gestor de paquetes, elegir una ubicación y un proxy si hace falta, pero se puede dejar todo por defecto y el proxy en blanco.

Ahora nos dejará elegir unos cuantos paquetes extra que instalar, estos son los cambios que hay que hacer:

::: warning ADVERTENCIA
Si no quieres que se te quede la cara de tonto que se me quedó a mí ya en dos ocasiones, recuerda que para desmarcar opciones hay que usar \<Space\> y no \<Intro\>, que como le des sin querer te toca repetir todo el proceso de instalación.
:::

- Quitar el entorno de escritorio. El servidor no lo necesitará allá donde vas a dejarlo.
- Añadir el servidor SSH, que nos permitirá conectarnos al servidor remotamente desde otro dispositivo para hacer cualquier gestión.

## Configuración básica y pequeñas mejoras

**POR HACER:** Añadir el resto de discos, encriptarlos y configurar cryptab.