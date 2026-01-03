---
layout: home
title: Inicio

hero:
  name: WUPP.DEV
  text: Un servidor mamádisimo
  tagline: Patrocinado por la polla con peluca y el pelirrojo de comedores
  actions:
    - theme: brand
      text: Guía del servidor
      link: equipo/historia
    - theme: alt
      text: Repositorio de GitHub
      link: https://github.com/wupp-dev/server

features:
  - icon: 🖥
    title: Hardware y disposición
    details: Componentes físicos del servidor. Procesador, memoria RAM, discos duros mecánicos, disco SSD y el uso que se le da a cada uno de ellos.
  - icon: ⚙️
    title: Instalación del sistema y configuración básica
    details: Instalación del sistema operativo y configuración necesaria para que el servidor pueda funcionar como debería funcionar un servidor.
  - icon: 📡
    title: Instalación y configuración del resto de servicios
    details: Cosas más específicas como la página web, el servidor de Minecraft, el correo electrónico, Nextcloud...
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/ComicIvans.png',
    name: 'Iván Salido Cobo',
    title: 'Matemático',
    links: [
      { icon: 'github', link: 'https://github.com/ComicIvans' },
      { icon: 'firefox', link: 'https://ivan.wupp.dev' }
    ]
  },
  {
    avatar: 'https://www.github.com/HipyCas.png',
    name: 'Lucas de Uña Ocampo',
    title: 'Ingeniero Informático',
    links: [
      { icon: 'github', link: 'https://github.com/HipyCas' },
    ]
  },
]
</script>

## Nosotros

Conoce a los creadores de WUPP.DEV.

<VPTeamMembers size="medium" :members />