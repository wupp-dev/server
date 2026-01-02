# Server

Este repositorio contiene:

- Los **archivos de configuración** que se han usado en el servidor de casita, dentro de la carpeta `fs`.
- Una **guía detallada de todo el proceso** que se ha seguido para poner el servidor en funcionamiento.

La guía se divide en dos partes y tiene una tercera de relatos:

1. [Preparación del equipo](https://wupp-dev.github.io/server/equipo/historia)
2. [Instalación de servicios específicos](https://wupp-dev.github.io/server/servicios/nextcloud)
3. [Relatos de dramas ocurridos](https://wupp-dev.github.io/server/relatos/bloqueo-ssh.html)

---

Puedes **consultar la guía** en [este enlace](https://wupp-dev.github.io/server/) o puedes compilarla tú mismo descargando el repositorio:

1. Necesitarás `npm` o `pnpm` instalado. Puedes descargar NPM [aquí](https://github.com/nodesource/distributions) y PNPM [aquí](https://pnpm.io/installation).
2. Abre una terminal en la carpeta raíz del repositorio y escribe `pnpm install`
3. Ejecuta `pnpm run build` y `pnpm run serve` _(si esto no funciona, utiliza en su lugar `pnpm run dev`)_
4. Abre el enlace que aparezca en la consola y podrás ver la guía.

---

La guía está hecha en Markdown con [VitePress](https://github.com/vuejs/vitepress) y está alojada en este repositorio con GitHub Pages.

Además, se publica automáticamente tras cada cambio gracias a [esta guía](https://jamesiv.es/blog/github/actions/2022/01/23/deploying-to-github-pages-with-github-actions).

---

> [!IMPORTANT]
> A lo largo de la guía se hace mención a prácticas que son recomendables para mejorar la seguridad del servidor. Es por ello que los archivos de configuración pueden no estar completos o diferir de como realmente son en nuestro servidor, así que mucho ojo a la hora de copiarlos sin editar.
