---
title: Minecraft con AMP
lang: es-ES
---

# Minecraft con AMP

Para gestionar un servidor de minecraft con varios tipos de mundos incluyendo minijuegos, las cosas se vuelven más complicadas que simplemente tener un servidor ejecutándose con los plugins, así que usamos un software *(por desgracia de código cerrado)* que nos ayudará a gestionar todos los servidores.

Este software se llama [AMP *(Application Management Panel)*](https://cubecoders.com/AMP) y está desarrrollado por CubeCoders. Lo bueno que tiene es que no solo sirve para gestionar servidores de Minecraft Java Edition, sirve para Bedrock y para bastantes más juegos. Además, la licencia *Professional*, que es la más barata, cuesta unos 10€ y es un pago único, así que está guay.

Dentro de AMP, crearemos los distintos servidores de minecraft, de los que hay que diferenciar dos partes:
- Están los servidores con los distintos mundos o minijuegos. Aquí está lo jugable.
- Y luego está el proxy, que se encarga de conectar todos esos servidores para que los jugadores puedan moverse cómodamente de uno a otro. El proxy es el que se encarga de gestionar la conexión con los jugadores en todo momento.

Así que lo primero será instalar AMP y después ya podremos crear y configurar los servidores.

## Instalación de AMP

Lo primero es cambiarnos al usuario `root` y después ejecutar el script de instalación:

```
$ sudo su -l
$ bash <(wget -qO- getamp.sh)
```

Lo primero que hará es preguntarnos una contraseña para el usuario `amp` del sistema, que será el que contenga todos los archivos de minecraft. Si no introducimos ninguna generará una aleatoria. Como no va a ser necesario acceder a ese usuario manualmente, lo dejamos en blanco.

Ahora hay que elegir un nombre de usuario y una contraseña *(solo con números y letras)* que será para acceder al panel de control y gestionar los servidores. La contraseña debe ser tremenda.

Nos hace una serie de preguntas, cuya respuesta es:
- Sí vamos a tener servidores de Minecraft.
- Aquí depende de si hay interés por crear servidores de otros juegos. Nunca está de más tener las librerías.
- Sí queremos utilizar docker para los servidores.
- Y, si ya hemos [configurado Nginx](../equipo/nginx), sí queremos habilitar HTTPS.

Pulsamos \<Enter\>  y so pondrá a instalar AMP. Una vez instalado, tendremos que acceder desde la web para seguir la configuración *(el enlace lo mostrará en la consola)*.

Desde el navegador, utilizaremos el modo de operación por defecto *(Standalone)*, pondremos la licencia y nos tocará reiniciar AMP con el botón.

**¡OJO!** Si hemos seguido la [configuración de Docker](../equipo/docker), nos dará un error al intentar crear un servidor de minecraft, ya que antes tendremos que añadir al usuario `amp` al grupo `docker` con el comando ejecutado como `root`:

```
usermod -a -G docker amp
```

Y seguramente tengamos que hacer un reiniciao para que los cambios tengan efecto, después de eso ya no debería de haber problema para crear servidores.

## Configurando el proxy