---
title: Router y dominio
lang: es-ES
---
# Configuración del router y del dominio

Aquí nuestro objetivo será no tener que preocuparnos de nada que no sea el propio servidor. Para ello, hay que preocuparse momentáneamente de dos elementos externos:
- Configurar el router de tu casa para que deje que el servidor sea un servidor.
- Adquirir un dominio para que sea más cómodo conectarte al servidor y despreocuparte de cambios de la IP pública.

## Breve introducción sobre las IPs

Aquí vamos a hablar de dos tipos de IPs:
- **IP Pública:** Esta es la IP con la que se puede acceder al servidor *(o cualquier otro dispositivo de tu red, si lo permites)* desde cualquier parte de internet.
- **IP Local:** Esta IP identifica al sevidor dentro de la red a la que está conectado, pero no sirve fuera.

Por desgracia, seguimos usando para ambos casos IPv4, pero bueno, menos da una piedra.

Lo que nos interesa aquí es la IP pública. Cuando queramos conectarnos al servidor o alguien más quiera, queda feo que tengan que hacerlo con la IP. Aquí es donde entran los **dominios**.

## Dominio, ¿qué es y para qué sirve?

Un dominio es un pseudónimo para la IP, que es más bonito y fácil de recordar que la propia IP.

En nuestro caso, el dominio es `servermamadisimo.xyz`, y cuando te intentas conectar a esa dirección, el ordenador ya lo traduce a la IP correspondiente.

Pero el hecho de tener un dominio no solo ayuda para a la comodidad de recordarlo y escribirlo, también nos permite:
- No preocuparnos de qué pasa si la IP pública del servidor cambia *(que puede ocurrir)*, solo tienes que decirle al dominio que señale a la nueva IP. De no tener un dominio, tendrías que decirle a todas las personas que se conectan al servidor la nueva IP para que la cambien.
- Añadir subdominios como `mc.servermamadisimo.xyz` para conectarse al minecraft directamente o `nextcloud.severmamadisimo.xyz` para el servicio de Nextcloud.

## Toqueteando en el router