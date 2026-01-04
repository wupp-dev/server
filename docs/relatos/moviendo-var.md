---
order: 5
---

# Moviendo /var a otro disco

Optamos por mover toda la carpeta `/var` al disco duro grande por ser una carpeta donde se suelen almacenar logs y archivos más pesados. Para ello, montaremos directamente el disco grande en `/var`.

Empezamos copiando todo el contenido al disco duro con `sudo cp -rf /var/* /mnt/vault/`. Después modificamos `/etc/fstab` para cambiar el punto de montaje del disco duro de `/mnt/vault` a `/var` y tenemos que reiniciar _daemon_ de _systemclt_ con `sudo systemctl daemon-reload`. Ahora podemos mover la actual carpeta a una copia y mantenerla durante un tiempo prudencial `sudo mv /var /var.old`, creamos la nueva carpeta `sudo mkdir /var` y remontamos el disco duro con `sudo umount /mnt/vault` y `sudo mount /dev/mapper/vault`.

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