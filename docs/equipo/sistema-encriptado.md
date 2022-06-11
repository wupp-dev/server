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


### Encriptación en los discos
