let guideSidebar = [
  {
    text: "Equipo",
    collapsible: true,
    items: [
      { text: "Historia", link: "/equipo/historia" },
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
      {
        text: "Monitorizando el equipo y los servicios",
        link: "/equipo/monitorizacion",
      },
      {
        text: "Conectando varios servidores",
        link: "/equipo/conectando-servidores",
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
      {
        text: "Docker Mailserver - Correo electrónico",
        link: "/servicios/mailserver",
      },
      {
        text: "Minio - Almacenamiento S3",
        link: "/servicios/minio",
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
      {
        text: "Docker Mailserver - Servidor de correo",
        link: "/servicios/docker-mailserver",
      },
    ],
  },
  {
    text: "Relatos",
    collapsible: true,
    items: [
      { text: "Bloqueo de SSH", link: "/relatos/bloqueo-ssh" },
      {
        text: "Docker y sus cosas",
        link: "/relatos/docker",
      },
      {
        text: "Resolución de dominios en initramfs",
        link: "/relatos/dns-initramfs",
      },
      {
        text: "Túnel SSH en la UGR LAN Party de 2024",
        link: "/relatos/tunel-ssh-ulp",
      },
    ],
  },
];

/**
 * @type {import('vitepress').SiteConfig}
 */
export default {
  title: "WUPP",
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
        link: "/equipo/historia",
        activeMatch: "/(equipo|servicios)/",
      },
      {
        text: "Archivos de configuración",
        link: "https://github.com/wupp-dev/server",
      },
    ],
    socialLinks: [
      { icon: "discord", link: "https://discord.gg/2pdbaf6Ugz" },
      {
        icon: "github",
        link: "https://github.com/wupp-dev/",
      },
    ],
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
};
