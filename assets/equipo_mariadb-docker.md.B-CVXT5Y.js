import{_ as s,c as a,o as e,a1 as i}from"./chunks/framework.Bxmcb2_I.js";const u=JSON.parse('{"title":"Configurando MariaDB con Docker","description":"","frontmatter":{"title":"Configurando MariaDB con Docker","lang":"es-ES"},"headers":[],"relativePath":"equipo/mariadb-docker.md","filePath":"equipo/mariadb-docker.md","lastUpdated":1716105125000}'),n={name:"equipo/mariadb-docker.md"},o=i(`<h1 id="configurando-mariadb-con-docker" tabindex="-1">Configurando MariaDB con Docker <a class="header-anchor" href="#configurando-mariadb-con-docker" aria-label="Permalink to &quot;Configurando MariaDB con Docker&quot;">​</a></h1><div class="warning custom-block"><p class="custom-block-title">ATENCIÓN</p><p>Esta página está desactualizada y pendiente de revisión.</p></div><p>Para empezar a ver cómo funciona el <code>docker-compose.yaml</code> y probar docker, vamos a configurar un contenedor de MariaDB, que servirá como base de datos para los diferentes servicios que soporten MySQL.</p><h2 id="contenido-de-docker-compose-yaml" tabindex="-1">Contenido de <code>docker-compose.yaml</code> <a class="header-anchor" href="#contenido-de-docker-compose-yaml" aria-label="Permalink to &quot;Contenido de \`docker-compose.yaml\`&quot;">​</a></h2><p>Aquí está el contenido a añadir al <code>docker-compose.yaml</code>:</p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">secrets</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  mariadb_root_password</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    external</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  nextcloud_db_user</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    external</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  nextcloud_db_password</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    external</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">services</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  db</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">mariadb:10.5</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">always</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">./db:/var/lib/mysql</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    secrets</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">mariadb_root_password</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">nextcloud_db_user</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">nextcloud_db_password</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">MARIADB_ROOT_PASSWORD_FILE=/run/secrets/mariadb_root_password</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">MARIADB_USER_FILE=/run/secrets/nextcloud_db_user</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">MARIADB_PASSWORD_FILE=/run/secrets/nextcloud_db_password</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">MARIADB_DATABASE=\${NEXTCLOUD_DB_NAME:?nextcloud database name required}</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">¿POR QUÉ APARECE NEXTCLOUD?</p><p>La imagen del contenedor Docker de MariaDB nos permite crear una base de datos al iniciar el contenedor por primera vez. En este caso, como uno de los servicios principales del servidor es Nextcloud, hemos configurado aquí el contenedor para que cree la base de datos y el usuario para Nextcloud al iniciarse, y para más bases de datos las crearemos posteriormente antes de iniciar el otro servicio.</p></div><h2 id="gestion-de-secretos-secrets" tabindex="-1">Gestión de secretos: <code>secrets</code> <a class="header-anchor" href="#gestion-de-secretos-secrets" aria-label="Permalink to &quot;Gestión de secretos: \`secrets\`&quot;">​</a></h2><p>Esta sección del <code>docker-compose.yaml</code> nos permite declarar los llamados <em>secrets</em> (o secretos por su traducción al castellano). Estos son cadenas de texto que se crean con <code>docker secrets</code> o a través de un archivo, que Docker gestiona de una manera segura y nos sirve para reemplazar las variables de entorno que contengan datos más sensibles como contraseñas. Aunque estos secretos se pueden crear a través de un archivo indicándolo en el propio <code>docker-compose.yaml</code>, realizarlo de tal forma requiere tener la contraseña en texto plano en el sistema, por tanto vamos a crear los secretos a través de la terminal.</p><p>En el archivo <code>docker-compose.yaml</code> tenemos que declarar el nombre de los <em>secrets</em> que vamos a usar en <code>secrets</code>. Estos se declaran indicando su nombre como miembro de <code>secrets</code>, i.e. añadiendo el nombre indentado debajo de <code>secrets</code> como se puede ver anteriormente y, dado que los vamos a crear manualmente con la CLI de Docker, tenemos que indicar <code>external: true</code> para cada uno.</p><div class="warning custom-block"><p class="custom-block-title">IMPORTANTE</p><p>La versión que se indica con la clave <code>version</code> en el archivo ha de ser 3 o superior para que los <em>secrets</em> funcionen</p></div><p>Procedamos ahora a crear los diferentes <em>secrets</em> que se necesitan. En los siguientes comandos, sustituye el texto entre <code>&lt;&gt;</code> (e.g. <code>&lt;root_password&gt;</code>) con lo que desees (que recomendamos que sea generado aleatoriamente) y guárdalo en un sitio seguro y que no vayas a perder:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&lt;root_password&gt;&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> secret</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> mariadb_root_password</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&lt;nextcloud_password&gt;&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> secret</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nextcloud_db_password</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&lt;nextcloud_user&gt;&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> secret</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> create</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nextcloud_db_user</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">SUGERENCIA</p><p>Dado que estas contraseñas permiten acceder a todos los datos de Nextcloud y la de <em>root</em> a <strong>TODOS los datos de TODAS las bases de datos</strong>, te recomendamos que sean bastante seguras, de más de 20 caracteres mínimo. El usuario de la base de datos también es recomendable generarlo aleatoriamente para así proveer más seguridad evitando que si alguien gana acceso a la contraseña pueda acceder</p></div><h2 id="variables-de-entorno" tabindex="-1">Variables de entorno <a class="header-anchor" href="#variables-de-entorno" aria-label="Permalink to &quot;Variables de entorno&quot;">​</a></h2><p>A lo largo del <code>docker-compose.yaml</code> vamos a utilizar múltiples variables de entorno para interpolar datos que no resultan tan privados, como el nombre de la base de datos. Las variables de entorno se cargan directamente de un archivo <code>.env</code> que se sitúe junto al <code>docker-compose.yaml</code>, aunque puede personalizarse para cada servicio usando la opción <code>env_file</code>. En nuestro caso, tenemos un <a href="https://github.com/ComicIvans/server/blob/main/home/dockeruser/docker-compose.yml" target="_blank" rel="noreferrer">archivo de entorno de ejemplo en el repositorio</a>. Para proseguir, vamos a descargar este archivo y renombrarlo a <code>.env</code>:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Sitúate donde tengas el archivo docker-compose, que debería de ser /home/&lt;usuario-docker&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://raw.githubusercontent.com/ComicIvans/server/main/home/dockeruser/.env.example</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .env</span></span></code></pre></div><div class="danger custom-block"><p class="custom-block-title">RECORDATORIO IMPORTANTE</p><p>El archivo <code>.env.example</code> es de ejemplo y público para cualquiera, así que antes de proseguir edita el archivo con tu editor favorito para que no tenga los mismos valores que el de ejemplo.</p></div><p>En la siguiente sección indicaremos como usar estas variables de entorno en los diferentes servicios.</p><div class="info custom-block"><p class="custom-block-title">MÁS INFORMACIÓN</p><p>Si te has quedado con la duda de por qué usamos <em>secrets</em> y no variables de entorno, puedes leer más en <a href="https://blog.diogomonica.com//2017/03/27/why-you-shouldnt-use-env-variables-for-secret-data/" target="_blank" rel="noreferrer">este artículo</a> de la antigua coordinadora de seguridad en Docker.</p></div><h2 id="el-contenedor-en-si-services-db" tabindex="-1">El contenedor en sí: <code>services</code> &gt; <code>db</code> <a class="header-anchor" href="#el-contenedor-en-si-services-db" aria-label="Permalink to &quot;El contenedor en sí: \`services\` &gt; \`db\`&quot;">​</a></h2><p><em><strong>WIP</strong></em></p><h2 id="gestionando-mariadb-con-adminer" tabindex="-1">Gestionando MariaDB con Adminer <a class="header-anchor" href="#gestionando-mariadb-con-adminer" aria-label="Permalink to &quot;Gestionando MariaDB con Adminer&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">services</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  adminer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">adminer</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">always</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">8088:8080</span></span></code></pre></div>`,24),t=[o];function r(l,d,p,c,h,k){return e(),a("div",null,t)}const m=s(n,[["render",r]]);export{u as __pageData,m as default};