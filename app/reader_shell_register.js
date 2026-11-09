if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('reader-shell-worker.js', document.baseURI), {
    updateViaCache: 'none',
  }).catch(error => console.warn('Reader shell could not be saved', error));
}
