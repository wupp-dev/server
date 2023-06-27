import{_ as s,o as a,c as e,O as o}from"./chunks/framework.d334b221.js";const n="/server/assets/debian-inicio.e86551c4.png",l="/server/assets/debian-particiones.5298fdb5.png",m=JSON.parse('{"title":"Instalación del SO encriptado","description":"","frontmatter":{"title":"Instalación del SO encriptado","lang":"es-ES"},"headers":[],"relativePath":"equipo/sistema-encriptado.md","filePath":"equipo/sistema-encriptado.md","lastUpdated":1687869238000}'),p={name:"equipo/sistema-encriptado.md"},r=o('<h1 id="instalacion-del-so-encriptado" tabindex="-1">Instalación del SO encriptado <a class="header-anchor" href="#instalacion-del-so-encriptado" aria-label="Permalink to &quot;Instalación del SO encriptado&quot;">​</a></h1><p>Vamos a darle vida al cacharro ese que se hace llamar servidor. En esta sección instalaremos el sistema operativo con los discos encriptados y haremos un poco de configuración básica.</p><h2 id="escogiendo-y-descargando-el-sistema-operativo" tabindex="-1">Escogiendo y descargando el sistema operativo. <a class="header-anchor" href="#escogiendo-y-descargando-el-sistema-operativo" aria-label="Permalink to &quot;Escogiendo y descargando el sistema operativo.&quot;">​</a></h2><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Para esta parte necesitarás:</p><ul><li>Un ordenador con internet.</li><li>Un pendrive de unos <strong>4GB</strong> vacío o con archivos que no te importe perder.</li><li>Una pantalla y teclado extra para el servidor.</li></ul></div><p>Hay varias opciones para escoger como sistema operativo:</p><ul><li><a href="https://www.debian.org/" target="_blank" rel="noreferrer">Debian</a>.</li><li><a href="https://www.raspbian.org/" target="_blank" rel="noreferrer">Raspbian</a> <em>(para Raspberry)</em>.</li><li><a href="https://ubuntu.com/download/server" target="_blank" rel="noreferrer">Ubuntu Server</a>.</li><li><a href="https://getfedora.org/en/server/" target="_blank" rel="noreferrer">Fedora Server</a>.</li></ul><p>Esos son solo algunos ejemplos, pero hay muchas opciones. En nuestro caso, el servidor tuvo instalado al principio Ubuntu Server, pero Lucas se puso tonto, así que ha habido que cambiarlo a <strong>Debian</strong>, que según él es mejor <em>(<strong>Spoiler:</strong> No ha probado Ubuntu Server)</em>.</p><div class="danger custom-block"><p class="custom-block-title">PELIGRO</p><p>Toda persona que use Windows Server será perseguida y juzgada por sus crímenes contra la humanidad.</p></div><h3 id="descarga-y-preparacion-del-instalador-de-debian-11" tabindex="-1">Descarga y preparación del instalador de Debian 11 <a class="header-anchor" href="#descarga-y-preparacion-del-instalador-de-debian-11" aria-label="Permalink to &quot;Descarga y preparación del instalador de Debian 11&quot;">​</a></h3><p>Actualmente la versión de Debian del servidor es la 11, también llamada Bullseye. La forma más sencilla de instalarlo es descargar la ISO del principio de su <a href="https://www.debian.org/download" target="_blank" rel="noreferrer">página de descarga</a>, ya que es un instalador muy ligero.</p><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>Esa ISO de Debian necesita que el servidor se pueda conectar a internet en el momento de la instalación, así que ten preparado el cable para conectarlo.</p></div><p>Una vez descargada la ISO, tenemos que grabarla en el pendrive cosa que se puede hacer con <a href="https://www.balena.io/etcher/" target="_blank" rel="noreferrer">Balena Etcher</a>.</p><p>Ese pendrive lo cogemos y lo enchufamos al servidor.</p><h2 id="configuracion-de-la-bios-del-servidor" tabindex="-1">Configuración de la BIOS del servidor <a class="header-anchor" href="#configuracion-de-la-bios-del-servidor" aria-label="Permalink to &quot;Configuración de la BIOS del servidor&quot;">​</a></h2><p>Antes de instalar el sistema operativo, tenemos que hacer unos retoques en la BIOS, así que enciende el servidor y accede a la BIOS <em>(si no sabes cómo, búscalo, porque cambia mucho de un ordenador a otro)</em>.</p><p>Aquí hay <strong>dos cambios muy importantes</strong> que hacer:</p><ul><li><strong>Desactivar</strong>, si estuviera activado, el <strong>Secure Boot</strong>, ya que es algo de Windows y puede dar problemas para encender los ordenadores con Linux.</li><li>Establecer una <strong>contraseña de administrador</strong> de la BIOS.</li></ul><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Puede que te encuentres con dos posibles contraseñas, la de <strong>usuario</strong> y la de <strong>administrador</strong>. La de usuario, si la creas, probablemente te la pida cada vez que el ordenador se encienda, cosa que no te conviene. La de administrador es la que nos interesa, que es la que se pide cuando se intenta acceder a la BIOS.</p></div><p>Ahora hay que ir al apartado de <strong>Boot</strong> y cambiar el orden de inicio de los dispositivos para poner como primera opción el USB donde tenemos el instalador del sistema operativo.</p><p>Salimos guardando los cambios y el ordenador debería reiniciarse y mostrar el instalador del sistema.</p><h2 id="instalacion-de-debian-11" tabindex="-1">Instalación de Debian 11 <a class="header-anchor" href="#instalacion-de-debian-11" aria-label="Permalink to &quot;Instalación de Debian 11&quot;">​</a></h2><p>Así se verá nuestro instalador:</p><p><img src="'+n+'" alt="Instalador"></p><p>La instalación gráfica y la otra son prácticamente iguales, la diferencia es que en la gráfica puedes usar el ratón.</p><p>Primero tocará elegir el idioma y la distribución del teclado <em>(nosotros hemos elegido Español para mayor comodidad)</em>. Después se intentará conectar a internet y tocará poner unos cuantos datos:</p><ol><li>El nombre de la máquina, como puede ser <code>server</code></li><li>El nombre del dominio, que para nuestro servidor es <code>wupp.dev</code> <em>(si no tienes el dominio o no sabes qué es, puedes hacerte spolier mirando la sección de <a href="./router-dominio.html#dominio-¿que-es-y-para-que-sirve">Router y dominio</a>)</em>.</li><li>La contraseña para el usuario <code>root</code>. Esta contraseña tiene que ser <strong>potente</strong>, como de 20 caracteres, porque es la que permite hacer cualquier cambio en el sistema operativo.</li></ol><div class="tip custom-block"><p class="custom-block-title">TRUQUITO</p><p>Puedes generar, guardar y gestionar contraseñas cómodamente con <a href="https://bitwarden.com/" target="_blank" rel="noreferrer">Bitwarden</a>.</p></div><ol start="4"><li>El nombre del usuario administrativo, por ejemplo, <code>admin</code> <em>(tanto para el nombre completo como para el nombre de usuario)</em>.</li></ol><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>El usuario escogido en la guía es <code>admin</code>. Este nombre es de ejemplo y Debian no te dejará usarlo. Intenta escoger otro distinto que no sea tan fácil de averiguar.</p></div><ol start="5"><li>La contraseña para el usuario <code>admin</code>. Una contraseña que sea buena, aunque no es necesario que sea tan extensa como la de <code>root</code>.</li><li>Configuración del reloj, de chill.</li></ol><p>Después de esto toca encriptar el disco de instalación.</p><h3 id="encriptacion-del-disco" tabindex="-1">Encriptación del disco <a class="header-anchor" href="#encriptacion-del-disco" aria-label="Permalink to &quot;Encriptación del disco&quot;">​</a></h3><p>Para no complicarnos la vida, aquí dejaremos que Debian haga la magia de gestionar las particiones porque si no nos tocaría sufrir mucho.</p><p>En el instalador, elegiremos el método de particionado <strong>Guiado - utilizar todo el disco y configurar LVM cifrado</strong>. Elegimos el disco donde queremos instalar el sistema operativo, que en nuestro caso es el SSD de 480GB y utilizamos como esquema de particionado <strong>Todos los ficheros en una partición (recomendado para novatos)</strong>.</p><p>Ahora, si aprecias tu tiempo y no tenías archivos altamente sensibles en el disco donde vas a instalar Debian, puedes elegir no borrar el disco, ya que tardaría un buen rato.</p><p>Tras eso, nos pedirá una <strong>contraseña de cifrado</strong> y esta sí que tiene que ser una tremenda contraseña. Igual o mejor que la del usuario <code>root</code>.</p><p>Ahora toca lo interesante. Le decimos que use todo el disco para el particionado y nos aparecerá una lista con las particiones que se van a crear.</p><p><img src="'+l+`" alt="Particiones"></p><p>Las particiones más importantes son:</p><ul><li>Una partición donde irá <strong>el sistema operativo y todos los datos</strong>. Por defecto aparecerá con el sistema de archivos <code>ext4</code>, uno de los más comunes en Linux.</li><li>Una partición de <strong>intercambio <em>(SWAP)</em></strong>, que se utiliza como una ampliación de la RAM.</li><li>Una partición <code>boot</code> que contiene los archivos necesarios para que el ordenador se encienda.</li></ul><p>Se puede dejar tal y como está, pero nosotros hemos optado por usar <code>btrfs</code> en vez de <code>ext4</code> como sistema de archivos de la partición principal. Esto es por las grandes facilidades que da <code>btrfs</code> para hacer copias de seguridad del sistema al completo sin que ocupen casi espacio.</p><p>Por suerte, cambiar el sistema de archivos es relativamente fácil, solo hay que ir a la línea donde aparece la palabra <code>ext4</code>, pulsar &lt;Intro&gt; y en <strong>Utilizar como</strong> elegir el sistema <code>btrfs</code>. Salimos y ahora debería aparecer <code>btrfs</code> en vez de <code>ext4</code> como sistema de archivos. Finalizamos el particionado confirmando que se hagan los cambios elegidos y empezará la instalación del sistema operativo.</p><h3 id="terminando-la-instalacion" tabindex="-1">Terminando la instalación <a class="header-anchor" href="#terminando-la-instalacion" aria-label="Permalink to &quot;Terminando la instalación&quot;">​</a></h3><p>Una vez acabe la instalación, nos tocará configurar el gestor de paquetes, elegir una ubicación y un proxy si hace falta, pero se puede dejar todo por defecto y el proxy en blanco.</p><p>Ahora nos dejará elegir unos cuantos paquetes extra que instalar, estos son los cambios que hay que hacer:</p><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>Si no quieres que se te quede la cara de tonto que se me quedó a mí ya en dos ocasiones, recuerda que para desmarcar opciones hay que usar &lt;Espacio&gt; y no &lt;Intro&gt;, que como le des sin querer te toca repetir todo el proceso de instalación.</p></div><ul><li>Quitar el entorno de escritorio. El servidor no lo necesitará allá donde vas a dejarlo.</li><li>Añadir el servidor SSH, que nos permitirá conectarnos al servidor remotamente desde otro dispositivo para hacer cualquier gestión.</li></ul><h2 id="configuracion-basica-y-pequenas-mejoras" tabindex="-1">Configuración básica y pequeñas mejoras <a class="header-anchor" href="#configuracion-basica-y-pequenas-mejoras" aria-label="Permalink to &quot;Configuración básica y pequeñas mejoras&quot;">​</a></h2><p>Encendemos el servidor, iniciamos sesión con el nombre de usuario que creamos, con su contraseña y ya estaría.</p><p>Lo primero que vamos a hacer, por comodidad, es instalar el paquete <code>sudo</code>, que nos permite hacer casi todo lo que hace el usuario <code>root</code> sin necesidad de cambiarnos a ese usuario, para ello escribimos los siguientes comandos:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">su</span></span>
<span class="line"><span style="color:#FFCB6B;">Contraseña:</span></span>
<span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo</span></span></code></pre></div><p>Ahora queda añadir al usuario que creamos durante la instalación como <em>sudoer</em>, para ello editamos el archivo <code>/etc/sudoers</code> y ponemos lo siguiente:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># This file MUST be edited with the &#39;visudo&#39; command as root.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Please consider adding local content in /etc/sudoers.d/ instead of</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># directly modifying this file.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># See the man page for details on how to write a sudoers file.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#FFCB6B;">Defaults</span><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">env_reset</span></span>
<span class="line"><span style="color:#FFCB6B;">Defaults</span><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">mail_badpass</span></span>
<span class="line"><span style="color:#FFCB6B;">Defaults</span><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">secure_path=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Host alias specification</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># User alias specification</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Cmnd alias specification</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># User privilege specification</span></span>
<span class="line"><span style="color:#FFCB6B;">root</span><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">ALL=</span><span style="color:#A6ACCD;">(</span><span style="color:#C3E88D;">ALL:ALL</span><span style="color:#A6ACCD;">) ALL</span></span>
<span class="line"><span style="color:#FFCB6B;">admin</span><span style="color:#A6ACCD;">  </span><span style="color:#C3E88D;">ALL=</span><span style="color:#A6ACCD;">(</span><span style="color:#C3E88D;">ALL:ALL</span><span style="color:#A6ACCD;">) ALL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Allow members of group sudo to execute any command</span></span>
<span class="line"><span style="color:#FFCB6B;">%sudo</span><span style="color:#A6ACCD;">   </span><span style="color:#C3E88D;">ALL=</span><span style="color:#A6ACCD;">(</span><span style="color:#C3E88D;">ALL:ALL</span><span style="color:#A6ACCD;">) ALL</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># See sudoers(5) for more information on &quot;@include&quot; directives:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">@includedir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/sudoers.d</span></span></code></pre></div><p>Donde <code>admin</code> será el usuario que creamos. Guardamos el archivo y ya podemos escribir <code>exit</code> para salirnos del usuario <code>root</code>. A partir de ahora lo normal será usar <code>sudo</code> para instalar cosas o editar archivos.</p><h3 id="optimizando-el-disco-ssd" tabindex="-1">Optimizando el disco SSD <a class="header-anchor" href="#optimizando-el-disco-ssd" aria-label="Permalink to &quot;Optimizando el disco SSD&quot;">​</a></h3><p><strong>Si tenemos el sistema operativo en un disco SSD</strong>, como es el caso, hay unos cambios que podemos hacer para mejorar el rendimiento y la durabilidad del disco, tenemos que editar <code>/etc/fstab</code>, concretamente la primera línea sin comentar, que debería ser la correspondiente al sistema de archivos <code>root</code>, añadiendo unas opciones extra para cuando se monte la partición:</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;"># /etc/fstab: static file system information.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Use &#39;blkid&#39; to print the universally unique identifier for a</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># device; this may be used with UUID= as a more robust way to name devices</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># that works even if disks are added and removed. See fstab(5).</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># systemd generates mount units based on this file, see systemd.mount(5).</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># Please run &#39;systemctl daemon-reload&#39; after making changes here.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># &lt;file system&gt;             &lt;mount point&gt;   &lt;type&gt;  &lt;options&gt;                                                                              &lt;dump&gt;  &lt;pass&gt;</span></span>
<span class="line"><span style="color:#FFCB6B;">/dev/mapper/server--vg-root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/</span><span style="color:#A6ACCD;">               </span><span style="color:#C3E88D;">btrfs</span><span style="color:#A6ACCD;">   </span><span style="color:#C3E88D;">defaults,subvol=@rootfs,ssd,noatime,space_cache,commit=</span><span style="color:#F78C6C;">120</span><span style="color:#C3E88D;">,compress=zstd,discard=async</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">       </span><span style="color:#F78C6C;">0</span></span></code></pre></div><p>El resto de líneas que haya debajo las dejamos intactas.</p><h3 id="montando-el-disco-tocho-al-inicio" tabindex="-1">Montando el disco tocho al inicio <a class="header-anchor" href="#montando-el-disco-tocho-al-inicio" aria-label="Permalink to &quot;Montando el disco tocho al inicio&quot;">​</a></h3><p>Como tenemos un disco duro de 4TB que vamos a usar para almacenar archivos, necesitamos que se desencripte también y se monte al encenderse el servidor, así que vamos a ello.</p><p>Lo primero es que se desencripte, para ello tendremos que añadir el disco a <code>/etc/crypttab</code>, pero como ese queremos que se desencripte solo sin tener que ponerle nosotros la contraseña, tendremos que crear un archivo que servirá como contraseña para desencriptar el disco. Localizamos el disco, que en este caso es <code>sdb1</code>:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">lsblk</span></span>
<span class="line"><span style="color:#FFCB6B;">NAME</span><span style="color:#A6ACCD;">                    </span><span style="color:#C3E88D;">MAJ:MIN</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">RM</span><span style="color:#A6ACCD;">   </span><span style="color:#C3E88D;">SIZE</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">RO</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">TYPE</span><span style="color:#A6ACCD;">  </span><span style="color:#C3E88D;">MOUNTPOINT</span></span>
<span class="line"><span style="color:#FFCB6B;">sda</span><span style="color:#A6ACCD;">                       </span><span style="color:#F78C6C;">8</span><span style="color:#C3E88D;">:0</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">447</span><span style="color:#C3E88D;">,1G</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">disk</span><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#FFCB6B;">├─sda1</span><span style="color:#A6ACCD;">                    </span><span style="color:#F78C6C;">8</span><span style="color:#C3E88D;">:1</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">512</span><span style="color:#C3E88D;">M</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">part</span><span style="color:#A6ACCD;">  </span><span style="color:#C3E88D;">/boot/efi</span></span>
<span class="line"><span style="color:#FFCB6B;">├─sda2</span><span style="color:#A6ACCD;">                    </span><span style="color:#F78C6C;">8</span><span style="color:#C3E88D;">:2</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">488</span><span style="color:#C3E88D;">M</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">part</span><span style="color:#A6ACCD;">  </span><span style="color:#C3E88D;">/boot</span></span>
<span class="line"><span style="color:#FFCB6B;">└─sda3</span><span style="color:#A6ACCD;">                    </span><span style="color:#F78C6C;">8</span><span style="color:#C3E88D;">:3</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">446</span><span style="color:#C3E88D;">,2G</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">part</span><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">└─sda3_crypt</span><span style="color:#A6ACCD;">          </span><span style="color:#F78C6C;">254</span><span style="color:#C3E88D;">:0</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">446</span><span style="color:#C3E88D;">,1G</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">crypt</span><span style="color:#A6ACCD;"> </span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#FFCB6B;">├─server--vg-root</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">254</span><span style="color:#C3E88D;">:1</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">445</span><span style="color:#C3E88D;">,1G</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">lvm</span><span style="color:#A6ACCD;">   </span><span style="color:#C3E88D;">/var/lib/docker/btrfs</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#FFCB6B;">└─server--vg-swap_1</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">254</span><span style="color:#C3E88D;">:2</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">976</span><span style="color:#C3E88D;">M</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">lvm</span><span style="color:#A6ACCD;">   [SWAP]</span></span>
<span class="line"><span style="color:#FFCB6B;">sdb</span><span style="color:#A6ACCD;">                       </span><span style="color:#F78C6C;">8</span><span style="color:#C3E88D;">:16</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">3</span><span style="color:#C3E88D;">,6T</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">disk</span><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#FFCB6B;">└─sdb1</span><span style="color:#A6ACCD;">                    </span><span style="color:#F78C6C;">8</span><span style="color:#C3E88D;">:17</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;">   </span><span style="color:#F78C6C;">3</span><span style="color:#C3E88D;">,6T</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">part</span><span style="color:#A6ACCD;">  </span></span>
<span class="line"><span style="color:#FFCB6B;">sr0</span><span style="color:#A6ACCD;">                      </span><span style="color:#F78C6C;">11</span><span style="color:#C3E88D;">:0</span><span style="color:#A6ACCD;">    </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">1024</span><span style="color:#C3E88D;">M</span><span style="color:#A6ACCD;">  </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">rom</span></span></code></pre></div><p>Ahora hay que buscar su UUID:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ls</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-l</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/dev/disk/by-uuid</span></span>
<span class="line"><span style="color:#FFCB6B;">total</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#FFCB6B;">lrwxrwxrwx</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ago</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#C3E88D;">:47</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0053</span><span style="color:#C3E88D;">a965-9146-4e52-b842-0ba1a756c4c5</span><span style="color:#A6ACCD;"> -</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">../../sda3</span></span>
<span class="line"><span style="color:#FFCB6B;">lrwxrwxrwx</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ago</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#C3E88D;">:47</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#C3E88D;">e28c433-5bf5-41e5-9708-5730bb18d0ef</span><span style="color:#A6ACCD;"> -</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">../../dm-2</span></span>
<span class="line"><span style="color:#FFCB6B;">lrwxrwxrwx</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ago</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#C3E88D;">:47</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">60</span><span style="color:#C3E88D;">e8d58f-cb05-47f1-85bc-38e5b0a05505</span><span style="color:#A6ACCD;"> -</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">../../sdb1</span></span>
<span class="line"><span style="color:#FFCB6B;">lrwxrwxrwx</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ago</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#C3E88D;">:47</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">a3313b2a-fe80-4f3c-a384-bbce92fd4301</span><span style="color:#A6ACCD;"> -</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">../../dm-1</span></span>
<span class="line"><span style="color:#FFCB6B;">lrwxrwxrwx</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ago</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#C3E88D;">:47</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">E283-990E</span><span style="color:#A6ACCD;"> -</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">../../sda1</span></span>
<span class="line"><span style="color:#FFCB6B;">lrwxrwxrwx</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">root</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ago</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">10</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">17</span><span style="color:#C3E88D;">:47</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">eb777051-9d3a-4bf9-a186-fdfcc9d5c9c0</span><span style="color:#A6ACCD;"> -</span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">../../sda2</span></span></code></pre></div><p>Que en este caso es <code>60e8d58f-cb05-47f1-85bc-38e5b0a05505</code>, lo guardamos y vamos a crear el archivo que servirá de clave:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">if=/dev/urandom</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">of=/root/hdd_key</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">bs=</span><span style="color:#F78C6C;">1024</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">count=</span><span style="color:#F78C6C;">4</span></span>
<span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">chmod</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0400</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/root/hdd_key</span></span>
<span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">cryptsetup</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">luksAddKey</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/dev/sdb1</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/root/hdd_key</span></span></code></pre></div><p>Lo que acabamos de hacer es crear un archivo con caracteres aleatorios <em>(como una contraseña básicamente pero mucho más larga)</em> y añadirlo como clave para desencriptar el disco duro, ya que LUKS nos permite tener varias claves. Ahora sí, hay que editar <code>/etc/fstab</code> añadiendo esta línea al final:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">vault</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">UUID=</span><span style="color:#F78C6C;">60</span><span style="color:#C3E88D;">e8d58f-cb05-47f1-85bc-38e5b0a05505</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/root/hdd_key</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">luks</span></span></code></pre></div><p>Donde lo primero es el nombre que tendrá el volumen, lo segundo su UUID <em>(no olvidar comprobar que sea el correcto)</em>, lo tercero el archivo donde está la clave y lo cuarto especifica que utiliza LUKS.</p><p>Muy bien, con esto el disco se desencriptará al encenderse el servidor, solo nos queda añadirlo a <code>/etc/fstab</code> para que también se monte. Añadimos esta línea al final del archivo:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">/dev/mapper/vault</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/mnt/vault</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">btrfs</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">defaults,nofail</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span></span></code></pre></div><p>Que hará que el disco se monte en <code>/mnt/vault</code> cuando se encienda el servidor. La opción <code>nofail</code> hace que, aunque no se pueda montar el disco, el ordenador se siga encendiendo en vez de fallar.</p>`,72),t=[r];function c(i,d,C,y,u,A){return a(),e("div",null,t)}const b=s(p,[["render",c]]);export{m as __pageData,b as default};
