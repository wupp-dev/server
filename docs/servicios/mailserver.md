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
      - "25:25" # SMTP  (explicit TLS => STARTTLS)
      - "143:143" # IMAP4 (explicit TLS => STARTTLS)
      - "465:465" # ESMTP (implicit TLS)
      - "587:587" # ESMTP (explicit TLS => STARTTLS)
      - "993:993" # IMAP4 (implicit TLS)
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

Como vamos a habilitar `TLS` mediante letsencrypt, vamos a expandir el certificado base con el comando:

```sh
sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d wupp.dev -d www.wupp.dev -d mail.wupp.dev
```

Nos preguntará si queremos expandir el certificado existente, a lo que diremos que sí.

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

Queda configurar DMARC, DKIM y SPF. ¿Qué son? Puedes aprenderlo con [este artículo de Cloudflare](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/). Vamos un por uno.

### SPF

Este es relativamente sencillo de configurar, simplemente debemos añadir un registro a nuestro dominio de tipo TXT con el siguiente contenido: `v=spf1 mx -all`. Esto indica que solo las direcciones IP que hemos incluído en los registros MX están autorizadas para mandar correos desde nuestro dominio y que el resto deben ser rechazadas.

### DKIM

Tenemos que asegurarnos que, entre los volúmenes montados en el `docker-compose.yml`, está `/var/dms/config/:/tmp/docker-mailserver/` para que las claves persistan. Desde el usuario _dockeruser_ ejecutamos `docker compose exec -ti mailserver setup config dkim keytype ed25519 selector dkim-ed25519` para generar las claves principales y `docker compose exec -ti mailserver setup config dkim keysize 4096 selector dkim-rsa` para generar unas segundas claves porque no todos los servidores de correo aceptan aun el otro tipo de clave.

Vamos a mover y renombrar los archivos generados para mayor comodidad. Actualmente tenemos estos archivos en el contenedor en `/tmp/docker-mailserver/rspamd/dkim`:

```
ed25519-dkim-ed25519-wupp.dev.private.txt
ed25519-dkim-ed25519-wupp.dev.public.dns.txt
ed25519-dkim-ed25519-wupp.dev.public.txt
rsa-4096-dkim-rsa-wupp.dev.private.txt
rsa-4096-dkim-rsa-wupp.dev.public.dns.txt
rsa-4096-dkim-rsa-wupp.dev.public.txt
```

Vamos a cambiarlos a `/tmp/docker-mailserver/rspamd/dkim/wupp.dev` con el siguiente nombre cada uno:

```
dkim-ed25519.private
dkim-ed25519.public.dns
dkim-ed25519.public
dkim-rsa.private
dkim-rsa.public.dns
dkim-rsa.public
```

Ahora toca crear el archivo de configuración (en el servidor, no en el contenedor). Primero creamos la carpeta con `sudo mkdir /var/dms/config/rspamd/override.d` y dentro el archivo `dkim_signing.conf` con:

```conf
# documentation: https://rspamd.com/doc/modules/dkim_signing.html

enabled = true;

sign_authenticated = true;
sign_local = true;

use_domain = "header";
use_redis = false; # don't change unless Redis also provides the DKIM keys
use_esld = true;
check_pubkey = true; # you want to use this in the beginning

selector = "dkim-rsa";
# The path location is searched for a DKIM key with these variables:
# - `$domain` is sourced from the MIME mail message `From` header
# - `$selector` is configured for `mail` (as a default fallback)
path = "/tmp/docker-mailserver/rspamd/dkim/wupp.dev/dkim-rsa.private";

# domain specific configurations can be provided below:
domain {
    wupp.dev {
        selectors [
            {
                path = "/tmp/docker-mailserver/rspamd/dkim/wupp.dev/dkim-rsa.private";
                selector = "dkim-rsa";
            },
            {
                path = "/tmp/docker-mailserver/rspamd/dkim/wupp.dev/dkim-ed25519.private";
                selector = "dkim-ed25519";
            }
        ]
    }
}
```

Y para que el archivo de configuración se copie al lugar correcto ejecutamos `docker compose down mailserver` y `docker compose up -d mailserver`. El archivo debería estar ahora (en el contenedor) en `/etc/rspamd/override.d/dkim_signing.conf`.

Por último, tenemos que añadir cada clave pública a un registro nuevo en el dominio. Igual que para la SPF, creamos un registro de tipo TXT con el contenido del archivo `/tmp/docker-mailserver/rspamd/dkim/wupp.dev/dkim-ed25519.public.dns` y `dkim-ed25519._domainkey` como subdominio y otro con el de `/tmp/docker-mailserver/rspamd/dkim/wupp.dev/dkim-rsa.public.dns` y `dkim-rsa._domainkey` como subdominio.

Podemos comprobar que funciona con [esta página](https://mxtoolbox.com/dkim.aspx).

### DMARC

Este último es sencillo de configurar, utilizamos [esta página](https://dmarcguide.globalcyberalliance.org/) para generar la configuración que en nuestro caso es esta:

```
_dmarc.wupp.dev. IN TXT "v=DMARC1; p=quarantine; rua=mailto:admin@wupp.dev; ruf=mailto:admin@wupp.dev; sp=none; fo=1; ri=86400"
```

Y creamos un último registro TXT en el dominio con `_dmarc` como subdominio y el contenido entre comillas.

### Información adicional

Es posible que, aun habiendo configurado SPF, DKIM y DMARC, algunos servidores de correos nos bloqueen el correo al intentar enviarlo a una de sus direcciones. A nosotros nos pasó con las direcciones de Outlook porque la IP del servidor estaba en la lista de Spamhaus y hubo que solicitar que se retirase desde [este enlace](https://check.spamhaus.org/).

## Cliente web

Por ahora no hemos visto ninguno interesante ni hemos tenido la necesidad.
