# Monitorizando el equipo y los servicios

::: info
Aunque es recomendable configurar la monitorización, es **completamente opcional** y el servidor funciona perfectamente sin ello.
:::

Tener una mínima idea de qué pasa en tu servidor es probablemente una buena idea. ¿La tenemos? Realmente no y nunca nos habíamos preocupado, hasta que un buen día este reventó por subir unas fotos a Immich. Desde ese momento, se me ocurrió que igual era buena idea tener un mínimo de conocimiento de qué pasa.

Grafana y Prometheus son dos herramientas bastante conocidas en este aspecto, así que empecé por ahí, buscando en un blog sobre self-hosting que conocía. Encontré y partí de [este artículo](), el cual también incluye NetData.

Tras un intento fallido (y por tanto ignorado) de conseguir configurarlo adecuadamente en el local, comenzamos con la instalación.

## Instalando NetData en el sistema

Vamos a hacer una excepción con la instalación de este servicio. Dado que NetData es una herramienta para monitorizar el sistema y con ello Docker, nos viene bien tenerla aislada del propio Docker, permitiéndonos así ver errores y problemas en Docker cuando estos surgan sin el riesgo de que este serivicio también caiga.

::: details ¿Puedo instalarlo con Docker?
Se puede instalar perfectamente con Docker, toda la información para la instalación está en [su documentación](https://learn.netdata.cloud/docs/netdata-agent/installation/docker).
:::
