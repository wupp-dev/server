import{_ as s,o as n,c as a,Q as p}from"./chunks/framework.3d7dc540.js";const m=JSON.parse('{"title":"MinIO para almacenamiento","description":"","frontmatter":{"title":"MinIO para almacenamiento","lang":"es-ES"},"headers":[],"relativePath":"servicios/minio.md","filePath":"servicios/minio.md","lastUpdated":1706299952000}'),l={name:"servicios/minio.md"},o=p(`<h1 id="minio-almacenamiento-s3" tabindex="-1">MinIO - Almacenamiento S3 <a class="header-anchor" href="#minio-almacenamiento-s3" aria-label="Permalink to &quot;MinIO - Almacenamiento S3&quot;">​</a></h1><p>Minio es un servicio de almacenamiento de alto rendimiento compatible con el sistema de almacenamiento <a href="https://en.wikipedia.org/wiki/Amazon_S3" target="_blank" rel="noreferrer">S3</a>. Está pensado para gestionar el almacenamiento de todos los demás servicios y así hacer más fácil su escalabilidad, pero todo eso es para cuando estamos hablando de muchos servicios en muchos ordenadores. ¿Entonces para qué necesitamos Minio en nuestro caso? Pues concretamente para el almacenamiento de copias de seguridad de Minecraft. Así que el resto de la página irá dedicada a configurar Minio para almacenar las copias de seguridad de Minecraft.</p><h2 id="configuracion-de-docker" tabindex="-1">Configuración de Docker <a class="header-anchor" href="#configuracion-de-docker" aria-label="Permalink to &quot;Configuración de Docker&quot;">​</a></h2><p>La configuración de Docker para Minio es relativamente sencilla, en el <code>docker-compose.yml</code> escribimos lo siguiente:</p><div class="language-yml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#85E89D;">version</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#85E89D;">services</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#85E89D;">minio</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">image</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">minio/minio</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">container_name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">minio</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">restart</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">always</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">env_file</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">minio.env</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">ports</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;9000:9000&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># API</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">&quot;9001:9001&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># Console</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">volumes</span><span style="color:#E1E4E8;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">      - </span><span style="color:#9ECBFF;">/var/minio:/data</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#85E89D;">command</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">minio server --address &#39;:9000&#39; --console-address &#39;:9001&#39; /data</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#22863A;">version</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;3&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#22863A;">services</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#22863A;">minio</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">image</span><span style="color:#24292E;">: </span><span style="color:#032F62;">minio/minio</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">container_name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">minio</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">restart</span><span style="color:#24292E;">: </span><span style="color:#032F62;">always</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">env_file</span><span style="color:#24292E;">: </span><span style="color:#032F62;">minio.env</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">ports</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">&quot;9000:9000&quot;</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># API</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">&quot;9001:9001&quot;</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># Console</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">volumes</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">      - </span><span style="color:#032F62;">/var/minio:/data</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#22863A;">command</span><span style="color:#24292E;">: </span><span style="color:#032F62;">minio server --address &#39;:9000&#39; --console-address &#39;:9001&#39; /data</span></span></code></pre></div><p>Y creamos el archivo <code>minio.env</code> con el contenido:</p><div class="language-dotenv vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">dotenv</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">MINIO_ROOT_USER=minio123</span></span>
<span class="line"><span style="color:#e1e4e8;">MINIO_ROOT_PASSWORD=minio456</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">MINIO_ROOT_USER=minio123</span></span>
<span class="line"><span style="color:#24292e;">MINIO_ROOT_PASSWORD=minio456</span></span></code></pre></div><p>Tras iniciar el contenedor con <code>docker compose up -d</code> la consola web será accesible a través de <code>127.0.0.1:9001</code>, pero si estamos conectados por SSH, tendremos que volver a conectarnos añadiendo los argumentos <code>-L 9000:127.0.0.1:9000 -L 9001:127.0.0.1:9001</code> para poder conectarnos poniendo esa dirección en el navegador. Otra opción es hacer el servicio accesible a través de la web.</p><h2 id="nginx-y-subdominio" tabindex="-1">Nginx y subdominio <a class="header-anchor" href="#nginx-y-subdominio" aria-label="Permalink to &quot;Nginx y subdominio&quot;">​</a></h2><p>Como estamos usando el ordenador para Minecraft y nos planteamos usar Minio también en el otro ordenador, creamos los subdominios <code>mcminio.wupp.dev</code> y <code>web.mcminio.wupp.dev</code> para la API y la consola web respectivamente (no funcionará si intentamos usar el mismo subdominio para ambos) y configuramos Nginx en ambos servidores. Empezamos con esta configuración temporal en el servidor principal:</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-2CPRO" id="tab--H-m1bW" checked="checked"><label for="tab--H-m1bW">mcminio.wupp.dev.conf</label><input type="radio" name="group-2CPRO" id="tab-sLSj63u"><label for="tab-sLSj63u">web.mcminio.wupp.dev.conf</label></div><div class="blocks"><div class="language-nginx vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> index </span><span style="color:#E1E4E8;">landing.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri /landing.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_dhparam </span><span style="color:#E1E4E8;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> root </span><span style="color:#24292E;">/var/www/html;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> index </span><span style="color:#24292E;">landing.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri /landing.html;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/letsencrypt/live/wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/letsencrypt/live/wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_dhparam </span><span style="color:#24292E;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span></code></pre></div><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">web.mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> root </span><span style="color:#E1E4E8;">/var/www/html;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> index </span><span style="color:#E1E4E8;">landing.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> try_files </span><span style="color:#E1E4E8;">$uri /landing.html;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_dhparam </span><span style="color:#E1E4E8;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">web.mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> root </span><span style="color:#24292E;">/var/www/html;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> index </span><span style="color:#24292E;">landing.html;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> try_files </span><span style="color:#24292E;">$uri /landing.html;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/letsencrypt/live/wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/letsencrypt/live/wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_dhparam </span><span style="color:#24292E;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span></code></pre></div></div></div><p>Generamos los certificados con cerbot <code>sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d mcminio.wupp.dev</code> y <code>sudo certbot --key-type ecdsa --elliptic-curve secp384r1 --nginx -d web.mcminio.wupp.dev</code> y este se encargará de actualizar la configuración del archivo.</p><p>Ahora tenemos que que poner la configuración final en los dos archivos y en los dos servidores. Para el servidor principal:</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-4bAxe" id="tab-xtNIVZo" checked="checked"><label for="tab-xtNIVZo">mcminio.wupp.dev.conf</label><input type="radio" name="group-4bAxe" id="tab-60IV_k_"><label for="tab-60IV_k_">web.mcminio.wupp.dev.conf</label></div><div class="blocks"><div class="language-nginx vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ignore_invalid_headers </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> client_max_body_size </span><span style="color:#E1E4E8;">0;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> proxy_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> proxy_request_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Permitted-Cross-Domain-Policies </span><span style="color:#9ECBFF;">&quot;none&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Frame-Options </span><span style="color:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-XSS-Protection </span><span style="color:#9ECBFF;">&quot;1; mode=block&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Referrer-Policy </span><span style="color:#9ECBFF;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Permissions-Policy </span><span style="color:#9ECBFF;">&quot;accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_pass </span><span style="color:#E1E4E8;">https://192.168.1.144;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_ssl_session_reuse </span><span style="color:#E1E4E8;">on;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_ssl_verify </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Host $host;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_http_version </span><span style="color:#E1E4E8;">1.1;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Connection </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> chunked_transfer_encoding </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;"> proxy_connect_timeout </span><span style="color:#E1E4E8;">300;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/mcminio.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/mcminio.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_dhparam </span><span style="color:#E1E4E8;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ignore_invalid_headers </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> client_max_body_size </span><span style="color:#24292E;">0;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> proxy_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> proxy_request_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Permitted-Cross-Domain-Policies </span><span style="color:#032F62;">&quot;none&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Frame-Options </span><span style="color:#032F62;">&quot;SAMEORIGIN&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-XSS-Protection </span><span style="color:#032F62;">&quot;1; mode=block&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Referrer-Policy </span><span style="color:#032F62;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Permissions-Policy </span><span style="color:#032F62;">&quot;accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Strict-Transport-Security </span><span style="color:#032F62;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_pass </span><span style="color:#24292E;">https://192.168.1.144;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_ssl_session_reuse </span><span style="color:#24292E;">on;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_ssl_verify </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Host $host;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_http_version </span><span style="color:#24292E;">1.1;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Connection </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> chunked_transfer_encoding </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;"> proxy_connect_timeout </span><span style="color:#24292E;">300;</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/letsencrypt/live/mcminio.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/letsencrypt/live/mcminio.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_dhparam </span><span style="color:#24292E;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span></code></pre></div><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">web.mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ignore_invalid_headers </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> client_max_body_size </span><span style="color:#E1E4E8;">0;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> proxy_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> proxy_request_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Permitted-Cross-Domain-Policies </span><span style="color:#9ECBFF;">&quot;none&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-Frame-Options </span><span style="color:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">X-XSS-Protection </span><span style="color:#9ECBFF;">&quot;1; mode=block&quot;</span><span style="color:#E1E4E8;"> always;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Referrer-Policy </span><span style="color:#9ECBFF;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Permissions-Policy </span><span style="color:#9ECBFF;">&quot;accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> add_header </span><span style="color:#E1E4E8;">Strict-Transport-Security </span><span style="color:#9ECBFF;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_pass </span><span style="color:#E1E4E8;">https://192.168.1.144;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_ssl_session_reuse </span><span style="color:#E1E4E8;">on;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_ssl_verify </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Host $host;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_http_version </span><span style="color:#E1E4E8;">1.1;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Upgrade $http_upgrade;</span></span>
<span class="line"><span style="color:#E1E4E8;">       </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Connection </span><span style="color:#9ECBFF;">&quot;upgrade&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#F97583;"> proxy_connect_timeout </span><span style="color:#E1E4E8;">300;	</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/web.mcminio.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/letsencrypt/live/web.mcminio.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> include </span><span style="color:#E1E4E8;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;"> ssl_dhparam </span><span style="color:#E1E4E8;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">web.mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ignore_invalid_headers </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> client_max_body_size </span><span style="color:#24292E;">0;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> proxy_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> proxy_request_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Permitted-Cross-Domain-Policies </span><span style="color:#032F62;">&quot;none&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Content-Type-Options nosniff always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-Frame-Options </span><span style="color:#032F62;">&quot;SAMEORIGIN&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">X-XSS-Protection </span><span style="color:#032F62;">&quot;1; mode=block&quot;</span><span style="color:#24292E;"> always;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Referrer-Policy </span><span style="color:#032F62;">&quot;strict-origin-when-cross-origin&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Permissions-Policy </span><span style="color:#032F62;">&quot;accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> add_header </span><span style="color:#24292E;">Strict-Transport-Security </span><span style="color:#032F62;">&quot;max-age=63072000; includeSubDomains; preload&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_pass </span><span style="color:#24292E;">https://192.168.1.144;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_ssl_session_reuse </span><span style="color:#24292E;">on;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_ssl_verify </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Host $host;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_http_version </span><span style="color:#24292E;">1.1;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Upgrade $http_upgrade;</span></span>
<span class="line"><span style="color:#24292E;">       </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Connection </span><span style="color:#032F62;">&quot;upgrade&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#D73A49;"> proxy_connect_timeout </span><span style="color:#24292E;">300;	</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/letsencrypt/live/web.mcminio.wupp.dev/fullchain.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/letsencrypt/live/web.mcminio.wupp.dev/privkey.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> include </span><span style="color:#24292E;">/etc/letsencrypt/options-ssl-nginx.conf; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;"> ssl_dhparam </span><span style="color:#24292E;">/etc/letsencrypt/ssl-dhparams.pem; </span><span style="color:#6A737D;"># managed by Certbot</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span></code></pre></div></div></div><p>Y en el servidor secundario podemos usar únicamente un archivo <code>/etc/nginx/conf.d/mcminio.wupp.dev.conf</code>:</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">upstream</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">minio_s3 </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> 127.0.0.1:9000;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">upstream</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">minio_console </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> 127.0.0.1:9001;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">mcminio.wupp.dev;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> ssl_certificate </span><span style="color:#E1E4E8;">/etc/ssl/certs/ssl-cert-snakeoil.pem;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> ssl_certificate_key </span><span style="color:#E1E4E8;">/etc/ssl/private/ssl-cert-snakeoil.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> ignore_invalid_headers </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> client_max_body_size </span><span style="color:#E1E4E8;">0;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> proxy_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> proxy_request_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Host $http_host;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_connect_timeout </span><span style="color:#E1E4E8;">300;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># Default is HTTP/1, keepalive is only enabled in HTTP/1.1</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_http_version </span><span style="color:#E1E4E8;">1.1;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Connection </span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> chunked_transfer_encoding </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_pass </span><span style="color:#E1E4E8;">http://minio_s3; </span><span style="color:#6A737D;"># This uses the upstream directive definition to load balance</span></span>
<span class="line"><span style="color:#E1E4E8;">   }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">server</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> listen </span><span style="color:#E1E4E8;">443 ssl;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> server_name </span><span style="color:#E1E4E8;">web.mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> ignore_invalid_headers </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> client_max_body_size </span><span style="color:#E1E4E8;">0;</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> proxy_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;"> proxy_request_buffering </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#F97583;">location</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">/ </span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Host $http_host;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">X-NginX-Proxy</span><span style="color:#79B8FF;"> true</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># This is necessary to pass the correct IP to be hashed</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> real_ip_header </span><span style="color:#E1E4E8;">X-Real-IP;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_connect_timeout </span><span style="color:#E1E4E8;">300;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;"># To support websocket</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_http_version </span><span style="color:#E1E4E8;">1.1;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Upgrade $http_upgrade;</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_set_header </span><span style="color:#E1E4E8;">Connection </span><span style="color:#9ECBFF;">&quot;upgrade&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> chunked_transfer_encoding </span><span style="color:#E1E4E8;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#F97583;"> proxy_pass </span><span style="color:#E1E4E8;">http://minio_console/; </span><span style="color:#6A737D;"># This uses the upstream directive definition to load balance</span></span>
<span class="line"><span style="color:#E1E4E8;">   }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">upstream</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">minio_s3 </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">server</span><span style="color:#24292E;"> 127.0.0.1:9000;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">upstream</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">minio_console </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">server</span><span style="color:#24292E;"> 127.0.0.1:9001;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">mcminio.wupp.dev;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> ssl_certificate </span><span style="color:#24292E;">/etc/ssl/certs/ssl-cert-snakeoil.pem;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> ssl_certificate_key </span><span style="color:#24292E;">/etc/ssl/private/ssl-cert-snakeoil.key;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> ignore_invalid_headers </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> client_max_body_size </span><span style="color:#24292E;">0;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> proxy_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> proxy_request_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Host $http_host;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_connect_timeout </span><span style="color:#24292E;">300;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># Default is HTTP/1, keepalive is only enabled in HTTP/1.1</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_http_version </span><span style="color:#24292E;">1.1;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Connection </span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> chunked_transfer_encoding </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_pass </span><span style="color:#24292E;">http://minio_s3; </span><span style="color:#6A737D;"># This uses the upstream directive definition to load balance</span></span>
<span class="line"><span style="color:#24292E;">   }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">server</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> listen </span><span style="color:#24292E;">443 ssl;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> server_name </span><span style="color:#24292E;">web.mcminio.wupp.dev;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Allow special characters in headers</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> ignore_invalid_headers </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Allow any size file to be uploaded.</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Set to a value such as 1000m; to restrict file size to a specific value</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> client_max_body_size </span><span style="color:#24292E;">0;</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6A737D;"># Disable buffering</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> proxy_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;"> proxy_request_buffering </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#D73A49;">location</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">/ </span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Host $http_host;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">X-NginX-Proxy</span><span style="color:#005CC5;"> true</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># This is necessary to pass the correct IP to be hashed</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> real_ip_header </span><span style="color:#24292E;">X-Real-IP;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_connect_timeout </span><span style="color:#24292E;">300;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;"># To support websocket</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_http_version </span><span style="color:#24292E;">1.1;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Upgrade $http_upgrade;</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_set_header </span><span style="color:#24292E;">Connection </span><span style="color:#032F62;">&quot;upgrade&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> chunked_transfer_encoding </span><span style="color:#24292E;">off;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#D73A49;"> proxy_pass </span><span style="color:#24292E;">http://minio_console/; </span><span style="color:#6A737D;"># This uses the upstream directive definition to load balance</span></span>
<span class="line"><span style="color:#24292E;">   }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Tendremos también que modificar <code>minio.env</code> para añadir las siguientes lineas:</p><div class="language-dotenv vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">dotenv</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">MINIO_SERVER_URL: &quot;https://mcminio.wupp.dev&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">MINIO_BROWSER_REDIRECT_URL: &quot;https://web.mcminio.wupp.dev/&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">MINIO_SERVER_URL: &quot;https://mcminio.wupp.dev&quot;</span></span>
<span class="line"><span style="color:#24292e;">MINIO_BROWSER_REDIRECT_URL: &quot;https://web.mcminio.wupp.dev/&quot;</span></span></code></pre></div><h2 id="configuracion-de-minio" tabindex="-1">Configuración de Minio <a class="header-anchor" href="#configuracion-de-minio" aria-label="Permalink to &quot;Configuración de Minio&quot;">​</a></h2><p>Conectándonos a la consola web, ya sea por <a href="https://web.mcminio.wupp.dev" target="_blank" rel="noreferrer">https://web.mcminio.wupp.dev</a> o por la redirección de puertos de SSH nos aparecerá una pantalla de inicio de sesión donde introducir el usuario y la contraseña que pusimos en <code>minio.env</code>. Una vez hecho eso podremos pasar a configurar el propio Minio.</p><p>Empezamos creando una política, que definirá los permisos que le daremos al usuario para las copias de seguridad de AMP. Como nombre la política escribimos <code>Minecraft</code> y cambiamos el texto de la política por:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;Version&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;2012-10-17&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;Statement&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;Effect&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;Allow&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;Action&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#9ECBFF;">&quot;s3:*&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            ],</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#79B8FF;">&quot;Resource&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#9ECBFF;">&quot;arn:aws:s3:::amp-*&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                </span><span style="color:#9ECBFF;">&quot;arn:aws:s3:::amp-*/**&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">            ]</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">    ]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;Version&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;2012-10-17&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;Statement&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;Effect&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;Allow&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;Action&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;s3:*&quot;</span></span>
<span class="line"><span style="color:#24292E;">            ],</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#005CC5;">&quot;Resource&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;arn:aws:s3:::amp-*&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#032F62;">&quot;arn:aws:s3:::amp-*/**&quot;</span></span>
<span class="line"><span style="color:#24292E;">            ]</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">    ]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Que dará permisos de edición a todos los <em>buckets</em> que empiecen por <em>amp-</em>. Ahora creamos el usuario <code>ampuser</code> con la contraseña que queramos y le asignamos la política creada.</p><p>A partir de aquí, iremos creando <em>buckets</em> (con la configuración por defecto) cuyo nombre empiece por <em>amp-</em> como <code>amp-ads</code> o <code>amp-proxy</code> para los distintos servidores de Minecraft.</p><p>Cuando hayamos creado los buckets, vamos al apartado de usuarios, a <code>ampuser</code> y en <em>Service Accounts</em> creamos una clave de acceso y la guardamos, ya que será, junto con la clave secreta, las que usaremos para configurar las copias de seguridad dentro de AMP.</p>`,25),e=[o];function c(t,r,y,E,i,d){return n(),a("div",null,e)}const _=s(l,[["render",c]]);export{m as __pageData,_ as default};
