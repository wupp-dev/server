---
title: Hardware
lang: es-ES
---
# Hardware

Actualmente tenemos dos ordenadores conectados a la misma red actuando de servidores:
- Uno general, para todos los servicios excepto los relacionados con Minecraft.
- Otro más potente, específicamente para los servidores de Minecraft y su web.

## Servidor general

Los datos sobre este servidor son menos precisos, pero son lo suficientemente informativos:
- **CPU:** [Intel Xeon E3-1230 v2 Quad 3,3GHz](https://ark.intel.com/content/www/es/es/ark/products/65732/intel-xeon-processor-e31230-v2-8m-cache-3-30-ghz.html)
- **CPU Cooler:** *Por defecto*
- **Placa base:** Asus TUF Gaming A620M-PLUS
- **GPU:** *Desconocida*
- **RAM:** 24GB DDR3
- **SSD:** Kingston A400 SATA 480GB
- **HDD 1:** 1TB 7200 RPM
- **HDD 2:** 4TB WD Red Plus de 5400 RPM
- **PSU:** *Desconocida*
- **Tarjeta de red:** *Integrada*
- **Ventiladores extra:** *Ninguno*
- **Caja:** *Desconocida*

Para un servidor genérico en el que principalmente se ofrecerán servicios web, un Xeon es un procesador adecuado por tener una buena cantidad de núcleos. Pero ese no es el caso si el servidor se quiere usar para Minecraft, ya que no aprovecha los múltiples núcleos, beneficiándose únicamente de la velocidad del reloj.

La velocidad a la que funcionan los discos duros mecánicos es importante, ya que **uno de 7200 RMP será más rápido que uno de 5400 RPM, pero se calentará más y tendrá una vida más corta.** Por eso, para el almacenamiento de archivos como los de Nextcloud y fotos, es más recomendable usar un disco de 5400 RPM, ya que no necesitas una gran velocidad *(te limita normalmente la de transferencia de internet)* y te interesa que el disco duro dure más tiempo.

::: warning ADVERTENCIA
Aunque no sepa qué tarjeta de red tiene, es importante que sea una decente. No quieres que el servidor vaya lento porque la tarjeta de red es una castaña.
:::

Además de todo eso, tiene un lector de discos que no se ha usado ni se va a usar.

## Servidor de Minecraft

Este servidor se montó comprando los componentes individuales, así que esta es la lista exacta:
- **CPU:** [AMD Ryzen 9 7900 3.7/5.4 GHz](https://www.amd.com/es/products/apu/amd-ryzen-9-7900)
- **CPU Cooler:** *Por defecto*
- **Placa base:** [ASUS PRIME B650M-A II](https://www.asus.com/motherboards-components/motherboards/prime/prime-b650m-a-ii/)
- **GPU:** *Gráficos integrados*
- **RAM:** [Corsair Vengeance DDR5 6000MHz 32GB 2x16GB CL36 Optimizado AMD](https://www.corsair.com/es/es/p/memory/cmk32gx5m2d6000c36/vengeance-32gb-2x16gb-ddr5-dram-6000mhz-c36-memory-kit-black-cmk32gx5m2d6000c36)
- **SSD:** [WD Blue SN570 1TB M.2](https://www.westerndigital.com/es-es/products/internal-drives/wd-blue-sn570-nvme-ssd#WDS250G3B0C)
- **HDD:** [WD Blue 2TB 3.5" SATA3](https://www.westerndigital.com/es-es/products/internal-drives/wd-blue-desktop-sata-hdd#WD5000AZLX)
- **PSU:** [NOX Hummer Alpha 500W 80 Plus Bronce](https://www.nox-xtreme.com/fuentes/hummer-alpha-500w)
- **Tarjeta de red:** *Integrada*
- **Ventiladores extra:** 2 [Noctua NF-S12B redux-1200 PWM](https://noctua.at/es/nf-s12b-redux-1200-pwm)
- **Caja:** [Cooler Master MasterBox Q300L](https://www.coolermaster.com/la/es-la/catalog/cases/mini-tower/masterbox-q300l/)

Este servidor costó en total 928,96€.

## Hardware externo

A parte de tener un ordenador decente para el servidor, necesitas una buena conexión a internet. Una de las cosas **obligatorias** es tener el servidor **conectado por cable**, no por WiFi.

Por último, siempre puede beneficiar comprar un router distinto al que te da la compañía de internet. Esto es, principalmente, porque puede que te de más facilidades *(o posibilidades)* para configurarlo y sí, es necesario toquetear en el router para que el servidor funcione.

::: info
A no ser que se diga lo contrario, en el resto de documentación se puede asumir que nos estamos refiriendo al servidor general.
:::