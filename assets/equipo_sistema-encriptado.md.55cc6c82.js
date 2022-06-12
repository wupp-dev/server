import{_ as e,c as a,o,a as r}from"./app.a690a6e8.js";var s="/server/assets/debian-inicio.e86551c4.png",i="/server/assets/debian-particiones.5298fdb5.png";const v='{"title":"Instalaci\xF3n del SO encriptado","description":"","frontmatter":{"title":"Instalaci\xF3n del SO encriptado","lang":"es-ES"},"headers":[{"level":2,"title":"Escogiendo y descargando el sistema operativo.","slug":"escogiendo-y-descargando-el-sistema-operativo"},{"level":3,"title":"Descarga y preparaci\xF3n del instalador de Debian 11","slug":"descarga-y-preparacion-del-instalador-de-debian-11"},{"level":2,"title":"Configuraci\xF3n de la BIOS del servidor","slug":"configuracion-de-la-bios-del-servidor"},{"level":2,"title":"Instalaci\xF3n de Debian 11","slug":"instalacion-de-debian-11"},{"level":3,"title":"Encriptaci\xF3n en los discos","slug":"encriptacion-en-los-discos"},{"level":3,"title":"Terminando la instalaci\xF3n","slug":"terminando-la-instalacion"},{"level":2,"title":"Configuraci\xF3n b\xE1sica y peque\xF1as mejoras","slug":"configuracion-basica-y-pequenas-mejoras"}],"relativePath":"equipo/sistema-encriptado.md","lastUpdated":1655058876000}',n={name:"equipo/sistema-encriptado.md"},t=r('<h1 id="instalacion-del-so-encriptado" tabindex="-1">Instalaci\xF3n del SO encriptado <a class="header-anchor" href="#instalacion-del-so-encriptado" aria-hidden="true">#</a></h1><p>Vamos a darle vida al cacharro ese que se hace llamar servidor. En esta secci\xF3n instalaremos el sistema operativo con los discos encriptados y haremos un poco de configuraci\xF3n b\xE1sica.</p><h2 id="escogiendo-y-descargando-el-sistema-operativo" tabindex="-1">Escogiendo y descargando el sistema operativo. <a class="header-anchor" href="#escogiendo-y-descargando-el-sistema-operativo" aria-hidden="true">#</a></h2><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Para esta parte necesitar\xE1s:</p><ul><li>Un ordenador con internet.</li><li>Un pendrive de unos <strong>4GB</strong> vac\xEDo o con archivos que no te importe perder.</li><li>Una pantalla y teclado extra para el servidor.</li></ul></div><p>Hay varias opciones para escoger como sistema operativo:</p><ul><li><a href="https://www.debian.org/" target="_blank" rel="noopener noreferrer">Debian</a>.</li><li><a href="https://www.raspbian.org/" target="_blank" rel="noopener noreferrer">Raspbian</a> <em>(para Raspberry)</em>.</li><li><a href="https://ubuntu.com/download/server" target="_blank" rel="noopener noreferrer">Ubuntu Server</a>.</li><li><a href="https://getfedora.org/en/server/" target="_blank" rel="noopener noreferrer">Fedora Server</a>.</li></ul><p>Esos solo algunos ejemplos, pero hay muchas opciones. En nuestro caso, el servidor tuvo instalado al principio Ubuntu Server, pero Lucas se puso tonto, as\xED que ha habido que cambiarlo a <strong>Debian</strong>, que seg\xFAn \xE9l es mejor <em>(<strong>Spoiler:</strong> No ha probado Ubuntu Server)</em>.</p><div class="danger custom-block"><p class="custom-block-title">PELIGRO</p><p>Toda persona que use Windows Server ser\xE1 perseguida y juzgada por sus cr\xEDmenes contra la humanidad.</p></div><h3 id="descarga-y-preparacion-del-instalador-de-debian-11" tabindex="-1">Descarga y preparaci\xF3n del instalador de Debian 11 <a class="header-anchor" href="#descarga-y-preparacion-del-instalador-de-debian-11" aria-hidden="true">#</a></h3><p>Actualmente la versi\xF3n de Debian del servidor es la 11, tambi\xE9n llamada Bullseye. La forma m\xE1s sencilla de instalarlo es descargar la ISO del principio de su <a href="https://www.debian.org/download" target="_blank" rel="noopener noreferrer">p\xE1gina de descarga</a>, ya que es un instalador muy ligero.</p><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>Esa ISO de Debian necesita que el servidor se pueda conectar a internet en el momento de la instalaci\xF3n, as\xED que ten preparado el cable para conectarlo.</p></div><p>Una vez descargada la ISO, tenemos que grabarla en el pendrive:</p><ul><li>Si est\xE1s en <strong>Windows</strong>, puedes hacerlo con <a href="https://rufus.ie/en/" target="_blank" rel="noopener noreferrer">Rufus</a>.</li><li>Si est\xE1s en <strong>Linux</strong>, puedes hacerlo con <a href="https://www.balena.io/etcher/" target="_blank" rel="noopener noreferrer">Balena Etcher</a>.</li></ul><p>Ese pendrive lo cogemos y lo enchufamos al servidor.</p><h2 id="configuracion-de-la-bios-del-servidor" tabindex="-1">Configuraci\xF3n de la BIOS del servidor <a class="header-anchor" href="#configuracion-de-la-bios-del-servidor" aria-hidden="true">#</a></h2><p>Antes de instalar el sistema operativo, tenemos que hacer unos retoques en la BIOS, as\xED que enciende el servidor y accede a la BIOS <em>(si no sabes c\xF3mo, b\xFAscalo, porque cambia mucho de un ordenador a otro)</em>.</p><p>Aqu\xED hay <strong>dos cambios muy importantes</strong> que hacer:</p><ul><li><strong>Desactivar</strong>, si estuviera activado, el <strong>Secure Boot</strong>, ya que es algo de Windows y puede dar problemas para encender los ordenadores con Linux.</li><li>Establecer una <strong>contrase\xF1a de administrador</strong> de la BIOS.</li></ul><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Puede que te encuentres con dos posibles contrase\xF1as, la de <strong>usuario</strong> y la de <strong>administrador</strong>. La de usuario, si la creas, probablemente te la pida cada vez que el ordenador se encienda, cosa que no te conviene. La de administrador es la que nos interesa, que es la que se pide cuando se intenta acceder a la BIOS.</p></div><p>Ahora hay que ir al apartado de <strong>Boot</strong> y cambiar el orden de inicio de los dispositivos para poner como primera opci\xF3n el USB donde tenemos el instalador del sistema operativo.</p><p>Salimos guardando los cambios y el ordeandor deber\xEDa reiniciarse y mostrar el instalador del sistema.</p><h2 id="instalacion-de-debian-11" tabindex="-1">Instalaci\xF3n de Debian 11 <a class="header-anchor" href="#instalacion-de-debian-11" aria-hidden="true">#</a></h2><p>As\xED deber\xEDa verse nuestro instalador:</p><p><img src="'+s+'" alt="Instalador"></p><p>La instalaci\xF3n gr\xE1fica y la otra son pr\xE1cticamente iguales, la diferencia es que en la gr\xE1fica podr\xEDas usar el rat\xF3n.</p><p>Primero tocar\xE1 elegir el idioma y la distribuci\xF3n del teclado <em>(nosotros hemos elegido Espa\xF1ol para mayor comodidad)</em>. Despu\xE9s se intentar\xE1 conectar a internet y tocar\xE1 poner unos cuantos datos:</p><ol><li>El nombre de la m\xE1quina, como puede ser <code>server</code></li><li>El nombre del dominio, que para nuestro servidor es <code>servermamadisimo.xyz</code> <em>(si no tienes el dominio o no sabes qu\xE9 es, puedes hacerte spolier mirando la secci\xF3n de <a href="./router-dominio.html#dominio-\xBFque-es-y-para-que-sirve">Router y dominio</a>)</em>.</li><li>La contrase\xF1a para el usuario <code>root</code>. Esta contrase\xF1a tiene que ser <strong>potente</strong>, como de 20 caracteres, porque es la que permite hacer cualquier cambio.</li></ol><div class="tip custom-block"><p class="custom-block-title">TRUQUITO</p><p>Puedes generar, guardar y gestionar contrase\xF1as c\xF3modamente con <a href="https://bitwarden.com/" target="_blank" rel="noopener noreferrer">Bitwarden</a>.</p></div><ol start="4"><li>El nombre del usuario administrativo, como puede ser <code>admin</code> <em>(tanto para el nombre completo como para el nombre de usuario)</em>.</li></ol><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>El usuario escogido en la gu\xEDa es <code>admin</code>. Este nombre es de ejemplo y Debian no te dejar\xE1 usarlo. Intenta escoger otro distinto que no sea tan f\xE1cil de averiguar.</p></div><ol start="5"><li>La contrase\xF1a para el usuario <code>admin</code>. Una contrase\xF1a que sea buena, aunque no es necesario que sea tan extensa como la de <code>root</code>.</li><li>Configuraci\xF3n del reloj, de chill.</li></ol><p>Despu\xE9s de esto toca poner una encriptaci\xF3n en el disco de instalaci\xF3n.</p><h3 id="encriptacion-en-los-discos" tabindex="-1">Encriptaci\xF3n en los discos <a class="header-anchor" href="#encriptacion-en-los-discos" aria-hidden="true">#</a></h3><p>Para no complicarnos la vida, aqu\xED dejaremos que Debian haga la magia de gestionar las particiones porque si no nos tocar\xEDa sufrir mucho.</p><p>En el instalador, elegiremos el m\xE9todo de particionado <strong>Guiado - utilizar todo el disco y configurar LVM cifrado</strong>. Elegimos el disco donde queremos instalar el sistema operativo, que en nuestro caso es la SSD de 480GB y utilizamos como esquema de particionado <strong>Todos los ficheros en una partici\xF3n (recomendado para novatos)</strong>.</p><p>Ahora, si aprecias tu tiempo y no ten\xEDas archivos altamente sensibles en el disco donde vas a instalar Debian, puedes elegir no borrar el disco, ya que tardar\xEDa un buen rato.</p><p>Tras eso, nos pedir\xE1 una <strong>contrase\xF1a de cifrado</strong> y esta s\xED que tiene que ser una tremenda contrase\xF1a. Igual o mejor que la del usuario <code>root</code>.</p><p>Ahora toca lo interesante. Le decimos que use todo el disco para el particionado y nos aparecer\xE1 una lista con las particiones que se van a crear.</p><p><img src="'+i+'" alt="Particiones"></p><p>Las particiones m\xE1s importantes son:</p><ul><li>Una partici\xF3n donde ir\xE1 <strong>el sistema operativo y todos los datos</strong>. Por defecto aparecer\xE1 con el sistema de archivos <code>ext4</code>, uno de los m\xE1s comunes en Linux.</li><li>Una partici\xF3n de <strong>intercambio <em>(SWAP)</em></strong>, que se utiliza como una ampliaci\xF3n de la RAM.</li><li>Una partici\xF3n <code>boot</code> para que el ordenador se pueda encender.</li></ul><p>Se puede dejar tal y como est\xE1, pero nosotros hemos optado por usar <code>btrfs</code> en vez de <code>ext4</code> como sistema de archivos de la partici\xF3n principal. Esto es por las grandes facilidades que da <code>btrfs</code> para hacer copias de seguridad del sistema al completo sin que ocupen casi espacio.</p><p>Por suerte, cambiar el sistema de archivos es relativamente f\xE1cil, solo hay que ir a la l\xEDnea donde aparece la palabra <code>ext4</code>, pulsar &lt;Intro&gt; y en <strong>Utilizar como</strong> elegir el sistema <code>btrfs</code>. Salimos y ahora deber\xEDa aparecer <code>btrfs</code> en vez de <code>ext4</code> como sistema de archivos. Finalizamos el particionado confirmando que se hagan los cambios elegidos y empezar\xE1 la instalaci\xF3n del sistema operativo.</p><h3 id="terminando-la-instalacion" tabindex="-1">Terminando la instalaci\xF3n <a class="header-anchor" href="#terminando-la-instalacion" aria-hidden="true">#</a></h3><p>Una vez acabe la instalaci\xF3n, nos tocar\xE1 configurar el gestor de paquetes, elegir una ubicaci\xF3n y un proxy si hace falta, pero se puede dejar todo por defecto y el proxy en blanco.</p><p>Ahora nos dejar\xE1 elegir unos cuantos paquetes extra que instalar, estos son los cambios que hay que hacer:</p><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>Si no quieres que se te quede la cara de tonto que se me qued\xF3 a m\xED ya en dos ocasiones, recuerda que para desmarcar opciones hay que usar &lt;Espacio&gt; y no &lt;Intro&gt;, que como le des sin querer te toca repetir todo el proceso de instalaci\xF3n.</p></div><ul><li>Quitar el entorno de escritorio. El servidor no lo necesitar\xE1 all\xE1 donde vas a dejarlo.</li><li>A\xF1adir el servidor SSH, que nos permitir\xE1 conectarnos al servidor remotamente desde otro dispositivo para hacer cualquier gesti\xF3n.</li></ul><h2 id="configuracion-basica-y-pequenas-mejoras" tabindex="-1">Configuraci\xF3n b\xE1sica y peque\xF1as mejoras <a class="header-anchor" href="#configuracion-basica-y-pequenas-mejoras" aria-hidden="true">#</a></h2><p><strong>POR HACER:</strong> A\xF1adir el resto de discos, encriptarlos y configurar cryptab.</p>',50),d=[t];function l(c,p,u,m,g,b){return o(),a("div",null,d)}var q=e(n,[["render",l]]);export{v as __pageData,q as default};
