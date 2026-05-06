if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const isLocal = location.protocol === 'http:' || location.protocol === 'https:';
    if (!isLocal) return;
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// --- PWA Install ---
let _installPrompt = null;

// Перехватываем beforeinstallprompt (Android/Chrome)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _installPrompt = e;
});

function _isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

function _isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

let _shouldShowInstall = false;

function initInstallButton() {
  if (_isStandalone()) return;
  _shouldShowInstall = true;
  // не показываем на обложке — покажем после «Начать»
}

function showInstallPill() {
  if (!_shouldShowInstall) return;
  const btn = document.getElementById('bn-install-btn');
  if (btn) btn.style.display = 'block';
}

function handleInstall() {
  if (_isIOS()) {
    _showIOSModal();
    return;
  }
  if (_installPrompt) {
    _installPrompt.prompt();
    _installPrompt.userChoice.then((r) => {
      if (r.outcome === 'accepted') {
        document.getElementById('bn-install-btn').style.display = 'none';
      }
      _installPrompt = null;
    });
    return;
  }
  // Android без beforeinstallprompt — инструкция
  _showAndroidModal();
}

function _showIOSModal() {
  const m = document.createElement('div');
  m.id = 'pwa-modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  m.innerHTML = `
    <div style="background:#fff9f4;border-radius:20px 20px 0 0;padding:28px 24px 40px;width:100%;max-width:420px;box-sizing:border-box;font-family:inherit">
      <div style="font-size:17px;font-weight:600;color:#3a2e26;margin-bottom:16px">Добавить на экран Домой</div>
      <div style="font-size:14px;color:#6b5448;line-height:1.7">
        1. Нажмите <strong>Поделиться</strong> <span style="font-size:16px">⎙</span> в нижней панели Safari<br>
        2. Выберите <strong>На экран «Домой»</strong><br>
        3. Нажмите <strong>Добавить</strong>
      </div>
      <button onclick="document.getElementById('pwa-modal').remove()"
        style="margin-top:22px;width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#6b7d62,#8fa082);color:#fff;font-size:15px;font-weight:600;cursor:pointer">
        Понятно
      </button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
}

function _showAndroidModal() {
  const m = document.createElement('div');
  m.id = 'pwa-modal';
  m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:flex-end;justify-content:center';
  m.innerHTML = `
    <div style="background:#fff9f4;border-radius:20px 20px 0 0;padding:28px 24px 40px;width:100%;max-width:420px;box-sizing:border-box;font-family:inherit">
      <div style="font-size:17px;font-weight:600;color:#3a2e26;margin-bottom:16px">Добавить на экран Домой</div>
      <div style="font-size:14px;color:#6b5448;line-height:1.7">
        1. Нажмите <strong>⋮</strong> (меню браузера) в правом верхнем углу<br>
        2. Выберите <strong>Добавить на главный экран</strong>
      </div>
      <button onclick="document.getElementById('pwa-modal').remove()"
        style="margin-top:22px;width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#6b7d62,#8fa082);color:#fff;font-size:15px;font-weight:600;cursor:pointer">
        Понятно
      </button>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
}
