---
title: Docker Mailserver
lang: es-ES
---

# Docker Mailserver - Correo electrónico

Tener un correo funcionando en un servidor es una tarea compleja porque un servidor de correo no se compone únicamente de un programa, suelen ser muchos que trabajan entre sí. Es por eso que, tras ver las opciones disponibles, decidimos utilizar [Docker Mailserver](https://github.com/docker-mailserver/docker-mailserver), que (a parte de ser obviamente un servicio para docker) viene con varios complementos y tiene una instalación muy sencilla.

Hemos seguido [la documentación](https://docker-mailserver.github.io/docker-mailserver/latest/usage), pero dejamos por aquí todos los pasos.

## Dominio y router

Lo primero que tenemos que hacer es añadir un registro `MX` al dominio base `wupp.dev` que apunte al subdominio que crearemos para el correo `mail.wupp.dev`. En el caso de FreeDNS, nos pide también una prioridad, así que pusimos `10:mail.wupp.dev` en el registro `MX`.

Después, creamos un registro `A` con el subdominio `mail.wupp.dev` y la IP del servidor.

Por último, tendremos que irnos al router y abrir los puertos `25`, `143`, `465`, `587` y `993`, que serán los usados por el correo tanto entrante como saliente.

## Nginx y docker-compose

En el `docker-compose.ylm` añadimos la [configuración de ejemplo que tienen en el repositorio](https://github.com/docker-mailserver/docker-mailserver/blob/master/compose.yaml):

```yml
version: "3.0"

services:
  mailserver:
    image: mailserver/docker-mailserver
    container_name: mailserver
    restart: always
    env_file: mailserver.env
    ports:
      - "25:25"    # SMTP  (explicit TLS => STARTTLS)
      - "143:143"  # IMAP4 (explicit TLS => STARTTLS)
      - "465:465"  # ESMTP (implicit TLS)
      - "587:587"  # ESMTP (explicit TLS => STARTTLS)
      - "993:993"  # IMAP4 (implicit TLS)
    volumes:
      - /var/dms/mail-data/:/var/mail/
      - /var/dms/mail-state/:/var/mail-state/
      - /var/dms/mail-logs/:/var/log/mail/
      - /var/dms/config/:/tmp/docker-mailserver/
      - /etc/localtime:/etc/localtime:ro
      - /etc/letsencrypt:/etc/letsencrypt
    hostname: mail.wupp.dev
    stop_grace_period: 1m
    cap_add:
      - NET_ADMIN
    healthcheck:
      test: "ss --listening --tcp | grep -P 'LISTEN.+:smtp' || exit 1"
      timeout: 3s
      retries: 0
```

Y creamos un archivo junto al `docker-compose.yml` con también la [configuración por defecto del repositorio](https://github.com/docker-mailserver/docker-mailserver/blob/master/mailserver.env) `mailserver.env`.

Por la longitud del archivo, me limitaré a especificar los cambios realizados en el archivo:

```dotenv
TZ=Europe/Madrid

SPOOF_PROTECTION=1

ENABLE_OPENDKIM=0

ENABLE_OPENDMARC=0

ENABLE_POLICYD_SPF=0

ENABLE_CLAMAV=1

ENABLE_RSPAMD=1

RSPAMD_LEARN=1

RSPAMD_GREYLISTING=1

ENABLE_AMAVIS=0

ENABLE_FAIL2BAN=1

SSL_TYPE=letsencrypt

DOVECOT_MAILBOX_FORMAT=sdbox
```

Como vamos a habilitar `TLS` mediante letsencrypt, tendremos que general el certificado. Nosotros hicimos temporalmente una copia de la configuración de `www.wupp.dev.conf` en Nginx para `mail.wupp.dev` y para así poder general el certificado con el comando:

```sh
sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d mail.wupp.dev
```

Si aquí intentásemos ejecutar el contenedor, puede ser que salga un error diciendo que el puerto 25 ya está en uso. En nuestro caso, estaba en uso por `exim4`, que es un servicio para el correo que viene instalado en Debian. Nosotros lo que hicimos fue parar el servicio y desactivarlo con `sudo systemctl stop exim4.service` y `sudo systemctl disable exim4-base.timer`.

Hecho todo esto, podemos ejecutar `docker compose up -d` y, rápidamente habrá que crear una primera cuenta como puede ser `admin@wupp.dev`, así que ejecutamos el siguiente comando:

```sh
docker exec -ti mailserver setup email add admin@wupp.dev
```

Y con esto deberíamos tener el servidor de correo correctamente funcionando.

## Retoques finales

Como primera recomendación, crearemos un alias para postmaster:

```sh
docker exec -ti mailserver setup alias add postmaster@wupp.dev admin@wupp.dev
```

Queda configurar DMARC, DKIM y SPF.

## ¿Cliente web?

*Posible sección.*

## ¿Autenticación?

*Posible sección.*