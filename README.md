# Server
Este repositorio contiene los **archivos de configuración** que se han usado en el servidor de casita.

Además, incluye una **guía detallada de todo el proceso** que se ha seguido para poner el servidor en funcionamiento.

Esa guía se divide en dos partes:
1. [Preparación del equipo](https://comicivans.github.io/server/equipo/hardware)
2. [Instalación de servicios específicos](https://comicivans.github.io/server/servicios/minecraft)

---

Puedes **consultar la guía** en [este enlace](https://comicivans.github.io/server/) o puedes compilarla tú mismo descargando el repositorio:
1. Necesitarás `npm` instalado. Puedes descargarlo [aquí](https://github.com/nodesource/distributions/blob/master/README.md).
2. Abre una terminal en la carpeta raiz del repositorio y escribe `npm install`
3. Ejecuta `npm run docs:build` y `npm run docs:serve` *(si esto no funciona, utiliza en su lugar `npm run docs:dev`)*
4. Abre http://localhost:5000 *(si utilizaste `npm run docs:dev`, tienes que abrir http://localhost:3000)*

---

La guía está hecha en Markdown con [VitePress](https://github.com/vuejs/vitepress) y está alojada en este repositorio con GitHub Pages.

Además, se publica automáticamente tras cada cambio gracias a [esta guía](https://jamesiv.es/blog/github/actions/2022/01/23/deploying-to-github-pages-with-github-actions).