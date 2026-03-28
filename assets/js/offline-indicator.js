/**
 * Offline Indicator v1.0
 * Zeigt visuelles Feedback wenn User offline ist
 * PWA Feature für bessere UX
 */

(function() {
  'use strict';

  // Offline Indicator Element erstellen
  function createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator';
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    indicator.setAttribute('aria-label', 'Verbindungsstatus');
    indicator.innerHTML = `
      <span class="offline-icon" aria-hidden="true">📡</span>
      <span class="offline-text">Du bist offline</span>
      <span class="offline-sub">Einige Features sind möglicherweise eingeschränkt</span>
    `;
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #000;
      padding: 12px 20px;
      text-align: center;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      z-index: 10000;
      transform: translateY(-100%);
      transition: transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    `;
    
    // Sub-text styling
    const subText = indicator.querySelector('.offline-sub');
    if (subText) {
      subText.style.cssText = `
        font-size: 0.75rem;
        opacity: 0.8;
        font-weight: 400;
        margin-left: 8px;
      `;
    }
    
    document.body.appendChild(indicator);
    return indicator;
  }

  // Status aktualisieren
  function updateOnlineStatus() {
    const indicator = document.getElementById('offline-indicator') || createOfflineIndicator();
    const isOnline = navigator.onLine;
    
    if (!isOnline) {
      // Offline - zeige Banner
      indicator.style.transform = 'translateY(0)';
      indicator.classList.add('is-offline');
      
      // Toast-Benachrichtigung
      if (window.showToast) {
        window.showToast('📡 Du bist offline', 3000);
      }
      
      console.log('[Offline] Verbindung verloren');
    } else {
      // Online - verstecke Banner
      indicator.style.transform = 'translateY(-100%)';
      indicator.classList.remove('is-offline');
      
      // Erfolgs-Toast
      if (window.showToast) {
        window.showToast('✅ Verbindung wiederhergestellt', 2000);
      }
      
      console.log('[Offline] Verbindung wiederhergestellt');
    }
  }

  // Initialisierung
  function init() {
    // Nur initialisieren wenn Service Worker unterstützt
    if (!('serviceWorker' in navigator)) {
      console.log('[Offline] Service Worker nicht unterstützt - überspringe Offline-Indikator');
      return;
    }

    // Event Listener
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initialer Check
    if (!navigator.onLine) {
      setTimeout(updateOnlineStatus, 100);
    }

    console.log('[Offline] Indicator initialisiert');
  }

  // Start wenn DOM bereit
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API für andere Module
  window.isOffline = function() {
    return !navigator.onLine;
  };

  window.offlineStatus = {
    isOffline: !navigator.onLine,
    check: function() { return !navigator.onLine; }
  };
})();
