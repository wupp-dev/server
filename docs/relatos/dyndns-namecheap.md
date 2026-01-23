---
order: 6
title: DynDNS con Namecheap
---

# Actualizar la IP del servidor en Namecheap

*Esta es la configuración que usamos cuando teníamos el dominio gestionado con Namechap, antes de moverlo a Cloudflare.*

Comenzamos creando el registro `A` o `A + Dynamic DNS Record` (funcionan igual) para el dominio y los subdominios.
![Registros A + Dynamic DNS Record de Namecheap](../images/namecheap-ddns.png)

::: info
Los registros A asocian un nombre de dominio con una dirección IPv4. En IPv6 se utilizan registros AAAA. Hay muchos más tipos de registros DNS, que puedes ver [aquí](https://www.cloudflare.com/learning/dns/dns-records/).
:::

Por desgracia, el programa que tiene disponible Namecheap es solo para Windows, pero igualmente existe la posibilidad de utilizar un enlace para actualizar la IP. Aun así, no utilizaremos directamente el enlace, ya que podemos aprovecharnos de la existencia de [este](https://github.com/nickjer/namecheap-ddns) repositorio.

Siguiendo su documentación vamos a instalarlo usando `cargo`, así que también tendremos que [instalar Rust](https://www.rust-lang.org/tools/install).

Una vez instalado Rust, ejecutamos `cargo install namecheap-ddns` y tendremos el ejecutable en `/home/admin/.cargo/bin/namecheap-ddns`.

Siguiendo nuevamente la documentación, vamos a crear un servicio de `systemd` para que se encargue de actualizar la IP del dominio y todos sus subdominios. Creamos el archivo `/etc/systemd/system/ddns-update.service`:

```ini
[Unit]
Description=Update DDNS records for Namecheap
After=nss-user-lookup.target
Wants=nss-user-lookup.target

[Service]
Type=simple
Environment=NAMECHEAP_DDNS_TOKEN=passwd
Environment=NAMECHEAP_DDNS_DOMAIN=wupp.dev
Environment=NAMECHEAP_DDNS_SUBDOMAIN=@,mc,www
ExecStart=/home/admin/.cargo/bin/namecheap-ddns
User=admin

[Install]
WantedBy=default.target
```

::: warning ADVERTENCIA
Si no escribimos el `@` al principio de `Environment=NAMECHEAP_DDNS_SUBDOMAIN`, no se nos actualizará el dominio base `wupp.dev`.
:::

Ejecutamos `sudo chmod 600 /etc/systemd/system/ddns-update.service` (esto evita que otros usuarios del sistema puedan leer el token) y creamos el archivo `/etc/systemd/system/ddns-update.timer`:

```ini
[Unit]
Description=Run DDNS update every 15 minutes
Requires=ddns-update.service

[Timer]
Unit=ddns-update.service
OnUnitInactiveSec=15m
AccuracySec=1s

[Install]
WantedBy=timers.target
```

Y ejecutamos los siguientes comandos para ponerlo en funcionamiento y comprobar que todo va bien:

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now ddns-update.service ddns-update.timer
sudo journalctl -u ddns-update.service
```