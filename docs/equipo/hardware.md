---
order: 2
---

# Hardware

Actualmente tenemos dos ordenadores conectados a la misma red actuando de servidores:

- Uno general, para todos los servicios que no requieran de mucha potencia.
- Otro más potente, principalmente para los servidores de Minecraft y otras cosas que requieran de mayor potencia.

## Servidor general

Los datos sobre este servidor son menos precisos, pero son lo suficientemente informativos:

- **CPU:** [Intel Xeon E3-1230 v2 Quad 3,3GHz](https://www.intel.la/content/www/xl/es/products/sku/65732/intel-xeon-processor-e31230-v2-8m-cache-3-30-ghz/specifications.html)
- **CPU Cooler:** _Por defecto_
- **Placa base:** Fujitsu D3167-A11 GS1 ATX Mainboard
- **GPU:** _Desconocida_
- **RAM:** 24GB DDR3
- **SSD:** Kingston A400 SATA 480GB
- **HDD 1:** 1TB 7200 RPM
- **HDD 2:** 4TB WD Red Plus de 5400 RPM
- **PSU:** _Desconocida_
- **Tarjeta de red:** _Integrada_
- **Ventiladores extra:** _Ninguno_
- **Caja:** _Desconocida_

La verdad es que ya se le notan los años, pero para un servidor genérico en el que principalmente se ofrecerán servicios web sigue funcionando. Si el servidor se quisiera usar para Minecraft, tendríamos que centrarnos en que tuviese un procesador más rápido, ya que Minecraft no aprovecha los múltiples núcleos.

La velocidad a la que funcionan los discos duros mecánicos es importante, ya que **uno de 7200 RMP será más rápido que uno de 5400 RPM, pero se calentará más y durará menos.** Por eso, para el almacenamiento de archivos como los de Nextcloud y fotos, es más recomendable usar un disco de 5400 RPM, ya que no necesitas una gran velocidad _(te limita normalmente la de transferencia de Internet)_ y te interesa que el disco duro dure más tiempo.

::: warning ADVERTENCIA
Aunque no sepa qué tarjeta de red tiene, es importante que sea una decente. No quieres que el servidor vaya lento porque la tarjeta de red es una castaña.
:::

Además de todo eso, tiene un lector de discos que no se ha usado ni se va a usar.

## Servidor de Minecraft

Este servidor se montó comprando los componentes individuales, así que esta es la lista exacta:

- **CPU:** [AMD Ryzen 9 7900 3.7/5.4 GHz](https://www.amd.com/es/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900.html)
- **CPU Cooler:** _Por defecto_
- **Placa base:** [ASUS PRIME B650M-A II](https://www.asus.com/motherboards-components/motherboards/prime/prime-b650m-a-ii/)
- **GPU:** _Gráficos integrados_
- **RAM:** [Corsair Vengeance DDR5 6000MHz 32GB 2x16GB CL36 Optimizado AMD](https://www.corsair.com/es/es/p/memory/cmk32gx5m2d6000c36/vengeance-32gb-2x16gb-ddr5-dram-6000mhz-c36-memory-kit-black-cmk32gx5m2d6000c36)
- **SSD:** [WD Blue SN570 1TB M.2](https://www.westerndigital.com/es-es/products/internal-drives/wd-blue-sn570-nvme-ssd#WDS250G3B0C)
- **HDD:** [WD Blue 2TB 3.5" SATA3](https://www.westerndigital.com/es-es/products/internal-drives/wd-blue-desktop-sata-hdd#WD5000AZLX)
- **PSU:** [NOX Hummer Alpha 500W 80 Plus Bronce](https://www.nox-xtreme.com/fuentes/hummer-alpha-500w)
- **Tarjeta de red:** _Integrada_
- **Ventiladores extra:** 2 [Noctua NF-S12B redux-1200 PWM](https://noctua.at/es/nf-s12b-redux-1200-pwm)
- **Caja:** [Cooler Master MasterBox Q300L](https://www.coolermaster.com/la/es-la/catalog/cases/mini-tower/masterbox-q300l/)

Este servidor costó en total 928,96€.

::: info
Aunque nosotros no lo consideramos, si el servidor va a almacenar datos importantes, utilizar máquinas virtuales y queremos garantizar la estabilidad e integridad del sistema, es recomendable comprar una memoria RAM con ECC (Error-Correcting Code). La RAM ECC corrige errores de memoria silenciosos que, aunque poco frecuentes, existen y pueden provocar corrupción de datos con el tiempo. Aunque, junto a esta decisión, se debería de considerar el uso de varios discos duros con un sistema de archivos RAID o ZFS con snapshots para mayor seguridad.
:::


## Hardware externo

Además de tener un ordenador decente para el servidor, necesitas una buena conexión a Internet. Una de las cosas **obligatorias** es tener el servidor **conectado por cable**, no por WiFi.

En nuestro caso, también tenemos ambos servidores conectados al router a través de un switch. Concretamente, un [TP-Link LS105G](https://www.tp-link.com/es/business-networking/litewave-switch/ls105g/).

Por último, siempre puede beneficiar comprar un router distinto al que te da la compañía de Internet. Esto es, principalmente, porque puede que te de más facilidades _(o posibilidades)_ para configurarlo, cosa que habrá que hacer.

::: info
A no ser que se diga lo contrario, en el resto de documentación se puede asumir que nos estamos refiriendo al servidor general.
:::
