const shell = {"version":"9608a7fc6b0cec28823766438d0982ed17efaf49693179265b4054e102c89860","html":"<!DOCTYPE html>\n<html>\n<head>\n  <!--\n    If you are serving your web app in a path other than the root, change the\n    href value below to reflect the base path you are serving from.\n\n    The path provided below has to start and end with a slash \"/\" in order for\n    it to work correctly.\n\n    For more details:\n    * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base\n\n    This is a placeholder for base href that will be replaced by the value of\n    the `--base-href` argument provided to `flutter build`.\n  -->\n  <base href=\"/infoiran-app/app/\">\n\n  <meta charset=\"UTF-8\">\n  <meta content=\"IE=Edge\" http-equiv=\"X-UA-Compatible\">\n  <meta name=\"description\" content=\"Read verified InfoIran news in six languages.\">\n\n  <!-- iOS meta tags & icons -->\n  <meta name=\"mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">\n  <meta name=\"apple-mobile-web-app-title\" content=\"InfoIran Reader\">\n  <link rel=\"apple-touch-icon\" href=\"icons/Icon-192.png\">\n\n  <!-- Favicon -->\n  <link rel=\"icon\" type=\"image/png\" href=\"favicon.png\"/>\n\n  <title>InfoIran Reader</title>\n  <link rel=\"manifest\" href=\"manifest.json\">\n</head>\n<body>\n  <!--\n    You can customize the \"flutter_bootstrap.js\" script.\n    This is useful to provide a custom configuration to the Flutter loader\n    or to give the user feedback during the initialization process.\n\n    For more details:\n    * https://docs.flutter.dev/platform-integration/web/initialization\n  -->\n  <script src=\"signed_feed.js\" defer></script>\n  <script src=\"reader_shell_register.js\" defer></script>\n  <script src=\"flutter_bootstrap-974486a2e395.js\" defer></script>\n</body>\n</html>\n","assets":{"assets/AssetManifest.bin":"9ea08e531d40a44bfc56d85fc3ac7a725c8dd631c1a0bd13198b94ff63053c49","assets/AssetManifest.bin.json":"85e44636c1fbcef94815e411cf07dfaf6dfc1815f74a90db563605caaa6de9b7","assets/FontManifest.json":"a330d63de7b15909e00eadc187e47c3f344dcc7abef77508167bbc6b732f2498","assets/fonts/MaterialIcons-Regular.otf":"8cb0adfa46f7ef6a36d48c60f3d66055108646863f7d76f581eb685a647814c7","assets/packages/cupertino_icons/assets/CupertinoIcons.ttf":"3d90c370aa4cf00dc57ee2b902f6652147c0f81e03e483df584a9c08b1687c9d","assets/reader-fonts/NotoSansArabic.ttf":"63111b5b2e074dd48cc67692e0a2726d86ee94c1c37fe8598257b7b4e87e869e","assets/reader-fonts/NotoSansGeorgian.ttf":"dc591156f36842d38996c4a7a17fee9bb58e45da3e2cac7a31b7d33de700adb9","assets/reader-fonts/NotoSansHebrew.ttf":"7ef36a2c3593758cdb622e1bdef4f84523e92fbc3ccc667438dd80ff54c2de88","assets/reader-fonts/Roboto.ttf":"d7598e12c5dbef095ff8272cfc55da0250bd07fbdecbac8a530b9b277872a134","assets/shaders/ink_sparkle.frag":"2dca5ab93d4ec29e963f996f3916320ba60825e9537dfb149a68008c7a16b026","assets/shaders/stretch_effect.frag":"ab412f07a5b9b50b67a885b24dbe16929738ae28630407d6490c924caf0a3220","canvaskit-live/canvaskit.js":"7361b744487f98262f77ac507006b3eae37830430048ab7811a626b79f34a52c","canvaskit-live/canvaskit.wasm":"6bdfaa51c76845c02ea90153d44f56f99da51de44a7ee0ea15ccaeb33ed8f476","favicon.png":"0905def4002c1f21344be2c99c33ee1c3ef563b35b105239d92f095d0126bf08","flutter_bootstrap-974486a2e395.js":"974486a2e3956c39d273e58e4bbb0ac82179fd00dc72f235598d7feb8bfa8d99","icons/Icon-192.png":"38fc402ae966e6f1a83c8f0b9dd6e84ac5917862bd8b3b7767914ea78082a469","icons/Icon-512.png":"90ad0366dfd1720aa09b993a998ec557038f0050259f30f22b64e036f9810b63","icons/Icon-maskable-192.png":"a1688e07d76aad9a55a88314082357dd5ca620e06df2a83c424c2749886ac6c3","icons/Icon-maskable-512.png":"4fec52076c037cd71beacc02078819496f4ce42289179e74f20edc4d1967ef09","main-0438bec92f32.js":"0438bec92f32f6b5c9ed4c94a25d89f7594a203258bf3364cea22aca56d28e92","manifest.json":"daac556e54cc77ae39170af7da651bd18ec525d5be88ab7f8fd94fbd46aff11b","reader_shell_register.js":"c4402f45c417227ecca680190105e91763c3ee0d747d8f379b04c6fc1ef749a2","signed_feed.js":"95ead4181ef0ceca9f29accfea0867dff21ed22c8a0ee46581f8bc9caf3c8a63"}};
const base = new URL(self.registration.scope);
const prefix = `infoiran-reader-shell:${base.href}:`;
const cacheName = prefix + shell.version;
const urls = new Map(Object.entries(shell.assets).map(([path, hash]) => [new URL(path, base).href, hash]));
const index = new URL('index.html', base).href;

async function saveAsset(cache, url, hash) {
  const response = await fetch(url, {cache: 'reload', redirect: 'error'});
  if (response.status !== 200) throw new Error('Reader asset is unavailable: ' + new URL(url).pathname);
  const bytes = await response.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const actual = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  if (actual !== hash) throw new Error('Reader asset does not match the installed release: ' + new URL(url).pathname);
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.delete('Content-Length');
  if (url.endsWith('.wasm')) headers.set('Content-Type', 'application/wasm');
  await cache.put(url, new Response(bytes, {headers}));
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    try {
      const assets = [...urls];
      for (let offset = 0; offset < assets.length; offset += 4) {
        await Promise.all(assets.slice(offset, offset + 4).map(([url, hash]) => saveAsset(cache, url, hash)));
      }
      await cache.put(index, new Response(shell.html, {headers: {'Content-Type': 'text/html; charset=utf-8'}}));
    } catch (error) {
      await caches.delete(cacheName);
      console.warn('Could not install the Reader shell:', error);
      throw error;
    }
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const old = (await caches.keys()).filter(key => key.startsWith(prefix) && key !== cacheName);
    await Promise.all(old.map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== base.origin) return;
  url.search = '';
  const key = request.mode === 'navigate' && (url.href === base.href || url.href === index)
    ? index : urls.has(url.href) ? url.href : null;
  if (key !== null) {
    event.respondWith((async () => (await (await caches.open(cacheName)).match(key)) || fetch(request))());
  }
});
