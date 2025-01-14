# Monitorizando el equipo y los servicios

::: info
Aunque es recomendable configurar la monitorización, es **completamente
opcional** y el servidor funciona perfectamente sin ello.
:::

Tener una mínima idea de qué pasa en tu servidor es probablemente una buena
idea. ¿La tenemos? Realmente no y nunca nos habíamos preocupado, hasta que un
buen día este reventó por subir unas fotos a Immich. Desde ese momento, se me
ocurrió que igual era buena idea tener un mínimo de conocimiento de qué pasa.

Grafana y Prometheus son dos herramientas bastante conocidas en este aspecto,
así que empecé por ahí, buscando en un blog sobre self-hosting que conocía.
Encontré y partí de [este
artículo](https://noted.lol/netdata-prometheus-and-grafana/), el cual también
incluye NetData. Adicionalmente, a parte de recolectar todas las métricas del sistema, vamos a configurar Loki con Grafana para almacenar y agregar todos los logs

Tras un intento fallido (y por tanto ignorado) de conseguir configurarlo
adecuadamente en el local, comenzamos con la instalación.

## Instalando NetData en el sistema

Vamos a hacer una excepción con la instalación de este servicio. Dado que
NetData es una herramienta para monitorizar el sistema y con ello Docker, nos
viene bien tenerla aislada del propio Docker, permitiéndonos así ver errores y
problemas en Docker cuando estos surjan sin el riesgo de que este servicio
también caiga.
::: details ¿Puedo instalarlo con Docker?

Se puede instalar perfectamente con Docker, toda la información para la
instalación está en [su
documentación](https://learn.netdata.cloud/docs/netdata-agent/installation/docker).
:::

Para instalarlo en el sistema, vamos a usar el script que proveen:

```bash
wget -O /tmp/netdata-kickstart.sh https://my-netdata.io/kickstart.sh && sh /tmp/netdata-kickstart.sh --stable-channel --disable-telemetry
```

Con el par de flags que le pasamos, nos aseguramos de que nos instala la versión
estable y que se deshabilita la telemetría. El script te pedirá permisos de
administrador, te toca dárselos te guste o no para que instale algunas cosas con
apt.
Una vez instalado, vamos a usar port forwarding para poder acceder a la
dashboard de Netdata y configurar un par de cosas más. Para ello, utilizamos ssh
de la siguiente manera:

```bash
ssh -L 19999:127.0.0.1:19999 -N -p <puero_ssh> user@server.com
```

En la dashboard te va a aparecer en grande un texto de bienvenida y un botón
para iniciar sesión, pasa. Si te fijas debajo de él, debajo de todo, en
pequeñito y sin casi contraste con el fondo, con la clara intención de que no lo
veas, le puedes dar a continuar sin iniciar sesión. Continuamos por tanto así de
manera anónima.

Puedes curiosear ahora todo lo que quieras. Hay mucha, mucha, mucha información,
incluida mucho inútil (para nosotros al menos) como el número de inodes
disponibles. Pero ahora vamos a ir poquito a poco dándole sentido y una mejor
apariencia a todo :D.

## Lanzando Prometheus: a agregar datos

Sinceramente ahora mismo no vamos a dar un paso adelante en que todo coja
sentido, casi que más hacia atrás, pero no pasa nada, a veces hay que ir para
atrás para ir hacia delante. Vamos a pasar a instalar Prometheus, un recolector
y agregador de métricas.

Este software nos va a permitir tener todas las métricas de todos los servicios
(más adelante lo entenderéis mejor) juntas en un único sitio y bien almacenadas,
por el tiempo que estimemos y deseemos. También se puede usar para ver los datos
y hacer queries, pero no nos vamos a centrar en eso, no es lo que nos interesa
de esto.

Primero, vamos a crear un archivo de configuración básico con el que empezar.
Cómo se trata de empezar con algo, vamos a usar el archivo del artículo que
mencionaba al comienzo de la página. Por tanto, copiamos el siguiente texto y lo
guardamos en `prometheus/prometheus.yml`:

```yaml
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]

  #################################################################################################

  - job_name: "server-monitor"

    metrics_path: "/api/v1/allmetrics"
    params:
      # format: prometheus | prometheus_all_hosts
      # You can use `prometheus_all_hosts` if you want Prometheus to set the `instance` to your hostname instead of IP
      format: [prometheus]
      #
      # source: as-collected | raw | average | sum | volume
      # default is: average
      #source: [as-collected]
      #
      # server name for this prometheus - the default is the client IP
      # for Netdata to uniquely identify it
      #server: ['prometheus1']
    honor_labels: true
    static_configs:
      - targets: ["localhost:19999"]
#################################################################################################
```

Una vez que tenemos el archivo básico (más adelante profundizaremos en la
configuración) podemos pasar a lanzar la imagen de docker. Para esto, añadimos
a los servicios del `docker-compose.yml` lo siguiente:

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - "./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml"
  # ports:
  # - '9090:9090'
  network_mode: "host"
```

<!-- TODO Segunda respuesta: https://stackoverflow.com/questions/17770902/forward-host-port-to-docker-container -->

En este caso, los puertos expuestos están comentados y hay una clave nueva,
`network_mode`. Esto se debe a que para que Prometheus pueda acceder a **todas**
las métricas de **todos** nuestros servicios y sistemas (incluyendo el NetData
que hemos configurado antes) tiene que poder acceder a los puertos que estos
vinculan al host, lo que se hace adjudicando el contenedor directamente a la red
del host, en vez de a la que crea Docker. ¿Es lo más seguro? Nop. ¿Es perfecto?
Nop. ¿Es una solución real? Nop. ¿Es un apaño que nos sirve perfectamente? Sip.
(_Algún día descubriré cómo hacerlo mejor_).)

Para comprobar que en efecto Prometheus está recogiendo bien las métricas de
NetData, puedes hacer 2 cosas diferentes:

- Dónde está el campo de entrada para meter una expresión, haz click sobre los
  tres puntos y dale a "Explore metrics". Te va a aparecer una lista
  excesivamente larga de métricas disponibles, pero puedes buscar en el campo de
  búsqueda `netdata` y deberían de aparecerte.

- Ve a _Status > Target health_ y deberán de aparecerte 2 targets, el propio
  Prometheus y el que hemos configurado como `server-monitor`. Si en el segundo
  pone que el estado es `UP`, todo perfe.

Vamos ahora ya a lo chulo (aunque aún no se vea chulo).

## Gráficos bonitos con Grafana

Para poder sacar algo útil de esto y adaptarlo a nuestro gusto y necesidades,
necesitamos algo que nos permita crear esa interfaz que buscamos. Entra el
último componente del montaje: [Grafana](https://grafana.com).

Grafana nos permite crear básicamente cualquier tipo de panel/dashboard para
visualizar datos, incluyendo todos los recogidos con Prometheus pero también
cosas desde un [simple
reloj](https://grafana.com/grafana/plugins/grafana-clock-panel/) a conectar con
[Google
Sheets](https://grafana.com/grafana/plugins/grafana-googlesheets-datasource/).
Como con Prometheus, utilizaremos Docker y de nuevo, para que pueda sacar los
datos de Prometheus, usaremos la red del host. Así, añadimos lo siguiente a los
servicios de nuestro `docker-compose.yml`:

```yaml
grafana:
  image: grafana/grafana
  user: <uid>:<gid>
  network_mode: "host"
  volumes:
    - "./grafana/data:/var/lib/grafana"
  env_file:
    - ".env.d/grafana.env"
  restart: unless-stopped
```

- Como antes, utilizamos la red de host y no vinculamos puertos por ello.

- Montamos un único volumen (al menos por ahora), que nos enlaza con la base de
  datos y nos permite persistir los datos de Grafana. En la documentación oficial,
  recomiendan usar volúmenes de docker en lugar de vincular al sistema de
  archivos, pero en nuestro caso en todo momento hemos vinculado al sistema de
  archivos, por lo que así continuará siendo.

- En el archivo de entorno que vinculamos, vamos a configurar nuestra instancia.
  La imagen de Docker de Grafana no permite añadir otros archivos de configuración
  para extender el por defecto, por tanto nos tenemos que apañar con las variables
  de entorno ([aquí está en su
  documentación](https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/#default-paths),
  que mira que me costó encontrarlo).

Como comentamos en el último punto, vamos a configurar un par de cosas antes de
lanzar el contenedor, así que tomad el siguiente archivo y completad:

```dotenv
# Para darnos más seguridad, vamos a vincularlo a un puerto aleatorio
GF_SERVER_HTTP_PORT=<puerto_aleatorio>
# Aunque está deshabilitado por defecto, es recomendable habilitarlo y no debería dar problemas (deshabilítalo si te da problemas))
GF_SERVER_ENABLE_GZIP=true

# Si se desea, esto se puede desactivar si se ha configurado Watchtower (descomentar la línea)
# GF_ANALYTICS_CHECK_FOR_UPDATES=false

# Por comodidad, configuramos la cuenta de admin aquí
# Lo primero es desactivar el registro inicial de ella
GF_SECURITY_DISABLED_INITIAL_ADMIN_CREATION=true
# Ahora configuramos la cuenta
GF_ADMIN_USER=<usuario>
GF_ADMIN_PASSWORD=<contraseña>
GF_ADMIN_EMAIL=admin@server.com

# Configuración del email
GF_SMTP_ENABLED=true
GF_SMTP_HOST=server.com
# Recuerda crear los correos que vayas a usar
GF_SMTP_USER="grafana@server.com"
GF_SMTP_PASSWORD=<contraseña>
GF_SMTP_FROM_ADDRESS="grafana@server.com"
GF_SMTP_FROM_NAME="Grafana Server" # El por defecto es "Grafana"

# Manda un mensaje de bienvenida a los nuevos usuarios
GF_EMAILS_WELCOME_EMAIL_ON_SIGN_UP=true

# TODO Usar una DB que no sea SQLite
```

¡Ya podemos por fin subir el contenedor y comprobar que funciona!

Te tiene que aparecer el inicio de sesión lo primero, así que inicia sesión como admin con las credenciales que hemos configurado antes. Si no te funcionan por lo que sea, prueba a usar lo por defecto, que es usuario `admin` y contraseña `admin`. Para poder ver algo, vamos a hacer dos cosas:

1. Tenemos que configurar Prometheus como una fuente de datos para Grafana. Cuando accedas a Grafana, te aparecerá una tarjetita con un enlace diciendo que configures una fuente de datos. Haz click ahí y selecciona Prometheus como la fuente de datos. Introduce la dirección a ella, que en nuestro caso será `localhost:<puerto_prometheus>` (el porto por defecto es 9090). Una vez configurado esto, Grafana ya puede recolectar y acceder a los datos de Prometheus.

1. Para ver algo, vamos a configurar una dashboard para hacer pruebas. Para ello podemos descargar un archivo JSON que funciona como definición de una dashboard, yo por ejemplo he probado con [este](https://grafana.com/grafana/dashboards/7107-netdata/). Ahora, desde dónde hemos añadido Prometheus, te tiene que aparecer abajo para crear una dashboard (si te has salido de ahí ya, puedes ir al inicio y te aparece otra tarjeta como la de conectar una fuente de datos para crear una dashboard, haz click ahí). Dale a la opción de importar archivo JSON y sube el archivo de la que acabas de descargar. Ta-da! Ya tenemos nuestra primera dashboard. Puede que algunas métricas no se muestren bien, es normal, aún podemos configurar mejor NetData para que recolecte cosas que igual no está recolectando, pero por ahora nos sirve para ver que funciona.

Pues ya está, ya estás recolectando métricas de tu sistema y ya puedes visualizarlas. Según vaya probando a configurar mejor Grafana, Prometheus y NetData, iré actualizando este artículo para reflejarlo. Por ahora, te animo a investigar por tu cuenta y probar a configurar mejor estas cosas.

## Logs con Loki

Una parte muy importante para saber qué demonios pasa en las cosas es los logs. Ahora mismo cada log está en un lado diferente, o en sus contenedores correspondiente, o en un archivo en el FS o perdidos por algún lado (odio Nextcloud); lo cual admitamos no es nada cómodo ni práctico. Ahora que tenemos Grafana, podemos ver en ella logs si así lo configuramos, así que vamos a configurar un agregador y recolector de logs desarrollado por el propio equipo de Grafana: [Loki](https://grafana.com/docs/loki/latest/).

### Instalación de Loki

Loki es el servicio que nos va a almacenar y nos va a permitir filtrar y buscar todos los logs, pero además de este, vamos a configurar otro que nos va a permitir recolectar los logs de varios sitios: Promtrail.

Vamos a seguir lo [guía de instalación con docker oficial](https://grafana.com/docs/loki/latest/setup/install/docker/). Para ello, primero, vamos a crear un directorio para loki y uno para promtail (dentro del de loki) y vamos a usar los archivos de configuración por defecto que podemos encontrar en el artículo enlazado arriba:

```bash
mkdir loki
cd loki
wget https://raw.githubusercontent.com/grafana/loki/v3.0.0/cmd/loki/loki-local-config.yaml -O loki-config.yaml
mkdir promtail
cd promtail
wget https://raw.githubusercontent.com/grafana/loki/v3.0.0/clients/cmd/promtail/promtail-docker-config.yaml -O promtail-config.yaml
```

Antes de crear el contenedor, como de nuevo vamos a conectarlo directamente al host, vamos a cambiar los puerto a los que se vincula para mejorar la seguridad. Para ello genera dos aleatorios, por ejemplo consideremos 17823 y 34532 y cambia la siguiente configuración en el `loki-config.yaml`:

```yaml
server:
  http_listen_port: 17823
  grpc_listen_port: 34532
```

Tenemos que también actualizar la configuración de Promtail para que vincule correctamente a Loki, ya que hemos cambiado su puerto, así que cambiemos lo siguiente en `promtail-config.yaml`:

```yaml
clients:
  - url: http://localhost:17823/loki/api/v1/push
```

Nos falta una última cosa para asegurarnos de que todo va bien: permisos. Linux es súper granular con los permisos, lo cual está guay, pero también nos va a dar un poco de dolor de cabeza conseguir que Promtail pueda acceder a nuestros logs. Para ello, vamos a tener que darle permiso a nuestros logs, y los más fácil nos va a resultar crear un grupo para ello.

Vamos entonces a crear un grupo, por ejemplo `monitoreo`. Una vez tengamos este grupo creado, vamos a tener que ir cambiando el grupo propietario de los archivos que con Promtail queramos leer a este grupo. Para empezar con lo básico, los logs del sistema, haríamos tal que así (esto vas a tener que hacerlo en un user con el que puedas hacer sudo):

```bash
sudo groupadd monitoreo                 # Creamos el grupo
sudo usermod -a -G monitoreo root       # Añadimos a root
sudo usermod -a -G monitoreo usuario    # Añadimos a nuestro usuario por defecto
sudo usermod -a -G monitoreo dockeruser # Añadimos a nuestro usuario de docker
sudo usermod -a -G monitoreo netdata    # Añadimos al usuario de NetData para no romper nada, ya que tiene acceso al grupo que por defecto se pone
sudo chgrp monitoreo /var/log/*.log     # Cambiamos el grupo de los logs a monitorizar
```

Una vez hecho esto, tenemos que anotarnos el id del grupo que acabamos de crear. Para eso, ejecuta `id` y busca algo como `<numero>(monitoreo)` y anótate ese número, ese número es el id del grupo de monitoreo y lo usaremos al configurar docker.

En el artículo oficial, ejecuta los contenedores manualmente desde la terminal, así que vamos a traducirlo a formato de Compose (aprovechando también la documentación [que tienen en Docker Hub](https://hub.docker.com/r/grafana/loki)) y añadirlo a nuestros servicios en él:

```yaml
loki:
  image: grafana/loki:3
  user: "1001:1001" # Necesario para que pueda acceder a los archivos de config creados
  volumes:
    - "./loki/loki-config.yaml:/etc/loki/local-config.yaml"
    - "./loki/loki-data:/loki"
  network_mode: "host" # Como antes, tenemos que darle acceso al host para poder contactar con promtail correctamente

promtail:
  image: grafana/promtail:3
  user: "1001:<id_grupo_monitoreo>"
  volumes:
    - "/var/log:/var/log"
    - "./loki/promtail:/mnt/config"
  command: "-config.file=/mnt/config/promtail-config.yaml"
  network_mode: "host"
```

### Añadiéndolo a Grafana

Configurar ahora la fuente de datos en Grafana vuelve a ser muy fácil. Tenemos que ir a _Connections > Data Sources_ y añadir una nueva. El tipo de conexión que queremos añadir el "Loki". Introduce la URL que hayas configurado antes para Loki (el puerto que hayas puesto), ¡y ya podemos ver los logs de Loki!

Para ello, ve a _Explore > Logs_ y te aparecerán todos los logs que Loki está recolectando.

<!-- TODO https://community.grafana.com/t/maximum-of-series-500-reached-for-a-single-query/64117/2 como desplegable? -->

### Recolectando métricas de Loki

Tanto Loki como Promtail exportan métricas que Prometheus puede recolectar. Como otro ejemplo de configurar más recolección de métricas en Prometheus, vamos a configurar estos dos.

Para ello, añadimos al final de nuestro archivo de configuración de Prometheus (`prometheus.yml`) las siguientes líneas:

```yaml
- job_name: loki
  static_configs:
    - targets: ["localhost:<loki_port>"]

- job_name: promtail
  static_configs:
    - targets: ["localhost:<promtail_port>"]
```

Y reiniciamos el contenedor de Prometheus para que pille la nueva configuración con `docker compose restart prometheus`

### Configurando cada servicio

La mayoría de servicios te permiten recolectar métricas sobre ellos o puedes recolectar sus logs en Loki, pero ponernos a explicar cómo hacerlo para cada uno aquí no tiene mucho sentido.

En su lugar, en cada una de las páginas de servicios vas a tener al final una parte de _Extra > Monitorización_ y una de _Extra > Recolección de logs_ en la que se va a explicar cómo configurar cada uno para ello.

<!-- TODO For nextcloud: https://github.com/xperimental/nextcloud-exporter o sino https://learn.netdata.cloud/docs/collecting-metrics/cloud-provider-managed/nextcloud-servers -->
<!-- TODO https://learn.netdata.cloud/docs/collecting-metrics/containers-and-vms/cadvisor -->

## Usando cAdvisor

TODO https://github.com/google/cadvisor
