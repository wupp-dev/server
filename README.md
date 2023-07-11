# Server
Este repositorio contiene los **archivos de configuración** que se han usado en el servidor de casita.

Además, incluye una **guía detallada de todo el proceso** que se ha seguido para poner el servidor en funcionamiento.

Esa guía se divide en dos partes y tiene una tercera de relatos:
1. [Preparación del equipo](https://comicivans.github.io/server/equipo/historia)
2. [Instalación de servicios específicos](https://comicivans.github.io/server/servicios/nextcloud)
3. [Relatos de dramas ocurridos](https://comicivans.github.io/server/relatos/initramfs-vs-router)

---

Puedes **consultar la guía** en [este enlace](https://comicivans.github.io/server/) o puedes compilarla tú mismo descargando el repositorio:
1. Necesitarás `npm` o `pnpm` instalado. Puedes descargar NPM [aquí](https://github.com/nodesource/distributions/blob/master/README.md) y PNPM [aquí](https://pnpm.io/installation). Si decides instalar PNPM, cuando en un comando haya que poner `npm` tendrás que sustituirlo por `pnpm`.
2. Abre una terminal en la carpeta raíz del repositorio y escribe `npm install`
3. Ejecuta `npm run docs:build` y `npm run docs:serve` *(si esto no funciona, utiliza en su lugar `npm run docs:dev`)*
4. Abre el enlace que aparezca en la consola y podrás ver la guía.

---

La guía está hecha en Markdown con [VitePress](https://github.com/vuejs/vitepress) y está alojada en este repositorio con GitHub Pages.

Además, se publica automáticamente tras cada cambio gracias a [esta guía](https://jamesiv.es/blog/github/actions/2022/01/23/deploying-to-github-pages-with-github-actions).