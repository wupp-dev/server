export default {
  title: 'Servidor mamadísimo',
  description: 'Guía del servidor.',
  lang: 'es-ES',
  base: '/server/',
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/', activeMatch: '' },
      { text: 'Guía del servidor', link: '/equipo/hardware', activeMatch: '/(equipo)/' },
      { text: 'Archivos de configuración', link: 'https://github.com/ComicIvans/server' }
    ],
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/YdnmG5v8' },
    ],
    sidebar: {
      '/equipo/': [
        {
          text: 'Equipo',
          collapsible: true,
          items: [
            { text: 'Hardware', link: '/equipo/hardware' },
            { text: 'Instalación del SO, encriptado y SSH', link: '/equipo/sistema-encriptado-ssh' },
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
