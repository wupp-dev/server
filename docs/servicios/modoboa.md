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