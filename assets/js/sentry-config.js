/**
 * Sentry Error Tracking Configuration
 * v8.9 - Launch-Ready Setup
 * 
 * Setup:
 * 1. Registriere dich bei https://sentry.io (kostenlos für Open Source)
 * 2. Erstelle ein neues Projekt: "numerologie-rechner"
 * 3. Kopiere die DSN und ersetze YOUR_SENTRY_DSN_HERE unten
 * 4. Aktiviere Performance Monitoring in Sentry Settings
 */

(function() {
  'use strict';

  // Konfiguration
  const SENTRY_DSN = null; // Deaktiviert - ersetze mit echtem DSN wenn Sentry aktiv werden soll
  const ENVIRONMENT = window.location.hostname === 'localhost' ? 'development' : 'production';
  const RELEASE = '2.1.0'; // Numerologie Premium Version

  // Sentry nur laden wenn DSN konfiguriert
  if (!SENTRY_DSN || SENTRY_DSN.includes('YOUR_SENTRY') || SENTRY_DSN.includes('654321')) {
    // Sentry deaktiviert - kein Error Tracking
    return;
  }

  // Sentry Loader Script dynamisch laden
  const script = document.createElement('script');
  script.src = 'https://js.sentry-cdn.com/' + SENTRY_DSN.split('/').pop().split('@')[0] + '.min.js';
  script.crossOrigin = 'anonymous';
  script.onload = initSentry;
  script.onerror = function() {
    console.error('[Sentry] Failed to load SDK');
  };
  document.head.appendChild(script);

  function initSentry() {
    if (typeof Sentry === 'undefined') {
      console.error('[Sentry] SDK not available');
      return;
    }

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENVIRONMENT,
      release: RELEASE,
      
      // Performance Monitoring
      tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
      
      // Error Filtering
      beforeSend: function(event, hint) {
        // Ignoriere bekannte harmlose Fehler
        const error = hint.originalException;
        if (error && error.message) {
          const ignored = [
            'ResizeObserver loop limit exceeded',
            'Script error.',
            'Network Error',
            'Failed to fetch'
          ];
          if (ignored.some(msg => error.message.includes(msg))) {
            return null;
          }
        }
        return event;
      },
      
      // User Feedback bei Crashes
      integrations: [new Sentry.Integrations.UserFeedback()]
    });

    // User Context setzen (anonymisiert)
    Sentry.setUser({
      id: 'anonymous_' + Math.random().toString(36).substr(2, 9),
      session: new Date().toISOString()
    });

    // Tags für bessere Filterung
    Sentry.setTags({
      theme: document.documentElement.getAttribute('data-theme') || 'dark',
      viewport: window.innerWidth + 'x' + window.innerHeight
    });

    // Custom Error Handler für numerology.js
    window.addEventListener('error', function(event) {
      Sentry.captureException(event.error);
    });

    // Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', function(event) {
      Sentry.captureException(event.reason);
    });

    console.log('[Sentry] Error Tracking aktiviert (' + ENVIRONMENT + ')');
  }

  // Globale Error Reporting Funktion
  window.reportError = function(error, context) {
    if (typeof Sentry !== 'undefined') {
      Sentry.withScope(function(scope) {
        if (context) {
          Object.keys(context).forEach(function(key) {
            scope.setExtra(key, context[key]);
          });
        }
        Sentry.captureException(error);
      });
    } else {
      console.error('[Error Report]', error, context);
    }
  };
})();
