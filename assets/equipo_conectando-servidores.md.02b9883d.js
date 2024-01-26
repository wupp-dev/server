import{_ as s,o as e,c as a,Q as n}from"./chunks/framework.3d7dc540.js";const h=JSON.parse('{"title":"Conectando varios servidores","description":"","frontmatter":{"title":"Conectando varios servidores","lang":"es-ES"},"headers":[],"relativePath":"equipo/conectando-servidores.md","filePath":"equipo/conectando-servidores.md","lastUpdated":1706299952000}'),o={name:"equipo/conectando-servidores.md"},l=n(`<h1 id="conectando-varios-servidores" tabindex="-1">Conectando varios servidores <a class="header-anchor" href="#conectando-varios-servidores" aria-label="Permalink to &quot;Conectando varios servidores&quot;">​</a></h1><p>Llega un momento en el que un ordenador se queda corto, sobre todo si quieres usarlo para Minecraft. Así que nuestra solución fue añadir otro a la colección pero, ¿cómo conectamos ambos para que respondan bajo un mismo dominio?</p><h2 id="introduccion" tabindex="-1">Introducción <a class="header-anchor" href="#introduccion" aria-label="Permalink to &quot;Introducción&quot;">​</a></h2><p>Lo primero que tendremos que hacer con el nuevo ordenador es seguir toda esta guía para llegar a tenerlo en un punto usable. Eso sí, tendremos que escoger dos nuevos puertos para OpenSSH Server y Dropbear, pero por lo demás es todo igual hasta que llegamos a Nginx. Que no se nos olvide asignarle una IP local fija que, asumiremos que es <code>192.168.1.144</code>. Si hacemos referenci a la IP local del servidor principal, asumiremos también que es <code>192.168.1.133</code>.</p><h2 id="nginx" tabindex="-1">Nginx <a class="header-anchor" href="#nginx" aria-label="Permalink to &quot;Nginx&quot;">​</a></h2><p>Llegados a este punto, lo ideal sería tener un tercer ordenador (como una Raspberry) con Nginx para gestionar las conexiones y que simplemente haga de proxy inverso hacia los otros ordenadores, que tendrán los distintos servicios.</p><p>Como no nos sobra el dinero para tener todavía otro más, hemos optado por seguir usando el ordenador principal para gestionar las conexiones y que el de Minecraft simplemente se comunique con el otro y no con el exterior (salvo por el SSH).</p><h3 id="internet-servidor-principal" tabindex="-1">Internet &lt;-&gt; Servidor principal <a class="header-anchor" href="#internet-servidor-principal" aria-label="Permalink to &quot;Internet &lt;-&gt; Servidor principal&quot;">​</a></h3><p>Para empezar tenemos que configurar Nginx para que lo único que haga al recibir una solicitud que deba de ir al ordenador secundario sea gestionar la conexión HTTPS y comunicarse con el ordenador secundario. En nuestro caso queremos redirigir los subdominios <code>mc.wupp.dev</code> y <code>amp.wupp.dev</code> (entre otros) al servidor secundario para servir NamelessMC y el panel de control de Minecraft respectivamente.</p><p>El archivo de configuración de Nginx para los dos dominios debería de quedar igual. Este sería el de <code>amp.wupp.dev</code> por ejemplo:</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">amp.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_pass </span><span style="color:#E1E4E8;">https://192.168.1.144;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_ssl_session_reuse </span><span style="color:#E1E4E8;">on;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_ssl_verify </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Host $host;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/amp.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/amp.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_dhparam </span><span style="color:#E1E4E8;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">amp.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_pass </span><span style="color:#24292E;">https://192.168.1.144;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_ssl_session_reuse </span><span style="color:#24292E;">on;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_ssl_verify </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Host $host;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/letsencrypt/live/amp.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/letsencrypt/live/amp.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_dhparam </span><span style="color:#24292E;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Aunque las opciones <code>proxy_ssl_session_reuse on;</code> y <code>proxy_ssl_verify off;</code> ya tienen esos valores por defecto, he preferido especificarlas para tenerlas más en cuenta. La primera lo que hace es reutilizar los parámetros del SSL handshake para que las conexiones requieran menos recursos al establecerse. La segunda le indica a Nginx que no debe indicar si el certificado del ordenador secundario es válido, pues utilizaremos uno <em>self-signed</em> para facilitar las cosas (y esos no se consideran válidos tal cual).</p><h3 id="servidor-principal-servidor-secundario" tabindex="-1">Servidor principal &lt;-&gt; Servidor secundario <a class="header-anchor" href="#servidor-principal-servidor-secundario" aria-label="Permalink to &quot;Servidor principal &lt;-&gt; Servidor secundario&quot;">​</a></h3><p>En el servidor secundario, a parte de instalar Nginx y configurarlo tal y como dice esta guía, hay que modificar <code>/etc/nginx/nginx.conf</code> para quitar todas las líneas de configuración de <em>OSCP stapling</em>, pues entre el ordenador principal y el secundario no será necesario usarlo.</p><p>Debian debería venir con un paquete llamado <code>ssl-cert</code> que genera un certificado <em>self-signed</em> al instalarse, así que también deberíamos tener un certificado en <code>/etc/ssl/certs/ssl-cert-snakeoil.pem</code> que será el que usaremos para que la conexión entre el servidor principal y el secundario pueda ser por HTTPS.</p><p>Para usarlo, simplemente debemos incluirlo en el archivo de configuración como si se tratase del certificado de certbot:</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">listen </span><span style="color:#E1E4E8;">443 ssl;</span></span>
<span class="line"><span style="color:#F97583;">ssl_certificate </span><span style="color:#E1E4E8;">/etc/ssl/certs/ssl-cert-snakeoil.pem;</span></span>
<span class="line"><span style="color:#F97583;">ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/ssl/private/ssl-cert-snakeoil.key;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">listen </span><span style="color:#24292E;">443 ssl;</span></span>
<span class="line"><span style="color:#D73A49;">ssl_certificate </span><span style="color:#24292E;">/etc/ssl/certs/ssl-cert-snakeoil.pem;</span></span>
<span class="line"><span style="color:#D73A49;">ssl_certificate_key </span><span style="color:#24292E;">/etc/ssl/private/ssl-cert-snakeoil.key;</span></span></code></pre></div><h2 id="correo-electronico" tabindex="-1">Correo electrónico <a class="header-anchor" href="#correo-electronico" aria-label="Permalink to &quot;Correo electrónico&quot;">​</a></h2><p>Si nos hemos decidido a configurar un servidor de correo en el ordenador principal, se nos puede dar el caso en el que un servicio del ordenador secundario necesite mandar correos a través del servidor de correo que hayamos configurado.</p><p>Para asegurar que funcione correctamente, utilizaremos y configuraremos <code>exim4</code> en el servidor secundario. Empezamos instalándolo con <code>sudo apt-get install exim4-daemon-light</code> y pasamos a configurarlo editando <code>sudo nano /etc/exim4/update-exim4.conf.conf</code>. Para nuestro caso concreto:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># /etc/exim4/update-exim4.conf.conf</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Edit this file and /etc/mailname by hand and execute update-exim4.conf</span></span>
<span class="line"><span style="color:#e1e4e8;"># yourself or use &#39;dpkg-reconfigure exim4-config&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Please note that this is _not_ a dpkg-conffile and that automatic changes</span></span>
<span class="line"><span style="color:#e1e4e8;"># to this file might happen. The code handling this will honor your local</span></span>
<span class="line"><span style="color:#e1e4e8;"># changes, so this is usually fine, but will break local schemes that mess</span></span>
<span class="line"><span style="color:#e1e4e8;"># around with multiple versions of the file.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># update-exim4.conf uses this file to determine variable values to generate</span></span>
<span class="line"><span style="color:#e1e4e8;"># exim configuration macros for the configuration file.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Most settings found in here do have corresponding questions in the</span></span>
<span class="line"><span style="color:#e1e4e8;"># Debconf configuration, but not all of them.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># This is a Debian specific file</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">dc_eximconfig_configtype=&#39;satellite&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_other_hostnames=&#39;mcserver&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_local_interfaces=&#39;127.0.0.1 ; ::1&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_readhost=&#39;wupp.dev&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_relay_domains=&#39;&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_minimaldns=&#39;false&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_relay_nets=&#39;&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_smarthost=&#39;192.168.1.133:587&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">CFILEMODE=&#39;644&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_use_split_config=&#39;false&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_hide_mailname=&#39;true&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_mailname_in_oh=&#39;true&#39;</span></span>
<span class="line"><span style="color:#e1e4e8;">dc_localdelivery=&#39;mail_spool&#39;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"># /etc/exim4/update-exim4.conf.conf</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Edit this file and /etc/mailname by hand and execute update-exim4.conf</span></span>
<span class="line"><span style="color:#24292e;"># yourself or use &#39;dpkg-reconfigure exim4-config&#39;</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Please note that this is _not_ a dpkg-conffile and that automatic changes</span></span>
<span class="line"><span style="color:#24292e;"># to this file might happen. The code handling this will honor your local</span></span>
<span class="line"><span style="color:#24292e;"># changes, so this is usually fine, but will break local schemes that mess</span></span>
<span class="line"><span style="color:#24292e;"># around with multiple versions of the file.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># update-exim4.conf uses this file to determine variable values to generate</span></span>
<span class="line"><span style="color:#24292e;"># exim configuration macros for the configuration file.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Most settings found in here do have corresponding questions in the</span></span>
<span class="line"><span style="color:#24292e;"># Debconf configuration, but not all of them.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># This is a Debian specific file</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">dc_eximconfig_configtype=&#39;satellite&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_other_hostnames=&#39;mcserver&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_local_interfaces=&#39;127.0.0.1 ; ::1&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_readhost=&#39;wupp.dev&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_relay_domains=&#39;&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_minimaldns=&#39;false&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_relay_nets=&#39;&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_smarthost=&#39;192.168.1.133:587&#39;</span></span>
<span class="line"><span style="color:#24292e;">CFILEMODE=&#39;644&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_use_split_config=&#39;false&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_hide_mailname=&#39;true&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_mailname_in_oh=&#39;true&#39;</span></span>
<span class="line"><span style="color:#24292e;">dc_localdelivery=&#39;mail_spool&#39;</span></span></code></pre></div><p>donde <code>192.168.1.133:587</code> es la IP local del ordenador principal y el puerto donde esté ESMTP con STARTTLS.</p><p>También editamos <code>sudo nano /etc/exim4/passwd.client</code>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;"># password file used when the local exim is authenticating to a remote</span></span>
<span class="line"><span style="color:#e1e4e8;"># host as a client.</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># see exim4_passwd_client(5) for more documentation</span></span>
<span class="line"><span style="color:#e1e4e8;">#</span></span>
<span class="line"><span style="color:#e1e4e8;"># Example:</span></span>
<span class="line"><span style="color:#e1e4e8;">### target.mail.server.example:login:password</span></span>
<span class="line"><span style="color:#e1e4e8;">*:admin@wupp.dev:passw</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"># password file used when the local exim is authenticating to a remote</span></span>
<span class="line"><span style="color:#24292e;"># host as a client.</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># see exim4_passwd_client(5) for more documentation</span></span>
<span class="line"><span style="color:#24292e;">#</span></span>
<span class="line"><span style="color:#24292e;"># Example:</span></span>
<span class="line"><span style="color:#24292e;">### target.mail.server.example:login:password</span></span>
<span class="line"><span style="color:#24292e;">*:admin@wupp.dev:passw</span></span></code></pre></div><p>donde <code>admin@wupp.dev</code> y <code>passw</code> es un correo y su contraseña del ordenador principal.</p><p>Aplicamos los cambios con <code>sudo update-exim4.conf</code> y con <code>sudo /etc/init.d/exim4 restart</code>.</p><p>Esto nos permitirá que, mandando correos desde el servidor secundario a sí mismo al puerto 25, se redirijan al servidor principal y salgan desde allí.</p>`,27),p=[l];function r(c,t,i,d,y,u){return e(),a("div",null,p)}const E=s(o,[["render",r]]);export{h as __pageData,E as default};
