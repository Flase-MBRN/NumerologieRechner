/**
 * MBRN Logger v1.0
 * Intelligentes Logging für Development vs Production
 * 
 * @version 1.0.0
 * @author SWE 1.5
 * @license MIT
 */

class MBRNLogger {
  constructor(options = {}) {
    this.prefix = options.prefix || '[MBRN]';
    this.enabled = options.enabled !== false;
    this.debugEnabled = this._isDevelopment();
    this.performanceEnabled = options.performance !== false;
    
    // Globaler Zugriff
    if (typeof window !== 'undefined') {
      window.MBRNLogger = this;
    }
  }
  
  /**
   * Prüft ob wir im Development Mode sind
   * @private
   * @returns {boolean}
   */
  _isDevelopment() {
    if (typeof window === 'undefined') return false;
    
    // Check für localhost, 127.0.0.1, oder file://
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || 
                   hostname === '127.0.0.1' || 
                   hostname.startsWith('192.168.') ||
                   hostname.startsWith('10.') ||
                   window.location.protocol === 'file:';
    
    // Check für development flag in URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasDevFlag = urlParams.has('dev') || urlParams.has('debug');
    
    // Check für console in development
    const hasConsole = typeof console !== 'undefined';
    
    return isLocal || hasDevFlag || (hasConsole && console.clear);
  }
  
  /**
   * Formatiert die Log-Message
   * @private
   * @param {string} level - Log Level
   * @param {string} message - Message
   * @param {any} args - Zusätzliche Argumente
   * @returns {Array}
   */
  _format(level, message, ...args) {
    const timestamp = new Date().toISOString().slice(11, 23);
    const prefix = `%c${this.prefix} ${level} ${timestamp}`;
    const styles = this._getLevelStyles(level);
    
    return [prefix, styles, message, ...args];
  }
  
  /**
   * Gibt CSS Styles für Log-Level zurück
   * @private
   * @param {string} level
   * @returns {string}
   */
  _getLevelStyles(level) {
    const styles = {
      DEBUG: 'color: #6b7280; font-weight: 400;',
      INFO: 'color: #3b82f6; font-weight: 500;',
      WARN: 'color: #f59e0b; font-weight: 600;',
      ERROR: 'color: #ef4444; font-weight: 700;',
      PERF: 'color: #8b5cf6; font-weight: 600;'
    };
    return styles[level] || styles.INFO;
  }
  
  /**
   * Debug Log (nur im Development)
   * @param {string} message
   * @param {...any} args
   */
  debug(message, ...args) {
    if (!this.enabled || !this.debugEnabled) return;
    
    if (typeof console !== 'undefined' && console.debug) {
      const formatted = this._format('DEBUG', message, ...args);
      console.debug(...formatted);
    }
  }
  
  /**
   * Info Log (immer sichtbar)
   * @param {string} message
   * @param {...any} args
   */
  info(message, ...args) {
    if (!this.enabled) return;
    
    if (typeof console !== 'undefined' && console.info) {
      const formatted = this._format('INFO', message, ...args);
      console.info(...formatted);
    }
  }
  
  /**
   * Warning Log (immer sichtbar)
   * @param {string} message
   * @param {...any} args
   */
  warn(message, ...args) {
    if (!this.enabled) return;
    
    if (typeof console !== 'undefined' && console.warn) {
      const formatted = this._format('WARN', message, ...args);
      console.warn(...formatted);
    }
  }
  
  /**
   * Error Log (immer sichtbar, auch in Production)
   * @param {string} message
   * @param {...any} args
   */
  error(message, ...args) {
    if (!this.enabled) return;
    
    if (typeof console !== 'undefined' && console.error) {
      const formatted = this._format('ERROR', message, ...args);
      console.error(...formatted);
    }
  }
  
  /**
   * Performance Messung
   * @param {string} label - Label für die Messung
   * @param {Function} fn - Zu messende Funktion
   * @returns {any} - Resultat der Funktion
   */
  perf(label, fn) {
    if (!this.enabled || !this.performanceEnabled) {
      return fn();
    }
    
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.debug(`${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  
  /**
   * Async Performance Messung
   * @param {string} label
   * @param {Function} fn - Async Funktion
   * @returns {Promise<any>}
   */
  async perfAsync(label, fn) {
    if (!this.enabled || !this.performanceEnabled) {
      return fn();
    }
    
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.debug(`${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  
  /**
   * Gruppierte Logs
   * @param {string} label
   * @param {Function} fn
   */
  group(label, fn) {
    if (!this.enabled || !this.debugEnabled) return fn();
    
    if (typeof console !== 'undefined' && console.group) {
      console.group(`${this.prefix} ${label}`);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  }
  
  /**
   * Tabelle für strukturierte Daten
   * @param {Array|Object} data
   * @param {string} title
   */
  table(data, title = '') {
    if (!this.enabled || !this.debugEnabled) return;
    
    if (typeof console !== 'undefined' && console.table) {
      if (title) this.info(title);
      console.table(data);
    }
  }
  
  /**
   * Assert für Debugging
   * @param {boolean} condition
   * @param {string} message
   */
  assert(condition, message) {
    if (!this.enabled || !this.debugEnabled) return;
    
    if (typeof console !== 'undefined' && console.assert) {
      console.assert(condition, `${this.prefix} ASSERT: ${message}`);
    } else if (!condition) {
      this.error(`ASSERT FAILED: ${message}`);
    }
  }
  
  /**
   * Logger deaktivieren
   */
  disable() {
    this.enabled = false;
  }
  
  /**
   * Logger aktivieren
   */
  enable() {
    this.enabled = true;
  }
  
  /**
   * Debug Mode aktivieren/deaktivieren
   * @param {boolean} enabled
   */
  setDebugMode(enabled) {
    this.debugEnabled = enabled;
  }
  
  /**
   * Gibt aktuelle Konfiguration zurück
   * @returns {Object}
   */
  getConfig() {
    return {
      enabled: this.enabled,
      debugEnabled: this.debugEnabled,
      performanceEnabled: this.performanceEnabled,
      isDevelopment: this._isDevelopment()
    };
  }
}

// Singleton Instanz erstellen
const logger = new MBRNLogger();

// Auto-Global Export
if (typeof window !== 'undefined') {
  window.logger = logger;
  window.MBRNLogger = MBRNLogger;
}

// Module Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MBRNLogger, logger };
}

// Convenience Aliases für Migration
if (typeof window !== 'undefined') {
  window.log = {
    debug: (...args) => logger.debug(...args),
    info: (...args) => logger.info(...args),
    warn: (...args) => logger.warn(...args),
    error: (...args) => logger.error(...args),
    perf: (...args) => logger.perf(...args),
    perfAsync: (...args) => logger.perfAsync(...args),
    group: (...args) => logger.group(...args),
    table: (...args) => logger.table(...args),
    assert: (...args) => logger.assert(...args)
  };
}
