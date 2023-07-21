import{_ as s,o as a,c as o,U as n}from"./chunks/framework.4c4a06b8.js";const A=JSON.parse('{"title":"Docker","description":"","frontmatter":{"title":"Docker","lang":"es-ES"},"headers":[],"relativePath":"equipo/docker.md","filePath":"equipo/docker.md","lastUpdated":1689977958000}'),e={name:"equipo/docker.md"},l=n(`<h1 id="docker" tabindex="-1">Docker <a class="header-anchor" href="#docker" aria-label="Permalink to &quot;Docker&quot;">​</a></h1><p>Para gestionar y ejecutar todos los servicios web, utilizaremos el maravilloso Docker. Este hermoso software te permite (a través de un plugin llamado Docker Compose) ejecutar una serie de mini máquinas virtuales desde la terminal en base a un archivo de configuración llamado <code>docker-compose.yml</code>.</p><p>Aquí hay una guía de cómo instalar y configurar todo, pero si te quedas con dudas o quieres ver algo más a fondo, puedes visitar la <a href="https://docs.docker.com/" target="_blank" rel="noreferrer">documentación oficial de Docker</a>.</p><p><strong>Cositas generales</strong>: para seguir esta instalación tienes que ya haber <a href="./sistema-encriptado.html">configurado lo básico del sistema operativo</a> (<code>apt</code> en realidad) y tener una terminal abierta. A parte, cualquier comando de <code>apt</code> se puede sustituir por su correspondiente <code>apt-get</code> (o <code>apt-cache</code>, pero que no vamos a usar realmente).</p><h2 id="tl-dr" tabindex="-1">TL;DR <a class="header-anchor" href="#tl-dr" aria-label="Permalink to &quot;TL;DR&quot;">​</a></h2><p>Si vas con prisa o te da pereza leer, aunque no lo recomiendo para nada, copia y pega lo siguiente en tu terminal, dale a intro y que se haga la magia:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">remove</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-engine</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker.io</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">containerd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">runc</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">mkdir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/apt/keyrings</span></span>
<span class="line"><span style="color:#FFCB6B;">curl</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-fsSL</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">https://download.docker.com/linux/debian/gpg</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">gpg</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dearmor</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-o</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/apt/keyrings/docker.gpg</span></span>
<span class="line"><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">deb [arch=</span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">dpkg</span><span style="color:#C3E88D;"> --print-architecture</span><span style="color:#89DDFF;">)</span><span style="color:#C3E88D;"> signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian </span><span style="color:#A6ACCD;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  </span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">lsb_release</span><span style="color:#C3E88D;"> -cs</span><span style="color:#89DDFF;">)</span><span style="color:#C3E88D;"> stable</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">tee</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/apt/sources.list.d/docker.list</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/dev/null</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">update</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-ce</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-ce-cli</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">containerd.io</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-compose-plugin</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">adduser</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dockeruser</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">usermod</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-aG</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dockeruser</span></span></code></pre></div><h2 id="instalacion" tabindex="-1">Instalación <a class="header-anchor" href="#instalacion" aria-label="Permalink to &quot;Instalación&quot;">​</a></h2><p>Gracias a estar en el inmejorable Debian, usaremos el magnífico comando <code>apt</code>. Nuestros queridos amigos de docker hace un tiempo cambiaron de los repositorios oficiales de apt a unos propios, y por tanto, <strong>si ya tienes alguna versión de docker instalada</strong> (llamadas <code>docker</code>, <code>docker.io</code> o <code>docker-engine</code>) toca eliminar los antiguos paquetes ejecutando lo siguiente:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">remove</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-engine</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker.io</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">containerd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">runc</span></span></code></pre></div><p>Antes de empezar con la instalación de Docker, hay unos pequeños requerimientos que instalar de apt: <code>ca-certificates</code>, <code>curl</code>, <code>gnupg</code>, <code>lsb-release</code>. Así que <strong>asegúrate de tener esto instalado para seguir</strong>.</p><p>Ahora que tenemos esto instalado, vamos a descargar la clave GPG oficial de Docker y configurar el repositorio de APT. Ejecuta los siguientes comandos:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">mkdir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/apt/keyrings</span></span>
<span class="line"><span style="color:#FFCB6B;">curl</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-fsSL</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">https://download.docker.com/linux/debian/gpg</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">gpg</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--dearmor</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-o</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/apt/keyrings/docker.gpg</span></span>
<span class="line"><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">deb [arch=</span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">dpkg</span><span style="color:#C3E88D;"> --print-architecture</span><span style="color:#89DDFF;">)</span><span style="color:#C3E88D;"> signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian </span><span style="color:#A6ACCD;">\\</span></span>
<span class="line"><span style="color:#C3E88D;">  </span><span style="color:#89DDFF;">$(</span><span style="color:#FFCB6B;">lsb_release</span><span style="color:#C3E88D;"> -cs</span><span style="color:#89DDFF;">)</span><span style="color:#C3E88D;"> stable</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">tee</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/etc/apt/sources.list.d/docker.list</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/dev/null</span></span></code></pre></div><p>Y ahora sin más dilación instalemos docker:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">update</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-ce</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-ce-cli</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">containerd.io</span></span></code></pre></div><p>Todo debería de estar bien, pero si eres muy tiquismiqui puedes probar a ejecutar <code>sudo docker run hello-world</code> o mirar la documentación si algo va mal. No debería de haber ningún problema con la compatibilidad de versiones, por lo menos por ahora, pero si llegase a haberlo pues ª.</p><h2 id="docker-compose" tabindex="-1">Docker Compose <a class="header-anchor" href="#docker-compose" aria-label="Permalink to &quot;Docker Compose&quot;">​</a></h2><p>¡Sigamos instalando! La maravilla de Docker Compose es qur vamos a instalarla como un plugin del Docker que ya hemos instalado. Venga que esta es facilita, ejecuta esto y listo:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">apt</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-compose-plugin</span></span></code></pre></div><p>De nuevo, si no confías lo suficiente en <code>apt</code>, comprueba que todo está bien ejecutando <code>docker compose version</code>.</p><h2 id="usuario-para-docker" tabindex="-1">Usuario para Docker <a class="header-anchor" href="#usuario-para-docker" aria-label="Permalink to &quot;Usuario para Docker&quot;">​</a></h2><div class="tip custom-block"><p class="custom-block-title">RELATO</p><p>Cuando estaba en esto, que parecía muy simple, Debian decidió que se iba a poner en mi contra y no funcionar, así que tenéis la historia de como colapsé en <a href="./../relatos/usuario-docker.html">un relato</a> (si veis que la guía y los comandos han cambiado, es por lo ocurrido en ese relato).</p></div><p>Vamos a crear un usuario diferente para ejecutar Docker, así mejoramos ligeramente la seguridad. Para que un usuario pueda ejecutar Docker sin tener que hacer <code>sudo</code> y ejecutarlo como <em>root</em>, hay que añadirlo al grupo <em>docker</em>. Desde tu usuario de administración con <code>sudo</code> aún instalado, vamos a ello entonces:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">adduser</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dockeruser</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># Creación del usuario y su home en /home/dockeruser</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">passwd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dockeruser</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># Tenemos que asignarle una contraseña (recomendación: que sea larga)</span></span>
<span class="line"><span style="color:#FFCB6B;">sudo</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">usermod</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-aG</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dockeruser</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># Añadir el usuario al grupo</span></span></code></pre></div><h2 id="el-docker-compose-yml" tabindex="-1">El <code>docker-compose.yml</code> <a class="header-anchor" href="#el-docker-compose-yml" aria-label="Permalink to &quot;El \`docker-compose.yml\`&quot;">​</a></h2><p>Por fin llegamos al famoso archivo. Este archivo incluye toda la configuración de los servicios a ejecutar con Docker y nos permite cómodamente iniciar todos. En la página de cada servicio se puede encontrar un extracto del contenido del <code>docker-compose.yml</code> para ese servicio concreto. Veamos la estructura del archivo:</p><div class="language-yaml"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F07178;">version</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">3</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">services</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">service</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">test</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">container_name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">test-container</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">links</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">another_db</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">depends_on</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">db</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">restart</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">unless-stopped</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">privileged</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">user</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">uid:gid</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">secrets</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">super_secret_test</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">env_file</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">env/test.env</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">environment</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">...</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">ports</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">127.0.0.1:34665:80</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">expose</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">7080</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">volumes</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/var/app:/app</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">healthcheck</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">test</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">echo hi</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">interval</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">10s</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">logging</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">driver</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">none</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">labels</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">com.centurylinklabs.watchtower.enable=true</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">entrypoint</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">sh</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">command</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nice</span></span></code></pre></div><p>Obviamente no siempre tendremos que usar tantas opciones para un servicio, pero es útil saber las que hay y tener siempre un orden común. Vemos que el archivo se separa en dos partes:</p><ul><li><p><strong><code>version</code>:</strong> algo importará intuyo, pero no creo que mucho así que está la 2 por que lo debí de ver por ahí con el primer servicio que puse y ahí se ha quedado. <strong>Actualización:</strong> Ahora Iván lo ha cambiado a la 3 por el mismo motivo.</p></li><li><p><strong><code>services</code>:</strong> esto es lo importante, aquí declaramos todos los contenedores que se han de crear, en donde se especifican todas las opciones.</p></li></ul><p>Te recomiendo que leas la <a href="https://docs.docker.com/compose/" target="_blank" rel="noreferrer">documentación oficial de Docker Compose</a> para saber cómo funciona exactamente el archivo.</p><p>Lo dicho, según vayamos viendo los diferentes servicios se irán mostrando los extractos del archivo para el correspondiente servicio para que así podáis cómodamente seleccionar que servicios queréis.</p>`,31),p=[l];function c(r,t,i,C,y,D){return a(),o("div",null,p)}const u=s(e,[["render",c]]);export{A as __pageData,u as default};