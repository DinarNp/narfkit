/* ===== NARFKIT — skrip bersama halaman aplikasi (siswa & guru) ===== */
(function () {
  function logout() {
    try {
      localStorage.removeItem('narfkit_session');
      localStorage.removeItem('narfkit_nama');
    } catch (e) { console.warn('LocalStorage error:', e); }
    window.location.href = 'index.html';
  }

  function addLogoutButton() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight || navRight.querySelector('.btn-logout')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-logout';
    btn.title = 'Keluar';
    btn.setAttribute('aria-label', 'Keluar');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
      '<span>Keluar</span>';
    btn.addEventListener('click', logout);
    navRight.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addLogoutButton);
  } else {
    addLogoutButton();
  }
})();
