---
title: Minecraft con AMP
lang: es-ES
---

# Minecraft con AMP

Para gestionar un servidor de minecraft con varios tipos de mundos incluyendo minijuegos, las cosas se vuelven más complicadas que simplemente tener un servidor ejecutándose con los plugins, así que usamos un software *(por desgracia de código cerrado)* que nos ayudará a gestionar todos los servidores.

![AMP Instalación](../images/amp-instalacion.png)

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

![AMP Inicio](../images/amp-inicio.png)

Una vez estamos aquí, vamos a hacer un primer cambio en la configuración, nos vamos a *New Instances Defaults* y marcamos la opción *Exclude new instances from firewall*. Esto hará que los servidores nuevos no se añadan automáticamente al firewall para permitir sus puertos, ya que no necesitaremos que esos puertos estén abiertos al exterior porque la gente se conectará únicamente al proxy, que sí tendremos que permitir, así que escribimos en la terminal:
```
$ sudo ufw allow 25565
```

## Configurando el proxy

Ahora vamos a crear el proxy. Utilizaremos [Waterfall](https://papermc.io/downloads#Waterfall), un fork de [Bungeecord](https://www.spigotmc.org/wiki/bungeecord/) que tiene mejor soporte para [Forge](https://files.minecraftforge.net/net/minecraftforge/forge/). Aun así, como AMP no tiene soporte directo para Waterfall, le diremos que estamos usando Bungeecord *(es mentira)*.

![AMP Creación Proxy](../images/amp-creacion-proxy.png)

Nos metemos a gestionar la instancia porque nos toca descargar manualmente la última versión de waterfall *(ahora y cada vez que queramos actualizar)* y moverla a los archivos de la instacia, cosa que deberíamos de poder hacer yendo a *File Manager* y arrastrando el archivo descargado. Si no deja, como es nuestro caso, nos toca complicarnos más la vida.

AMP ejecuta un servidor SFTP *(SSH File Transfer Protocol)* para poder gestionar los archivos de las instancias de forma más cómoda. Por defecto se ejecuta en el puerto `2223` y nos podemos conectar con el mismo usuario y contraseña que usamos para acceder al panel. Pues bien, para gestionar los archivos, utilizamos [FileZilla](https://filezilla-project.org/), nos conectamos a `wupp.dev:2223` con usuario y contraseña y ya podremos transferir archivos cómodamente entre nuestro ordenador y el servidor.

Una vez esté el archivo, volvemos a la instancia, a *Configuration*, *Server Settings* y en *Server JAR* elegimos el archivo de waterfall. También vamos a cambiar la versión de Java a la última, en este caso la 18, así que vamos a *Java and Memory* y editamos *Java Version*. Ahora podemos iniciarlo y ya editar los archivos de configuración manualmente.

A parte de los cambios hechos que voy a escribir a continuación, los archivos modificados están en [el repositorio de GitHub](https://github.com/ComicIvans/server).
- `Java.MaxHeapSizeMB=1024`
- `Java.CustomOpts=-Xms512M -Xmx512M -XX:+UseG1GC -XX:G1HeapRegionSize=4M -XX:+UnlockExperimentalVMOptions -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch`

Estos argumentos de java, a parte de establecer la cantidad de memoria RAM que puede usar el proxy, se supone que ayudan a que rinda mejor.

Además, esta es la lista de plugins:
- [BungeeTabListPlus](https://www.spigotmc.org/resources/bungeetablistplus.313/)
- [Bungee Chat](https://www.spigotmc.org/resources/bungee-chat.12592/)
- [Hub Command](https://www.spigotmc.org/resources/hub-command.57584/)
- [LuckPerms](https://luckperms.net/download)
- [SkinsRestorer](https://www.spigotmc.org/resources/skinsrestorer.2124/)
- [ViaVersion](https://www.spigotmc.org/resources/viaversion.19254/)
- [ViaBackwards](https://www.spigotmc.org/resources/viabackwards.27448/)

## El primer servidor

Muy bien, tenemos un proxy y si añadimos el servidor a la pantalla de multijugador de minecraft aparecerá como en línea. Pero si intentamos conectarnos no podremos, porque no tenenemos ningún mundo al que unirnos.

Vamos a crear el primer servidor, que será el que tenga el mundo donde aparezcan los jugadores que se conecten.

Este servidor será el **Lobby**, y desde aquí los jugadores podrán moverse entre los demás servidores.

![AMP Creación Lobby](../images/amp-creacion-lobby.png)

Dependiendo del tipo de servidor que queramos hacer tendremos que elegir si tener mods o plugins. Lo más común es querer tener plugins, así que vamos a usar Purpur.

Igual que antes, a parte de los cambios escritos a continuación, los archivos modificados están en [el repositorio de GitHub](https://github.com/ComicIvans/server).
- `Java.MaxHeapSizeMB=2048`
- `Java.CustomOpts=-Xms2G -Xmx2G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true`

Nuevamente, estos argumentos de java aumentan el rendmiento, de servidor y están sacados de [aquí](https://docs.papermc.io/paper/aikars-flags).

Esta es la lista de plugins:
- as