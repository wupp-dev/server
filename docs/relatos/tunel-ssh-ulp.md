---
title: Túnel SSH en la UGR LAN Party de 2024
lang: es-ES
---

# Túnel SSH en la UGR LAN Party de 2024

De cuando el servidor fue dispensado para la organización del torneo de Minecraft en la [UGR LAN Party](https://ulp.ugr.es/) de 2024.

## Contexto histórico

El **9 de marzo de 2024** se celebraba la UGR LAN Party en la [E.T.S. de Ingenierías Informática y de Telecomunicaciones](https://etsiit.ugr.es/) y el día anterior habíamos llevado el servidor físicamente a la escuela. Esto, como es obvio, suponía que no iba a estar operativo ningún servicio de ese ordenador durante el fin de semana, pues, aunque el ordenador estaba conectado a internet, no era posible abrir ningún puerto para nosotros en la red de la Universidad.

Este relato cuenta cómo pudimos mantener todos los servicios operativos aun cuando uno de los ordenadores no se encontraba accesible a través de internet.

## Túnel SSH para mantener el dominio funcionando

La respuesta al dilema, obviamente, es mediante un túnel SSH con el servidor principal, es decir, una conexión SSH ininterrumpida entre ambos ordenadores por donde se redirigía el tráfico del dominio al servidor de Minecraft.

Para poder llevarlo a cabo son necesarios los siguientes requisitos:

- Tener un servidor al que poder conectarte a través del dominio, que será el encargado de redirigir el tráfico al que no lo está.
- Tener conexión a internet con el servidor que no es accesible a través del dominio.
- Tener acceso a ambos, a uno por red local y a otro por internet.

Lo primero que había que hacer era recabar los puertos que usaban los distintos servicios del servidor de Minecraft, para así poder redirigirlos desde el servidor principal, pongamos que son estos:

- SSH en el puerto `22`.
- HTTPS en el puerto `443`.
- Minecraft en el puerto `25565`.
- SFTP para Minecraft en el puerto `2121`

Esos tres puertos serán los que tendremos que redirigir por el túnel SSH. Los puertos `25565` y `2222` los podemos redirigir a los mismo en el otro servidor, pero el `22` y el `443` no, puesto que está en uso, así que los redirigiremos al `2222` y al `4443` respectivamente. Vamos a poner el comando para crear el túnel en un archivo llamado `ssh_tunnel_ulp.sh`:

```sh
#!/usr/env/bin bash
ssh -R 0.0.0.0:2222:0.0.0.0:22 -R 0.0.0.0:4443:0.0.0.0:443 -R 0.0.0.0:25565:0.0.0.0:25565 -R 0.0.0.0:2121:0.0.0.0:2121 -N admin@wupp.dev
```

Los parámetros `-R` lo que indican son los puertos a redirigir y el parámetro `-N` indica que no queremos iniciar una consola interactiva, solo establecer la conexión y redirigir los puertos. No debemos olvidar hacer ejecutable el archivo con un `chmod +x ssh_tunnel_ulp.sh`

Ahora, para asegurarnos de que el túnel siempre está funcionando y poder editarlo si hace falta, vamos a crear un servicio. Añadimos el siguiente contenido al archivo `/etc/systemd/system/ssh-tunnel.service`:

```
[Unit]
Description=SSH tunnel from UGR
After=nss-user-lookup.target
Wants=nss-user-lookup.target

[Service]
Type=simple
User=admin
ExecStart=/bin/bash /home/admin/ssh_tunel_ulp.sh

[Install]
WantedBy=default.target
```

Y creamos un temporizador, `/etc/systemd/system/ssh-tunnel.timer`, para que se reinicie en caso de fallo:

```
[Unit]
Description=Run SSH tunnel
Requires=ssh-tunnel.service

[Timer]
Unit=ssh-tunnel.service
OnUnitInactiveSec=1m
AccuracySec=1s

[Install]
WantedBy=timers.target
```

Por último activamos el servicio con `sudo systemctl enable ssh-tunnel.service`, como el temporizador con `sudo systemctl enable ssh-tunnel.timer` e iniciamos el servicio con `sudo systemctl start ssh-tunnel`.

Hecho esto debemos tener las siguientes consideraciones para que todo funcione correctamente:

- Los puertos deben estar abiertos en el router y redigiridos al servidor principal.
- Los puertos deben estar permitidos en el firewall del servidor principal.
- Para todos los servicios HTTPS que haya que redirigir, debemos cambiar el `proxy_pass` a `127.0.0.1:4443` en la configuración de Nginx.
- Para que podamos acceder a servicios directamente por el puerto _(que no sean HTTPS)_, debemos de asegurarnos en el comando SSH de haber especificado `0.0.0.0` al menos para el puerto correspondiente al servidor principal, ya que indica que permita conexiones desde toda las interfaces de red. Además, para que esto sea posible, debemos de tener en `/etc/ssh/sshd_config` la línea `GatewayPorts yes` en el servidor principal.

## Torneo de Minecraft

Por añadir un poquito de información sobre el torneo de Minecraft para los interesados, consistió en 5 partidas de los Juegos del Hambre alternando entre 3 mapas míticos.

Los mapas se obtuvieron a través de [este video](https://www.youtube.com/watch?v=IJH3RL2Y4kI&pp=ygUSbWNzZyBtYXBzIGRvd25sb2Fk) de YouTube.

Para las partidas se hizo una [modificación](https://github.com/ComicIvans/ulpHungerGames) de [este plugin](https://github.com/Ayman-Isam/Hunger-Games).
