import{_ as s,c as e,o as a,a as o}from"./app.c3ea2832.js";const y=JSON.parse('{"title":"Configurando MariaDB con Docker","description":"","frontmatter":{"title":"Configurando MariaDB con Docker","lang":"es-ES"},"headers":[{"level":2,"title":"Contenido de docker-compose.yaml","slug":"contenido-de-docker-compose-yaml","link":"#contenido-de-docker-compose-yaml","children":[]},{"level":2,"title":"Gesti\xF3n de secretos: secrets","slug":"gestion-de-secretos-secrets","link":"#gestion-de-secretos-secrets","children":[]},{"level":2,"title":"Variables de entorno","slug":"variables-de-entorno","link":"#variables-de-entorno","children":[]},{"level":2,"title":"El contenedor en s\xED: services > db","slug":"el-contenedor-en-si-services-db","link":"#el-contenedor-en-si-services-db","children":[]},{"level":2,"title":"Gestionando MariaDB con Adminer","slug":"gestionando-mariadb-con-adminer","link":"#gestionando-mariadb-con-adminer","children":[]}],"relativePath":"equipo/mariadb-docker.md","lastUpdated":1663514401000}'),n={name:"equipo/mariadb-docker.md"},l=o(`<h1 id="configurando-mariadb-con-docker" tabindex="-1">Configurando MariaDB con Docker <a class="header-anchor" href="#configurando-mariadb-con-docker" aria-hidden="true">#</a></h1><p>Para empezar a ver c\xF3mo funciona el <code>docker-compose.yaml</code> y probar docker, vamos a configurar un contenedor de MariaDB, que servir\xE1 como base de datos para los diferentes servicios que soporten MySQL.</p><h2 id="contenido-de-docker-compose-yaml" tabindex="-1">Contenido de <code>docker-compose.yaml</code> <a class="header-anchor" href="#contenido-de-docker-compose-yaml" aria-hidden="true">#</a></h2><p>Aqu\xED est\xE1 el contenido a a\xF1adir al <code>docker-compose.yaml</code>:</p><div class="language-yaml"><button class="copy"></button><span class="lang">yaml</span><pre><code><span class="line"><span style="color:#F07178;">secrets</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">mariadb_root_password</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">external</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">nextcloud_db_user</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">external</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">nextcloud_db_password</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">external</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">services</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">db</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">mariadb:10.5</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">restart</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">always</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">volumes</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">./db:/var/lib/mysql</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">secrets</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">mariadb_root_password</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nextcloud_db_user</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">nextcloud_db_password</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">environment</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_ROOT_PASSWORD_FILE=/run/secrets/mariadb_root_password</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_USER_FILE=/run/secrets/nextcloud_db_user</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_PASSWORD_FILE=/run/secrets/nextcloud_db_password</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">MARIADB_DATABASE=\${NEXTCLOUD_DB_NAME:?nextcloud database name required}</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">\xBFPOR QU\xC9 APARECE NEXTCLOUD?</p><p>La imagen del contenedor Docker de MariaDB nos permite crear una base de datos al iniciar el contenedor por primera vez. En este caso, como uno de los servicios principales del servidor es Nextcloud, hemos configurado aqu\xED el contenedor para que cree la base de datos y el usuario para Nextcloud al iniciarse, y para m\xE1s bases de datos las crearemos posteriormente antes de iniciar el otro servicio.</p></div><h2 id="gestion-de-secretos-secrets" tabindex="-1">Gesti\xF3n de secretos: <code>secrets</code> <a class="header-anchor" href="#gestion-de-secretos-secrets" aria-hidden="true">#</a></h2><p>Esta secci\xF3n del <code>docker-compose.yaml</code> nos permite declarar los llamados <em>secrets</em> (o secretos por su traducci\xF3n al castellano). Estos son cadenas de texto que se crean con <code>docker secrets</code> o a trav\xE9s de un archivo, que Docker gestiona de una manera segura y nos sirve para reemplazar las variables de entorno que contengan datos m\xE1s sensibles como contrase\xF1as. Aunque estos secretos se pueden crear a trav\xE9s de un archivo indic\xE1ndolo en el propio <code>docker-compose.yaml</code>, realizarlo de tal forma requiere tener la contrase\xF1a en texto plano en el sistema, por tanto vamos a crear los secretos a trav\xE9s de la terminal.</p><p>En el archivo <code>docker-compose.yaml</code> tenemos que declarar el nombre de los <em>secrets</em> que vamos a usar en <code>secrets</code>. Estos se declaran indicando su nombre como miembro de <code>secrets</code>, i.e. a\xF1adiendo el nombre indentado debajo de <code>secrets</code> como se puede ver anteriormente y, dado que los vamos a crear manualmente con la CLI de Docker, tenemos que indicar <code>external: true</code> para cada uno.</p><div class="warning custom-block"><p class="custom-block-title">IMPORTANTE</p><p>La versi\xF3n que se indica con la clave <code>version</code> en el archivo ha de ser 3 o superior para que los <em>secrets</em> funcionen</p></div><p>Procedamos ahora a crear los diferentes <em>secrets</em> que se necesitan. En los siguientes comandos, sustituye el texto entre <code>&lt;&gt;</code> (e.g. <code>&lt;root_password&gt;</code>) con lo que desees (que recomendamos que sea generado aleatoriamente) y gu\xE1rdalo en un sitio seguro y que no vayas a perder:</p><div class="language-bash"><button class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#A6ACCD;">$ </span><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">&lt;root_password&gt;</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> docker secret create mariadb_root_password -</span></span>
<span class="line"><span style="color:#A6ACCD;">$ </span><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">&lt;nextcloud_password&gt;</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> docker secret create nextcloud_db_password -</span></span>
<span class="line"><span style="color:#A6ACCD;">$ </span><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">&lt;nextcloud_user&gt;</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> docker secret create nextcloud_db_user -</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">SUGERENCIA</p><p>Dado que estas contrase\xF1as permiten acceder a todos los datos de Nextcloud y la de <em>root</em> a <strong>TODOS los datos de TODAS las bases de datos</strong>, te recomendamos que sean bastante seguras, de m\xE1s de 20 caracteres m\xEDnimo. El usuario de la base de datos tambi\xE9n es recomendable generarlo aleatoriamente para as\xED proveer m\xE1s seguridad evitando que si alguien gana acceso a la contrase\xF1a pueda acceder</p></div><h2 id="variables-de-entorno" tabindex="-1">Variables de entorno <a class="header-anchor" href="#variables-de-entorno" aria-hidden="true">#</a></h2><p>A lo largo del <code>docker-compose.yaml</code> vamos a utilizar m\xFAltiples variables de entorno para interpolar datos que no resultan tan privados, como el nombre de la base de datos. Las variables de entorno se cargan directamente de un archivo <code>.env</code> que se sit\xFAe junto al <code>docker-compose.yaml</code>, aunque puede personalizarse para cada servicio usando la opci\xF3n <code>env_file</code>. En nuestro caso, tenemos un <a href="https://github.com/ComicIvans/server/blob/main/home/dockeruser/docker-compose.yml" target="_blank" rel="noreferrer">archivo de entorno de ejemplo en el repositorio</a>. Para proseguir, vamos a descargar este archivo y renombrarlo a <code>.env</code>:</p><div class="language-bash"><button class="copy"></button><span class="lang">bash</span><pre><code><span class="line"><span style="color:#676E95;"># Sit\xFAate donde tengas el archivo docker-compose, que deber\xEDa de ser /home/&lt;usuario-docker&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">$ curl https://raw.githubusercontent.com/ComicIvans/server/main/home/dockeruser/.env.example -o .env</span></span>
<span class="line"></span></code></pre></div><div class="danger custom-block"><p class="custom-block-title">RECORDATORIO IMPORTANTE</p><p>El archivo <code>.env.example</code> es de ejemplo y p\xFAblico para cualquiera, as\xED que antes de proseguir edita el archivo con tu editor favorito para que no tenga los mismos valores que el de ejemplo.</p></div><p>En la siguiente secci\xF3n indicaremos como usar estas variables de entorno en los diferentes servicios.</p><div class="info custom-block"><p class="custom-block-title">M\xC1S INFORMACI\xD3N</p><p>Si te has quedado con la duda de por qu\xE9 usamos <em>secrets</em> y no variables de entorno, puedes leer m\xE1s en <a href="https://blog.diogomonica.com//2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/" target="_blank" rel="noreferrer">este art\xEDculo</a> de la antigua coordinadora de seguridad en Docker.</p></div><h2 id="el-contenedor-en-si-services-db" tabindex="-1">El contenedor en s\xED: <code>services</code> &gt; <code>db</code> <a class="header-anchor" href="#el-contenedor-en-si-services-db" aria-hidden="true">#</a></h2><p><em><strong>WIP</strong></em></p><h2 id="gestionando-mariadb-con-adminer" tabindex="-1">Gestionando MariaDB con Adminer <a class="header-anchor" href="#gestionando-mariadb-con-adminer" aria-hidden="true">#</a></h2><div class="language-yaml"><button class="copy"></button><span class="lang">yaml</span><pre><code><span class="line"><span style="color:#F07178;">services</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">adminer</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">image</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">adminer</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">restart</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">always</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">ports</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">-</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">8088:8080</span></span>
<span class="line"></span></code></pre></div>`,23),r=[l];function c(p,t,d,i,u,D){return a(),e("div",null,r)}const A=s(n,[["render",c]]);export{y as __pageData,A as default};