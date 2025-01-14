import{_ as a,c as s,a0 as n,o}from"./chunks/framework.BXIsVzPz.js";const h=JSON.parse('{"title":"Túnel SSH en la UGR LAN Party de 2024","description":"","frontmatter":{"title":"Túnel SSH en la UGR LAN Party de 2024","lang":"es-ES"},"headers":[],"relativePath":"relatos/tunel-ssh-ulp.md","filePath":"relatos/tunel-ssh-ulp.md","lastUpdated":1736885052000}'),i={name:"relatos/tunel-ssh-ulp.md"};function r(t,e,l,p,d,c){return o(),s("div",null,e[0]||(e[0]=[n(`<h1 id="tunel-ssh-en-la-ugr-lan-party-de-2024" tabindex="-1">Túnel SSH en la UGR LAN Party de 2024 <a class="header-anchor" href="#tunel-ssh-en-la-ugr-lan-party-de-2024" aria-label="Permalink to &quot;Túnel SSH en la UGR LAN Party de 2024&quot;">​</a></h1><p>De cuando el servidor fue dispensado para la organización del torneo de Minecraft en la <a href="https://ulp.ugr.es/" target="_blank" rel="noreferrer">UGR LAN Party</a> de 2024.</p><h2 id="contexto-historico" tabindex="-1">Contexto histórico <a class="header-anchor" href="#contexto-historico" aria-label="Permalink to &quot;Contexto histórico&quot;">​</a></h2><p>El <strong>9 de marzo de 2024</strong> se celebraba la UGR LAN Party en la <a href="https://etsiit.ugr.es/" target="_blank" rel="noreferrer">E.T.S. de Ingenierías Informática y de Telecomunicaciones</a> y el día anterior habíamos llevado el servidor físicamente a la escuela. Esto, como es obvio, suponía que no iba a estar operativo ningún servicio de ese ordenador durante el fin de semana, pues, aunque el ordenador estaba conectado a internet, no era posible abrir ningún puerto para nosotros en la red de la Universidad.</p><p>Este relato cuenta cómo pudimos mantener todos los servicios operativos aun cuando uno de los ordenadores no se encontraba accesible a través de internet.</p><h2 id="tunel-ssh-para-mantener-el-dominio-funcionando" tabindex="-1">Túnel SSH para mantener el dominio funcionando <a class="header-anchor" href="#tunel-ssh-para-mantener-el-dominio-funcionando" aria-label="Permalink to &quot;Túnel SSH para mantener el dominio funcionando&quot;">​</a></h2><p>La respuesta al dilema, obviamente, es mediante un túnel SSH con el servidor principal, es decir, una conexión SSH ininterrumpida entre ambos ordenadores por donde se redirigía el tráfico del dominio al servidor de Minecraft.</p><p>Para poder llevarlo a cabo son necesarios los siguientes requisitos:</p><ul><li>Tener un servidor al que poder conectarte a través del dominio, que será el encargado de redirigir el tráfico al que no lo está.</li><li>Tener conexión a internet con el servidor que no es accesible a través del dominio.</li><li>Tener acceso a ambos, a uno por red local y a otro por internet.</li></ul><p>Lo primero que había que hacer era recabar los puertos que usaban los distintos servicios del servidor de Minecraft, para así poder redirigirlos desde el servidor principal, pongamos que son estos:</p><ul><li>SSH en el puerto <code>22</code>.</li><li>HTTPS en el puerto <code>443</code>.</li><li>Minecraft en el puerto <code>25565</code>.</li><li>SFTP para Minecraft en el puerto <code>2121</code></li></ul><p>Esos tres puertos serán los que tendremos que redirigir por el túnel SSH. Los puertos <code>25565</code> y <code>2222</code> los podemos redirigir a los mismo en el otro servidor, pero el <code>22</code> y el <code>443</code> no, puesto que está en uso, así que los redirigiremos al <code>2222</code> y al <code>4443</code> respectivamente. Vamos a poner el comando para crear el túnel en un archivo llamado <code>ssh_tunnel_ulp.sh</code>:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/usr/env/bin bash</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ssh</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0.0.0.0:2222:0.0.0.0:22</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0.0.0.0:4443:0.0.0.0:443</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0.0.0.0:25565:0.0.0.0:25565</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -R</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0.0.0.0:2121:0.0.0.0:2121</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -N</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> admin@wupp.dev</span></span></code></pre></div><p>Los parámetros <code>-R</code> lo que indican son los puertos a redirigir y el parámetro <code>-N</code> indica que no queremos iniciar una consola interactiva, solo establecer la conexión y redirigir los puertos. No debemos olvidar hacer ejecutable el archivo con un <code>chmod +x ssh_tunnel_ulp.sh</code></p><p>Ahora, para asegurarnos de que el túnel siempre está funcionando y poder editarlo si hace falta, vamos a crear un servicio. Añadimos el siguiente contenido al archivo <code>/etc/systemd/system/ssh-tunnel.service</code>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=SSH tunnel from UGR</span></span>
<span class="line"><span>After=nss-user-lookup.target</span></span>
<span class="line"><span>Wants=nss-user-lookup.target</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>Type=simple</span></span>
<span class="line"><span>User=admin</span></span>
<span class="line"><span>ExecStart=/bin/bash /home/admin/ssh_tunel_ulp.sh</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=default.target</span></span></code></pre></div><p>Y creamos un temporizador, <code>/etc/systemd/system/ssh-tunnel.timer</code>, para que se reinicie en caso de fallo:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=Run SSH tunnel</span></span>
<span class="line"><span>Requires=ssh-tunnel.service</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Timer]</span></span>
<span class="line"><span>Unit=ssh-tunnel.service</span></span>
<span class="line"><span>OnUnitInactiveSec=1m</span></span>
<span class="line"><span>AccuracySec=1s</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=timers.target</span></span></code></pre></div><p>Por último activamos el servicio con <code>sudo systemctl enable ssh-tunnel.service</code>, como el temporizador con <code>sudo systemctl enable ssh-tunnel.timer</code> e iniciamos el servicio con <code>sudo systemctl start ssh-tunnel</code>.</p><p>Hecho esto debemos tener las siguientes consideraciones para que todo funcione correctamente:</p><ul><li>Los puertos deben estar abiertos en el router y redigiridos al servidor principal.</li><li>Los puertos deben estar permitidos en el firewall del servidor principal.</li><li>Para todos los servicios HTTPS que haya que redirigir, debemos cambiar el <code>proxy_pass</code> a <code>127.0.0.1:4443</code> en la configuración de Nginx.</li><li>Para que podamos acceder a servicios directamente por el puerto <em>(que no sean HTTPS)</em>, debemos de asegurarnos en el comando SSH de haber especificado <code>0.0.0.0</code> al menos para el puerto correspondiente al servidor principal, ya que indica que permita conexiones desde toda las interfaces de red. Además, para que esto sea posible, debemos de tener en <code>/etc/ssh/sshd_config</code> la línea <code>GatewayPorts yes</code> en el servidor principal.</li></ul><h2 id="torneo-de-minecraft" tabindex="-1">Torneo de Minecraft <a class="header-anchor" href="#torneo-de-minecraft" aria-label="Permalink to &quot;Torneo de Minecraft&quot;">​</a></h2><p>Por añadir un poquito de información sobre el torneo de Minecraft para los interesados, consistió en 5 partidas de los Juegos del Hambre alternando entre 3 mapas míticos.</p><p>Los mapas se obtuvieron a través de <a href="https://www.youtube.com/watch?v=IJH3RL2Y4kI&amp;pp=ygUSbWNzZyBtYXBzIGRvd25sb2Fk" target="_blank" rel="noreferrer">este video</a> de YouTube.</p><p>Para las partidas se hizo una <a href="https://github.com/ComicIvans/ulpHungerGames" target="_blank" rel="noreferrer">modificación</a> de <a href="https://github.com/Ayman-Isam/Hunger-Games" target="_blank" rel="noreferrer">este plugin</a>.</p>`,25)]))}const m=a(i,[["render",r]]);export{h as __pageData,m as default};
