/* ===== NARFKIT — skrip bersama halaman aplikasi (siswa & guru) =====
   Menyeragamkan ikon navbar menjadi tombol, dan menambahkan menu profil
   (nama, peran, tombol Keluar). */
(function () {
  const ICON_TITLES = [
    { match: 'M7.5 38.75', title: 'Progres belajar' },
    { match: 'M22.5 42.5', title: 'Notifikasi' },
  ];
  const PROFILE_MATCH = 'M40 22.5';

  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem('narfkit_session') || 'null');
      if (s) return s;
      const nama = localStorage.getItem('narfkit_nama');
      return nama ? { nama } : null;
    } catch (e) { return null; }
  }

  function initials(nama) {
    return nama.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  function logout() {
    try {
      localStorage.removeItem('narfkit_session');
      localStorage.removeItem('narfkit_nama');
    } catch (e) { console.warn('LocalStorage error:', e); }
    window.location.href = 'index.html';
  }

  function buildProfileMenu(isGuru) {
    const session = getSession();
    const nama = (session && session.nama) || 'Tamu';
    const peran = (session && session.peran) || (isGuru ? 'guru' : 'siswa');
    const dashboard = peran === 'guru' ? 'dashboardguru.html' : 'dashboardsiswa.html';

    const wrap = document.createElement('div');
    wrap.className = 'profile';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'profile-trigger';
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.title = 'Akun';
    trigger.textContent = initials(nama);

    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML =
      '<div class="profile-head">' +
        '<span class="profile-avatar"></span>' +
        '<div><div class="profile-name"></div><div class="profile-role"></div></div>' +
      '</div>' +
      '<a class="profile-item" role="menuitem" href="' + dashboard + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>' +
        'Dashboard</a>' +
      '<button type="button" class="profile-item profile-logout" role="menuitem">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
        'Keluar</button>';
    menu.querySelector('.profile-avatar').textContent = initials(nama);
    menu.querySelector('.profile-name').textContent = nama;
    menu.querySelector('.profile-role').textContent = peran === 'guru' ? 'Guru' : 'Siswa';
    menu.querySelector('.profile-logout').addEventListener('click', logout);

    function setOpen(open) {
      wrap.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    }
    trigger.addEventListener('click', e => { e.stopPropagation(); setOpen(!wrap.classList.contains('open')); });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

    wrap.append(trigger, menu);
    return wrap;
  }

  function enhanceNav() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight || navRight.querySelector('.profile')) return;

    const isGuru = !!document.querySelector('.menu a[href*="grading"], .menu a[href*="monitoring"]');
    let profileSlot = null;

    Array.from(navRight.children).forEach(el => {
      if (el.tagName.toLowerCase() !== 'svg') return;
      const path = el.querySelector('path');
      const d = path ? path.getAttribute('d') || '' : '';
      if (d.startsWith(PROFILE_MATCH)) {
        profileSlot = el;
        return;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-icon';
      const known = ICON_TITLES.find(i => d.startsWith(i.match));
      btn.title = known ? known.title : '';
      if (known) btn.setAttribute('aria-label', known.title);
      el.replaceWith(btn);
      btn.appendChild(el);
    });

    const profile = buildProfileMenu(isGuru);
    if (profileSlot) profileSlot.remove();
    navRight.appendChild(profile);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceNav);
  } else {
    enhanceNav();
  }
})();
