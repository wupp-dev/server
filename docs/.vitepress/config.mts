import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";

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
        link: "https://github.com/wupp-dev/server/tree/main/fs",
        target: "_blank",
      },
    ],
    sidebar: generateSidebar({
      documentRootPath: "docs",
      useTitleFromFileHeading: true,
      useTitleFromFrontmatter: true,
      useFolderTitleFromIndexFile: true,
      sortMenusByFrontmatterOrder: true,
      excludePattern: ["nosotros.md", "shared/**"],
    }),
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/wupp-dev/server/",
        ariaLabel: "Repositorio GitHub de este proyecto",
      },
    ],
    footer: {
      message: "Distribuido bajo la licencia CC BY.",
      copyright:
        "Copyright © 2022-presente Lucas de Uña Ocampo e Iván Salido Cobo",
    },
    notFound: {
      title: "Página no encontrada",
      quote: "Caminante, no hay camino, se hace camino al andar.",
      linkLabel: "Volver al inicio",
      linkText: "Volver al inicio",
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
