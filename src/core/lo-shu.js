/**
 * MBRN Lo-Shu Grid Module
 * Lo-Shu Psychomatrix Berechnungen und Visualisierung
 */

'use strict';

import { reduceForceSingle } from './calculations.js';

// ═══════════════════════════════════════════════════════════
// LO-SHU KONSTANTEN
// ═══════════════════════════════════════════════════════════

export const LO_SHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

// Positionen im Gitter
export const LO_SHU_POSITIONS = {
  1: { row: 2, col: 1, meaning: 'Kern, Selbst, Ego' },
  2: { row: 0, col: 2, meaning: 'Emotionen, Intuition' },
  3: { row: 1, col: 0, meaning: 'Kreativität, Kommunikation' },
  4: { row: 0, col: 0, meaning: 'Stabilität, Ordnung' },
  5: { row: 1, col: 1, meaning: 'Mitte, Balance, Weisheit' },
  6: { row: 2, col: 2, meaning: 'Harmonie, Familie' },
  7: { row: 1, col: 2, meaning: 'Spiritualität, Analyse' },
  8: { row: 2, col: 0, meaning: 'Macht, Material, Erfolg' },
  9: { row: 0, col: 1, meaning: 'Idealismus, Mitgefühl' },
};

// ═══════════════════════════════════════════════════════════
// LO-SHU BERECHNUNGEN
// ═══════════════════════════════════════════════════════════

/**
 * Erstellt Lo-Shu Grid aus Geburtsdatum
 * @param {string} dateStr - Format: TT.MM.JJJJ
 * @returns {Object} Grid mit Zählungen pro Zahl
 */
export function createLoShuGrid(dateStr) {
  const digits = dateStr.replace(/\D/g, '').split('').map(Number);
  
  const grid = {
    1: 0, 2: 0, 3: 0,
    4: 0, 5: 0, 6: 0,
    7: 0, 8: 0, 9: 0,
  };
  
  digits.forEach(d => {
    if (d > 0) grid[d]++;
  });
  
  return grid;
}

/**
 * Analysiert dominante Zahlen im Gitter
 */
export function analyzeLoShu(grid) {
  const dominant = [];
  const missing = [];
  const balanced = [];
  
  for (let i = 1; i <= 9; i++) {
    const count = grid[i];
    if (count >= 3) dominant.push(i);
    if (count === 0) missing.push(i);
    if (count === 1 || count === 2) balanced.push(i);
  }
  
  return {
    dominant,
    missing,
    balanced,
    intensity: calculateIntensity(grid),
    balance: calculateBalance(grid)
  };
}

function calculateIntensity(grid) {
  // Summe aller Zählungen
  const total = Object.values(grid).reduce((a, b) => a + b, 0);
  return total;
}

function calculateBalance(grid) {
  // 5 in der Mitte = Balance
  const center = grid[5];
  const corners = grid[1] + grid[3] + grid[7] + grid[9];
  const edges = grid[2] + grid[4] + grid[6] + grid[8];
  
  return {
    center,
    corners,
    edges,
    isBalanced: center > 0 && Math.abs(corners - edges) <= 2
  };
}

/**
 * Vergleicht zwei Lo-Shu Grids
 */
export function compareLoShu(grid1, grid2) {
  const analysis1 = analyzeLoShu(grid1);
  const analysis2 = analyzeLoShu(grid2);
  
  // Gemeinsame dominante Zahlen
  const sharedDominant = analysis1.dominant.filter(n => analysis2.dominant.includes(n));
  
  // Komplementäre fehlende Zahlen
  const complementary = analysis1.missing.filter(n => !analysis2.missing.includes(n));
  
  // Harmonische Balance
  const bothBalanced = analysis1.balance.isBalanced && analysis2.balance.isBalanced;
  
  return {
    sharedDominant,
    complementary,
    bothBalanced,
    intensity: Math.abs(analysis1.intensity - analysis2.intensity),
    compatibility: calculateGridCompatibility(grid1, grid2)
  };
}

function calculateGridCompatibility(grid1, grid2) {
  // Einfacher Score: Wie ähnlich sind die Verteilungen?
  let similarity = 0;
  let totalDiff = 0;
  
  for (let i = 1; i <= 9; i++) {
    const diff = Math.abs(grid1[i] - grid2[i]);
    totalDiff += diff;
    if (grid1[i] > 0 && grid2[i] > 0) similarity++;
  }
  
  // Score 0-100
  const score = Math.max(0, 100 - (totalDiff * 5));
  return Math.round(score);
}

// ═══════════════════════════════════════════════════════════
// VISUALISIERUNGS-HILFEN
// ═══════════════════════════════════════════════════════════

export function getLoShuDescription(number, count) {
  const meanings = {
    1: { name: 'Ego/Selbst', desc: 'Selbstbewusstsein, Individualität' },
    2: { name: 'Emotionen', desc: 'Empathie, Intuition, Sensibilität' },
    3: { name: 'Kreativität', desc: 'Kommunikation, Ausdruck, Optimismus' },
    4: { name: 'Stabilität', desc: 'Ordnung, Praktikabilität, Verlässlichkeit' },
    5: { name: 'Mitte', desc: 'Balance, Weisheit, Anpassungsfähigkeit' },
    6: { name: 'Harmonie', desc: 'Familie, Verantwortung, Pflege' },
    7: { name: 'Spirit', desc: 'Analyse, Tiefe, Spirituelles' },
    8: { name: 'Macht', desc: 'Material, Erfolg, Anerkennung' },
    9: { name: 'Idealismus', desc: 'Mitgefühl, Großzügigkeit, Weitsicht' },
  };
  
  const base = meanings[number];
  if (!base) return null;
  
  const intensity = count === 0 ? 'Fehlt' : 
                   count === 1 ? 'Ausgeglichen' :
                   count === 2 ? 'Stark' :
                   count >= 3 ? 'Sehr stark' : 'Unbekannt';
  
  return {
    ...base,
    count,
    intensity,
    position: LO_SHU_POSITIONS[number]
  };
}
