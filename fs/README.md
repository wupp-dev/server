# Archivos del sistema

En esta carpeta se encuentran los **archivos de configuración** que se han modificado en los servidores, tanto para el sistema operativo como para cualesquiera de sus servicios.

Los archivos están organizados en las siguientes carpetas:

- **`shared/`**: Archivos que son idénticos en ambos servidores (principal y minecraft)
- **`principal/`**: Archivos específicos del servidor principal
- **`minecraft/`**: Archivos específicos del servidor de Minecraft

## Estructura

Dentro de cada carpeta se sigue la estructura de un **sistema de ficheros Linux** desde la raíz `/`. Por ejemplo:
- `etc/` contiene archivos de configuración del sistema
- `home/` contiene archivos de directorios de usuario
- `var/` contiene archivos variables del sistema
- `usr/` contiene archivos de usuario y aplicaciones

Esto facilita identificar la ubicación exacta de cada archivo en el servidor real.

> [!IMPORTANT]
> Estos archivos pueden no estar completos o diferir de cómo realmente son en los servidores. Siempre revisa y edita los archivos según tus necesidades específicas antes de usarlos en un entorno de producción.
