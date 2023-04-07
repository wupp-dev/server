import { defineConfig } from "vitepress";

let guideSidebar = [
  {
    text: "Equipo",
    collapsible: true,
    items: [
      { text: "Hardware", link: "/equipo/hardware" },
      {
        text: "Instalación del SO encriptado",
        link: "/equipo/sistema-encriptado",
      },
      {
        text: "Configuración del router y dominio",
        link: "/equipo/router-dominio",
      },
      {
        text: "Gestión remota con SSH y VNC",
        link: "/equipo/gestion-remota",
      },
      { text: "Nginx como servidor web", link: "/equipo/nginx" },
      { text: "Docker", link: "/equipo/docker" },
      {
        text: "Configurando MariaDB con Docker",
        link: "/equipo/mariadb-docker",
      },
    ],
  },
  {
    text: "Servicios",
    collapsible: true,
    items: [
      {
        text: "Nextcloud - Almacenamiento",
        link: "/servicios/nextcloud",
      },
      { text: "Minecraft con AMP", link: "/servicios/minecraft" },
      {
        text: "Dozzle - Visualizador de logs",
        link: "/servicios/dozzle",
      },
      { text: "Homarr - Dashboard", link: "/servicios/homarr" },
      { text: "Uptime Kuma - Status", link: "/servicios/uptime-kuma" },
      { text: "Authentik - Autenticación", link: "/servicios/authentik" },
      { text: "Gitea - Servicio git", link: "/servicios/gogs" },
      { text: "Navidrome - Streaming de música", link: "/servicios/navidrome" },
      { text: "Overleaf - Editor de LaTeX", link: "/servicios/sharelatex" },
      { text: "Docker Mailserver - Servidor de correo", link: "/servicios/docker-mailserver" },
    ],
  },
  {
    text: "Relatos",
    collapsible: true,
    items: [
      { text: "Bloqueo de SSH", link: "/relatos/bloqueo-ssh" },
      {
        text: "Lucas vs. Debian & Docker & etc.",
        link: "/relatos/usuario-docker",
      },
    ],
  },
];

export default defineConfig({
  title: "Servidor mamadísimo",
  description: "Guía del servidor.",
  lang: "es-ES",
  base: "/server/",
  lastUpdated: true,
  // markdown: {
  //   theme: "solarized-dark",
  // },
  themeConfig: {
    lastUpdatedText: "Actualizado por última vez",
    nav: [
      { text: "Inicio", link: "/", activeMatch: "" },
      {
        text: "Guía del servidor",
        link: "/equipo/hardware",
        activeMatch: "/(equipo|servicios)/",
      },
      {
        text: "Archivos de configuración",
        link: "https://github.com/ComicIvans/server",
      },
    ],
    socialLinks: [{ icon: "discord", link: "https://discord.gg/YdnmG5v8" }],
    sidebar: {
      "/equipo/": guideSidebar,
      "/servicios/": guideSidebar,
      "/relatos/": guideSidebar,
    },
    footer: {
      message: "Distribuido bajo la licencia CC BY.",
      copyright:
        "Copyright © 2022-presente Lucas de Uña Ocampo e Iván Salido Cobo",
    },
  },
});
