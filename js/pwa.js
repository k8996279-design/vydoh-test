if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const isLocal = location.protocol === 'http:' || location.protocol === 'https:';
    if (!isLocal) return;
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
