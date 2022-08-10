import{_ as e,c as a,o,a as r}from"./app.38ca1c03.js";var s="/server/assets/panik.302d9e42.png";const f=JSON.parse('{"title":"Bloqueo de SSH","description":"","frontmatter":{"title":"Bloqueo de SSH","lang":"es-ES"},"headers":[{"level":2,"title":"Contexto hist\xF3rico","slug":"contexto-historico"},{"level":2,"title":"La cagada","slug":"la-cagada"},{"level":2,"title":"El rescate","slug":"el-rescate"},{"level":3,"title":"Entorno de pruebas","slug":"entorno-de-pruebas"},{"level":3,"title":"Primeros enfoques","slug":"primeros-enfoques"},{"level":3,"title":"Ahondando en el funcionamiento de Linux","slug":"ahondando-en-el-funcionamiento-de-linux"},{"level":3,"title":"\xDAltimos intentos","slug":"ultimos-intentos"},{"level":3,"title":"Recuperando el servidor","slug":"recuperando-el-servidor"}],"relativePath":"relatos/bloqueo-ssh.md","lastUpdated":1660174949000}'),n={name:"relatos/bloqueo-ssh.md"},i=r('<h1 id="bloqueo-de-ssh" tabindex="-1">Bloqueo de SSH <a class="header-anchor" href="#bloqueo-de-ssh" aria-hidden="true">#</a></h1><p>De cuando Iv\xE1n escogi\xF3 no tener inteligencia estando lejos del servidor.</p><h2 id="contexto-historico" tabindex="-1">Contexto hist\xF3rico <a class="header-anchor" href="#contexto-historico" aria-hidden="true">#</a></h2><p><strong>28 de julio de 2022.</strong> El servidor, situado en Granada, estaba pendiente de casi toda configuraci\xF3n, solo ten\xEDa bien configurado Dropbear por si se reiniciaba o se iba la luz. El servidor de OpenSSH estaba aun en el puerto 22 y ten\xEDa activado el acceso por usuario y contrase\xF1a.</p><p>Iv\xE1n, estando en Valencia y sabiendo que quedaba un mes al menos hasta que pasase por Granada, decidi\xF3 que era buena idea cambiar el puerto de OpenSSH.</p><h2 id="la-cagada" tabindex="-1">La cagada <a class="header-anchor" href="#la-cagada" aria-hidden="true">#</a></h2><p>Primero se acord\xF3 de que ten\xEDa que abrir los puertos en el router, pero claro, para eso necesitaba configurar el servidor VNC <em>(de ah\xED surgi\xF3 esa parte de la gu\xEDa)</em> para poder meterse con Firefox a la IP del router y abrir el nuevo puerto.</p><p>Esto le mantuvo ocupado todo el d\xEDa, as\xED que nos trasladamos al 29 de julio, donde se dispon\xEDa, con los puertos abiertos en el router, a cambiar el puerto de SSH.</p><p>Cambia el puerto, reinicia el servicio SSH, cierra la conexi\xF3n e intenta volver a conectarse pero no funciona.</p><p><strong>HOSTIA EL FIREWALL</strong></p><p><img src="'+s+'" alt="Panik"></p><p>Efectivamente, se le hab\xEDa olvidado permitir el nuevo puerto de SSH en el firewall, as\xED que no hab\xEDa manera de poder volver a conectarse al servidor hasta que fuese a Granada.</p><h2 id="el-rescate" tabindex="-1">El rescate <a class="header-anchor" href="#el-rescate" aria-hidden="true">#</a></h2><p>Pero, \xBFy si no todo estaba perdido? Iv\xE1n empezo a teorizar una posible forma de recuperar el servidor. Si el servidor se reiniciaba, se quedar\xEDa esperando a que se desencriptasen los discos duros con Dropbear, y Dropbear todav\xEDa estaba con el puerto 22, as\xED que si desde ah\xED fuera capaz de editar la configuraci\xF3n de OpenSSH, podr\xEDa recuperar el servidor. Solo necesitaba a alguien que reiniciase el servidor y ya podr\xEDa hacer el resto del trabajo.</p><p>La persona que pod\xEDa ir a reiniciar el servidor fue f\xE1cil de encontrar. Pero hab\xEDa que hacer pruebas para ver si efectivamente era posible recuperar el servidor desde ese punto.</p><h3 id="entorno-de-pruebas" tabindex="-1">Entorno de pruebas <a class="header-anchor" href="#entorno-de-pruebas" aria-hidden="true">#</a></h3><p>Preparar el entorno de pruebas fue f\xE1cil, pues ya ten\xEDa una m\xE1quina virtual con Debian que hab\xEDa usado para las capturas de la gu\xEDa, solo ten\xEDa que hacer la poca configuraci\xF3n inicial que ten\xEDa el servidor y empezar a hacer pruebas.</p><h3 id="primeros-enfoques" tabindex="-1">Primeros enfoques <a class="header-anchor" href="#primeros-enfoques" aria-hidden="true">#</a></h3><p>Al principio, lo que intent\xE9 fue desencriptar y montar el disco manualmente desde initramfs para poder editar el archivo de configuraci\xF3n de OpenSSH.</p><p>Esto no dio buenos resultados porque el disco siempre se marcaba como ocupado y no dejaba montarlo.</p><h3 id="ahondando-en-el-funcionamiento-de-linux" tabindex="-1">Ahondando en el funcionamiento de Linux <a class="header-anchor" href="#ahondando-en-el-funcionamiento-de-linux" aria-hidden="true">#</a></h3><p>Como esto no funcionaba, tocaba entender mejor c\xF3mo funcionaba Initramfs y las fases en las que se dive, que viene bien explicado en la <a href="https://wiki.ubuntu.com/Initramfs" target="_blank" rel="noopener noreferrer">wiki de Ubuntu</a>.</p><p>Adem\xE1s, vi que por defecto el disco duro se montaba en solo lectura desde initramfs y, cuando segu\xEDa el proceso de arranque, ya se montaba escribible. As\xED que ten\xEDa que:</p><ul><li>Conseguir que initramfs montase el disco escribible.</li><li>Conseguir que el, una vez montado, borrase el archivo de configuraci\xF3n de OpenSSH para que se regenerase el por defecto.</li></ul><p>Este \xFAltimo enfoque result\xF3 no ser v\xE1lido, porque OpenSSH no regenera el archivo de configuraci\xF3n, simplemente deja de ejecutarse. As\xED que el enfoque cambi\xF3 a borrar el archivo de configuraci\xF3n de UFW, que hace que deje de funcionar y ,por tanto, que todos los puertos est\xE9n abiertos desde el servidor.</p><h3 id="ultimos-intentos" tabindex="-1">\xDAltimos intentos <a class="header-anchor" href="#ultimos-intentos" aria-hidden="true">#</a></h3><p>Intent\xE9 modificar los scripts de inicio que se ejecutan despu\xE9s de desencriptar el disco para que montasen el disco en escritura y borrasen el archivo de configuraci\xF3n, pero por mucho que cambiaba los par\xE1metros, parec\xEDa no afectar y segu\xEDa en solo escritura.</p><p>Finalmente, ya con pocas esperanzas, el 6 de agosto decid\xED cambiar ligeramente el enfoque y editar \xFAnicamente el archivo <code>/init</code>, que es el que se encarga de llamar a todos los scrips de inicio. Concretamente a\xF1ad\xED estas l\xEDneas justo antes del comentario <code># Move virtual filesystems over to the real filesystem</code>:</p><div class="language-bash"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">mount -w -t btrfs -o remount </span><span style="color:#89DDFF;">${</span><span style="color:#A6ACCD;">ROOT</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">${</span><span style="color:#A6ACCD;">rootmnt</span><span style="color:#89DDFF;">}</span></span>\n<span class="line"><span style="color:#A6ACCD;">rm -f </span><span style="color:#89DDFF;">${</span><span style="color:#A6ACCD;">rootmnt</span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">/etc/ufw/ufw.conf</span></span>\n<span class="line"><span style="color:#82AAFF;">unset</span><span style="color:#A6ACCD;"> ROOT</span></span>\n<span class="line"></span></code></pre></div><p>Borrando <code>unset ROOT</code> de m\xE1s arriba, ya que esa variable conten\xEDa el nombre del disco duro con el sistema.</p><p><strong>Funcion\xF3.</strong> Y despu\xE9s de eso solo hab\xEDa que reinstalar y configurar de nuevo UFW.</p><h3 id="recuperando-el-servidor" tabindex="-1">Recuperando el servidor <a class="header-anchor" href="#recuperando-el-servidor" aria-hidden="true">#</a></h3><p>Sabiendo esto, solo hubo que esperar a que la persona encargada de reiniciar el servidor lo hiciese bajando y subiendo los plomos del piso.</p><p>Lo hizo y el servidor volvi\xF3 a la vida \u{1F604}</p>',34),t=[i];function l(d,c,u,p,h,m){return o(),a("div",null,t)}var v=e(n,[["render",l]]);export{f as __pageData,v as default};