import{_ as s,c as a,o as i,a1 as n}from"./chunks/framework.Bxmcb2_I.js";const g=JSON.parse('{"title":"Resolución de dominios en initramfs","description":"","frontmatter":{"title":"Resolución de dominios en initramfs","lang":"es-ES"},"headers":[],"relativePath":"relatos/dns-initramfs.md","filePath":"relatos/dns-initramfs.md","lastUpdated":1716105125000}'),e={name:"relatos/dns-initramfs.md"},l=n(`<h1 id="resolucion-de-dominios-en-initramfs" tabindex="-1">Resolución de dominios en initramfs <a class="header-anchor" href="#resolucion-de-dominios-en-initramfs" aria-label="Permalink to &quot;Resolución de dominios en initramfs&quot;">​</a></h1><p>De cuando Iván tuvo que enfrentarse a esta tarea sin apenas información en la web.</p><h2 id="contexto-historico" tabindex="-1">Contexto histórico <a class="header-anchor" href="#contexto-historico" aria-label="Permalink to &quot;Contexto histórico&quot;">​</a></h2><p><strong>6 de septiembre de 2023.</strong> Hasta entonces, el domino <code>wupp.dev</code> lo gestionábamos desde <a href="https://freedns.afraid.org/" target="_blank" rel="noreferrer">FreeDNS</a>, pero alcanzamos el límite de 25 subdominios y decidimos gestionarlos desde <a href="https://www.namecheap.com/" target="_blank" rel="noreferrer">Namecheap</a>, que era donde teníamos comprado el dominio. La transición fue bastante sencilla excepto por una cosa, la actualización automática de la IP en el dominio y sus subdominios.</p><p>FreeDNS tenía un enlace para actualizar la IP muy cómo que era <code>freedns.afraid.org/dynamic/update.php?id</code>, lo que nos permitía hacer un apaño a no poder resolver dominios en <code>initramfs</code> con esta tarea de <code>crontab</code>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>1,6,11,16,21,26,31,36,41,46,51,56 * * * * sleep 46 ; wget --no-check-certificate -O - &quot;https://$(nslookup freedns.afraid.org 1.1.1.1 | awk &#39;/^Address: / { print $2 }&#39;)/dynamic/update.php?id&quot; &gt; /tmp/freedns_@_wupp_dev.log 2&gt;&amp;1 &amp;</span></span></code></pre></div><p>Esto básicamente lo que hacía era sustituir <code>freedns.afraid.org</code> por la IP a la que apunta.</p><p>El problema al cambiar a Namecheap fue que ese truco dejó de servir, así que hubo que poner a funcionar la resolución de dominos.</p><h2 id="primeros-intentos" tabindex="-1">Primeros intentos <a class="header-anchor" href="#primeros-intentos" aria-label="Permalink to &quot;Primeros intentos&quot;">​</a></h2><p>Al principio intenté buscar una alternativa más sencilla como especificarle a <code>wget</code> directamente los servidores DNS que usar, pero no existe ninguna opción para hacer eso.</p><p>Después probé a usar <code>curl</code>, para lo que hubo que crear un nuevo archivo <code>/usr/share/initramfs-tools/hooks/curl</code>:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/sh -e</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PREREQS</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">case</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> $1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;">        prereqs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">)</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PREREQS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">esac</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/initramfs-tools/hook-functions</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">copy_exec</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/bin/curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /bin</span></span></code></pre></div><p>Y ejecutar:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> chmod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +x</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/initramfs-tools/hooks/curl</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update-initramfs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span></span></code></pre></div><p>Esto fue porque <code>curl</code> sí que tiene una opción para especificar los servidores DNS que utilizar, pero tampoco funcionó.</p><h2 id="el-final" tabindex="-1">El final <a class="header-anchor" href="#el-final" aria-label="Permalink to &quot;El final&quot;">​</a></h2><p>Por los foros leí que alguna persona había conseguido hacer funcionar la resolución copiando archivos que faltaban de librerías. También me encontré con la herramienta <code>strace</code> que te ayuda a investigar los errores en los comandos.</p><p>Añadí <code>strace</code> a <code>initramfs</code> como añadí <code>curl</code>, es decir, con el archivo <code>/usr/share/initramfs-tools/hooks/strace</code>:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/sh -e</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PREREQS</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">case</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> $1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;">        prereqs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">)</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PREREQS</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">esac</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/initramfs-tools/hook-functions</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">copy_exec</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/bin/strace</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /bin</span></span></code></pre></div><p>Y ejecutando:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> chmod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +x</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/initramfs-tools/hooks/strace</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update-initramfs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span></span></code></pre></div><p>Hecho esto me puse a investigar los archivos que buscaba (y no encontraba) <code>wget</code> con el comando <code>strace wget google.com</code> y esta es la lista de todos los archivos que buscaba:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>/etc/resolv.conf</span></span>
<span class="line"><span>/etc/host.conf</span></span>
<span class="line"><span>/etc/hosts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/lib/x86_64-linux-gnu/tls//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu/tls//libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu/tls/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu/tls/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu//libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64-linux-gnu/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu/tls//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu/tls//libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu/tls/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu/tls/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu//libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64-linux-gnu/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/tls//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/tls//libnss_dns.so.2</span></span>
<span class="line"><span>/lib/tls/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/tls/libnss_dns.so.2</span></span>
<span class="line"><span>/lib//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/lib/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/tls//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/tls//libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/tls/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/tls/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib//x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib//libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/x86_64/libnss_dns.so.2</span></span>
<span class="line"><span>/usr/lib/libnss_dns.so.2</span></span></code></pre></div><p>La separación viene porque realmente todos los archivos del segundo bloque son el mismo pero en distintas posibles localizaciones, así que solo tenía que encontrar cuál de todos ellos era el que estaba en el ordenador cuando estaba encendido.</p><p>Tras encontrarlo, creé el archivo <code>/usr/share/initramfs-tools/hooks/dns</code> con:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/sh -e</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;prereqs&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ]; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">then</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fi</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/initramfs-tools/hook-functions</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cp</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/lib/x86_64-linux-gnu/libnss_dns.so.2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $DESTDIR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/usr/lib/x86_64-linux-gnu/libnss_dns.so.2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cp</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/resolv.conf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $DESTDIR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/resolv.conf</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cp</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/host.conf</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $DESTDIR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/host.conf</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cp</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/hosts</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $DESTDIR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/etc/hosts</span></span></code></pre></div><p>Y ejecuté nuevamente:</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> chmod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +x</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/initramfs-tools/hooks/dns</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update-initramfs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span></span></code></pre></div><p>Con esto ya funcionaba la resolución de dominios en <code>initramfs</code> y solo faltaba adaptar la tarea de <code>crontab</code> al nuevo enlace que era del tipo <code>https://dynamicdns.park-your-domain.com/update?host=@&amp;domain=wupp.dev&amp;password=passwd&amp;ip=ip</code>. Este nuevo enlace tenía un problema y era que había que especificarle la nueva IP para el dominio, pero se pudo resolver gracias a la gran cantidad de páginas que permiten conseguir la IP pública (y especialmente a aquellas que te dan la IPv4) con un comando un poquito más complicado <code>wget --no-check-certificate -qO- ipinfo.io/ip -O - | xargs -I {} wget --no-check-certificate -qO- &quot;https://dynamicdns.park-your-domain.com/update?host=@&amp;domain=wupp.dev&amp;password=passwd&amp;ip={}&quot;</code>.</p>`,29),p=[l];function t(o,h,r,d,c,k){return i(),a("div",null,p)}const F=s(e,[["render",t]]);export{g as __pageData,F as default};