/**
 * INLINE SCRIPTS - SECURITY HARDENED
 * Ehemals inline im HTML, jetzt extern für CSP Compliance
 */

'use strict';

// 1. Dialog Polyfill für ältere Browser
if (typeof HTMLDialogElement === 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    ['detailModal','shareCardModal'].forEach(function(id) {
      var d = document.getElementById(id);
      if (!d) return;
      d.showModal = function() { d.setAttribute('open',''); d.style.display='flex'; };
      d.close    = function() { d.removeAttribute('open'); d.style.display=''; };
    });
  });
}

// 2. Legal Modal Functions
document.addEventListener('DOMContentLoaded', function() {
  window.openLegalModal = function() {
    document.getElementById('legal-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  window.closeLegalModal = function() {
    document.getElementById('legal-modal').classList.remove('active');
    document.body.style.overflow = '';
  };
  
  document.getElementById('legal-modal').addEventListener('click', function(e) {
    if (e.target === this) window.closeLegalModal();
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closeLegalModal();
  });
});

// 3. Theme Toggle
document.addEventListener('DOMContentLoaded', function(){
  const saved = localStorage.getItem('fr-theme');
  const theme = saved || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  
  const btn = document.getElementById('frThemeBtn');
  if(!btn) return;
  
  const isDark = saved === 'dark';
  btn.textContent = isDark ? '☀' : '☾';
  btn.setAttribute('aria-label', isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren');
  
  btn.addEventListener('click', function(){
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fr-theme', next);
    btn.textContent = next === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', next === 'dark' ? 'Light Mode aktivieren' : 'Dark Mode aktivieren');
  });
});

// 4. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('[PWA] Service Worker aktiv'))
    .catch((err) => console.log('[PWA] Fehler', err));
}
