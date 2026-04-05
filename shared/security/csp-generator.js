/**
 * MBRN CSP Generator v1.0
 * Automatischer Security-Header Generator für Content Security Policy
 * 
 * @version 1.0.0
 * @author SWE 1.5
 * @license MIT
 */

class CSPGenerator {
  constructor(options = {}) {
    this.options = {
      // Standard CSP Richtlinien
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.coingecko.com"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: true,
      
      ...options
    };
    
    this.hashes = new Map(); // Speichert berechnete Hashes
  }
  
  /**
   * Generiert SHA-256 Hash für Inline Script/Style
   * @param {string} content - Der Inline Content
   * @returns {Promise<string>} - 'sha256-...' Hash
   */
  async generateHash(content) {
    const key = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
    const hashArray = Array.from(new Uint8Array(key));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `'sha256-${hashHex}'`;
  }
  
  /**
   * Fügt einen Hash zur CSP hinzu
   * @param {string} type - 'script-src' oder 'style-src'
   * @param {string} content - Inline Content
   * @returns {Promise<void>}
   */
  async addHash(type, content) {
    const hash = await this.generateHash(content);
    
    if (!this.hashes.has(type)) {
      this.hashes.set(type, []);
    }
    this.hashes.get(type).push(hash);
  }
  
  /**
   * Scannt das DOM nach Inline Scripts/Styles und generiert Hashes
   * @returns {Promise<void>}
   */
  async scanAndHashInlineContent() {
    if (typeof document === 'undefined') return;
    
    // Inline Scripts scannen
    const scripts = document.querySelectorAll('script:not([src]):not([type])');
    for (const script of scripts) {
      if (script.textContent) {
        await this.addHash('scriptSrc', script.textContent);
      }
    }
    
    // Inline Styles scannen
    const styles = document.querySelectorAll('style:not([media])');
    for (const style of styles) {
      if (style.textContent) {
        await this.addHash('styleSrc', style.textContent);
      }
    }
    
    // Inline Event Handler (onclick, etc.) scannen
    const elementsWithHandlers = document.querySelectorAll('[onclick], [onload], [onerror]');
    for (const element of elementsWithHandlers) {
      const handlers = ['onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout'];
      for (const handler of handlers) {
        const content = element.getAttribute(handler);
        if (content) {
          await this.addHash('scriptSrc', content);
        }
      }
    }
  }
  
  /**
   * Baut CSP Direktive zusammen
   * @param {string} directive - Direktivenname
   * @param {Array} sources - Quellenliste
   * @param {Array} additionalHashes - Zusätzliche Hashes
   * @returns {string}
   */
  buildDirective(directive, sources = [], additionalHashes = []) {
    const allSources = [...sources];
    
    // Hashes hinzufügen
    if (this.hashes.has(directive)) {
      allSources.push(...this.hashes.get(directive));
    }
    allSources.push(...additionalHashes);
    
    if (allSources.length === 0) {
      return `${directive};`;
    }
    
    return `${directive} ${allSources.join(' ')};`;
  }
  
  /**
   * Generiert vollständige CSP Policy
   * @param {Object} overrides - Optionale Overrides
   * @returns {string}
   */
  generatePolicy(overrides = {}) {
    const policy = [];
    
    // Alle Direktiven bauen
    const directives = {
      'default-src': this.options.defaultSrc,
      'script-src': [...(this.options.scriptSrc || [])],
      'style-src': [...(this.options.styleSrc || [])],
      'font-src': this.options.fontSrc,
      'img-src': this.options.imgSrc,
      'connect-src': this.options.connectSrc,
      'media-src': this.options.mediaSrc,
      'object-src': this.options.objectSrc,
      'child-src': this.options.childSrc,
      'frame-src': this.options.frameSrc,
      'worker-src': this.options.workerSrc,
      'manifest-src': this.options.manifestSrc
    };
    
    // Overrides anwenden
    Object.assign(directives, overrides);
    
    // Direktiven zur Policy hinzufügen
    for (const [directive, sources] of Object.entries(directives)) {
      if (sources && sources.length > 0) {
        policy.push(this.buildDirective(directive, sources));
      }
    }
    
    // Upgrade insecure requests
    if (this.options.upgradeInsecureRequests) {
      policy.push('upgrade-insecure-requests;');
    }
    
    return policy.join(' ');
  }
  
  /**
   * Generiert Meta-Tag für CSP
   * @param {Object} overrides
   * @returns {string}
   */
  generateMetaTag(overrides = {}) {
    const policy = this.generatePolicy(overrides);
    const encoded = encodeURIComponent(policy);
    return `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
  }
  
  /**
   * Injiziert CSP Meta-Tag in den Head
   * @param {Object} overrides
   * @returns {Promise<void>}
   */
  async injectMetaTag(overrides = {}) {
    if (typeof document === 'undefined') return;
    
    // Zuerst scannen für Hashes
    await this.scanAndHashInlineContent();
    
    // Meta-Tag generieren
    const metaTag = this.generateMetaTag(overrides);
    
    // In Head injizieren
    const head = document.head;
    const existing = head.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    if (existing) {
      existing.setAttribute('content', this.generatePolicy(overrides));
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute('content', this.generatePolicy(overrides));
      head.appendChild(meta);
    }
  }
  
  /**
   * Generiert HTTP Header für CSP
   * @param {Object} overrides
   * @returns {string}
   */
  generateHeader(overrides = {}) {
    return this.generatePolicy(overrides);
  }
  
  /**
   * Validiert eine CSP Policy
   * @param {string} policy
   * @returns {Object}
   */
  validatePolicy(policy) {
    const errors = [];
    const warnings = [];
    
    // Prüfen auf 'unsafe-inline' ohne Hashes
    if (policy.includes("'unsafe-inline'")) {
      warnings.push("'unsafe-inline' detected - consider using hashes instead");
    }
    
    // Prüfen auf 'unsafe-eval'
    if (policy.includes("'unsafe-eval'")) {
      warnings.push("'unsafe-eval' detected - security risk");
    }
    
    // Prüfen auf wildcard (*)
    if (policy.includes(' * ') || policy.includes(' *;')) {
      warnings.push("Wildcard (*) detected - consider specific sources");
    }
    
    // Prüfen auf http:// URLs
    if (policy.includes('http://')) {
      errors.push('HTTP URLs detected - use HTTPS only');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Setzt eine Option
   * @param {string} key
   * @param {any} value
   */
  setOption(key, value) {
    this.options[key] = value;
  }
  
  /**
   * Setzt mehrere Optionen
   * @param {Object} options
   */
  setOptions(options) {
    Object.assign(this.options, options);
  }
  
  /**
   * Gibt aktuelle Konfiguration zurück
   * @returns {Object}
   */
  getConfig() {
    return {
      options: { ...this.options },
      hashes: Object.fromEntries(this.hashes)
    };
  }
  
  /**
   * Setzt zurück auf Standardwerte
   */
  reset() {
    this.hashes.clear();
    this.options = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: true
    };
  }
}

// Convenience Funktion für schnelle Nutzung
async function generateCSP(options = {}) {
  const generator = new CSPGenerator(options);
  await generator.scanAndHashInlineContent();
  return generator.generatePolicy();
}

// Auto-Global Export
if (typeof window !== 'undefined') {
  window.CSPGenerator = CSPGenerator;
  window.generateCSP = generateCSP;
}

// Module Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CSPGenerator, generateCSP };
}
