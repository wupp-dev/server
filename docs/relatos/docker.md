---
title: Docker y sus cosas
lang: es-ES
---

# Docker y sus cosas

Inicialmente, este relato viene de intentar instalar Docker que y Debian decidiese que no lo iba a hacer, pero tras una larga meditación y que Docker no funcione muchas veces porque porqué no, he decidido que puedo incluir aquí todas esas anécdotas de cuando Docker no es maravilloso.

## Instalación de Docker

Sorprendentemente, fué bien, sin problema.

## Vamos a crear el usuario _docker_

Aquí Debian dijo: ª.

Lo primero fué ejecutar `sudo adduser -m docker`, que es lo que indica cualquier guía para crear un usuario con Debian y otras distros y, hasta donde mi memoria llega, es el comando que había ejecutado yo previamente para esas tareas. Pero esta ejecución fallaba y decía lo siguiente: `Unknown option: m`. Viendo la ayuda del comando con `sudo adduser --help` y `man adduser`, pues no estaba la opción `-m`, entonces procedí a crearlo sin la opción a ver si funcionaba.

::: info
En un principio, la opción `-m` en `adduser` indica al comando que cree la carpeta _home_ del usuario en _/home/\<username>_ (o donde se indique con la opción `-D`).
:::

Al ejecutar `sudo adduser docker`, el comando fallaba y devolvía el siguiente error: `adduser: El grupo 'docker' ya existe.`. Y pues claro, mi respuesta inicial fué que yo estaba intentando crear un usuario, no un grupo. Me gustaría poder decir que me di cuenta de que al crear un usuario se creaba un grupo con el mismo nombre, pero eso no sería cierto, sino que mi compañero Iván lo descubrió cuando esto ya estaba solucionado. Básicamente mi solución fue crear un usuario con otro nombre, en este caso hice `sudo adduser dockeruser`, y funcionó.

Ahora procedí a comprobar la existencia de _/home/dockeruser_ y correcto, existía, y los permisos estaban correctamente configurados así que perfecto. Procedo a ver los usuarios que existen con `awk -F: '{ print $1}' /etc/passwd | grep docker` y ¡sorpresa!, no aparece el usuario.

Entonces yo que se me veía muy despierto ese día, vuelvo a buscar por internet y descubro que claro, tenía que asignarle una contraseña al usuario con `sudo passwd dockeruser` y ya estaba todo bien.

::: tip RECOMENDACIÓN

Contraseñas largas para los usuarios por favor y gracias
:::

::: info

Normalmente las herramientas base del sistema de Debian y todas estas distros, GNU utils vamos, no suelen cambiar la API, así que realmente desconozco por completo que ha podido ocurrir con `adduser` para que no me funcionase una opción que se supone que existe.
:::

## Nos queda crear el grupo

Por si crear el usuario no hubiese sido ya difícil, toca gestionar el añadir el usuario al grupo de Docker. Quiero que veáis lo que pone en la documentación oficial de Docker antes de nada:

![sudo groupadd docker](../images/docker-group.png)

Se puede observar que Docker te dice que crees el grupo _docker_. Pues procedo a crear el grupo docker con `sudo groupadd docker` y obtengo lo siguiente (después de entender por qué fallaba lo del usuario, esto tiene lógica): `groupadd: group 'docker' already exists`.

Así que lo dicho, lo que ocurrió es que al **contrario de lo que dice la documentación oficial de Docker**, el grupo _docker_ ya se crea al instalar Docker y por tanto no es necesario crearlo, solo añadir el resultado con `sudo usermod -aG docker dockeruser`.

## Secrets: ¿funcionarán o no?

De cuando los `secret: external: true` no fué

## Resolviendo URLs a su manera

Probando de manera local Grafana, seguí la configuración lógica y recomendada para una instalación completamente local, es decir usando `http://localhost:9090` para conectar con Prometheus. Y resulta que a Grafana no le gustó la idea, prefirió no conectarse.

::: tip
Grafana al ir a guardar comprueba la condición, concretamente utilizando la dirección `<URL_INDICADA>/api/v1/query`. Igual os tenta a decir _"Bueno voy a acceder a la dirección desde el navegador a ver que pasa"_. Ya os adelanto que os va a dar un error, pero ese no es el error, simplemente que Grafana está llamando a esa dirección de otra forma. Empezamos bien.
:::

Me puse por tanto a investigar. Lo primero es cambiar `localhost` por, por ejemplo, la IP del ordenador. Igual te preguntarás que qué cambia esto.

Resulta que al parecer Docker, cuando indicas `locahost` en una URL que se resuleve dentro del contenedor, se refiere al propio contenedor. ¿Me había dado alguna vez este problema? Pues no, pero bueno ahora sí. Por tanto, cambiamos esto por la IP.

Tampoco funciona. Ahora ya si que desconozco completamente el porqué, dado que el puerto estaba expuesto. Para resolverlo, podemos utilizar la **IP del contenedor**.

Para esto, utilizamos `docker network inspect <NETWORK_NAME>`, lo cual nos dará una salida en JSON tal que así, en la que lo que queremos es el campo `IPv4Addres` de nuestro contenedor de Prometheus:

```json {11}
[
  {
    "Name": "<NETWORK_NAME>",
    // ...
    "Containers": {
      // ...
      "dab612af78aad409569df2dba82a4b4eb5fba7f112e678834c091334a52be3b2": {
        "Name": "prometheus-1",
        "EndpointID": "fea6ee17f8403a1de08769a602bd8175bdc7fdr6a23983a49bc0b5f7bf1994e1",
        "MacAddress": "02:42:ac:14:00:03",
        "IPv4Address": "172.20.0.3/16",
        "IPv6Address": ""
      }
    }
    // ...
  }
]
```

Ahora, si en Grafana reemplazamos `localhost` por `172.20.0.3` (ignorando lo que hay después de la `/`), ¡ya funciona! Esto se debe a que esa dirección IPv4 es la del contenedor en la red aislada que monta Docker, por tanto estamos accediendo al contenedor de Prometheus directamente.

¿Debería de haber funcionado poniendo `localhost` por que estamos exponiendo el puerto? Sí. ¿Por qué no lo hace? Buena pregunta. Si en algún momento lo descubro, aquí veréis la respuesta.
