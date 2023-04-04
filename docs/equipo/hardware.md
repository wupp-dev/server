---
title: Hardware
lang: es-ES
---
# Hardware

El servidor es una torre **Fujitsu CELSIUS W520** que estaba a la venta en Ebay. Originalmente se compró con el único objetivo de montar un servidor de Minecraft que pudiera estar activo las 24 horas del día.
![Servidor](../images/servidor.png)

## CPU y GPU

El procesador es un [Intel Xeon E3-1230 v2 Quad 3,3GHz](https://ark.intel.com/content/www/es/es/ark/products/65732/intel-xeon-processor-e31230-v2-8m-cache-3-30-ghz.html) y tiene una tarjeta gráfica de Nvida cuyo modelo ahora no recuerdo, pero es un tostón, es solo para poder encenderlo, instalar el sistema operativo y hacer la configuración inicial.

En un principio, los procesadores Xeon están pensados para servidores, porque tienen muchos núcleos. Pero para un servidor de Minecraft la cosa cambia un poco, ya que Minecraft solo sabe aprovechar un núcleo, haciendo que lo que verdaderamente importe sea la velocidad del reloj *(3,3GHz)*.

## Memoria RAM

En cuanto a memoria RAM, necesitas tener mucha, sobre todo si vas a tener un servidor de Minecraft *(ya no hablemos si quieres meterle mods)*. Java devora RAM.

El servidor cuenta con **24GB** de memoria RAM **DDR3**. Por ahora es suficiente, pero tampoco sobra.
::: info
Lo recomendable, a parte de ampliar la cantidad de RAM, sería cambiarla a **DDR4** o **DDR5**, que son más modernas y rápidas, pero para eso haría falta cambiar la placa base y, consecuentemente, el procesador.
:::

## Discos duros

Al principio, el servidor contaba únicamente con un disco duro mecánico de **1TB** a **7200 RPM**, pero se ha actualizado a:
- Un disco duro **SSD de 480GB** para almacenar el sistema operativo y el servidor de Minecraft, ya que en los foros dicen que mejora mucho el rendimiento del mundo.
- El disco duro inicial de **1TB** para guardar copias de seguridad tanto del sistema como del servidor de Minecraft.
- Otro disco duro mecánico de **4TB WD Red Plus de 5400 RPM** para almacenar todos los demás archivos: *Correo, Nextcloud, páginas web (incluyendo los mapas de Minecraft)...*
::: info
La velocidad a la que funcionan los discos duros mecánicos es importante, ya que **uno de 7200 RMP será más rápido que uno de 5400 RPM, pero se calentará más y tendrá una vida más corta.** Por eso, para el almacenamiento de archivos como los de Nextcloud y los mapas de Minecraft, es más recomendable usar un disco de 5400 RPM, ya que no necesitas una gran velocidad *(te limita normalmente la de transferencia de internet)* y te interesa que el disco duro dure más tiempo.
:::

## Otros componentes

La verdad es que no tengo ni idea de qué tarjeta de red tiene ni de la potencia de la fuente de alimentación.
::: warning ADVERTENCIA
Aunque no sepa qué tarjeta de red tiene, es importante que sea una decente. No quieres que el servidor vaya lento porque la tarjeta de red es una castaña.
:::

Además, tiene un lector de discos que no se ha usado ni se va a usar.

Y de la placa base con saber que es **ATX** vamos tirando, pero no tiene ni puertos **M.2.**

## Hardware externo

A parte de tener un ordenador decente para el servidor, necesitas una buena conexión a internet. Una de las cosas **obligatorias** es tener el servidor **conectado por cable**, no por WiFi.

Por último, siempre puede beneficiar comprar un router distinto al que te da la compañía de internet. Esto es, principalmente, porque puede que te de más facilidades *(o posibilidades)* para configurarlo y sí, es necesario toquetear en el router para que el servidor funcione.