export default {
  title: 'Servidor mamadísimo',
  description: 'Guía del servidor.',
  lang: 'es-ES',
  base: '/server/',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/', activeMatch: '' },
      { text: 'Guía del servidor', link: '/guia/hardware', activeMatch: '/guia/' },
      { text: 'Archivos de configuración', link: 'https://github.com/ComicIvans/server' }
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/YdnmG5v8' },
    ],
    sidebar: {
      '/guia/': [
        {
          text: 'Guía del servidor',
          items: [
            { text: 'Hardware', link: '/guia/hardware' },
            { text: 'Instalación del SO, encriptado y SSH', link: '/guia/sistema-encriptado-ssh' },
          ],
        },
      ],
    },
    footer: {
      message: 'Distribuido bajo la licencia CC BY.',
      copyright: 'Copyright © 2022-presente Lucas de Uña Ocampo e Iván Salido Cobo',
    },
  },
}
