/**
 * MBRN Compare Module
 * Vergleichs-Modus für zwei Profile
 */

'use strict';

import { calculateProfile, compareProfiles } from '../core/profile.js';
import { isValidDate } from '../core/calculations.js';

// ═══════════════════════════════════════════════════════════
// URL PARAMETER HANDLING
// ═══════════════════════════════════════════════════════════

/**
 * Parst Vergleichs-Parameter aus URL
 * Format: ?compare=Name,TT.MM.JJJJ oder ?with=Name,TT.MM.JJJJ
 */
export function parseCompareParams() {
  const params = new URLSearchParams(window.location.search);
  const compareParam = params.get('compare') || params.get('with');
  
  if (!compareParam) return null;
  
  // Format: "Name,TT.MM.JJJJ" oder "Name TT.MM.JJJJ"
  const parts = compareParam.includes(',') 
    ? compareParam.split(',')
    : compareParam.split(' ');
  
  if (parts.length < 2) return null;
  
  const name = parts[0].trim();
  const date = parts[1].trim();
  
  if (!isValidDate(date)) return null;
  
  return { name, date };
}

/**
 * Erstellt Vergleichs-URL
 */
export function createCompareUrl(name, date) {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeURIComponent(`${name},${date}`);
  return `${baseUrl}?compare=${encoded}`;
}

// ═══════════════════════════════════════════════════════════
// VERGLEICHS-UI
// ═══════════════════════════════════════════════════════════

/**
 * Initialisiert Vergleichs-Modus
 */
export function initCompareMode(myProfile) {
  const compareData = parseCompareParams();
  if (!compareData) return null;
  
  try {
    const otherProfile = calculateProfile(compareData.name, compareData.date);
    const comparison = compareProfiles(myProfile, otherProfile);
    
    return {
      myProfile,
      otherProfile,
      comparison,
      shareUrl: createCompareUrl(compareData.name, compareData.date)
    };
  } catch (err) {
    console.error('[Compare] Error:', err);
    return null;
  }
}

/**
 * Rendert Vergleichs-Ansicht
 */
export function renderComparison(container, data) {
  const { myProfile, otherProfile, comparison } = data;
  
  container.innerHTML = `
    <div class="comparison-container">
      <header class="comparison-header">
        <h2>Kompatibilitäts-Analyse</h2>
        <div class="overall-score">
          <span class="score-value">${comparison.overall.score}%</span>
          <span class="score-label">Harmonie-Score</span>
        </div>
        <p class="comparison-summary">${comparison.overall.summary}</p>
      </header>
      
      <div class="profiles-side-by-side">
        <div class="profile-card profile-mine">
          <h3>${escapeHtml(myProfile.meta.name)}</h3>
          <div class="life-number">${myProfile.lifePath.number}</div>
          <div class="archetype">${myProfile.lifePath.archetype?.emoji} ${myProfile.lifePath.archetype?.name}</div>
          ${renderMiniLoShu(myProfile.loShu.grid)}
        </div>
        
        <div class="comparison-connector">
          <div class="connector-line"></div>
          <div class="connector-score">${comparison.overall.score}%</div>
        </div>
        
        <div class="profile-card profile-other">
          <h3>${escapeHtml(otherProfile.meta.name)}</h3>
          <div class="life-number">${otherProfile.lifePath.number}</div>
          <div class="archetype">${otherProfile.lifePath.archetype?.emoji} ${otherProfile.lifePath.archetype?.name}</div>
          ${renderMiniLoShu(otherProfile.loShu.grid)}
        </div>
      </div>
      
      <div class="comparison-details">
        <div class="detail-section">
          <h4>Lebenszahl-Kompatibilität</h4>
          <div class="compatibility-bar">
            <div class="bar-fill" style="width: ${comparison.lifePath.compatibility}%"></div>
            <span>${comparison.lifePath.compatibility}% – ${comparison.lifePath.description}</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Lo-Shu Resonanz</h4>
          <p>Gemeinsame Zahlen: ${comparison.loShu.sharedNumbers.join(', ') || 'Keine'}</p>
          <div class="compatibility-bar">
            <div class="bar-fill" style="width: ${comparison.loShu.score}%"></div>
            <span>${comparison.loShu.score}% Übereinstimmung</span>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Seelenzahl-Resonanz</h4>
          <p>${comparison.soul.resonance 
            ? '✨ Gleiche Seelenzahl – Tiefe emotionale Verbindung' 
            : 'Unterschiedliche Seelenzahlen – Komplementäre Energien'}</p>
        </div>
      </div>
      
      <div class="comparison-actions">
        <button class="btn btn--primary" id="shareComparisonBtn">
          <span>🔗</span> Vergleich teilen
        </button>
        <button class="btn btn--secondary" id="newComparisonBtn">
          <span>🔄</span> Neuen Vergleich
        </button>
      </div>
    </div>
  `;
  
  // Event Listeners
  document.getElementById('shareComparisonBtn')?.addEventListener('click', () => {
    shareComparison(data);
  });
  
  document.getElementById('newComparisonBtn')?.addEventListener('click', () => {
    showCompareInputDialog();
  });
}

/**
 * Rendert Mini Lo-Shu Grid
 */
function renderMiniLoShu(grid) {
  const cells = [];
  const layout = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];
  
  layout.forEach((row, rowIndex) => {
    row.forEach((num, colIndex) => {
      const count = grid[num] || 0;
      const hasNumber = count > 0;
      cells.push(`
        <div class="mini-cell ${hasNumber ? 'filled' : 'empty'}" 
             style="grid-row: ${rowIndex + 1}; grid-column: ${colIndex + 1};"
             title="${num}: ${count}x">
          ${hasNumber ? num : ''}
          ${count > 1 ? `<sub>${count}</sub>` : ''}
        </div>
      `);
    });
  });
  
  return `<div class="mini-loshu">${cells.join('')}</div>`;
}

/**
 * Teilt Vergleich
 */
async function shareComparison(data) {
  const { otherProfile, comparison } = data;
  const shareText = `Wir sind zu ${comparison.overall.score}% kompatibel! 🎯\n\n${otherProfile.meta.name} trifft auf ${data.myProfile.meta.name}\nLebenszahl ${data.myProfile.lifePath.number} trifft auf ${otherProfile.lifePath.number}\n\nVergleiche dich auch: ${data.shareUrl}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Unsere Numerologie-Kompatibilität',
        text: shareText,
        url: data.shareUrl
      });
    } catch (err) {
      console.log('Share cancelled');
    }
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Link kopiert! Füge ihn in WhatsApp, Instagram oder einen Messenger ein.');
    });
  }
}

/**
 * Zeigt Dialog für neuen Vergleich
 */
function showCompareInputDialog() {
  const name = prompt('Name der anderen Person:');
  if (!name) return;
  
  const date = prompt('Geburtsdatum (TT.MM.JJJJ):');
  if (!date || !isValidDate(date)) {
    alert('Ungültiges Datum. Format: TT.MM.JJJJ');
    return;
  }
  
  const url = createCompareUrl(name, date);
  window.location.href = url;
}

/**
 * Hilfsfunktion: HTML escapen
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════
// VERGLEICHS-FORM (für manuelle Eingabe)
// ═══════════════════════════════════════════════════════════

/**
 * Erstellt Vergleichs-Formular
 */
export function createCompareForm() {
  return `
    <div class="compare-form-overlay" id="compareFormOverlay">
      <div class="compare-form">
        <h3>Vergleiche dein Profil</h3>
        <p>Gib Name und Geburtsdatum einer anderen Person ein</p>
        
        <div class="input-group">
          <label>Name</label>
          <input type="text" id="compareName" placeholder="Vorname Nachname">
        </div>
        
        <div class="input-group">
          <label>Geburtsdatum</label>
          <input type="text" id="compareDate" placeholder="TT.MM.JJJJ" pattern="\\d{2}\\.\\d{2}\\.\\d{4}">
        </div>
        
        <div class="button-row">
          <button class="btn btn--primary" id="startCompareBtn">Vergleichen</button>
          <button class="btn btn--ghost" id="cancelCompareBtn">Abbrechen</button>
        </div>
      </div>
    </div>
  `;
}
