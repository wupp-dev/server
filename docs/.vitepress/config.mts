import { defineConfig } from "vitepress";

const guideSidebar = [
  {
    text: "Equipo",
    collapsed: false,
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
    collapsed: false,
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
    ],
  },
  {
    text: "Relatos",
    collapsed: false,
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

export default defineConfig({
  title: "WUPP",
  description: "Guía del servidor.",
  head: [["link", { rel: "icon", href: "/server/favicon.ico" }]],
  lang: "es-ES",
  base: "/server/",
  cleanUrls: true,
  appearance: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://wupp-dev.github.io/server/",
  },
  themeConfig: {
    logo: "/favicon.svg",
    outlineTitle: "En esta página",
    nav: [
      { text: "Inicio", link: "/", activeMatch: "" },
      {
        text: "Nosotros",
        link: "/nosotros",
        activeMatch: "^/nosotros$",
      },
      {
        text: "Guía del servidor",
        link: "/equipo/historia",
        activeMatch: "^/(?!$|nosotros$)",
      },
      {
        text: "Archivos de configuración",
        link: "https://github.com/wupp-dev/server",
        target: "_blank",
      },
    ],
    sidebar: {
      "/equipo/": guideSidebar,
      "/servicios/": guideSidebar,
      "/relatos/": guideSidebar,
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/wupp-dev/",
        ariaLabel: "GitHub WUPP-DEV",
      },
    ],
    footer: {
      message: "Distribuido bajo la licencia CC BY.",
      copyright:
        "Copyright © 2022-presente Lucas de Uña Ocampo e Iván Salido Cobo",
    },
    lastUpdated: { text: "Actualizado por última vez" },
    docFooter: {
      prev: "Página anterior",
      next: "Página siguiente",
    },
    darkModeSwitchLabel: "Apariencia",
    lightModeSwitchTitle: "Cambiar a modo claro",
    darkModeSwitchTitle: "Cambiar a modo oscuro",
    sidebarMenuLabel: "Menú",
    returnToTopLabel: "Volver arriba",
    skipToContentLabel: "Saltar al contenido",
    externalLinkIcon: true,
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "Buscar",
            buttonAriaLabel: "Buscar",
          },
          modal: {
            displayDetails: "Mostrar detalles",
            resetButtonTitle: "Restablecer",
            backButtonTitle: "Volver",
            noResultsText: "No se han encontrado resultados",
            footer: {
              selectText: "Seleccionar",
              selectKeyAriaLabel: "Tecla Enter",
              navigateText: "Navegar",
              navigateUpKeyAriaLabel: "Tecla flecha arriba",
              navigateDownKeyAriaLabel: "Tecla flecha abajo",
              closeText: "Cerrar",
              closeKeyAriaLabel: "Tecla Escape",
            },
          },
        },
      },
    },
  },
});
