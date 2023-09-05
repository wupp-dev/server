import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.3d7dc540.js";const F=JSON.parse('{"title":"Nextcloud","description":"","frontmatter":{"title":"Nextcloud","lang":"es-ES"},"headers":[],"relativePath":"servicios/nextcloud.md","filePath":"servicios/nextcloud.md","lastUpdated":1693957077000}'),p={name:"servicios/nextcloud.md"},o=l(`<h1 id="nextcloud-almacenamiento" tabindex="-1">Nextcloud - Almacenamiento <a class="header-anchor" href="#nextcloud-almacenamiento" aria-label="Permalink to &quot;Nextcloud - Almacenamiento&quot;">​</a></h1><p>Por fin llegó el momento de poner en marcha el primer servicio, y qué mejor elección que <a href="https://nextcloud.com/es/" target="_blank" rel="noreferrer">Nextcloud</a>. Antes de empezar asegúrate de que tienes un subdominio creado para Nextcloud como <code>cloud.wupp.dev</code>.</p><h2 id="configurando-docker" tabindex="-1">Configurando Docker <a class="header-anchor" href="#configurando-docker" aria-label="Permalink to &quot;Configurando Docker&quot;">​</a></h2><p>Empezamos escribiendo en el <code>docker-compose.yml</code> todo lo necesario para tener una instalación funcional de Nextcloud:</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">nextcloud-db</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">postgres</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">POSTGRES_USER=nextcloud</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">POSTGRES_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">POSTGRES_DB=nextcloud</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">/var/lib/nextcloud/postgresql/data:/var/lib/postgresql:Z</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">nextcloud-redis</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">redis</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">command</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">redis-server --requirepass pwd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">nextcloud</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nextcloud:fpm</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">nextcloud-db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">nextcloud-redis</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">environment</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">POSTGRES_HOST=nextcloud-db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">NEXTCLOUD_TRUSTED_DOMAINS=cloud.wupp.dev</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">REDIS_HOST=nextcloud-redis</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">REDIS_HOST_PORT=6379</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">REDIS_HOST_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">PHP_MEMORY_LIMIT=50G</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">PHP_UPLOAD_LIMIT=50G</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">9000:9000</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">/var/www/nextcloud:/var/www/html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">nextcloud-cron</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nextcloud:fpm</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">depends_on</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">nextcloud-db</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">nextcloud-redis</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">/var/www/nextcloud:/var/www/html</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">entrypoint</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">/cron.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">nextcloud-imaginary</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">nextcloud/aio-imaginary:latest</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">9090:9000</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">command</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">-concurrency 20 -enable-url-source -return-size</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">cap_add</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">SYS_NICE</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#22863A;">services</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">nextcloud-db</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">image</span><span style="color:#24292E;">: </span><span style="color:#032F62;">postgres</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">restart</span><span style="color:#24292E;">: </span><span style="color:#032F62;">always</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">environment</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">POSTGRES_USER=nextcloud</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">POSTGRES_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">POSTGRES_DB=nextcloud</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">volumes</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">/var/lib/nextcloud/postgresql/data:/var/lib/postgresql:Z</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">nextcloud-redis</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">image</span><span style="color:#24292E;">: </span><span style="color:#032F62;">redis</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">command</span><span style="color:#24292E;">: </span><span style="color:#032F62;">redis-server --requirepass pwd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">nextcloud</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">image</span><span style="color:#24292E;">: </span><span style="color:#032F62;">nextcloud:fpm</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">restart</span><span style="color:#24292E;">: </span><span style="color:#032F62;">always</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">depends_on</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">nextcloud-db</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">nextcloud-redis</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">environment</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">POSTGRES_HOST=nextcloud-db</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">NEXTCLOUD_TRUSTED_DOMAINS=cloud.wupp.dev</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">REDIS_HOST=nextcloud-redis</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">REDIS_HOST_PORT=6379</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">REDIS_HOST_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">PHP_MEMORY_LIMIT=50G</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">PHP_UPLOAD_LIMIT=50G</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">ports</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">9000:9000</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">volumes</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">/var/www/nextcloud:/var/www/html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">nextcloud-cron</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">image</span><span style="color:#24292E;">: </span><span style="color:#032F62;">nextcloud:fpm</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">restart</span><span style="color:#24292E;">: </span><span style="color:#032F62;">always</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">depends_on</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">nextcloud-db</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">nextcloud-redis</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">volumes</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">/var/www/nextcloud:/var/www/html</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">entrypoint</span><span style="color:#24292E;">: </span><span style="color:#032F62;">/cron.sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">nextcloud-imaginary</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">image</span><span style="color:#24292E;">: </span><span style="color:#032F62;">nextcloud/aio-imaginary:latest</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">restart</span><span style="color:#24292E;">: </span><span style="color:#032F62;">always</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">ports</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">9090:9000</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">command</span><span style="color:#24292E;">: </span><span style="color:#032F62;">-concurrency 20 -enable-url-source -return-size</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">cap_add</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">SYS_NICE</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Hemos decidido usar PostgreSQL como base de datos para Nextcloud por preferencia personal, pero se puede configurar sin mucha distinción con MariaDB, que es de hecho como empezarmos a usarlo.</p></div><p>Lo primero que cabe destacar es que en este nuevo archivo, los usuarios y las contraseñas están directamente escritos. Esto no es una buena práctica de seguridad, pero para la guía lo vamos a dejar así, dejando claro que a la hora de implementarlo deberían usarse <a href="https://docs.docker.com/engine/swarm/secrets/" target="_blank" rel="noreferrer">secretos de docker</a>. Una excepción que hemos hecho a esto es redis, que por unos cuantos problemas que nos ha dado lo hemos dejado sin contraseña, aunque se puede usar con contraseña siempre que esté escrita en el <code>docker-compose.yml</code> en el comando de iniciación de redis (y se le pase a Nextcloud).</p><p>Vamos a analizar un poco el documento, concretamente los servicios que hay declarados:</p><ul><li><code>nextcloud-db</code>: Esta será la base de datos de Nextcloud. En <code>environment</code> simplemente se establece un usuario, contraseña y base de datos a crear, que serán para Nextcloud. Por último, <code>volumes</code> permite que los datos guardados se conserven aunque el servicio se reinicie y la <code>Z</code> la puso Lucas en por verla en la documentación, <a href="https://docs.docker.com/storage/bind-mounts/#configure-the-selinux-label" target="_blank" rel="noreferrer">aquí</a> se explica lo que hace.</li><li><code>nextcloud-redis</code>: Es otra base de datos pero que en este caso Nextcloud utilizará para almacenar archivos en caché y así tener un mejor rendimiento. También se usará para gestionar los inicios de sesión. En <code>command</code> se puede especificar la contraseña.</li><li><code>nextcloud</code>: Tiene el mapeo de puertos <code>9000:9000</code> para que Nginx pueda redirigir las solicitudes PHP dentro del contenedor. Además, <code>depends_on</code> indica que tanto <code>nextcloud-db</code> como <code>nextcloud-redis</code> deben estar funcionando para que Nextcloud lo haga. Por último se hace igual que en <code>nextcloud-db</code> un mapeo de carpetas para conservar los datos y se establecen las variables de entorno para configurar Nextcloud.</li><li><code>nextcloud-cron</code>: Este contenedor es peculiar. Es necesario solo si planeas que Nextcloud lo vaya a usar más de una persona, para reducir la carga de trabajo del servidor. Lo único que hace es ejecutar puntualmente una tarea de <code>cron</code> dentro de los archivos de Nextcloud para hacer labores de mantenimiento y limpieza de forma automática.</li><li><code>nextcloud-imaginary</code>: La imagen actualizada por Nextcloud de <a href="https://github.com/h2non/imaginary" target="_blank" rel="noreferrer">Imaginary</a>, un microservicio encargado de generar las vistas previas de las imágenes subidas a Nextcloud. No es estrictamente necesario, pero es más rápido que la aplicación que tiene Nextcloud para ello.</li></ul><p>Para que Nextcloud empiece a ejecutarse (aunque aun no podamos acceder) simplemente escribimos <code>docker compose up -d</code>.</p><h2 id="configurando-nginx" tabindex="-1">Configurando Nginx <a class="header-anchor" href="#configurando-nginx" aria-label="Permalink to &quot;Configurando Nginx&quot;">​</a></h2><p>Con el <code>docker-compose.yml</code> configurado, podemos pasar a configurar el subdominio para Nextcloud en Nginx. La mayor parte de la configuración la hemos tomado de <a href="https://github.com/nextcloud/docker/blob/master/.examples/docker-compose/insecure/postgres/fpm/web/nginx.conf" target="_blank" rel="noreferrer">este ejemplo</a>, pero añadiendo HTTPS y cambiando unas cuantas cosas. Creamos el archivo <code>/etc/nginx/conf.d/cloud.wupp.dev.conf</code> con el contenido:</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">upstream</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">nextcloud </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> 127.0.0.1:9000;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Set the \`immutable\` cache control options only for assets with a cache busting \`v\` argument</span></span>
<span class="line"><span style="color:#F97583;">map</span><span style="color:#E1E4E8;"> $</span><span style="color:#FFAB70;">arg_v</span><span style="color:#E1E4E8;"> $asset_immutable {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#79B8FF;"> default</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;immutable&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">cloud.wupp.dev;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">http2</span><span style="color:#E1E4E8;"> on;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># set max upload size</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> client_max_body_size </span><span style="color:#E1E4E8;">50G;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># unlimited download speed</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> limit_rate </span><span style="color:#E1E4E8;">0;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> fastcgi_buffers </span><span style="color:#E1E4E8;">64 </span><span style="color:#79B8FF;">4K</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Enable gzip but do not remove ETag headers</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> gzip </span><span style="color:#E1E4E8;">on;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> gzip_vary </span><span style="color:#E1E4E8;">on;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> gzip_comp_level </span><span style="color:#E1E4E8;">4;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> gzip_min_length </span><span style="color:#E1E4E8;">256;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> gzip_proxied </span><span style="color:#E1E4E8;">expired no-cache no-store private no_last_modified no_etag auth;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> gzip_types </span><span style="color:#E1E4E8;">application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/wasm application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># The settings allows you to optimize the HTTP2 bandwitdth.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># See https://blog.cloudflare.com/delivering-http-2-upload-speed-improvements/</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># for tunning hints</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> client_body_buffer_size </span><span style="color:#E1E4E8;">512k;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># HTTP response headers</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Download-Options </span><span style="color:#9ECBFF;">&quot;noopen&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Robots-Tag </span><span style="color:#9ECBFF;">&quot;noindex, nofollow&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Frame-Options </span><span style="color:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-XSS-Protection </span><span style="color:#9ECBFF;">&quot;1; mode=block&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Referrer-Policy </span><span style="color:#9ECBFF;">&quot;no-referrer&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Permitted-Cross-Domain-Policies </span><span style="color:#9ECBFF;">&quot;none&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Add .mjs as a file extension for javascript</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Either include it in the default mime.types list</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># or include you can include that list explicitly and add the file extension</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># only for Nextcloud like below:</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">mime.types;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">types</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#79B8FF;">application/javascript</span><span style="color:#E1E4E8;"> mjs;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Path to the root of your installation</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> root </span><span style="color:#E1E4E8;">/var/www/nextcloud;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Specify how to handle directories -- specifying \`/index.php$request_uri\`</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># here as the fallback means that Nginx always exhibits the desired behaviour</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># when a client requests a path that corresponds to a directory that exists</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># on the server. In particular, if that directory contains an index.php file,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># that file is correctly served; if it doesn&#39;t, then the request is passed to</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># the front-end controller. This consistent behaviour means that we don&#39;t need</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># to specify custom rules for certain paths (e.g. images and other assets,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># \`/updater\`, \`/ocm-provider\`, \`/ocs-provider\`), and thus</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># \`try_files $uri $uri/ /index.php$request_uri\`</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># always provides the desired behaviour.</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> index </span><span style="color:#E1E4E8;">index.php index.html /index.php$request_uri;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Rule borrowed from \`.htaccess\` to handle Microsoft DAV clients</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> ( $http_user_agent </span><span style="color:#F97583;">~ </span><span style="color:#E1E4E8;">^DavClnt ) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">302</span><span style="color:#E1E4E8;"> /remote.php/webdav/$is_args$args;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">/robots.txt </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> allow </span><span style="color:#E1E4E8;">all;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> log_not_found </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> access_log </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Make a regex exception for \`/.well-known\` so that clients can still</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># access it despite the existence of the regex rule</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># \`location ~ /(\\.|autotest|...)\` which would otherwise handle requests</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># for \`/.well-known\`.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">^~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">/.well-known </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># The rules in this block are an adaptation of the rules</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># in \`.htaccess\` that concern \`/.well-known\`.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">/.well-known/carddav </span><span style="color:#E1E4E8;">{ </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">301</span><span style="color:#E1E4E8;"> /remote.php/dav/; }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">/.well-known/caldav  </span><span style="color:#E1E4E8;">{ </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">301</span><span style="color:#E1E4E8;"> /remote.php/dav/; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/.well-known/acme-challenge    </span><span style="color:#E1E4E8;">{</span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri $uri/ </span><span style="color:#79B8FF;">=404</span><span style="color:#E1E4E8;">; }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/.well-known/pki-validation    </span><span style="color:#E1E4E8;">{</span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri $uri/ </span><span style="color:#79B8FF;">=404</span><span style="color:#E1E4E8;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># Let Nextcloud&#39;s API for \`/.well-known\` URIs handle all other</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># requests by passing them to the front-end controller.</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">301</span><span style="color:#E1E4E8;"> /index.php$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Rules borrowed from \`.htaccess\` to hide certain paths from clients</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  </span><span style="color:#E1E4E8;">{ </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">404</span><span style="color:#E1E4E8;">; }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">^/(?:\\.|autotest|occ|issue|indie|db_|console)                </span><span style="color:#E1E4E8;">{ </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">404</span><span style="color:#E1E4E8;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Ensure this block, which passes PHP files to the PHP process, is above the blocks</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># which handle static assets (as seen below). If this block is not declared first,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># then Nginx will encounter an infinite rewriting loop when it prepends \`/index.php\`</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># to the URI, resulting in a HTTP 500 error response.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">\\.php(?:$|/) </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;"># Required for legacy support</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">rewrite</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">^/(?!index|remote|public|cron|core\\/ajax\\/update|status|ocs\\/v[12]|updater\\/.+|oc[ms]-provider\\/.+|.+\\/richdocumentscode\\/proxy) /index.php$</span><span style="color:#E1E4E8;">request_uri;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_split_path_info </span><span style="color:#DBEDFF;">^(.+?\\.php)(/.*)$</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> set </span><span style="color:#E1E4E8;">$path_info $fastcgi_path_info;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$fastcgi_script_name </span><span style="color:#79B8FF;">=404</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">fastcgi_params;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_param </span><span style="color:#E1E4E8;">SCRIPT_FILENAME /var/www/html/$fastcgi_script_name;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_param </span><span style="color:#E1E4E8;">PATH_INFO $path_info;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_param </span><span style="color:#E1E4E8;">HTTPS</span><span style="color:#79B8FF;"> on</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_param </span><span style="color:#E1E4E8;">modHeadersAvailable</span><span style="color:#79B8FF;"> true</span><span style="color:#E1E4E8;">;         </span><span style="color:#6A737D;"># Avoid sending the security headers twice</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_param </span><span style="color:#E1E4E8;">front_controller_active</span><span style="color:#79B8FF;"> true</span><span style="color:#E1E4E8;">;     </span><span style="color:#6A737D;"># Enable pretty urls</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_pass </span><span style="color:#E1E4E8;">nextcloud;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_intercept_errors </span><span style="color:#E1E4E8;">on;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_request_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_max_temp_file_size </span><span style="color:#E1E4E8;">0;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> fastcgi_read_timeout </span><span style="color:#E1E4E8;">600;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">\\.(?:css|js|svg|gif|png|jpg|ico|wasm|tflite|map)$ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri /index.php$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> expires </span><span style="color:#E1E4E8;">6M;         </span><span style="color:#6A737D;"># Cache-Control policy borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> access_log </span><span style="color:#E1E4E8;">off;     </span><span style="color:#6A737D;"># Optional: Don&#39;t log access to assets</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">\\.wasm$ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">           </span><span style="color:#F97583;"> default_type </span><span style="color:#E1E4E8;">application/wasm;</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">~</span><span style="color:#E1E4E8;"> </span><span style="color:#DBEDFF;">\\.woff2?$ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri /index.php$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> expires </span><span style="color:#E1E4E8;">7d;         </span><span style="color:#6A737D;"># Cache-Control policy borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> access_log </span><span style="color:#E1E4E8;">off;     </span><span style="color:#6A737D;"># Optional: Don&#39;t log access to assets</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Rule borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/remote </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">301</span><span style="color:#E1E4E8;"> /remote.php$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri $uri/ /index.php$request_uri;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/cloud.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/cloud.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_dhparam </span><span style="color:#E1E4E8;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">upstream</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">nextcloud </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">server</span><span style="color:#24292E;"> 127.0.0.1:9000;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># Set the \`immutable\` cache control options only for assets with a cache busting \`v\` argument</span></span>
<span class="line"><span style="color:#D73A49;">map</span><span style="color:#24292E;"> $</span><span style="color:#E36209;">arg_v</span><span style="color:#24292E;"> $asset_immutable {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#005CC5;"> default</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;immutable&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">cloud.wupp.dev;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">http2</span><span style="color:#24292E;"> on;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># set max upload size</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> client_max_body_size </span><span style="color:#24292E;">50G;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># unlimited download speed</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> limit_rate </span><span style="color:#24292E;">0;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> fastcgi_buffers </span><span style="color:#24292E;">64 </span><span style="color:#005CC5;">4K</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Enable gzip but do not remove ETag headers</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> gzip </span><span style="color:#24292E;">on;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> gzip_vary </span><span style="color:#24292E;">on;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> gzip_comp_level </span><span style="color:#24292E;">4;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> gzip_min_length </span><span style="color:#24292E;">256;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> gzip_proxied </span><span style="color:#24292E;">expired no-cache no-store private no_last_modified no_etag auth;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> gzip_types </span><span style="color:#24292E;">application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/wasm application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># The settings allows you to optimize the HTTP2 bandwitdth.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># See https://blog.cloudflare.com/delivering-http-2-upload-speed-improvements/</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># for tunning hints</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> client_body_buffer_size </span><span style="color:#24292E;">512k;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># HTTP response headers</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Download-Options </span><span style="color:#032F62;">&quot;noopen&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Robots-Tag </span><span style="color:#032F62;">&quot;noindex, nofollow&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Frame-Options </span><span style="color:#032F62;">&quot;SAMEORIGIN&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-XSS-Protection </span><span style="color:#032F62;">&quot;1; mode=block&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Referrer-Policy </span><span style="color:#032F62;">&quot;no-referrer&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Permitted-Cross-Domain-Policies </span><span style="color:#032F62;">&quot;none&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Strict-Transport-Security </span><span style="color:#032F62;">&quot;max-age=31536000; includeSubDomains; preload&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Add .mjs as a file extension for javascript</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Either include it in the default mime.types list</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># or include you can include that list explicitly and add the file extension</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># only for Nextcloud like below:</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">mime.types;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">types</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">application/javascript</span><span style="color:#24292E;"> mjs;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Path to the root of your installation</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> root </span><span style="color:#24292E;">/var/www/nextcloud;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Specify how to handle directories -- specifying \`/index.php$request_uri\`</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># here as the fallback means that Nginx always exhibits the desired behaviour</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># when a client requests a path that corresponds to a directory that exists</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># on the server. In particular, if that directory contains an index.php file,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># that file is correctly served; if it doesn&#39;t, then the request is passed to</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># the front-end controller. This consistent behaviour means that we don&#39;t need</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># to specify custom rules for certain paths (e.g. images and other assets,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># \`/updater\`, \`/ocm-provider\`, \`/ocs-provider\`), and thus</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># \`try_files $uri $uri/ /index.php$request_uri\`</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># always provides the desired behaviour.</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> index </span><span style="color:#24292E;">index.php index.html /index.php$request_uri;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Rule borrowed from \`.htaccess\` to handle Microsoft DAV clients</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> ( $http_user_agent </span><span style="color:#D73A49;">~ </span><span style="color:#24292E;">^DavClnt ) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">302</span><span style="color:#24292E;"> /remote.php/webdav/$is_args$args;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/robots.txt </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> allow </span><span style="color:#24292E;">all;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> log_not_found </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> access_log </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Make a regex exception for \`/.well-known\` so that clients can still</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># access it despite the existence of the regex rule</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># \`location ~ /(\\.|autotest|...)\` which would otherwise handle requests</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># for \`/.well-known\`.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">^~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/.well-known </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># The rules in this block are an adaptation of the rules</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># in \`.htaccess\` that concern \`/.well-known\`.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/.well-known/carddav </span><span style="color:#24292E;">{ </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">301</span><span style="color:#24292E;"> /remote.php/dav/; }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/.well-known/caldav  </span><span style="color:#24292E;">{ </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">301</span><span style="color:#24292E;"> /remote.php/dav/; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/.well-known/acme-challenge    </span><span style="color:#24292E;">{</span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri $uri/ </span><span style="color:#005CC5;">=404</span><span style="color:#24292E;">; }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/.well-known/pki-validation    </span><span style="color:#24292E;">{</span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri $uri/ </span><span style="color:#005CC5;">=404</span><span style="color:#24292E;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># Let Nextcloud&#39;s API for \`/.well-known\` URIs handle all other</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># requests by passing them to the front-end controller.</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">301</span><span style="color:#24292E;"> /index.php$request_uri;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Rules borrowed from \`.htaccess\` to hide certain paths from clients</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  </span><span style="color:#24292E;">{ </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">404</span><span style="color:#24292E;">; }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">^/(?:\\.|autotest|occ|issue|indie|db_|console)                </span><span style="color:#24292E;">{ </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">404</span><span style="color:#24292E;">; }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Ensure this block, which passes PHP files to the PHP process, is above the blocks</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># which handle static assets (as seen below). If this block is not declared first,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># then Nginx will encounter an infinite rewriting loop when it prepends \`/index.php\`</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># to the URI, resulting in a HTTP 500 error response.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\\.php(?:$|/) </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;"># Required for legacy support</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">rewrite</span><span style="color:#24292E;"> </span><span style="color:#032F62;">^/(?!index|remote|public|cron|core\\/ajax\\/update|status|ocs\\/v[12]|updater\\/.+|oc[ms]-provider\\/.+|.+\\/richdocumentscode\\/proxy) /index.php$</span><span style="color:#24292E;">request_uri;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_split_path_info </span><span style="color:#032F62;">^(.+?\\.php)(/.*)$</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> set </span><span style="color:#24292E;">$path_info $fastcgi_path_info;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$fastcgi_script_name </span><span style="color:#005CC5;">=404</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">fastcgi_params;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_param </span><span style="color:#24292E;">SCRIPT_FILENAME /var/www/html/$fastcgi_script_name;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_param </span><span style="color:#24292E;">PATH_INFO $path_info;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_param </span><span style="color:#24292E;">HTTPS</span><span style="color:#005CC5;"> on</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_param </span><span style="color:#24292E;">modHeadersAvailable</span><span style="color:#005CC5;"> true</span><span style="color:#24292E;">;         </span><span style="color:#6A737D;"># Avoid sending the security headers twice</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_param </span><span style="color:#24292E;">front_controller_active</span><span style="color:#005CC5;"> true</span><span style="color:#24292E;">;     </span><span style="color:#6A737D;"># Enable pretty urls</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_pass </span><span style="color:#24292E;">nextcloud;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_intercept_errors </span><span style="color:#24292E;">on;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_request_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_max_temp_file_size </span><span style="color:#24292E;">0;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> fastcgi_read_timeout </span><span style="color:#24292E;">600;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\\.(?:css|js|svg|gif|png|jpg|ico|wasm|tflite|map)$ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri /index.php$request_uri;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> expires </span><span style="color:#24292E;">6M;         </span><span style="color:#6A737D;"># Cache-Control policy borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> access_log </span><span style="color:#24292E;">off;     </span><span style="color:#6A737D;"># Optional: Don&#39;t log access to assets</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\\.wasm$ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">           </span><span style="color:#D73A49;"> default_type </span><span style="color:#24292E;">application/wasm;</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">~</span><span style="color:#24292E;"> </span><span style="color:#032F62;">\\.woff2?$ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri /index.php$request_uri;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> expires </span><span style="color:#24292E;">7d;         </span><span style="color:#6A737D;"># Cache-Control policy borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> access_log </span><span style="color:#24292E;">off;     </span><span style="color:#6A737D;"># Optional: Don&#39;t log access to assets</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Rule borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/remote </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">301</span><span style="color:#24292E;"> /remote.php$request_uri;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri $uri/ /index.php$request_uri;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/letsencrypt/live/cloud.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/letsencrypt/live/cloud.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_dhparam </span><span style="color:#24292E;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Como puntos a destacar, se ha puesto un límite de cuerpo de 50GB para permitir que se suban archivos de hasta 50G en consonancia con la configuración de <code>docker-compose.yml</code>. Además, se ha quitado el límite de velocidad de transferencia.</p><p>También se vuelven a especificar todas las cabeceras HTTP a pesar de que las pusimos en el bloque <code>http</code> de Nginx, donde está contenido nuestro bloque actual. ¿Por qué? Porque las cabeceras HTTP definidas en un bloque superior solo se heredan al siguiente si en ese no hay ninguna cabecera definida y, en este caso, había que definir sí o sí cabeceras nuevas, así que hay que añadir las que se quieran conservar.</p><p>Por último (y este cambio es puñetero), como PHP se está ejecutando dentro de Docker, para PHP los archivos no están en <code>/var/www/nextcloud</code>, están en <code>/var/www/html</code>, así que hay que cambiarlo en <code>fastcgi_param SCRIPT_FILENAME</code> o, de lo contrario, el servidor solo devolverá un mensaje de &quot;File not found&quot;.</p><p>¡Ojo! Que no se nos olvide generar el certificado HTTPS para el subdominio <code>cloud.wupp.dev</code>. Después, comprobamos que el archivo está bien con <code>sudo nginx -t</code> y si lo está, lo recargamos con <code>sudo nginx -s reload</code>.</p><h2 id="configurando-nextcloud" tabindex="-1">Configurando Nextcloud <a class="header-anchor" href="#configurando-nextcloud" aria-label="Permalink to &quot;Configurando Nextcloud&quot;">​</a></h2><p>Una vez hecho esto, deberíamos de poder acceder a <code>cloud.wupp.dev</code> y nos aparecería la pantalla de configuración inicial de Nexcloud, donde debemos elegir un nombre de usuario y contraseña para la cuenta de administrador. Para la base de datos, elegimos &quot;MySQL/MariaDB&quot; y ponemos el nombre de usuario, contraseña y la base de datos para Nextcloud que pusimos en <code>docker-compose.yml</code>. Por último, para la dirección escribimos <code>nextcloud-db:3306</code>.</p><p>Ya habiendo instalado Nextcloud, podemos navegar por los ajustes y configurarlo, aunque también podemos hacerlo modificando los archivos de configuración como <code>/var/www/nextcloud/config/config.php</code>. Por ejemplo, podemos añadir estas líneas al final:</p><div class="language-php vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">php</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#9ECBFF;">&#39;default_language&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;es&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#9ECBFF;">&#39;default_locale&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;es_ES&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#9ECBFF;">&#39;default_phone_region&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;ES&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#9ECBFF;">&#39;bulkupload.enabled&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#9ECBFF;">&#39;enabledPreviewProviders&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> [</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">TXT&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">MarkDown&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">PDF&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">MSOfficeDoc&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">JPEG&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">PNG&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">GIF&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">BMP&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">XBitmap&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">MP3&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">HEIC&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Movie&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">MKV&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">MP4&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">AVI&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">MP3&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">OpenDocument&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Krita&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;OC</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Preview</span><span style="color:#79B8FF;">\\\\</span><span style="color:#9ECBFF;">Imaginary&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#9ECBFF;">&#39;preview_imaginary_url&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;http://127.0.0.1:9090&#39;</span><span style="color:#E1E4E8;">,</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#032F62;">&#39;default_language&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;es&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#032F62;">&#39;default_locale&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;es_ES&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#032F62;">&#39;default_phone_region&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;ES&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#032F62;">&#39;bulkupload.enabled&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#032F62;">&#39;enabledPreviewProviders&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> [</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">TXT&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">MarkDown&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">PDF&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">MSOfficeDoc&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">JPEG&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">PNG&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">GIF&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">BMP&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">XBitmap&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">MP3&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">HEIC&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Movie&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">MKV&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">MP4&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">AVI&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">MP3&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">OpenDocument&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Krita&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;OC</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Preview</span><span style="color:#005CC5;">\\\\</span><span style="color:#032F62;">Imaginary&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#032F62;">&#39;preview_imaginary_url&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;http://127.0.0.1:9090&#39;</span><span style="color:#24292E;">,</span></span></code></pre></div><p>Concretamente, la línea <code>&#39;bulkupload.enabled&#39; =&gt; false,</code> ayuda a solucionar un <a href="https://github.com/nextcloud/desktop/issues/5094" target="_blank" rel="noreferrer">bug</a> que hay actualmente con el cliente de Nextcloud al tener la velocidad de subida ilimitada. Y las últimas líneas son la configuración de Imaginary.</p><p>A parte de eso, como Nextcloud funciona con PHP, nos conviene modificar también la configuración de PHP. Y esto puede ser un poco lioso, porque en la imagen de docker que tenemos hay muchos archivos que modifican la configuración de PHP. Además, esos archivos no los podemos modificar directamente porque al reiniciar el contenedor se borran. La solución es crear un nuevo archivo con las opciones que queremos cambiar y copiarlo dentro del contenedor de docker cada vez que se inicie.</p><p>Para empezar creamos el archivo <code>/var/www/nextcloud/manual-php.ini</code> y ponemos el siguiente contenido:</p><div class="language-ini vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ini</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">; Manual configuration for PHP</span></span>
<span class="line"><span style="color:#F97583;">max_input_time</span><span style="color:#E1E4E8;"> = -1</span></span>
<span class="line"><span style="color:#F97583;">max_execution_time</span><span style="color:#E1E4E8;"> = 172800</span></span>
<span class="line"><span style="color:#F97583;">max_file_uploads</span><span style="color:#E1E4E8;"> = 10000</span></span>
<span class="line"><span style="color:#F97583;">max_input_nesting_level</span><span style="color:#E1E4E8;"> = 128</span></span>
<span class="line"><span style="color:#F97583;">max_input_vars</span><span style="color:#E1E4E8;"> = 10000</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">; Manual configuration for PHP</span></span>
<span class="line"><span style="color:#D73A49;">max_input_time</span><span style="color:#24292E;"> = -1</span></span>
<span class="line"><span style="color:#D73A49;">max_execution_time</span><span style="color:#24292E;"> = 172800</span></span>
<span class="line"><span style="color:#D73A49;">max_file_uploads</span><span style="color:#24292E;"> = 10000</span></span>
<span class="line"><span style="color:#D73A49;">max_input_nesting_level</span><span style="color:#24292E;"> = 128</span></span>
<span class="line"><span style="color:#D73A49;">max_input_vars</span><span style="color:#24292E;"> = 10000</span></span></code></pre></div><p>Estos valores se pueden ajustar al gusto de cada uno. Después, solo tendremos que añadir a <code>docker-compose.yml</code> la línea <code>/var/www/nextcloud/manual-php.ini:/usr/local/etc/php/conf.d/manual-php.ini</code> como volumen de Nextcloud y reiniciar los contenedores de docker.</p><p>Finalmente, podemos añadir un poco más de seguridad siguiendo <a href="https://docs.nextcloud.com/server/latest/admin_manual/installation/harden_server.html#setup-fail2ban" target="_blank" rel="noreferrer">estas recomendaciones</a> del manual de Nextcloud.</p>`,27),e=[o];function c(t,r,E,y,i,d){return n(),a("div",null,e)}const m=s(p,[["render",c]]);export{F as __pageData,m as default};
