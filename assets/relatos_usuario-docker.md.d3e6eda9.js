import{_ as e,c as o,o as a,a as r}from"./app.c3ea2832.js";const c="/server/assets/docker-group.da03c483.png",b=JSON.parse('{"title":"Lucas vs. Debian & Docker & etc.","description":"","frontmatter":{"title":"Lucas vs. Debian & Docker & etc.","lang":"es-ES"},"headers":[{"level":2,"title":"Instalaci\xF3n de Docker","slug":"instalacion-de-docker","link":"#instalacion-de-docker","children":[]},{"level":2,"title":"Vamos a crear el usuario docker","slug":"vamos-a-crear-el-usuario-docker","link":"#vamos-a-crear-el-usuario-docker","children":[]},{"level":2,"title":"Nos queda el grupo","slug":"nos-queda-el-grupo","link":"#nos-queda-el-grupo","children":[]},{"level":2,"title":"Secrets: \xBFfuncionar\xE1n o no?","slug":"secrets-\xBFfuncionaran-o-no","link":"#secrets-\xBFfuncionaran-o-no","children":[]}],"relativePath":"relatos/usuario-docker.md","lastUpdated":1663514401000}'),s={name:"relatos/usuario-docker.md"},d=r('<h1 id="lucas-vs-debian-docker-etc" tabindex="-1">Lucas vs. Debian &amp; Docker &amp; etc. <a class="header-anchor" href="#lucas-vs-debian-docker-etc" aria-hidden="true">#</a></h1><p>De cuando Lucas intent\xF3 instalar Docker y Debian decidi\xF3 que no iba a ir.</p><h2 id="instalacion-de-docker" tabindex="-1">Instalaci\xF3n de Docker <a class="header-anchor" href="#instalacion-de-docker" aria-hidden="true">#</a></h2><p>Esto es simple, fu\xE9 bien, sin problema.</p><h2 id="vamos-a-crear-el-usuario-docker" tabindex="-1">Vamos a crear el usuario <em>docker</em> <a class="header-anchor" href="#vamos-a-crear-el-usuario-docker" aria-hidden="true">#</a></h2><p>Aqu\xED Debian dijo: \xAA.</p><p>Lo primero fu\xE9 ejecutar <code>sudo adduser -m docker</code>, que es lo que indica cualquier gu\xEDa para crear un usuario con Debian y otras distros y, hasta donde mi memoria llega, es el comando que hab\xEDa ejecutado yo previamente para esas tareas. Pero esta ejecuci\xF3n fallaba y dec\xEDa lo siguiente: <code>Unknown option: m</code>. Viendo la ayuda del comando con <code>sudo adduser --help</code> y <code>man adduser</code>, pues no estaba la opci\xF3n <code>-m</code>, entonces proced\xED a crearlo sin la opci\xF3n a ver si funcionaba.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>En un principio, la opci\xF3n <code>-m</code> en <code>adduser</code> indica al comando que cree la carpeta <em>home</em> del usuario en <em>/home/&lt;username&gt;</em> (o donde se indique con la opci\xF3n <code>-D</code>).</p></div><p>Al ejecutar <code>sudo adduser docker</code>, el comando fallaba y devolv\xEDa el siguiente error: <code>adduser: El grupo &#39;docker&#39; ya existe.</code>. Y pues claro, mi respuesta inicial fu\xE9 que yo estaba intentando crear un usuario, no un grupo. Me gustar\xEDa poder decir que me di cuenta de que al crear un usuario se creaba un grupo con el mismo nombre, pero eso no ser\xEDa cierto, sino que mi compa\xF1ero Iv\xE1n lo descubri\xF3 cuando esto ya estaba solucionado. B\xE1sicamente mi soluci\xF3n fue crear un usuario con otro nombre, en este caso hice <code>sudo adduser dockeruser</code>, y funcion\xF3.</p><p>Ahora proced\xED a comprobar la existencia de <em>/home/dockeruser</em> y correcto, exist\xEDa, y los permisos estaban correctamente configurados as\xED que perfecto. Procedo a ver los usuarios que existen con <code>awk -F: &#39;{ print $1}&#39; /etc/passwd | grep docker</code> y \xA1sorpresa!, no aparece el usuario.</p><p>Entonces yo que se me ve\xEDa muy despierto ese d\xEDa, vuelvo a buscar por internet y descubro que claro, ten\xEDa que asignarle una contrase\xF1a al usuario con <code>sudo passwd dockeruser</code> y ya estaba todo bien.</p><div class="tip custom-block"><p class="custom-block-title">RECOMENDACI\xD3N</p><p>Contrase\xF1as largas para los usuarios por favor y gracias</p></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Normalmente las herramientas base del sistema de Debian y todas estas distros, GNU utils vamos, no suelen cambiar la API, as\xED que realmente desconozco por completo que ha podido ocurrir con <code>adduser</code> para que no me funcionase una opci\xF3n que se supone que existe.</p></div><h2 id="nos-queda-el-grupo" tabindex="-1">Nos queda el grupo <a class="header-anchor" href="#nos-queda-el-grupo" aria-hidden="true">#</a></h2><p>Por si crear el usuario no hubiese sido ya dif\xEDcil, toca gestionar el a\xF1adir el usuario al grupo de Docker. Quiero que ve\xE1is lo que pone en la documentaci\xF3n oficial de Docker antes de nada:</p><p><img src="'+c+'" alt="sudo groupadd docker"></p><p>Se puede observar que Docker te dice que crees el grupo <em>docker</em>. Pues procedo a crear el grupo docker con <code>sudo groupadd docker</code> y obtengo lo siguiente (despu\xE9s de entender por qu\xE9 fallaba lo del usuario, esto tiene l\xF3gica): <code>groupadd: group &#39;docker&#39; already exists</code>.</p><p>As\xED que lo dicho, lo que ocurri\xF3 es que al <strong>contrario de lo que dice la documentaci\xF3n oficial de Docker</strong>, el grupo <em>docker</em> ya se crea al instalar Docker y por tanto no es necesario crearlo, solo a\xF1adir el resultado con <code>sudo usermod -aG docker dockeruser</code>.</p><h2 id="secrets-\xBFfuncionaran-o-no" tabindex="-1">Secrets: \xBFfuncionar\xE1n o no? <a class="header-anchor" href="#secrets-\xBFfuncionaran-o-no" aria-hidden="true">#</a></h2><p>De cuando los <code>secret: external: true</code> no fu\xE9</p>',20),n=[d];function i(u,t,l,p,m,k){return a(),o("div",null,n)}const g=e(s,[["render",i]]);export{b as __pageData,g as default};
