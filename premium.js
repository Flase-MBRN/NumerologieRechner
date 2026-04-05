/**
 * MBRN Numerologie Premium v1.0
 * Gumroad Integration und Premium Features
 * 
 * @version 1.0.0
 * @author SWE 1.5
 * @license MIT
 */

class NumerologiePremium {
  constructor(options = {}) {
    this.config = {
      gumroadUrl: options.gumroadUrl || 'https://flase.gumroad.com/l/mxjflg',
      price: options.price || '2.99€',
      storageKey: options.storageKey || 'numerologie-premium',
      ...options
    };
    
    this.isPremium = false;
    this.licenseKey = null;
    this.webhookSecret = 'numerologie_premium_2026';
    
    this._init();
  }
  
  /**
   * Initialisiert das Premium System
   * @private
   */
  _init() {
    this._loadPremiumStatus();
    this._setupWebhookListener();
    this._setupPremiumUI();
    
    // Globaler Zugriff
    if (typeof window !== 'undefined') {
      window.NumerologiePremium = this;
    }
  }
  
  /**
   * Lädt Premium Status aus localStorage
   * @private
   */
  _loadPremiumStatus() {
    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.isPremium = data.isPremium || false;
        this.licenseKey = data.licenseKey || null;
        
        // Prüfen ob License noch gültig (optional)
        if (this.licenseKey && this._validateLicense(this.licenseKey)) {
          this.isPremium = true;
        }
      }
    } catch (e) {
      console.warn('[Premium] Konnte Status nicht laden:', e);
    }
  }
  
  /**
   * Speichert Premium Status
   * @private
   */
  _savePremiumStatus() {
    try {
      const data = {
        isPremium: this.isPremium,
        licenseKey: this.licenseKey,
        timestamp: Date.now()
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (e) {
      console.warn('[Premium] Konnte Status nicht speichern:', e);
    }
  }
  
  /**
   * Validiert License Key (einfache Hash-Validierung)
   * @private
   */
  _validateLicense(key) {
    if (!key || key.length < 10) return false;
    
    // Einfache Validierung - in Production mit echtem Gumroad Webhook ersetzen
    const hash = btoa(key + this.webhookSecret).slice(0, 8);
    return hash === 'bXlqcHJl'; // Platzhalter - echte Validierung implementieren
  }
  
  /**
   * Setup für Gumroad Webhook Listener
   * @private
   */
  _setupWebhookListener() {
    // In Production: echten Webhook Endpoint implementieren
    // Für Demo: URL Parameter Prüfung
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const premiumParam = urlParams.get('premium');
      const licenseParam = urlParams.get('license');
      
      if (premiumParam === 'success' || licenseParam) {
        this._activatePremium(licenseParam || 'demo_success');
      }
    }
  }
  
  /**
   * Aktiviert Premium Features
   * @private
   */
  _activatePremium(licenseKey = null) {
    this.isPremium = true;
    this.licenseKey = licenseKey;
    this._savePremiumStatus();
    this._updateUI();
    
    // Event auslösen
    this._dispatchPremiumEvent('activated');
    
    // URL Parameter aufräumen
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location);
      url.searchParams.delete('premium');
      url.searchParams.delete('license');
      window.history.replaceState({}, '', url);
    }
  }
  
  /**
   * Setup für Premium UI Elemente
   * @private
   */
  _setupPremiumUI() {
    this._createPremiumOverlay();
    this._createPremiumButtons();
    this._updateUI();
  }
  
  /**
   * Erstellt Premium Overlay
   * @private
   */
  _createPremiumOverlay() {
    if (document.getElementById('premiumOverlay')) return;
    
    const overlay = document.createElement('div');
    overlay.id = 'premiumOverlay';
    overlay.className = 'premium-overlay';
    overlay.innerHTML = `
      <div class="premium-modal">
        <div class="premium-header">
          <h3 class="premium-title">🔮 Vollständiger Numerologie-Report</h3>
          <p class="premium-subtitle">Entfalle alle 36 Zahlen und deine persönliche Analyse</p>
        </div>
        
        <div class="premium-features">
          <div class="premium-feature">
            <span class="premium-icon">📊</span>
            <div class="premium-feature-text">
              <h4>36 Zahlen Complete</h4>
              <p>Alle Lebenszahlen, Meisterzahlen, Karmazahlen</p>
            </div>
          </div>
          <div class="premium-feature">
            <span class="premium-icon">🎯</span>
            <div class="premium-feature-text">
              <h4>Jahres-Prognose 2026</h4>
              <p>Persönliche Vorhersagen für das aktuelle Jahr</p>
            </div>
          </div>
          <div class="premium-feature">
            <span class="premium-icon">📄</span>
            <div class="premium-feature-text">
              <h4>PDF Export</h4>
              <p>Professioneller Report zum Herunterladen</p>
            </div>
          </div>
          <div class="premium-feature">
            <span class="premium-icon">💎</span>
            <div class="premium-feature-text">
              <h4>Partnerschafts-Analyse</h4>
              <p>Detaillierte Kompatibilitäts-Reports</p>
            </div>
          </div>
        </div>
        
        <div class="premium-pricing">
          <div class="premium-price">${this.config.price}</div>
          <div class="premium-note">Einmalzahlung • Kein Abo</div>
        </div>
        
        <div class="premium-actions">
          <button class="btn btn--primary premium-buy-btn" id="premiumBuyBtn">
            🛒 Jetzt kaufen
          </button>
          <button class="btn btn--secondary premium-close-btn" id="premiumCloseBtn">
            Später
          </button>
        </div>
        
        <div class="premium-footer">
          <p>✅ Sofort freigeschaltet • 🔰 Sichere Bezahlung • 📧 Support</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Event Listener
    document.getElementById('premiumBuyBtn').addEventListener('click', () => {
      this._openGumroad();
    });
    
    document.getElementById('premiumCloseBtn').addEventListener('click', () => {
      this._closeOverlay();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this._closeOverlay();
      }
    });
  }
  
  /**
   * Erstellt Premium Buttons für gesperrte Features
   * @private
   */
  _createPremiumButtons() {
    // Buttons für Premium Features erstellen
    const premiumSelectors = [
      '.premium-locked',
      '[data-premium="true"]',
      '.acc-section.premium-only'
    ];
    
    premiumSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (!element.querySelector('.premium-lock-btn')) {
          const lockBtn = document.createElement('button');
          lockBtn.className = 'premium-lock-btn';
          lockBtn.innerHTML = '🔒 Premium';
          lockBtn.addEventListener('click', () => {
            this._showOverlay();
          });
          
          // Original Content verstecken und Lock Button zeigen
          if (element.classList.contains('acc-section')) {
            element.querySelector('.acc-body').style.display = 'none';
            element.querySelector('.acc-header').appendChild(lockBtn);
          } else {
            element.appendChild(lockBtn);
          }
        }
      });
    });
  }
  
  /**
   * Aktualisiert UI basierend auf Premium Status
   * @private
   */
  _updateUI() {
    // Premium Status im UI anzeigen
    const premiumIndicators = document.querySelectorAll('.premium-indicator');
    premiumIndicators.forEach(indicator => {
      indicator.textContent = this.isPremium ? '💎 Premium' : '🔒 Free';
      indicator.className = this.isPremium ? 'premium-indicator premium-active' : 'premium-indicator';
    });
    
    // Gesperrte Inhalte freischalten
    if (this.isPremium) {
      document.querySelectorAll('.premium-locked, [data-premium="true"]').forEach(element => {
        element.classList.remove('premium-locked');
        element.classList.add('premium-unlocked');
      });
      
      document.querySelectorAll('.premium-lock-btn').forEach(btn => {
        btn.remove();
      });
      
      document.querySelectorAll('.acc-section.premium-only .acc-body').forEach(body => {
        body.style.display = '';
      });
    }
  }
  
  /**
   * Öffnet Gumroad Checkout
   * @private
   */
  _openGumroad() {
    window.open(this.config.gumroadUrl, '_blank', 'noopener,noreferrer');
    
    // Demo: Nach 3s automatisch aktivieren (nur für Development)
    if (window.location.hostname === 'localhost') {
      setTimeout(() => {
        this._activatePremium('demo_license_' + Date.now());
      }, 3000);
    }
  }
  
  /**
   * Zeigt Premium Overlay
   */
  _showOverlay() {
    const overlay = document.getElementById('premiumOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  /**
   * Schließt Premium Overlay
   * @private
   */
  _closeOverlay() {
    const overlay = document.getElementById('premiumOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  /**
   * Dispatched Premium Event
   * @private
   */
  _dispatchPremiumEvent(type) {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent('numerologie:premium', {
      detail: {
        type: type,
        isPremium: this.isPremium,
        licenseKey: this.licenseKey
      },
      bubbles: true
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * Prüft ob Premium aktiv ist
   * @returns {boolean}
   */
  isPremiumActive() {
    return this.isPremium;
  }
  
  /**
   * Gibt License Key zurück
   * @returns {string|null}
   */
  getLicenseKey() {
    return this.licenseKey;
  }
  
  /**
   * Manuelles Aktivieren (für Testing)
   * @param {string} licenseKey
   */
  activateLicense(licenseKey) {
    if (this._validateLicense(licenseKey)) {
      this._activatePremium(licenseKey);
      return true;
    }
    return false;
  }
  
  /**
   * Deaktiviert Premium (für Testing)
   */
  deactivatePremium() {
    this.isPremium = false;
    this.licenseKey = null;
    this._savePremiumStatus();
    this._updateUI();
    this._dispatchPremiumEvent('deactivated');
  }
  
  /**
   * Event Listener für Premium Änderungen
   * @param {Function} callback
   * @returns {Function}
   */
  onChange(callback) {
    if (typeof window === 'undefined') return () => {};
    
    const handler = (e) => callback(e.detail);
    document.addEventListener('numerologie:premium', handler);
    
    return () => {
      document.removeEventListener('numerologie:premium', handler);
    };
  }
}

// Auto-Initialisierung
(function autoInit() {
  if (typeof document === 'undefined') return;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.NumerologiePremium) {
        new NumerologiePremium();
      }
    });
  } else {
    if (!window.NumerologiePremium) {
      new NumerologiePremium();
    }
  }
})();

// Global Export
if (typeof window !== 'undefined') {
  window.NumerologiePremium = NumerologiePremium;
}
