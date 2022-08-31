import{_ as e,c as o,o as a,a as s}from"./app.0d42db77.js";const r="/server/assets/ips-pub-priv.2838c6e6.png",n="/server/assets/url.1276cbec.png",i="/server/assets/nameservers.29c88db3.png",t="/server/assets/freedns.8a951435.png",y=JSON.parse('{"title":"Router y dominio","description":"","frontmatter":{"title":"Router y dominio","lang":"es-ES"},"headers":[{"level":2,"title":"Breve introducci\xF3n sobre las IPs","slug":"breve-introduccion-sobre-las-ips","link":"#breve-introduccion-sobre-las-ips","children":[]},{"level":2,"title":"Dominio, \xBFqu\xE9 es y para qu\xE9 sirve?","slug":"dominio-\xBFque-es-y-para-que-sirve","link":"#dominio-\xBFque-es-y-para-que-sirve","children":[{"level":3,"title":"\xBFQu\xE9 son los subdominios?","slug":"\xBFque-son-los-subdominios","link":"#\xBFque-son-los-subdominios","children":[]},{"level":3,"title":"Adquiriendo el dominio","slug":"adquiriendo-el-dominio","link":"#adquiriendo-el-dominio","children":[]},{"level":3,"title":"Utilizando otros nameservers","slug":"utilizando-otros-nameservers","link":"#utilizando-otros-nameservers","children":[]}]},{"level":2,"title":"Actualizando la IP p\xFAblica en el domino autom\xE1ticamente","slug":"actualizando-la-ip-publica-en-el-domino-automaticamente","link":"#actualizando-la-ip-publica-en-el-domino-automaticamente","children":[]},{"level":2,"title":"Toqueteando en el router","slug":"toqueteando-en-el-router","link":"#toqueteando-en-el-router","children":[{"level":3,"title":"Breve introduci\xF3n sobre los puertos","slug":"breve-introducion-sobre-los-puertos","link":"#breve-introducion-sobre-los-puertos","children":[]},{"level":3,"title":"Abriendo puertos en el router (tengo que poner im\xE1genes)","slug":"abriendo-puertos-en-el-router-tengo-que-poner-imagenes","link":"#abriendo-puertos-en-el-router-tengo-que-poner-imagenes","children":[]}]}],"relativePath":"equipo/router-dominio.md","lastUpdated":1661964695000}'),l={name:"equipo/router-dominio.md"},u=s('<h1 id="configuracion-del-router-y-del-dominio" tabindex="-1">Configuraci\xF3n del router y del dominio <a class="header-anchor" href="#configuracion-del-router-y-del-dominio" aria-hidden="true">#</a></h1><p>Aqu\xED nuestro objetivo ser\xE1 no tener que preocuparnos de nada que no sea el propio servidor. Para ello, hay que preocuparse moment\xE1neamente de dos elementos externos:</p><ul><li>Configurar el router de tu casa para que deje que el servidor sea un servidor.</li><li>Adquirir un dominio para que sea m\xE1s c\xF3modo conectarte al servidor y poder usar subdominios.</li></ul><h2 id="breve-introduccion-sobre-las-ips" tabindex="-1">Breve introducci\xF3n sobre las IPs <a class="header-anchor" href="#breve-introduccion-sobre-las-ips" aria-hidden="true">#</a></h2><p>Aqu\xED vamos a hablar de dos tipos de IPs:</p><ul><li><strong>IP P\xFAblica:</strong> Esta es la IP con la que se puede acceder al servidor <em>(o cualquier otro dispositivo de tu red, si lo permites)</em> desde cualquier parte de internet.</li><li><strong>IP Local:</strong> Esta IP identifica al sevidor dentro de la red a la que est\xE1 conectado, pero no sirve fuera.</li></ul><p><img src="'+r+'" alt="IPs P\xFAblicas vs Privadas"></p><p>Por desgracia, seguimos usando para ambos casos IPv4, pero bueno, menos da una piedra.</p><p>Lo que nos interesa aqu\xED es la IP p\xFAblica. Cuando queramos conectarnos al servidor o alguien m\xE1s quiera, queda feo que tengan que hacerlo con la IP. Aqu\xED es donde entran los <strong>dominios</strong>.</p><h2 id="dominio-\xBFque-es-y-para-que-sirve" tabindex="-1">Dominio, \xBFqu\xE9 es y para qu\xE9 sirve? <a class="header-anchor" href="#dominio-\xBFque-es-y-para-que-sirve" aria-hidden="true">#</a></h2><p>Un dominio es un pseud\xF3nimo para la IP, que es m\xE1s bonito y f\xE1cil de recordar que la propia IP. Cuando nos conectamos a cualquier web, lo hacemos mediante el Uniform Resource Locator <em>(URL)</em>, que se divide en:</p><p><img src="'+n+'" alt="URL"></p><p>En nuestro caso, el dominio es <code>servermamadisimo.xyz</code>, y cuando te intentas conectar a esa direcci\xF3n, el ordenador le pregunta qu\xE9 IP es a la que apunta la direcci\xF3n a unos servidoes especiales que se llaman nameservers. Estos servidores son una parte fundamental del DNS <em>(Domain Name System)</em>, que permite utilizar las direcciones en vez de las IPs. Normalmente los nameservers que se usan son los del propio proveedor de internet, pero se pueden cambiar para que sean a otros como <a href="https://my.nextdns.io" target="_blank" rel="noreferrer">NextDNS</a>.</p><p>Los dominios <strong>hay que pagarlos</strong>, esta es la parte mala. Los m\xE1s baratos suelen estar entre 10\u20AC y 15\u20AC anuales, aunque el primer a\xF1o suele costar menos.</p><p>Una vez compras un dominio, puedes elegir a qu\xE9 IP apunta e incluso puedes crear <strong>subdominios</strong>.</p><h3 id="\xBFque-son-los-subdominios" tabindex="-1">\xBFQu\xE9 son los subdominios? <a class="header-anchor" href="#\xBFque-son-los-subdominios" aria-hidden="true">#</a></h3><p>Pues lo que va antes del dominio claro, por ejemplo, para <code>servermamadisimo.xyz</code> podemos crear los subdominios <code>www.servermamadisimo.xyz</code>, <code>mc.servermamadisimo.xyz</code> o <code>nextcloud.servermamadisimo.xyz</code>. Esto es \xFAtil para separar los servcios que tienes en el servidor. Adem\xE1s, te permite apuntar a distintas IPs o incluso hacer redirecciones para cada subdominio.</p><p>Pero el hecho de tener un dominio no solo ayuda a la comodidad de recordarlo y escribirlo, a parte de que es necesario para poder usar subdominios, tambi\xE9n nos permite no preocuparnos de qu\xE9 pasa si la IP p\xFAblica del servidor cambia <em>(que puede ocurrir)</em>, solo tienes que decirle al dominio que se\xF1ale a la nueva IP. De no tener un dominio, tendr\xEDas que decirle a todas las personas que se conectan al servidor la nueva IP para que la cambien.</p><h3 id="adquiriendo-el-dominio" tabindex="-1">Adquiriendo el dominio <a class="header-anchor" href="#adquiriendo-el-dominio" aria-hidden="true">#</a></h3><p>Para comprar un dominio, primero debes buscar un proveedor, hay muchas elecciones. La nuestra fue <a href="https://www.onlydomains.com/account/login" target="_blank" rel="noreferrer">OnlyDomains</a>, aunque <a href="https://www.namecheap.com/" target="_blank" rel="noreferrer">Namecheap</a> tambi\xE9n puede ser una buena opci\xF3n. Despu\xE9s, tendr\xE1s que pensar en qu\xE9 nombre quieres para tu dominio y comprobar que est\xE9 disponible.</p><p>Una cosa muy importante a la hora de registrar un dominio es tener la protecci\xF3n <strong>Whois</strong>, porque as\xED evitar\xE1 que cualquiera que busque qui\xE9n ha registrado el dominio pueda saber tus datos personales como el n\xFAmero de tel\xE9fono y el correo electr\xF3nico. Puede llegarte mucho spam por no tener esta protecci\xF3n. Por suerte, suele costar poco o incluso estar inclu\xEDdo con el pago del dominio, como es nuestro caso.</p><h3 id="utilizando-otros-nameservers" tabindex="-1">Utilizando otros nameservers <a class="header-anchor" href="#utilizando-otros-nameservers" aria-hidden="true">#</a></h3><p>Cada dominio est\xE1 asociado a unos nameservers, que ser\xE1n los que digan a qu\xE9 IP apunta el dominio y cada subdominio que haya.</p><p>Por defecto, los proveedores de dominios suelen usar sus propios nameservers, pero puedes configurar tu dominio para que use otros. Eso es b\xE1sicamente como darle el control del dominio a otra p\xE1gina en vez de la p\xE1gina en la que has comprado el dominio. <strong>\xBFPor qu\xE9 querr\xEDas hacer esto?</strong> Pues porque hay p\xE1ginas como <a href="https://freedns.afraid.org/" target="_blank" rel="noreferrer">FreeDNS</a> que te dan muchas facilidades para gestionar tu dominio y para actualizar la IP p\xFAblica de tu servidor en el dominio si cambia. Esto OnlyDomains, por ejemplo, no lo permite de una forma sencilla, por eso nosotros usamos los nameservers de FreeDNS en vez de los propios de OnlyDomains.</p><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>Cambiar los nameservers de tu dominio puede tardar hasta 24 horas en hacerse efectivo en todo el mundo, hazlo solo si es necesario y tienes tiempo para esperar.</p></div><p>As\xED se ven los nameservers de nuestro dominio al cambiarlos a FreeDNS: <img src="'+i+'" alt="nameservers"></p><h2 id="actualizando-la-ip-publica-en-el-domino-automaticamente" tabindex="-1">Actualizando la IP p\xFAblica en el domino autom\xE1ticamente <a class="header-anchor" href="#actualizando-la-ip-publica-en-el-domino-automaticamente" aria-hidden="true">#</a></h2><p>FreeDNS nos permite gestionar todos los subdominios y actualizar la IP a la que apuntan s\xEDmplemente con un enlace, que debemos abrir desde el servidor. Esto har\xE1 que dejemos de preocuparnos por si estamos fuera de casa y de repente nuestra IP p\xFAblica cambia, ya que si no se actualizara autom\xE1ticamente, perder\xEDamos acceso al servidor a trav\xE9s del dominio y para poder conectarnos tendr\xEDamos que averiguar la nueva IP p\xFAblica, cosa que no es precisamente sencilla.</p><p>Teniendo una cuenta de FreDNS y el dominio con sus nameservers, podemos ir al apartado de <strong>Dynamic DNS</strong> y copiar la <strong>Direct URL</strong> para actualizar la IP de nuestro dominio. <img src="'+t+`" alt="FreeDNS"> En este caso cualesquiera de las URLs nos servir\xEDa, ya que tanto el dominio como los subdominios apuntan a la misma IP y est\xE1 activada la opci\xF3n <strong>Link updates of the same IP together</strong>, haciendo que al actualizar un dominio o subdominio, se actualicen los dem\xE1s que aputaban a la misma IP.</p><p>Vayamos al servidor. Debemos tener installado <code>crontab</code>, un software para ejecutar tareas cada cierto tiempo. Escribimos <code>sudo crontab -e</code> <em>(importante el sudo para que se asocie al usuario root, ya que nos ser\xE1 c\xF3modo para un futuro)</em> y el archivo deber\xEDa quedar m\xE1s o menos as\xED:</p><div class="language-bash"><button class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#676E95;"># </span></span>
<span class="line"><span style="color:#676E95;"># To define the time you can provide concrete values for</span></span>
<span class="line"><span style="color:#676E95;"># minute (m), hour (h), day of month (dom), month (mon),</span></span>
<span class="line"><span style="color:#676E95;"># and day of week (dow) or use &#39;*&#39; in these fields (for &#39;any&#39;).</span></span>
<span class="line"><span style="color:#676E95;"># </span></span>
<span class="line"><span style="color:#676E95;"># Notice that tasks will be started based on the cron&#39;s system</span></span>
<span class="line"><span style="color:#676E95;"># daemon&#39;s notion of time and timezones.</span></span>
<span class="line"><span style="color:#676E95;"># </span></span>
<span class="line"><span style="color:#676E95;"># Output of the crontab jobs (including errors) is sent through</span></span>
<span class="line"><span style="color:#676E95;"># email to the user the crontab file belongs to (unless redirected).</span></span>
<span class="line"><span style="color:#676E95;"># </span></span>
<span class="line"><span style="color:#676E95;"># For example, you can run a backup of all your user accounts</span></span>
<span class="line"><span style="color:#676E95;"># at 5 a.m every week with:</span></span>
<span class="line"><span style="color:#676E95;"># 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/</span></span>
<span class="line"><span style="color:#676E95;"># </span></span>
<span class="line"><span style="color:#676E95;"># For more information see the manual pages of crontab(5) and cron(8)</span></span>
<span class="line"><span style="color:#676E95;"># </span></span>
<span class="line"><span style="color:#676E95;"># m h  dom mon dow   command</span></span>
<span class="line"><span style="color:#A6ACCD;">1,6,11,16,21,26,31,36,41,46,51,56 </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> sleep 46 </span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> wget --no-check-certificate -O - UpdateURL </span><span style="color:#89DDFF;">&gt;&gt;</span><span style="color:#A6ACCD;"> /tmp/freedns_@_dominio_com.log </span><span style="color:#89DDFF;">2&gt;&amp;1</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"></span></code></pre></div><p>Donde <code>UpdateURL</code> es la URL copiada de FreeDNS, que se ver\xE1 como <code>https://freedns.afraid.org/dynamic/update.php?cosas</code> y <code>dominio_com</code> es el dominio, que en nuestro caso ser\xEDa <code>servermamadisimo_xyz</code>.</p><p>Esto har\xE1 que cada 5 minutos se compruebe si la IP p\xFAblica del servidor ha cambiado y, si es as\xED, se actualizar\xE1 a la nueva. Adem\xE1s, el resultado se guarda en un archivo temporal en <code>/tmp/freedns_@_domino_com.log</code>.</p><h2 id="toqueteando-en-el-router" tabindex="-1">Toqueteando en el router <a class="header-anchor" href="#toqueteando-en-el-router" aria-hidden="true">#</a></h2><p>Muy bien, ya tenemos el dominio apuntando a la IP p\xFAblica de nuestro router y al servidor actualiz\xE1ndola si esta cambia. Pero queda todav\xEDa un problema externo al servidor que resolver.</p><p>Por defecto, el router no deja que alguien se conecte mediante la IP p\xFAblica a alg\xFAn dispositivo de la red porque es algo que solo deber\xEDa ocurrir si estamos ofreciendo un servicio a trav\xE9s de internet.</p><h3 id="breve-introducion-sobre-los-puertos" tabindex="-1">Breve introduci\xF3n sobre los puertos <a class="header-anchor" href="#breve-introducion-sobre-los-puertos" aria-hidden="true">#</a></h3><p>Para que varios programas puedan conectarse a internet y hacer cosas distintas simult\xE1neamente se utilizan los puertos. Los puertos son puntos de transmisi\xF3n y recepci\xF3n de datos <em>(no son nada f\xEDsico, solo un n\xFAmero que ayuda a gestionar mejor las conexiones)</em>, est\xE1n numerados del 0 al 65535 y algunos de ellos est\xE1n reservados o son los m\xE1s habituales para un uso espec\xEDfico, por ejemplo:</p><ul><li>Los puertos 20 y 21 se utilizan para transferencia de archivos.</li><li>El puerto 22 se utilia para las conexiones de Secure Shell <em>(SSH)</em> de las que hablaremos en la siguiente secci\xF3n.</li><li>El puerto 80 se utiliza para las conexiones de Hypertext Transfer Protocol <em>(HTTP)</em>, que es el protocolo por el que funcionan las p\xE1ginas web.</li><li>El puerto 123 se utiliza para el Network Time Protocol <em>(NTP)</em> para que los relojes de los ordenadoes est\xE9n sincronizados.</li><li>El puerto 443 se utiliza para las conexiones HTTP Secure <em>(HTTPS)</em>, actuando como sustituto del puerto <em>HTTP</em>, ya que todas las conexiones deber\xEDan ir cifradas.</li><li>El puerto 25565 es el m\xE1s com\xFAn para los servidores de Minecraft.</li></ul><p><strong>Nota:</strong> Puedes ver los puertos mejor explicados <a href="https://www.adslzone.net/como-se-hace/internet/abrir-puertos-router/" target="_blank" rel="noreferrer">aqu\xED</a>.</p><p>Pues bien, por defecto estos puertos no est\xE1n abiertos para que un dispositivo cualquiera de internet pueda llegar y conectarse a nuestro ordenador a trav\xE9s de ellos. Esto est\xE1 bien, porque, a no ser que tengas un servidor en tu casa, si alguien intenta conectarse a alguno de los puertos de tu ordenador no suele ser con buenas intenciones.</p><p>En nuestro caso, como tenemos un servidor, s\xED que necesitamos que los puertos est\xE9n abiertos, as\xED que debemos configurar el router para que permita conexiones externas a los puertos que digamos.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Esto no quiere decir que de aqu\xED en adelante cualquier persona se vaya a poder conectar a los puertos que quiera de cualquier dispositivo de tu red. Normalmente el router permite abrir los puertos solo para una IP local <em>(que en este caso ser\xE1 nuestro servidor)</em>, siguiendo cerrados para los dem\xE1s dispositivos. Adem\xE1s, los ordenadores y tel\xE9fonos suelen venir con un firewall instalado, que tambi\xE9n bloquea por defecto las conexiones externas en cualquier puerto. De hecho, tendremos que v\xE9rnolas tambi\xE9n con el firewall del servidor aunque los puertos est\xE9n abiertos desde el router.</p></div><h3 id="abriendo-puertos-en-el-router-tengo-que-poner-imagenes" tabindex="-1">Abriendo puertos en el router (tengo que poner im\xE1genes) <a class="header-anchor" href="#abriendo-puertos-en-el-router-tengo-que-poner-imagenes" aria-hidden="true">#</a></h3><p>Lo primero es saber si t\xFA desde tu casa puedes configurar tu router o debes contactar con el proveedor de internet para que lo haga, aunque lo m\xE1s com\xFAn es que s\xED puedas configurarlo.</p><p><strong>Nota:</strong> Nuevamente, en <a href="https://www.adslzone.net/como-se-hace/internet/abrir-puertos-router/" target="_blank" rel="noreferrer">esta p\xE1gina</a> est\xE1 mejor explicado c\xF3mo abrir los puertos.</p><p>Para configurarlo tienes que conectarte a la IP de la puerta de enlace del router, que suele ser <code>192.168.1.1</code>. Puedes conectarte simplemente abriendo el navegador y poniendo la IP en la barra superior como si de una URL se tratara.</p><p>Una vez conectado, te pedir\xE1 un nombre de usuario y una contrase\xF1a, que deber\xEDan estar escritos en el router <em>(no estar\xEDa mal cambiar la contrase\xF1a despu\xE9s de abrir los puertos)</em>.</p><div class="warning custom-block"><p class="custom-block-title">ADVERTENCIA</p><p>Hay proveedores de internet como Digi, que te permiten configurar el router, pero los cambios que le hagas a los puertos no van a funcionar a no ser que contactes con ellos y les pidas que te permitan abrir puertos <em>(cosa por la que te cobrar\xE1n 1\u20AC m\xE1s al mes)</em>.</p></div><p><em>Cuando pueda poner im\xE1genes de la interfaz terminar\xE9 esta parte porque lo \xFAnico que tengo que decir es que hay que abrir los puertos que vayas a usar como 80, 443, 25565, etc y abrirlos para conexiones TCP y UDP en la IP local del servidor.</em></p><p><strong>IMPORTANTE DEJAR FIJA LA IP LOCAL DEL SERVIDOR</strong></p>`,51),d=[u];function c(p,m,q,b,h,v){return a(),o("div",null,d)}const f=e(l,[["render",c]]);export{y as __pageData,f as default};
