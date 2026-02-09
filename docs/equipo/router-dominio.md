---
title: Router y dominio
order: 4
---

# Configuración del router y del dominio

Aquí nuestro objetivo será no tener que preocuparnos de nada que no sea el propio servidor. Para ello, hay que preocuparse momentáneamente de dos elementos externos:

- Configurar el router de tu casa para que deje que el servidor sea un servidor.
- Adquirir un dominio para que sea más cómodo conectarte al servidor y poder usar subdominios.

## Breve introducción sobre las direcciones IP

Aquí vamos a hablar de dos tipos de direciones IP:

- **IP Pública:** Esta es la IP con la que se puede acceder al servidor _(o cualquier otro dispositivo de tu red, si lo permites)_ desde cualquier parte de Internet.
- **IP Local:** Esta IP identifica al servidor dentro de la red a la que está conectado, pero no sirve fuera.

![IPs Públicas vs Privadas](../images/ips-pub-priv.png)

Este ejemplo es con IPv4, lo más común, pero es lo mismo para IPv6, aunque utiliza direcciones mucho más largas y mejora ciertos aspectos de seguridad a nivel de diseño.

Lo que nos interesa aquí es la IP pública. Cuando queramos conectarnos al servidor o alguien más quiera, queda feo que tengan que hacerlo con la IP. Aquí es donde entran los **dominios**.

## Dominio, ¿qué es y para qué sirve?

Un dominio lo podemos ver como un pseudónimo para la IP, que es más bonito y fácil de recordar que la propia IP. Cuando nos conectamos a cualquier web, lo hacemos mediante el Uniform Resource Locator _(URL)_, que se divide en:

![URL](../images/url.png)

En nuestro caso, el dominio es `wupp.dev`, aunque antes era `servermamadisimo.xyz` y, cuando te intentas conectar a esa dirección, el ordenador se encarga de preguntarle qué dirección IP corresponde a ese dominio a unos servidores especiales que se llaman nameservers. Estos servidores son una parte fundamental del DNS _(Domain Name System)_, que permite utilizar estas URLs en vez de las IPs. Normalmente los nameservers que se usan son los del propio proveedor de Internet, pero se pueden cambiar para que sean a otros como [NextDNS](https://my.nextdns.io).

Los dominios **hay que pagarlos**, esta es la parte mala.

::: tip TRUCO
Puedes conseguir subdominios gratuitos en [FreeDNS](https://freedns.afraid.org/), pero no dominios. También puedes conseguir dominios gratis durante un tiempo limitado con promociones como las que se incluyen en el [GitHub Student Developer Pack](https://education.github.com/pack).
:::

Una vez compras un dominio, puedes elegir a qué IP apunta e incluso puedes crear **subdominios**.

### ¿Qué son los subdominios?

Pues lo que va antes del dominio, claro. Por ejemplo, para `wupp.dev` podemos crear los subdominios `www.wupp.dev`, `mc.wupp.dev` o `cloud.wupp.dev`. Esto es útil para separar los servicios que tienes en el servidor. Además, te permite apuntar a distintas IPs o incluso hacer redirecciones para cada subdominio.

Pero el hecho de tener un dominio no solo ayuda a la comodidad de recordarlo y escribirlo; a parte de que es necesario para poder usar subdominios, también nos permite no preocuparnos de qué pasa si la IP pública del servidor cambia _(que puede ocurrir)_, solo tienes que decirle al dominio que señale a la nueva IP. De no tener un dominio, tendrías que decirle a todas las personas que se conectan al servidor la nueva IP para que la cambien.

### Adquiriendo el dominio

Para comprar un dominio, primero debes buscar un proveedor, hay muchas elecciones. La nuestra fue [OnlyDomains](https://www.onlydomains.com/account/login) para `servermamadisimo.xyz`, aunque después nos pasamos a [Namecheap](https://www.namecheap.com/) para `wupp.dev`. También está el clásico [Cloudflare](https://www.cloudflare.com/). Después, tendrás que pensar en qué nombre quieres para tu dominio y comprobar que esté disponible.

Una cosa muy importante a la hora de registrar un dominio es tener la protección **Whois**, porque así evitará que cualquiera que busque quién ha registrado el dominio pueda saber tus datos personales como el número de teléfono y el correo electrónico. Puede llegarte mucho spam por no tener esta protección. Por suerte, suele costar poco o incluso estar incluido con el pago del dominio, como es nuestro caso.

### Utilizando otros nameservers

Cada dominio está asociado a unos nameservers, que serán los que digan a qué IP apunta el dominio y cada subdominio que haya.

Por defecto, los proveedores de dominios suelen usar sus propios nameservers, pero puedes configurar tu dominio para que use otros. Eso es básicamente como darle el control del dominio a otro proveedor en vez de aquel con quien compraste el dominio.

Al principio nosotros decidimos usar los nameservers de [FreeDNS](https://freedns.afraid.org/) porque nos resultaba más fácil actualizar la IP pública del servidor si cambiaba a través de un enlace. Esto OnlyDomains, por ejemplo, no lo permitía de una forma sencilla.

El problema que encontramos usando FreeDNS es que alcanzamos el límite de 26 subdominios y, usando los nameservers de Namecheap el límite era mucho mayor, así que tuvimos que dejar de usarlo. Por suerte, Namecheap también ofrece la posibilidad de actualizar la IP pública del servidor si cambia a través de un enlace.

::: warning ADVERTENCIA
Cambiar los nameservers de tu dominio puede tardar varias horas en hacerse efectivo en todo el mundo, hazlo solo si es necesario y tienes tiempo para esperar.
:::

Así se veían los nameservers de nuestro dominio cuando estaban cambiados a FreeDNS:
![nameservers](../images/nameservers.png)

::: info
Recientemente hemos decidido cambiar los nameservers a los de Cloudflare porque el uso de su API es más cómodo y nos permite hacer más cosas.
:::

## Actualizando la IP pública en el dominio automáticamente

Lo más común en una casa es que la IP pública que tengamos asignada no sea fija y vaya cambiando con el tiempo. Esto es un problema porque el dominio apunta a la IP, pero si esta cambia quedará inservible y si estamos fuera de casa no tendremos forma de conectarnos al servidor sin saber la nueva IP. Para solucionar eso aprovecharemos que Namecheap nos ofrece la posibilidad de actualizar la IP del dominio (o de sus subdominios) a través de un enlace.

Comenzamos creando el registro `A` o `A + Dynamic DNS Record` (funcionan igual) para el dominio y los subdominios.
![Registros A + Dynamic DNS Record de Namecheap](../images/namecheap-ddns.png)

::: info
Los registros A asocian un nombre de dominio con una dirección IPv4. En IPv6 se utilizan registros AAAA. Hay muchos más tipos de registros DNS, que puedes ver [aquí](https://www.cloudflare.com/learning/dns/dns-records/).
:::

A continuación se explica cómo configurar la actualización automática de la IP pública en Cloudflare, ya que cambiamos los nameservers a Cloudflare. Si quieres ver lo que hicimos con Namecheap, puedes ver [este relato](../relatos/dyndns-namecheap.md).

Tencremos que crear un token de API en Cloudflare con permisos para editar los DNS del dominio. Luego, creamos un archivo para guardarlo:

```sh
sudo install -d -m 700 /etc/ddns
```

Creamos el archivo `/etc/ddns/cloudflare.env` con el siguiente contenido:

```dotenv
CF_API_TOKEN=abcd1234
ZONE_NAME=wupp.dev
```

Y restringimos los permisos del archivo para que solo el usuario root pueda leerlo:

```sh
sudo chmod 600 /etc/ddns/cloudflare.env
```

Ahora creamos el script que se encargará de actualizar la IP pública en Cloudflare. Creamos el archivo `/usr/local/sbin/ddns-cloudflare-update.sh` con el siguiente contenido:

```sh
#!/usr/bin/env bash
set -euo pipefail

: "${CF_API_TOKEN:?Falta CF_API_TOKEN}"
: "${ZONE_NAME:?Falta ZONE_NAME}"

API="https://api.cloudflare.com/client/v4"
AUTH=(-H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json")

STATE_DIR="/var/lib/ddns-cloudflare"
OLD4_FILE="${STATE_DIR}/old_ipv4"
OLD6_FILE="${STATE_DIR}/old_ipv6"

mkdir -p "${STATE_DIR}"
chmod 700 "${STATE_DIR}"

# --- Detecta IP pública actual ---
NEW4="$(curl -4 -fsS https://api.ipify.org || true)"
NEW6="$(curl -6 -fsS https://api64.ipify.org || true)"

if [[ -z "${NEW4}" && -z "${NEW6}" ]]; then
  echo "No he podido detectar IPv4 ni IPv6 pública. Salgo."
  exit 1
fi

# --- Obtiene zone_id (por nombre) ---
ZONE_ID="$(
  curl -fsS "${AUTH[@]}" \
    "${API}/zones?name=${ZONE_NAME}&status=active" \
  | jq -r '.result[0].id // empty'
)"

if [[ -z "${ZONE_ID}" ]]; then
  echo "No encuentro la zona ${ZONE_NAME} en Cloudflare (zone_id vacío)."
  exit 1
fi

# Función: lista todos los DNS records (paginado) de un tipo
list_records_by_type() {
  local rtype="$1"
  local page=1
  while :; do
    local resp
    resp="$(curl -fsS "${AUTH[@]}" \
      "${API}/zones/${ZONE_ID}/dns_records?type=${rtype}&per_page=100&page=${page}")"

    echo "${resp}" | jq -c '.result[]'

    local total_pages
    total_pages="$(echo "${resp}" | jq -r '.result_info.total_pages // 1')"
    if (( page >= total_pages )); then
      break
    fi
    ((page++))
  done
}

# Función: actualiza un record preservando "proxied" y "ttl"
update_record() {
  local id="$1" type="$2" name="$3" content="$4" ttl="$5" proxied="$6"

  # ttl=1 significa "auto" (válido en Cloudflare). :contentReference[oaicite:3]{index=3}
  curl -fsS "${AUTH[@]}" -X PATCH \
    "${API}/zones/${ZONE_ID}/dns_records/${id}" \
    --data "$(jq -n \
      --arg type "$type" \
      --arg name "$name" \
      --arg content "$content" \
      --argjson ttl "$ttl" \
      --argjson proxied "$proxied" \
      '{type:$type,name:$name,content:$content,ttl:$ttl,proxied:$proxied}')" >/dev/null
}

# --- IPv4 (A) ---
if [[ -n "${NEW4}" ]]; then
  OLD4=""
  [[ -f "${OLD4_FILE}" ]] && OLD4="$(cat "${OLD4_FILE}" || true)"

  if [[ -n "${OLD4}" && "${OLD4}" != "${NEW4}" ]]; then
    echo "IPv4 cambia: ${OLD4} -> ${NEW4}. Actualizando A que apunten a la antigua..."

    mapfile -t A_RECS < <(
      list_records_by_type "A" \
      | jq -r --arg old "${OLD4}" 'select(.content == $old) | @base64'
    )

    for b64 in "${A_RECS[@]}"; do
      rec="$(echo "$b64" | base64 -d)"
      id="$(echo "${rec}" | jq -r '.id')"
      name="$(echo "${rec}" | jq -r '.name')"
      ttl="$(echo "${rec}" | jq -r '.ttl // 1')"
      proxied="$(echo "${rec}" | jq -r '.proxied // false')"

      update_record "${id}" "A" "${name}" "${NEW4}" "${ttl}" "${proxied}"
      echo "  OK A ${name} -> ${NEW4}"
    done
  else
    echo "IPv4: sin cambios (o no había estado previo)."
  fi

  # Guardamos estado
  echo -n "${NEW4}" > "${OLD4_FILE}"
  chmod 600 "${OLD4_FILE}"
fi

# --- IPv6 (AAAA) ---
if [[ -n "${NEW6}" ]]; then
  OLD6=""
  [[ -f "${OLD6_FILE}" ]] && OLD6="$(cat "${OLD6_FILE}" || true)"

  if [[ -n "${OLD6}" && "${OLD6}" != "${NEW6}" ]]; then
    echo "IPv6 cambia: ${OLD6} -> ${NEW6}. Actualizando AAAA que apunten a la antigua..."

    mapfile -t AAAA_RECS < <(
      list_records_by_type "AAAA" \
      | jq -r --arg old "${OLD6}" 'select(.content == $old) | @base64'
    )

    for b64 in "${AAAA_RECS[@]}"; do
      rec="$(echo "$b64" | base64 -d)"
      id="$(echo "${rec}" | jq -r '.id')"
      name="$(echo "${rec}" | jq -r '.name')"
      ttl="$(echo "${rec}" | jq -r '.ttl // 1')"
      proxied="$(echo "${rec}" | jq -r '.proxied // false')"

      update_record "${id}" "AAAA" "${name}" "${NEW6}" "${ttl}" "${proxied}"
      echo "  OK AAAA ${name} -> ${NEW6}"
    done
  else
    echo "IPv6: sin cambios (o no había estado previo)."
  fi

  # Guardamos estado
  echo -n "${NEW6}" > "${OLD6_FILE}"
  chmod 600 "${OLD6_FILE}"
fi

echo "DDNS Cloudflare: terminado."
```

Y ajustamos los permisos para que sea ejecutable:

```sh
sudo chmod 755 /usr/local/sbin/ddns-cloudflare-update.sh
```

Vamos a crear un servicio de `systemd` para que se encargue de actualizar la IP del dominio y todos sus subdominios. Creamos el archivo `/etc/systemd/system/ddns-update.service`:

```ini
[Unit]
Description=Update DDNS records for Cloudflare
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
EnvironmentFile=/etc/ddns/cloudflare.env
ExecStart=/usr/local/sbin/ddns-cloudflare-update.sh

[Install]
WantedBy=multi-user.target
```

Y creamos el archivo `/etc/systemd/system/ddns-update.timer` que ejecutará el servicio cada 15 minutos:

```ini
[Unit]
Description=Run DDNS update every 15 minutes with random delay
Requires=ddns-update.service

[Timer]
OnBootSec=2m
OnUnitInactiveSec=15m
RandomizedDelaySec=7m
Persistent=true

[Install]
WantedBy=timers.target
```

Y ejecutamos los siguientes comandos para ponerlo en funcionamiento y comprobar que todo va bien:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now ddns-update.service ddns-update.timer
sudo journalctl -u ddns-update.service
```

## Toqueteando en el router

Muy bien, ya tenemos el dominio apuntando a la IP pública de nuestro router y al servidor actualizándola si esta cambia. Pero queda todavía un problema externo al servidor que resolver.

Por defecto, el router no deja que alguien se conecte desde cualquier lugar mediante la IP pública a algún dispositivo de nuestra red porque es algo que solo debería ocurrir si estamos ofreciendo un servicio a través de Internet.

### Breve introducción sobre los puertos

Para que varios programas puedan conectarse a Internet y hacer cosas distintas simultáneamente se utilizan los puertos. Los puertos son puntos de transmisión y recepción de datos _(no son nada físico, solo un número que ayuda a gestionar mejor las conexiones)_, están numerados del 0 al 65535 y algunos de ellos están reservados o son los más habituales para un uso específico, por ejemplo:

- Los puertos 20 y 21 se utilizan para transferencia de archivos.
- El puerto 22 se utiliza para las conexiones de Secure Shell _(SSH)_ de las que hablaremos en la siguiente sección.
- El puerto 80 se utiliza para las conexiones de Hypertext Transfer Protocol _(HTTP)_, que es el protocolo por el que funcionan las páginas web.
- El puerto 123 se utiliza para el Network Time Protocol _(NTP)_ para que los relojes de los ordenadores estén sincronizados.
- El puerto 443 se utiliza para las conexiones HTTP Secure _(HTTPS)_, actuando como sustituto del puerto _HTTP_, ya que todas las conexiones deberían ir cifradas.
- El puerto 25565 es el más común para los servidores de Minecraft.

**Nota:** Puedes ver los puertos mejor explicados [aquí](https://www.adslzone.net/como-se-hace/Internet/abrir-puertos-router/).

Pues bien, por defecto estos puertos no están abiertos para que un dispositivo cualquiera de Internet pueda llegar y conectarse a nuestro ordenador a través de ellos. Esto está bien, porque, a no ser que tengas un servidor en tu casa, si alguien intenta conectarse a alguno de los puertos de tu ordenador no suele ser con buenas intenciones.

En nuestro caso, como tenemos un servidor, sí que necesitamos que los puertos estén abiertos, así que debemos configurar el router para que permita conexiones externas a los puertos que digamos.

::: info
Esto no quiere decir que de aquí en adelante cualquier persona se vaya a poder conectar a los puertos que quiera de cualquier dispositivo de tu red. El router permite abrir los puertos solo para una IP local _(que en este caso será nuestro servidor)_, siguiendo cerrados para los demás dispositivos. Además, los ordenadores y teléfonos suelen venir con un firewall instalado, que también bloquea por defecto las conexiones externas en cualquier puerto. De hecho, tendremos que vérnoslas también con el firewall del servidor aunque los puertos estén abiertos desde el router.
:::

### Abriendo puertos en el router

Lo primero es saber si tú desde tu casa puedes configurar tu router o debes contactar con el proveedor de Internet para que lo haga, aunque lo más común es que sí puedas configurarlo.

Para configurarlo tienes que conectarte a la IP de la puerta de enlace de tu dispositivo, que suele ser `192.168.1.1`. Puedes conectarte simplemente abriendo el navegador y poniendo la IP en la barra superior como si de una URL se tratara.

Una vez conectado, te pedirá un nombre de usuario y una contraseña, que deberían estar escritos en el router _(no estaría mal cambiar la contraseña después de abrir los puertos)_.

![Router LogIn](../images/router-login.png)

::: warning ADVERTENCIA
Hay proveedores de Internet como Digi, que te permiten configurar el router, pero los cambios que le hagas a los puertos no van a funcionar a no ser que contactes con ellos y les pidas que te permitan abrir puertos _(cosa por la que te cobrarán 1€ más al mes)_. Esto se debe a que, por defecto, utilizan CG-NAT, que puedes averiguar de qué va en [este enlace](https://www.adslzone.net/reportajes/operadores/que-es-cg-nat-operadores/), y debes pedir que te saquen de ella.
:::

Vamos a abrir únicamente los puertos necesarios, por ejemplo los de HTTP, HTTPS, Minecraft y SSH. Estos se abrirán solo para TCP, excepto HTTPS, que también se abrirá para UDP. Puedes consultar [aquí](https://nordvpn.com/es/blog/protocolo-tcp-udp/) las diferencias entre TCP y UDP. Para ello, configuramos el router de forma que los puertos se redirijan exclusivamente a la dirección IP local del servidor o, preferiblemente, a su dirección MAC, evitando que otros dispositivos de la red queden expuestos.

::: warning ADVERTENCIA
Aunque la mayoría de las comunicaciones en Internet funcionan bajo TCP, si queremos hacer uso de HTTP/3, debemos asegurarnos de que el puerto 443 está abierto para UDP también, ya que esta versión hace uso de [QUIC](https://cloudflare-quic.com/), un protocolo de red sobre UDP.
:::

El resultado sería algo como esto:

![Router Port Forwarding](../images/router-puertos.png)

::: warning ADVERTENCIA
Si, para abrir los puertos, eliges usar la IP local del servidor en vez de la dirección MAC, es importante que dejes fija esa IP local al servidor, ya sea desde la configuración del router o desde el propio servidor, porque si no, en algún momento cambiará y los puertos dejarán de estar abiertos para el servidor.
:::

## Cambiando los servidores DNS del servidor

Hasta ahora hemos hablado del DNS «hacia fuera» (nameservers del dominio). Pero el servidor también usa DNS para resolver nombres (por ejemplo, cuando hace `apt update` o se conecta a servicios externos). Para mejorar privacidad e integridad en la resolución, podemos configurar `systemd-resolved` para usar **DNS-over-TLS (DoT)** con Cloudflare u otro proveedor.

DoT cifra las consultas DNS usando TLS, evitando que terceros en la red local o el operador puedan leer fácilmente qué dominios está resolviendo el servidor.

Para hacer el cambio, creamos el archivo `/etc/systemd/resolved.conf.d/99-cloudflare.conf` con el siguiente contenido:

```sh
[Resolve]
DNS=1.1.1.1#one.one.one.one
DNSOverTLS=yes
```

El sufijo `#one.one.one.one` fuerza el nombre esperado en el handshake TLS, de forma que la validación del certificado tenga sentido y sea mucho más difícil «hacerse pasar» por Cloudflare.

Aplicamos los cambios con:

```sh
sudo systemctl restart systemd-resolved
```

Y comprobamos que todo funciona bien con:

```sh
resolvectl status
```

Debiendo ver:

```
Global
         Protocols: +LLMNR -mDNS +DNSOverTLS DNSSEC=no/unsupported
  resolv.conf mode: stub
Current DNS Server: 1.1.1.1#one.one.one.one
       DNS Servers: 1.1.1.1#one.one.one.one
```