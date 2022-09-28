import{_ as s,c as o,o as a,a as e}from"./app.59268308.js";const b=JSON.parse('{"title":"Modoboa - Servidor de correo","description":"","frontmatter":{"title":"Modoboa - Servidor de correo","lang":"es-ES"},"headers":[],"relativePath":"servicios/modoboa.md","lastUpdated":1664399954000}'),n={name:"servicios/modoboa.md"},t=e(`<h1 id="modoboa-servidor-de-correo" tabindex="-1">Modoboa - Servidor de correo <a class="header-anchor" href="#modoboa-servidor-de-correo" aria-hidden="true">#</a></h1><p>Un d\xEDa, nos despertamos con ganas de tener un servidor de correo porque, \xBFpor qu\xE9 no? Habiendo hecho una b\xFAsqueda r\xE1pida de qu\xE9 opciones ten\xEDamos, decidimos usar <a href="https://github.com/modoboa/modoboa" target="_blank" rel="noreferrer">Modoboa</a>.</p><p>Lo bueno es que tiene un instalador, as\xED que como somos personas perezosas, nos decidimos a probarlo. En <a href="https://modoboa.readthedocs.io/en/latest/installation.html" target="_blank" rel="noreferrer">su documentaci\xF3n</a> viene explicado c\xF3mo usar el instalador, estos son los pasos m\xE1s importantes:</p><ul><li>Primero salta un aviso recordando que tenemos que tener configurado el subdominio para el correo, as\xED que hay que a\xF1adir dos registros, uno <code>A</code> y otro <code>MX</code>:</li></ul><div class="language-"><button class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">Warning:</span></span>
<span class="line"><span style="color:#A6ACCD;">Before you start the installation, please make sure the following DNS records exist for domain &#39;wupp.dev&#39;:</span></span>
<span class="line"><span style="color:#A6ACCD;">  mail IN A   &lt;IP ADDRESS OF YOUR SERVER&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">       IN MX  mail.wupp.dev</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>Despu\xE9s hay que esperar un largo rato... <em>Sigo esperando</em></li></ul><p>Vale nada, resulta que no hab\xEDa que esperar tanto, se hab\xEDa quedado pillado SSH. El caso es que, como tenemos Nginx instalado, da error, as\xED que vamos con la configuraci\xF3n manual, siguiendo los pasos de <a href="https://modoboa.readthedocs.io/en/latest/manual_installation/modoboa.html" target="_blank" rel="noreferrer">esta p\xE1gina</a>.</p><p>Si nos salta este error:</p><div class="language-"><button class="copy"></button><span class="lang"></span><pre><code><span class="line"><span style="color:#A6ACCD;">(env)$ pip install mysqlclient</span></span>
<span class="line"><span style="color:#A6ACCD;">    ERROR: Command errored out with exit status 1:</span></span>
<span class="line"><span style="color:#A6ACCD;">     command: /srv/modoboa/env/bin/python -c &#39;import sys, setuptools, tokenize; sys.argv[0] = &#39;&quot;&#39;&quot;&#39;/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup.py&#39;&quot;&#39;&quot;&#39;; __file__=&#39;&quot;&#39;&quot;&#39;/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup.py&#39;&quot;&#39;&quot;&#39;;f=getattr(tokenize, &#39;&quot;&#39;&quot;&#39;open&#39;&quot;&#39;&quot;&#39;, open)(__file__);code=f.read().replace(&#39;&quot;&#39;&quot;&#39;\\r\\n&#39;&quot;&#39;&quot;&#39;, &#39;&quot;&#39;&quot;&#39;\\n&#39;&quot;&#39;&quot;&#39;);f.close();exec(compile(code, __file__, &#39;&quot;&#39;&quot;&#39;exec&#39;&quot;&#39;&quot;&#39;))&#39; egg_info --egg-base /tmp/pip-pip-egg-info-wlcnv6o5</span></span>
<span class="line"><span style="color:#A6ACCD;">         cwd: /tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/</span></span>
<span class="line"><span style="color:#A6ACCD;">    Complete output (10 lines):</span></span>
<span class="line"><span style="color:#A6ACCD;">    /bin/sh: 1: mysql_config: not found</span></span>
<span class="line"><span style="color:#A6ACCD;">    Traceback (most recent call last):</span></span>
<span class="line"><span style="color:#A6ACCD;">      File &quot;&lt;string&gt;&quot;, line 1, in &lt;module&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">      File &quot;/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup.py&quot;, line 17, in &lt;module&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        metadata, options = get_config()</span></span>
<span class="line"><span style="color:#A6ACCD;">      File &quot;/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup_posix.py&quot;, line 47, in get_config</span></span>
<span class="line"><span style="color:#A6ACCD;">        libs = mysql_config(&quot;libs_r&quot;)</span></span>
<span class="line"><span style="color:#A6ACCD;">      File &quot;/tmp/pip-install-3hlmk2d4/mysqlclient_bd6cc790c75246cc8b05a5a5563f2cc5/setup_posix.py&quot;, line 29, in mysql_config</span></span>
<span class="line"><span style="color:#A6ACCD;">        raise EnvironmentError(&quot;%s not found&quot; % (mysql_config.path,))</span></span>
<span class="line"><span style="color:#A6ACCD;">    OSError: mysql_config not found</span></span>
<span class="line"><span style="color:#A6ACCD;">    ----------------------------------------</span></span>
<span class="line"><span style="color:#A6ACCD;">WARNING: Discarding https://files.pythonhosted.org/packages/6a/91/bdfe808fb5dc99a5f65833b370818161b77ef6d1e19b488e4c146ab615aa/mysqlclient-1.3.0.tar.gz#sha256=06eb5664e3738b283ea2262ee60ed83192e898f019cc7ff251f4d05a564ab3b7 (from https://pypi.org/simple/mysqlclient/). Command errored out with exit status 1: python setup.py egg_info Check the logs for full command output.</span></span>
<span class="line"><span style="color:#A6ACCD;">ERROR: Could not find a version that satisfies the requirement mysqlclient</span></span>
<span class="line"><span style="color:#A6ACCD;">ERROR: No matching distribution found for mysqlclient</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Podemos solucionando saliendo del usuario <code>modoboa</code> y ejecutando <code>sudo apt-get install libmariadbclient-dev</code>.</p>`,10),l=[t];function p(c,i,r,d,u,m){return a(),o("div",null,l)}const _=s(n,[["render",p]]);export{b as __pageData,_ as default};