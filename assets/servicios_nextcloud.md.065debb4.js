import{_ as s,c as n,o as a,O as e}from"./chunks/framework.023724bb.js";const D=JSON.parse('{"title":"Nextcloud","description":"","frontmatter":{"title":"Nextcloud","lang":"es-ES"},"headers":[],"relativePath":"servicios/nextcloud.md","lastUpdated":1681601062000}'),l={name:"servicios/nextcloud.md"},o=e(`<h1 id="nextcloud-almacenamiento" tabindex="-1">Nextcloud - Almacenamiento <a class="header-anchor" href="#nextcloud-almacenamiento" aria-label="Permalink to &quot;Nextcloud - Almacenamiento&quot;">​</a></h1><p>Por fin llegó el momento de poner en marcha el primer servicio, y qué mejor elección que <a href="https://nextcloud.com/es/" target="_blank" rel="noreferrer">Nextcloud</a>. Antes de empezar asegúrate de que tienes un subdominio creado para Nextcloud como <code>cloud.wupp.dev</code>.</p><h2 id="configurando-docker" tabindex="-1">Configurando Docker <a class="header-anchor" href="#configurando-docker" aria-label="Permalink to &quot;Configurando Docker&quot;">​</a></h2><p>Partimos del documento <code>docker-compose.yml</code> que nos quedó en la sección de <a href="./../equipo/docker.html">Docker</a> al que vamos a hacer unos cuantos cambios que ahora comentaré:</p><div class="language-yml"><button title="Copy Code" class="copy"></button><span class="lang">yml</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#F07178;">version</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">3</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">services</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">db</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">mariadb</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">container_name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">db</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">restart</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">always</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">environment</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_ROOT_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_USER=nextcloud</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_DATABASE=nextcloud</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">volumes</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/var/lib/mysql:/var/lib/mysql</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">command</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">redis</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">redis</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">container_name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">redis</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">command</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">redis-server --requirepass pwd</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">nextcloud</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nextcloud:fpm</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">container_name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nextcloud</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">restart</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">always</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">depends_on</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">db</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">redis</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">environment</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MYSQL_HOST=db</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">NEXTCLOUD_TRUSTED_DOMAINS=cloud.wupp.dev</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">REDIS_HOST=redis</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">REDIS_HOST_PORT=6379</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">REDIS_HOST_PASSWORD=pwd</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">PHP_MEMORY_LIMIT=50G</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">PHP_UPLOAD_LIMIT=50G</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">ports</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">9000:9000</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">volumes</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/var/www/nextcloud:/var/www/html</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">cron</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nextcloud:fpm</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">container_name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">cron</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">restart</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">always</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">depends_on</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">db</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">redis</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">volumes</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/var/www/nextcloud:/var/www/html</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">entrypoint</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/cron.sh</span></span></code></pre></div><p>Lo primero que cabe destacar es que en este nuevo archivo, los usuarios y las contraseñas están directamente escritos. Esto no es una buena práctica de seguridad, pero para la guía lo vamos a dejar así, dejando claro que a la hora de implementarlo deberían usarse <a href="https://docs.docker.com/engine/swarm/secrets/" target="_blank" rel="noreferrer">secretos de docker</a>. Una excepción que hemos hecho a esto es redis, que por unos cuantos problemas que nos ha dado lo hemos dejado sin contraseña.</p><p>Vamos a analizar un poco el documento, concretamente los servicios que hay declarados:</p><ul><li><code>db</code>: Esta será la base de datos de Nextcloud, la línea que hay en <code>command</code> tiene opciones para un mejor rendimiento y escalabilidad. Luego en <code>environment</code> simplemente se establece la contraseña del usuario root y un usuario, contraseña y base de datos a crear, que serán Nextcloud. Por último, <code>volumes</code> permite que los datos guardados se conserven aunque el servicio se reinicie.</li><li><code>redis</code>: Es otra base de datos pero que en este caso Nextcloud utilizará para almacenar archivos en caché y así tener un mejor rendimiento. También se usará para gestionar los inicios de sesión. En <code>command</code> se especifica la contraseña.</li><li><code>nextcloud</code>: Tiene el mapeo de puertos <code>9000:9000</code> para que Nginx pueda redirigir las solicitudes PHP dentro del contenedor. Además, <code>depends_on</code> indica que tanto <code>db</code> como <code>redis</code> deben estar funcionando para que Nextcloud lo haga. Por último se hace igual que en <code>db</code> un mapeo de carpetas para conservar los datos y se establecen las variables de entorno para configurar Nextcloud.</li><li><code>cron</code>: Este contenedor es peculiar. Es necesario solo si planeas que Nextcloud lo vaya a usar más de una persona, para reducir la carga de trabajo del servidor. Lo único que hace es ejecutar puntualmente una tarea de <code>cron</code> dentro de los archivos de Nextcloud para hacer labores de mantenimiento y limpieza de forma automática.</li></ul><p>Para que Nextcloud empiece a ejecutarse (aunque aun no podamos acceder) simplemente escribimos <code>docker compose up -d</code>.</p><h2 id="configurando-nginx" tabindex="-1">Configurando Nginx <a class="header-anchor" href="#configurando-nginx" aria-label="Permalink to &quot;Configurando Nginx&quot;">​</a></h2><p>Con el <code>docker-compose.yml</code> configurado, podemos pasar a configurar el subdominio para Nextcloud en Nginx. La mayor parte de la configuración la hemos tomado de <a href="https://github.com/nextcloud/docker/blob/master/.examples/docker-compose/insecure/postgres/fpm/web/nginx.conf" target="_blank" rel="noreferrer">este ejemplo</a>, pero añadiendo HTTPS y cambiando unas cuantas cosas. Creamos el archivo <code>/etc/nginx/conf.d/cloud.wupp.dev.conf</code> con el contenido:</p><div class="language-conf"><button title="Copy Code" class="copy"></button><span class="lang">conf</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">upstream nextcloud {</span></span>
<span class="line"><span style="color:#A6ACCD;">    server 127.0.0.1:9000;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"># Set the \`immutable\` cache control options only for assets with a cache busting \`v\` argument</span></span>
<span class="line"><span style="color:#A6ACCD;">map $arg_v $asset_immutable {</span></span>
<span class="line"><span style="color:#A6ACCD;">    &quot;&quot; &quot;&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">    default &quot;immutable&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">server {</span></span>
<span class="line"><span style="color:#A6ACCD;">    server_name cloud.wupp.dev;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # set max upload size</span></span>
<span class="line"><span style="color:#A6ACCD;">    client_max_body_size 50G;</span></span>
<span class="line"><span style="color:#A6ACCD;">    # unlimited download speed</span></span>
<span class="line"><span style="color:#A6ACCD;">    limit_rate 0;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    fastcgi_buffers 64 4K;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Enable gzip but do not remove ETag headers</span></span>
<span class="line"><span style="color:#A6ACCD;">    gzip on;</span></span>
<span class="line"><span style="color:#A6ACCD;">    gzip_vary on;</span></span>
<span class="line"><span style="color:#A6ACCD;">    gzip_comp_level 4;</span></span>
<span class="line"><span style="color:#A6ACCD;">    gzip_min_length 256;</span></span>
<span class="line"><span style="color:#A6ACCD;">    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;</span></span>
<span class="line"><span style="color:#A6ACCD;">    gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/wasm application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # The settings allows you to optimize the HTTP2 bandwitdth.</span></span>
<span class="line"><span style="color:#A6ACCD;">    # See https://blog.cloudflare.com/delivering-http-2-upload-speed-improvements/</span></span>
<span class="line"><span style="color:#A6ACCD;">    # for tunning hints</span></span>
<span class="line"><span style="color:#A6ACCD;">    client_body_buffer_size 512k;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # HTTP response headers</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header X-Download-Options &quot;noopen&quot; always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header X-Robots-Tag &quot;noindex, nofollow&quot; always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header X-Frame-Options &quot;SAMEORIGIN&quot; always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header X-XSS-Protection &quot;1; mode=block&quot; always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header Referrer-Policy &quot;no-referrer&quot; always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header X-Permitted-Cross-Domain-Policies &quot;none&quot; always;</span></span>
<span class="line"><span style="color:#A6ACCD;">    add_header Strict-Transport-Security &quot;max-age=31536000; includeSubDomains; preload&quot;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Add .mjs as a file extension for javascript</span></span>
<span class="line"><span style="color:#A6ACCD;">    # Either include it in the default mime.types list</span></span>
<span class="line"><span style="color:#A6ACCD;">    # or include you can include that list explicitly and add the file extension</span></span>
<span class="line"><span style="color:#A6ACCD;">    # only for Nextcloud like below:</span></span>
<span class="line"><span style="color:#A6ACCD;">    include mime.types;</span></span>
<span class="line"><span style="color:#A6ACCD;">    types {</span></span>
<span class="line"><span style="color:#A6ACCD;">        application/javascript mjs;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Path to the root of your installation</span></span>
<span class="line"><span style="color:#A6ACCD;">    root /var/www/nextcloud;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Specify how to handle directories -- specifying \`/index.php$request_uri\`</span></span>
<span class="line"><span style="color:#A6ACCD;">    # here as the fallback means that Nginx always exhibits the desired behaviour</span></span>
<span class="line"><span style="color:#A6ACCD;">    # when a client requests a path that corresponds to a directory that exists</span></span>
<span class="line"><span style="color:#A6ACCD;">    # on the server. In particular, if that directory contains an index.php file,</span></span>
<span class="line"><span style="color:#A6ACCD;">    # that file is correctly served; if it doesn&#39;t, then the request is passed to</span></span>
<span class="line"><span style="color:#A6ACCD;">    # the front-end controller. This consistent behaviour means that we don&#39;t need</span></span>
<span class="line"><span style="color:#A6ACCD;">    # to specify custom rules for certain paths (e.g. images and other assets,</span></span>
<span class="line"><span style="color:#A6ACCD;">    # \`/updater\`, \`/ocm-provider\`, \`/ocs-provider\`), and thus</span></span>
<span class="line"><span style="color:#A6ACCD;">    # \`try_files $uri $uri/ /index.php$request_uri\`</span></span>
<span class="line"><span style="color:#A6ACCD;">    # always provides the desired behaviour.</span></span>
<span class="line"><span style="color:#A6ACCD;">    index index.php index.html /index.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Rule borrowed from \`.htaccess\` to handle Microsoft DAV clients</span></span>
<span class="line"><span style="color:#A6ACCD;">    location = / {</span></span>
<span class="line"><span style="color:#A6ACCD;">        if ( $http_user_agent ~ ^DavClnt ) {</span></span>
<span class="line"><span style="color:#A6ACCD;">            return 302 /remote.php/webdav/$is_args$args;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    location = /robots.txt {</span></span>
<span class="line"><span style="color:#A6ACCD;">        allow all;</span></span>
<span class="line"><span style="color:#A6ACCD;">        log_not_found off;</span></span>
<span class="line"><span style="color:#A6ACCD;">        access_log off;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Make a regex exception for \`/.well-known\` so that clients can still</span></span>
<span class="line"><span style="color:#A6ACCD;">    # access it despite the existence of the regex rule</span></span>
<span class="line"><span style="color:#A6ACCD;">    # \`location ~ /(\\.|autotest|...)\` which would otherwise handle requests</span></span>
<span class="line"><span style="color:#A6ACCD;">    # for \`/.well-known\`.</span></span>
<span class="line"><span style="color:#A6ACCD;">    location ^~ /.well-known {</span></span>
<span class="line"><span style="color:#A6ACCD;">        # The rules in this block are an adaptation of the rules</span></span>
<span class="line"><span style="color:#A6ACCD;">        # in \`.htaccess\` that concern \`/.well-known\`.</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        location = /.well-known/carddav { return 301 /remote.php/dav/; }</span></span>
<span class="line"><span style="color:#A6ACCD;">        location = /.well-known/caldav  { return 301 /remote.php/dav/; }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        location /.well-known/acme-challenge    { try_files $uri $uri/ =404; }</span></span>
<span class="line"><span style="color:#A6ACCD;">        location /.well-known/pki-validation    { try_files $uri $uri/ =404; }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        # Let Nextcloud&#39;s API for \`/.well-known\` URIs handle all other</span></span>
<span class="line"><span style="color:#A6ACCD;">        # requests by passing them to the front-end controller.</span></span>
<span class="line"><span style="color:#A6ACCD;">        return 301 /index.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Rules borrowed from \`.htaccess\` to hide certain paths from clients</span></span>
<span class="line"><span style="color:#A6ACCD;">    location ~ ^/(?:build|tests|config|lib|3rdparty|templates|data)(?:$|/)  { return 404; }</span></span>
<span class="line"><span style="color:#A6ACCD;">    location ~ ^/(?:\\.|autotest|occ|issue|indie|db_|console)                { return 404; }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Ensure this block, which passes PHP files to the PHP process, is above the blocks</span></span>
<span class="line"><span style="color:#A6ACCD;">    # which handle static assets (as seen below). If this block is not declared first,</span></span>
<span class="line"><span style="color:#A6ACCD;">    # then Nginx will encounter an infinite rewriting loop when it prepends \`/index.php\`</span></span>
<span class="line"><span style="color:#A6ACCD;">    # to the URI, resulting in a HTTP 500 error response.</span></span>
<span class="line"><span style="color:#A6ACCD;">    location ~ \\.php(?:$|/) {</span></span>
<span class="line"><span style="color:#A6ACCD;">        # Required for legacy support</span></span>
<span class="line"><span style="color:#A6ACCD;">        rewrite ^/(?!index|remote|public|cron|core\\/ajax\\/update|status|ocs\\/v[12]|updater\\/.+|oc[ms]-provider\\/.+|.+\\/richdocumentscode\\/proxy) /index.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_split_path_info ^(.+?\\.php)(/.*)$;</span></span>
<span class="line"><span style="color:#A6ACCD;">        set $path_info $fastcgi_path_info;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        try_files $fastcgi_script_name =404;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        include fastcgi_params;</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_param SCRIPT_FILENAME /var/www/html/$fastcgi_script_name;</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_param PATH_INFO $path_info;</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_param HTTPS on;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_param modHeadersAvailable true;         # Avoid sending the security headers twice</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_param front_controller_active true;     # Enable pretty urls</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_pass nextcloud;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_intercept_errors on;</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_request_buffering off;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_max_temp_file_size 0;</span></span>
<span class="line"><span style="color:#A6ACCD;">        fastcgi_read_timeout 600;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    location ~ \\.(?:css|js|svg|gif|png|jpg|ico|wasm|tflite|map)$ {</span></span>
<span class="line"><span style="color:#A6ACCD;">        try_files $uri /index.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;">        expires 6M;         # Cache-Control policy borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#A6ACCD;">        access_log off;     # Optional: Don&#39;t log access to assets</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">        location ~ \\.wasm$ {</span></span>
<span class="line"><span style="color:#A6ACCD;">            default_type application/wasm;</span></span>
<span class="line"><span style="color:#A6ACCD;">        }</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    location ~ \\.woff2?$ {</span></span>
<span class="line"><span style="color:#A6ACCD;">        try_files $uri /index.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;">        expires 7d;         # Cache-Control policy borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#A6ACCD;">        access_log off;     # Optional: Don&#39;t log access to assets</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    # Rule borrowed from \`.htaccess\`</span></span>
<span class="line"><span style="color:#A6ACCD;">    location /remote {</span></span>
<span class="line"><span style="color:#A6ACCD;">        return 301 /remote.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    location / {</span></span>
<span class="line"><span style="color:#A6ACCD;">        try_files $uri $uri/ /index.php$request_uri;</span></span>
<span class="line"><span style="color:#A6ACCD;">    }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    listen 443 ssl; # managed by Certbot</span></span>
<span class="line"><span style="color:#A6ACCD;">    ssl_certificate /etc/letsencrypt/live/cloud.wupp.dev/fullchain.pem; # managed by Certbot</span></span>
<span class="line"><span style="color:#A6ACCD;">    ssl_certificate_key /etc/letsencrypt/live/cloud.wupp.dev/privkey.pem; # managed by Certbot</span></span>
<span class="line"><span style="color:#A6ACCD;">    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot</span></span>
<span class="line"><span style="color:#A6ACCD;">    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>Como puntos a destacar, se ha puesto un límite de cuerpo de 50GB para permitir que se suban archivos de hasta 50G en consonancia con la configuración de <code>docker-compose.yml</code>. Además, se ha quitado el límite de velocidad de transferencia.</p><p>También se vuelven a especificar todas las cabeceras HTTP a pesar de que las pusimos en el bloque <code>http</code> de Nginx, donde está contenido nuestro bloque actual. ¿Por qué? Porque las cabeceras HTTP definidas en un bloque superior solo se heredan al siguiente si en ese no hay ninguna cabecera definida y, en este caso, había que definir sí o sí cabeceras nuevas, así que hay que añadir las que se quieran conservar.</p><p>Por último (y este cambio es puñetero), como PHP se está ejecutando dentro de Docker, para PHP los archivos no están en <code>/var/www/nextcloud</code>, están en <code>/var/www/html</code>, así que hay que cambiarlo en <code>fastcgi_param SCRIPT_FILENAME</code> o, de lo contrario, el servidor solo devolverá un mensaje de &quot;File not found&quot;.</p><p>¡Ojo! Que no se nos olvide generar el certificado HTTPS para el subdominio <code>cloud.wupp.dev</code>. Después, comprobamos que el archivo está bien con <code>sudo nginx -t</code> y si lo está, lo recargamos con <code>sudo nginx -s reload</code>.</p><h2 id="configurando-nextcloud" tabindex="-1">Configurando Nextcloud <a class="header-anchor" href="#configurando-nextcloud" aria-label="Permalink to &quot;Configurando Nextcloud&quot;">​</a></h2><p>Una vez hecho esto, deberíamos de poder acceder a <code>cloud.wupp.dev</code> y nos aparecería la pantalla de configuración inicial de Nexcloud, donde debemos elegir un nombre de usuario y contraseña para la cuenta de administrador. Para la base de datos, elegimos &quot;MySQL/MariaDB&quot; y ponemos el nombre de usuario, contraseña y la base de datos para Nextcloud que pusimos en <code>docker-compose.yml</code>. Por último, para la dirección escribimos <code>db:3306</code>.</p><p>Ya habiendo instalado Nextcloud, podemos navegar por los ajustes y configurarlo, aunque también podemos hacerlo modificando los archivos de configuración como <code>/var/www/nextcloud/config/config.php</code>. Por ejemplo, podemos añadir estas líneas al final:</p><div class="language-php"><button title="Copy Code" class="copy"></button><span class="lang">php</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">default_language</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">es</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">default_locale</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">es_ES</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">default_phone_region</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">ES</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span></code></pre></div><p>A parte de eso, como Nextcloud funciona con PHP, nos conviene modificar también la configuración de PHP. Y esto puede ser un poco lioso, porque en la imagen de docker que tenemos hay muchos archivos que modifican la configuración de PHP. Además, esos archivos no los podemos modificar directamente porque al reiniciar docker se borran. La solución es crear un nuevo archivo con las opciones que queremos cambiar y copiarlo dentro del contenedor de docker cada vez que se inicie.</p><p>Para empezar creamos el archivo <code>/var/www/nextcloud/manual-php.ini</code> y ponemos el siguiente contenido:</p><div class="language-ini"><button title="Copy Code" class="copy"></button><span class="lang">ini</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">; Manual configuration for PHP</span></span>
<span class="line"><span style="color:#F07178;">max_input_time</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> -1</span></span>
<span class="line"><span style="color:#F07178;">max_execution_time</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> 172800</span></span>
<span class="line"><span style="color:#F07178;">max_file_uploads</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> 10000</span></span>
<span class="line"><span style="color:#F07178;">max_input_nesting_level</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> 128</span></span>
<span class="line"><span style="color:#F07178;">max_input_vars</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> 10000</span></span></code></pre></div><p>Estos valores se pueden ajustar al gusto de cada uno. Después, solo tendremos que añadir a <code>docker-compose.yml</code> la línea <code>/var/www/nextcloud/manual-php.ini:/usr/local/etc/php/conf.d/manual-php.ini</code> como volumen de Nextcloud y reiniciar los contenedores de docker.</p><p>Finalmente, podemos añadir un poco más de seguridad siguiendo <a href="https://docs.nextcloud.com/server/latest/admin_manual/installation/harden_server.html#setup-fail2ban" target="_blank" rel="noreferrer">estas recomendaciones</a> del manual de Nextcloud.</p>`,25),p=[o];function c(t,r,i,d,C,A){return a(),n("div",null,p)}const u=s(l,[["render",c]]);export{D as __pageData,u as default};
