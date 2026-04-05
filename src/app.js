/**
 * MBRN Main App Module
 * Integration aller Module und App-Controller
 */

'use strict';

// ═══════════════════════════════════════════════════════════
// MODULE IMPORTS (ES6)
// ═══════════════════════════════════════════════════════════

import { 
  calculateProfile,
  compareProfiles 
} from './core/profile.js';

import { 
  parseCompareParams, 
  createCompareUrl,
  initCompareMode,
  renderComparison,
  createCompareForm 
} from './ui/compare.js';

// ═══════════════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════════════

const AppState = {
  currentProfile: null,
  isCompareMode: false,
  compareData: null,
  history: [],
  
  // Load from localStorage
  init() {
    try {
      const saved = localStorage.getItem('mbrn:history');
      if (saved) {
        this.history = JSON.parse(saved).slice(0, 5);
      }
    } catch (e) {
      if (window.MBRNLogger) {
        window.MBRNLogger.debug('[MBRN] No history found');
      }
    }
  },
  
  saveProfile(profile) {
    this.currentProfile = profile;
    this.addToHistory(profile);
  },
  
  addToHistory(profile) {
    // Avoid duplicates
    this.history = this.history.filter(p => p.name !== profile.meta.name);
    this.history.unshift({
      name: profile.meta.name,
      date: profile.meta.birthdate,
      lifeNumber: profile.lifePath.number,
      timestamp: Date.now()
    });
    this.history = this.history.slice(0, 5);
    
    try {
      localStorage.setItem('mbrn:history', JSON.stringify(this.history));
    } catch (e) {
      // Ignore storage errors
    }
  }
};

// ═══════════════════════════════════════════════════════════
// URL HANDLING
// ═══════════════════════════════════════════════════════════

/**
 * Checkt URL-Parameter beim Start
 */
function checkUrlParams() {
  // Check for compare parameter
  const compareParams = parseCompareParams();
  if (compareParams) {
    if (window.MBRNLogger) {
      window.MBRNLogger.debug('[MBRN] Compare mode detected:', compareParams);
    }
    return { mode: 'compare', data: compareParams };
  }
  
  return { mode: 'normal' };
}

// ═══════════════════════════════════════════════════════════
// MAIN APP INITIALIZATION
// ═══════════════════════════════════════════════════════════

/**
 * Haupt-Initialisierung
 */
export function initApp() {
  if (window.MBRNLogger) {
    window.MBRNLogger.debug('[MBRN] Initializing...');
  }
  
  AppState.init();
  const urlState = checkUrlParams();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check if we have a current profile and compare mode
  if (urlState.mode === 'compare') {
    // Delay compare mode until we have a profile
    AppState.isCompareMode = true;
    AppState.compareData = urlState.data;
  }
  
  if (window.MBRNLogger) {
    window.MBRNLogger.debug('[MBRN] Ready');
  }
  return AppState;
}

/**
 * Führt Berechnung durch und zeigt Ergebnis
 */
export function calculateAndShow(name, birthdate) {
  try {
    const profile = calculateProfile(name, birthdate);
    AppState.saveProfile(profile);
    
    // If compare mode is active, do comparison
    if (AppState.isCompareMode && AppState.compareData) {
      const compareResult = initCompareMode(profile);
      if (compareResult) {
        showComparison(compareResult);
      } else {
        showProfile(profile);
      }
    } else {
      showProfile(profile);
    }
    
    return profile;
  } catch (err) {
    console.error('[MBRN] Calculation error:', err);
    showError(err.message);
    return null;
  }
}

/**
 * Zeigt Profil-Ergebnis
 */
function showProfile(profile) {
  // Trigger custom event for existing UI
  const event = new CustomEvent('mbrn:profileReady', { 
    detail: { profile } 
  });
  document.dispatchEvent(event);
}

/**
 * Zeigt Vergleichs-Ergebnis
 */
function showComparison(data) {
  const container = document.getElementById('comparisonContainer') || 
                    document.getElementById('resultsRegion');
  
  if (container) {
    renderComparison(container, data);
    container.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Trigger event
  const event = new CustomEvent('mbrn:comparisonReady', { 
    detail: data 
  });
  document.dispatchEvent(event);
}

/**
 * Zeigt Fehler
 */
function showError(message) {
  const event = new CustomEvent('mbrn:error', { 
    detail: { message } 
  });
  document.dispatchEvent(event);
}

/**
 * Öffnet Vergleichs-Dialog
 */
export function openCompareDialog() {
  if (!AppState.currentProfile) {
    alert('Bitte berechne zuerst dein eigenes Profil.');
    return;
  }
  
  // Insert compare form if not present
  if (!document.getElementById('compareFormOverlay')) {
    const formHtml = createCompareForm();
    document.body.insertAdjacentHTML('beforeend', formHtml);
    
    // Setup dialog listeners
    document.getElementById('startCompareBtn')?.addEventListener('click', () => {
      const name = document.getElementById('compareName').value;
      const date = document.getElementById('compareDate').value;
      
      if (name && date) {
        const url = createCompareUrl(name, date);
        window.location.href = url;
      }
    });
    
    document.getElementById('cancelCompareBtn')?.addEventListener('click', () => {
      document.getElementById('compareFormOverlay').remove();
    });
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

function setupEventListeners() {
  // Listen for form submission
  const form = document.getElementById('numerologyForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name');
      const dateInput = document.getElementById('birthdate');
      
      if (nameInput && dateInput) {
        calculateAndShow(nameInput.value, dateInput.value);
      }
    });
  }
  
  // Listen for compare button
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-action="compare"]')) {
      openCompareDialog();
    }
  });
}

// ═══════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════

export { AppState };

// Auto-init if DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
