(() => {
  'use strict';

  const languages = new Set(['fa', 'en', 'ka-ge', 'ar', 'he', 'ru']);
  const rtl = new Set(['fa', 'ar', 'he']);
  const prefix = new TextEncoder().encode('infoiran.web.feed.v1\n');
  const maxSize = 1024 * 1024;
  const require = (condition) => {
    if (!condition) throw new Error('Invalid signed web feed');
  };
  const exact = (object, keys) => object && !Array.isArray(object) &&
    typeof object === 'object' && Object.keys(object).sort().join(',') === keys;
  const integer = (value) => Number.isSafeInteger(value) && value > 0;
  const base64 = (value) => {
    require(typeof value === 'string' && /^[A-Za-z0-9_-]+$/.test(value));
    const decoded = atob(value.replaceAll('-', '+').replaceAll('_', '/'));
    require(btoa(decoded).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '') === value);
    return Uint8Array.from(decoded, c => c.charCodeAt(0));
  };
  const storageKey = (feed) => {
    const lang = feed.slice('infoiran.reader.'.length);
    require(languages.has(lang) && feed === `infoiran.reader.${lang}`);
    return `infoiran.web.signed.${lang}`;
  };

  async function decodeBody(payload) {
    const stream = new Blob([payload]).stream().pipeThrough(new DecompressionStream('gzip'));
    const reader = stream.getReader();
    let size = 0;
    let body = '';
    const utf8 = new TextDecoder('utf-8', {fatal: true});
    try {
      for (;;) {
        const {done, value} = await reader.read();
        if (done) return JSON.parse(body + utf8.decode());
        size += value.length;
        require(size <= 4 * maxSize);
        body += utf8.decode(value, {stream: true});
      }
    } finally {
      await reader.cancel();
    }
  }

  async function verify(raw, feed, key, kid, now) {
    storageKey(feed);
    require(raw.length <= maxSize && kid.length > 0);
    const outer = JSON.parse(raw);
    require(exact(outer, 'payload,sig') && JSON.stringify({payload: outer.payload, sig: outer.sig}) === raw);
    const payload = base64(outer.payload);
    const sig = base64(outer.sig);
    const publicBytes = base64(key);
    require(sig.length === 64 && publicBytes.length === 32);
    const publicKey = await crypto.subtle.importKey('raw', publicBytes, 'Ed25519', false, ['verify']);
    const message = new Uint8Array(prefix.length + payload.length);
    message.set(prefix);
    message.set(payload, prefix.length);
    require(await crypto.subtle.verify('Ed25519', publicKey, sig, message));
    const data = await decodeBody(payload);
    const lang = feed.slice('infoiran.reader.'.length);
    require(exact(data, 'date,exp,feedId,iat,items,kid,language,packId,seq,v'));
    require(data.v === 1 && data.feedId === feed && data.language === lang && data.kid === kid);
    require(integer(data.seq) && integer(data.iat) && integer(data.exp) &&
      data.iat <= now && data.exp > data.iat && data.exp - data.iat <= 86400);
    require(typeof data.date === 'string' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(data.date) &&
      !data.date.startsWith('0000') && Number.isFinite(Date.parse(data.date)) &&
      new Date(data.date).toISOString().startsWith(`${data.date}T`));
    require(data.packId === `${data.date.replaceAll('-', '')}-${String(data.seq).padStart(2, '0')}`);
    require(Array.isArray(data.items) && data.items.length <= 100);
    const ids = new Set();
    let previousTime = Infinity;
    let previousId = '';
    for (const item of data.items) {
      require(exact(item, 'id,origin,revision,ts,txt') && typeof item.id === 'string' &&
        /^[a-f0-9]{24}$/.test(item.id) && !ids.has(item.id));
      require(item.origin === (lang === 'ru' ? 'ru' : 'ir') || (lang === 'en' && item.origin === 'ru'));
      require(integer(item.revision) && integer(item.ts) && item.ts >= data.iat - 86400 && item.ts <= data.iat);
      require(item.ts < previousTime || (item.ts === previousTime && item.id > previousId));
      require(typeof item.txt === 'string' && item.txt.trim() && [...item.txt].length <= 5000);
      ids.add(item.id);
      previousTime = item.ts;
      previousId = item.id;
    }
    return data;
  }

  const seconds = () => Math.floor(Date.now() / 1000);
  const label = (value) => new Date(value * 1000).toISOString();
  const view = (data) => JSON.stringify({
    verified: true, feedId: data.feedId, stale: data.exp <= seconds(), diagnostics: [],
    pack: {
      feedId: data.feedId, language: data.language, direction: rtl.has(data.language) ? 'rtl' : 'ltr',
      packId: data.packId, date: data.date, sequence: data.seq, status: 'Verified scoped pack',
      source: 'Authenticated feed', updatedAt: label(data.iat).slice(11, 16),
      expiresAt: label(data.exp).slice(0, 16).replace('T', ' '),
      items: data.items.map(item => ({id: item.id, origin: item.origin, revision: item.revision,
        channel: '', text: item.txt, ts: item.ts, time: label(item.ts).slice(11, 16), language: data.language})),
    },
  });

  async function operate(method, feed, raw, key, kid) {
    const name = storageKey(feed);
    return navigator.locks.request(name, async () => {
      if (method === 'clear') {
        localStorage.removeItem(name);
        return null;
      }
      const now = seconds();
      const previousRaw = localStorage.getItem(name);
      const previous = previousRaw === null ? null : await verify(previousRaw, feed, key, kid, now);
      if (method === 'load') return previous === null ? null : view(previous);
      if (method === 'export') {
        require(previous && previous.exp > now);
        return previousRaw;
      }
      require(method === 'accept');
      const data = await verify(raw, feed, key, kid, now);
      require(data.exp > seconds());
      if (previous) {
        const order = data.date === previous.date ? data.seq - previous.seq : (data.date > previous.date ? 1 : -1);
        require(order > 0 || (order === 0 && raw === previousRaw));
      }
      if (raw !== previousRaw) localStorage.setItem(name, raw);
      return view(data);
    });
  }

  window.infoiranSignedWebFeed = operate;
})();
