---
order: 5
---

# Moviendo /var a otro disco

Optamos por mover toda la carpeta `/var` al disco duro grande por ser una carpeta donde se suelen almacenar logs y archivos más pesados. Para ello, montaremos directamente el disco grande en `/var`.

Primero detenemos los servicios que puedan estar usando `/var`:

```sh
sudo systemctl stop docker
sudo systemctl stop rsyslog
sudo systemctl stop systemd-journald
```

Luego copiando todo el contenido al disco duro:

```sh
sudo rsync -aAXH --numeric-ids --one-file-system /var/ /mnt/vault/
```

Después modificamos `/etc/fstab` para cambiar el punto de montaje del disco duro de `/mnt/vault` a `/var` (ajustando las opciones de montaje) y tenemos que recargamos la configuración de systemd con `sudo systemctl daemon-reload`.

Ahora podemos mover la actual carpeta a una copia y mantenerla durante un tiempo prudencial `sudo mv /var /var.old`, creamos la nueva carpeta `sudo mkdir /var` y remontamos el disco duro con `sudo umount /mnt/vault` y `sudo mount /dev/mapper/vault`.

Cuando comprobemos que todo funciona bien, podemos borrar la copia antigua con `sudo rm -rf /var.old`.

## Docker

Si tenemos Docker, lo mejor es que `/var/lib/docker` esté dentro del SSD, porque si no notaremos una gran lentitud al usar contenedores. Para ello, con docker parado (`sudo systemctl stop docker`), movemos la carpeta a una ubicación dentro del SSD, por ejemplo a `/docker`:

```sh
sudo mv /var/lib/docker /
```

Después, creamos de nuevo la carpeta `/var/lib/docker` y creamos un enlace simbólico apuntando a la nueva ubicación:

```sh
sudo mkdir -p /var/lib/docker
```

Y ahora podríamos elegir entre un enlace simbólico o un bind mount. Nosotros optamos por el bind mount porque nos parecía más limpio:

```sh
mount --bind /docker /var/lib/docker
```

Y para asegurar que se monta automáticamente al iniciar el sistema, añadimos esta línea a `/etc/fstab`:

```
/docker  /var/lib/docker  none  bind  0  0
```

Ahora ya podemos iniciar Docker de nuevo con `sudo systemctl start docker`.

## Posibles problemas

Si después de esto obtuviésemos un error al usar `apt` similar a:

```
/usr/bin/mandb: can't chmod /var/cache/man/CACHEDIR.TAG: Operation not permitted
/usr/bin/mandb: can't remove /var/cache/man/CACHEDIR.TAG: Permission denied
/usr/bin/mandb: fopen /var/cache/man/28371: Permission denied
```

Podemos solucionarlo con `chown -R man: /var/cache/man/` y `chmod -R 755 /var/cache/man/`.

También es posible que, después de eso, nos encontremos con que el servicio `lighdm` falla (posiblemente después de un reinicio). Lo podemos solucionar con `sudo chown -R lightdm:lightdm /var/lib/lightdm/` y `sudo chmod -R 755 /var/lib/lightdm/`.

Otra de las cosas que pueden ocurrir es que el servicio `binfmt-support` falle también después de un reinicio. Lo podemos solucionar con `mkdir /etc/systemd/system/binfmt-support.service.d` y creando el archivo `/etc/systemd/system/binfmt-support.service.d/override.conf` con:

```
[Unit]
RequiresMountsFor=/var
```

Que hará que el servicio se inicie una vez se haya montado la partición `/var`.