<?php
$CONFIG = array (
  'memcache.local' => '\\OC\\Memcache\\APCu',
  'apps_paths' => 
  array (
    0 => 
    array (
      'path' => '/var/www/html/apps',
      'url' => '/apps',
      'writable' => false,
    ),
    1 => 
    array (
      'path' => '/var/www/html/custom_apps',
      'url' => '/custom_apps',
      'writable' => true,
    ),
  ),
  'memcache.distributed' => '\\OC\\Memcache\\Redis',
  'filelocking.enabled' => true,
  'memcache.locking' => '\\OC\\Memcache\\Redis',
  'redis' => 
  array (
    'host' => 'nextcloud-redis',
    'password' => '',
    'port' => 6379,
  ),
  'instanceid' => 'id',
  'passwordsalt' => 'passwd',
  'secret' => 'shh',
  'trusted_domains' => 
  array (
    0 => 'cloud.wupp.dev',
  ),
  'default_language' => 'es',
  'default_locale' => 'es_ES',
  'default_phone_region' => 'ES',
  'bulkupload.enabled' => false,
  'maintenance' => false,
  'loglevel' => 2,
  'theme' => '',
  'enabledPreviewProviders' => 
  array (
    0 => 'OC\\Preview\\MP3',
    1 => 'OC\\Preview\\TXT',
    2 => 'OC\\Preview\\MarkDown',
    3 => 'OC\\Preview\\OpenDocument',
    4 => 'OC\\Preview\\Krita',
    5 => 'OC\\Preview\\Imaginary',
  ),
  'preview_imaginary_url' => 'http://127.0.0.1:22394',
);