---
layout: page
title: Nosotros
sidebar: false
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

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

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Nosotros
    </template>
    <template #lead>
      Conoce a los creadores de WUPP.DEV.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members />
</VPTeamPage>