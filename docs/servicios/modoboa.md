---
title: Modoboa - Servidor de correo
lang: es-ES
---

# Modoboa - Servidor de correo

Un día, nos despertamos con ganas de tener un servidor de correo porque, ¿por qué no? Habiendo hecho una búsqueda rápida de qué opciones teníamos, decidimos usar [Modoboa](https://github.com/modoboa/modoboa). 

Lo bueno es que tiene un instalador, así que como somos personas perezosas, nos decidimos a probarlo. En [su documentación](https://modoboa.readthedocs.io/en/latest/installation.html) viene explicado cómo usar el instalador, estos son los pasos más importantes:
- Primero salta un aviso recordando que tenemos que tener configurado el subdominio para el correo, así que hay que añadir dos registros, uno `A` y otro `MX`:

```
Warning:
Before you start the installation, please make sure the following DNS records exist for domain 'wupp.dev':
  mail IN A   <IP ADDRESS OF YOUR SERVER>
       IN MX  mail.wupp.dev
```
- Después hay que esperar un largo rato... *Sigo esperando*

Vale nada, resulta que no había que esperar tanto, se había quedado pillado SSH. El caso es que, como tenemos Nginx instalado, da error, así que vamos con la configuración manual, siguiendo los pasos de [esta página](https://modoboa.readthedocs.io/en/latest/manual_installation/modoboa.html).

Si nos salta este error:
```
(env)$ pip install mysqlclient
    ERROR: Command errored out with exit status 1:
     command: /srv/modoboa/env/bin/python -c 'import sys, setuptools, tokenize; sys.argv[0] = '"'"'/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup.py'"'"'; __file__='"'"'/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup.py'"'"';f=getattr(tokenize, '"'"'open'"'"', open)(__file__);code=f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' egg_info --egg-base /tmp/pip-pip-egg-info-wlcnv6o5
         cwd: /tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/
    Complete output (10 lines):
    /bin/sh: 1: mysql_config: not found
    Traceback (most recent call last):
      File "<string>", line 1, in <module>
      File "/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup.py", line 17, in <module>
        metadata, options = get_config()
      File "/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup_posix.py", line 47, in get_config
        libs = mysql_config("libs_r")
      File "/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup_posix.py", line 29, in mysql_config
        raise EnvironmentError("%s not found" % (mysql_config.path,))
    OSError: mysql_config not found
    ----------------------------------------
WARNING: Discarding https://files.pythonhosted.org/packages/6a/91/bdfe808fb5dc99a5f65833b370818161b77ef6d1e19b488e4c146ab615aa/mysqlclient-1.3.0.tar.gz#sha256=06eb5664e3738b283ea2262ee60ed83192e898f019cc7ff251f4d05a564ab3b7 (from https://pypi.org/simple/mysqlclient/). Command errored out with exit status 1: python setup.py egg_info Check the logs for full command output.
ERROR: Could not find a version that satisfies the requirement mysqlclient
ERROR: No matching distribution found for mysqlclient
```

Podemos solucionando saliendo del usuario `modoboa` y ejecutando `sudo apt-get install libmariadbclient-dev`.