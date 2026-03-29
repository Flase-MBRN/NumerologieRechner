/**
 * MBRN Profile Module
 * Komplettes Numerologie-Profil Berechnung
 */

'use strict';

import { 
  nameToNumbers, 
  reduceForceSingle, 
  reducePreserveMaster,
  formatValue,
  parseDate,
  isValidDate,
  VOWELS,
  isYVowel 
} from './calculations.js';

import { createLoShuGrid, analyzeLoShu } from './lo-shu.js';

// ═══════════════════════════════════════════════════════════
// KONSTANTEN
// ═══════════════════════════════════════════════════════════

export const ARCHETYPES = {
  1: { name: 'Der Innovator', emoji: '🚀', desc: 'Führung, Unabhängigkeit, Originalität' },
  2: { name: 'Der Diplomat', emoji: '🕊️', desc: 'Kooperation, Sensibilität, Balance' },
  3: { name: 'Der Kreative', emoji: '🎨', desc: 'Ausdruck, Optimismus, Sozialität' },
  4: { name: 'Der Baumeister', emoji: '🏗️', desc: 'Stabilität, Praxis, Verlässlichkeit' },
  5: { name: 'Der Freigeist', emoji: '🦅', desc: 'Freiheit, Abenteuer, Anpassung' },
  6: { name: 'Der Nurturer', emoji: '💝', desc: 'Verantwortung, Familie, Pflege' },
  7: { name: 'Der Sucher', emoji: '🔮', desc: 'Analyse, Tiefe, Spiritualität' },
  8: { name: 'Der Macher', emoji: '👑', desc: 'Macht, Material, Anerkennung' },
  9: { name: 'Der Humanist', emoji: '🌟', desc: 'Mitgefühl, Weitsicht, Idealismus' },
  11: { name: 'Der Visionär', emoji: '⚡', desc: 'Intuition, Inspiration, Sensibilität' },
  22: { name: 'Der Meisterbauer', emoji: '🏛️', desc: 'Praktische Vision, Manifestation' },
  33: { name: 'Der Meisterlehrer', emoji: '📿', desc: 'Mitgefühl, Heilung, Führung' },
};

// ═══════════════════════════════════════════════════════════
// HAUPTBERECHNUNGEN
// ═══════════════════════════════════════════════════════════

/**
 * Berechnet komplettes Numerologie-Profil
 */
export function calculateProfile(name, birthdate) {
  if (!isValidDate(birthdate)) {
    throw new Error('Ungültiges Datum. Format: TT.MM.JJJJ');
  }
  
  const parsed = parseDate(birthdate);
  
  // Lebenszahl
  const lifePath = calculateLifePath(parsed);
  
  // Seelenzahl
  const soulUrge = calculateSoulUrge(name);
  
  // Ausdruckszahl
  const expression = calculateExpression(name);
  
  // Persönlichkeitszahl
  const personality = calculatePersonality(name);
  
  // Geburtszahl
  const birthDay = calculateBirthDay(parsed);
  
  // Lo-Shu
  const loShuGrid = createLoShuGrid(birthdate);
  const loShuAnalysis = analyzeLoShu(loShuGrid);
  
  // Persönliches Jahr
  const personalYear = calculatePersonalYear(parsed);
  
  return {
    meta: {
      name: name.trim(),
      birthdate,
      calculatedAt: new Date().toISOString()
    },
    lifePath,
    soulUrge,
    expression,
    personality,
    birthDay,
    loShu: {
      grid: loShuGrid,
      analysis: loShuAnalysis
    },
    personalYear,
    // Kurz-Version für Vergleiche
    summary: {
      lifeNumber: lifePath.number,
      soulNumber: soulUrge.number,
      expressionNumber: expression.number,
      archetype: lifePath.archetype
    }
  };
}

/**
 * Lebenszahl (Life Path Number)
 */
function calculateLifePath(parsed) {
  const { day, month, year } = parsed;
  
  // Komponenten-Methode
  const daySum = reducePreserveMaster(day);
  const monthSum = reducePreserveMaster(month);
  const yearSum = reducePreserveMaster(year);
  
  const total = daySum + monthSum + yearSum;
  const final = reducePreserveMaster(total);
  
  const baseNum = reduceForceSingle(final);
  const archetype = ARCHETYPES[final] || ARCHETYPES[baseNum];
  
  return {
    number: formatValue(total),
    baseNumber: baseNum,
    masterNumber: [11, 22, 33].includes(final) ? final : null,
    daySum,
    monthSum,
    yearSum,
    archetype,
    description: `${archetype?.name}: ${archetype?.desc}`
  };
}

/**
 * Seelenzahl (Soul Urge / Heart's Desire)
 */
function calculateSoulUrge(name) {
  const numbers = nameToNumbers(name);
  const normalized = normalizeName(name);
  
  // Nur Vokale
  let vowelSum = 0;
  const chars = normalized.replace(/\s+/g, '').split('');
  
  chars.forEach((char, i) => {
    if (VOWELS.has(char)) {
      // Y-Vokal-Regel
      if (char === 'Y' && !isYVowel(name, i)) return;
      
      const num = charToNumber(char);
      if (num > 0) vowelSum += num;
    }
  });
  
  const final = reducePreserveMaster(vowelSum);
  const baseNum = reduceForceSingle(final);
  
  return {
    number: formatValue(vowelSum),
    baseNumber: baseNum,
    description: 'Innere Motivation, was du wirklich willst'
  };
}

/**
 * Ausdruckszahl (Expression Number)
 */
function calculateExpression(name) {
  const numbers = nameToNumbers(name);
  const sum = numbers.reduce((a, b) => a + b, 0);
  
  const final = reducePreserveMaster(sum);
  const baseNum = reduceForceSingle(final);
  
  return {
    number: formatValue(sum),
    baseNumber: baseNum,
    description: 'Äußere Persönlichkeit, wie die Welt dich sieht'
  };
}

/**
 * Persönlichkeitszahl (Personality Number)
 */
function calculatePersonality(name) {
  const normalized = normalizeName(name);
  const chars = normalized.replace(/\s+/g, '').split('');
  
  // Nur Konsonanten
  let consonantSum = 0;
  
  chars.forEach(char => {
    if (!VOWELS.has(char)) {
      const num = charToNumber(char);
      if (num > 0) consonantSum += num;
    }
  });
  
  const final = reducePreserveMaster(consonantSum);
  
  return {
    number: formatValue(consonantSum),
    baseNumber: reduceForceSingle(final),
    description: 'Erste Eindruck, äußere Fassade'
  };
}

/**
 * Geburtszahl (Birth Day Number)
 */
function calculateBirthDay(parsed) {
  const { day } = parsed;
  const final = reducePreserveMaster(day);
  
  return {
    number: formatValue(day),
    baseNumber: reduceForceSingle(final),
    description: 'Natürliche Talente, Geschenke'
  };
}

/**
 * Persönliches Jahr
 */
function calculatePersonalYear(parsed) {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  const { month, day } = parsed;
  
  // MM + TT + aktuelles Jahr
  const sum = month + day + currentYear;
  const final = reducePreserveMaster(sum);
  
  const yearThemes = {
    1: 'Neuanfang, Initiative, Unabhängigkeit',
    2: 'Kooperation, Balance, Geduld',
    3: 'Kreativität, Kommunikation, Freude',
    4: 'Stabilität, Arbeit, Fundament',
    5: 'Veränderung, Freiheit, Abenteuer',
    6: 'Verantwortung, Familie, Harmonie',
    7: 'Analyse, Spiritualität, Innenschau',
    8: 'Erfolg, Macht, materieller Fortschritt',
    9: 'Abschluss, Humanität, Großzügigkeit'
  };
  
  return {
    number: final,
    year: currentYear,
    theme: yearThemes[reduceForceSingle(final)],
    description: `Thema für ${currentYear}: ${yearThemes[reduceForceSingle(final)]}`
  };
}

// Hilfsfunktionen (dupliziert für Modul-Autarkie)
function normalizeName(name) {
  return name.toUpperCase()
    .replace(/Ä/g,'AE').replace(/Ö/g,'OE')
    .replace(/Ü/g,'UE').replace(/ß/g,'SS');
}

function charToNumber(char) {
  const PYTHAGORAS = {
    1: ['A','J','S'], 2: ['B','K','T'], 3: ['C','L','U'],
    4: ['D','M','V'], 5: ['E','N','W'], 6: ['F','O','X'],
    7: ['G','P','Y'], 8: ['H','Q','Z'], 9: ['I','R'],
  };
  
  for (const [num, chars] of Object.entries(PYTHAGORAS)) {
    if (chars.includes(char)) return parseInt(num, 10);
  }
  return 0;
}

// ═══════════════════════════════════════════════════════════
// VERGLEICHS-FUNKTIONEN
// ═══════════════════════════════════════════════════════════

/**
 * Vergleicht zwei Profile
 */
export function compareProfiles(profile1, profile2) {
  const lifeNum1 = parseInt(profile1.lifePath.baseNumber, 10);
  const lifeNum2 = parseInt(profile2.lifePath.baseNumber, 10);
  
  // Lo-Shu Vergleich
  const loShuComparison = compareLoShu(profile1.loShu.grid, profile2.loShu.grid);
  
  // Lebenszahl-Kompatibilität
  const lifeCompatibility = calculateLifeCompatibility(lifeNum1, lifeNum2);
  
  // Seelenzahl-Resonanz
  const soulResonance = profile1.soulUrge.baseNumber === profile2.soulUrge.baseNumber;
  
  return {
    lifePath: {
      numbers: [lifeNum1, lifeNum2],
      compatibility: lifeCompatibility,
      description: getCompatibilityDescription(lifeCompatibility)
    },
    loShu: loShuComparison,
    soul: {
      resonance: soulResonance,
      score: soulResonance ? 90 : 60
    },
    overall: {
      score: Math.round((lifeCompatibility + loShuComparison.compatibility + (soulResonance ? 90 : 60)) / 3),
      summary: generateComparisonSummary(profile1, profile2, lifeCompatibility, loShuComparison)
    }
  };
}

function calculateLifeCompatibility(num1, num2) {
  if (num1 === num2) return 95; // Gleiche Zahl = sehr kompatibel
  
  // Harmonische Kombinationen
  const harmonies = {
    1: [3, 5, 9],
    2: [4, 6, 8],
    3: [1, 5, 9],
    4: [2, 6, 8],
    5: [1, 3, 9],
    6: [2, 4, 8],
    7: [7], // 7 passt am besten zu 7
    8: [2, 4, 6],
    9: [1, 3, 5]
  };
  
  if (harmonies[num1]?.includes(num2)) return 85;
  if (harmonies[num2]?.includes(num1)) return 85;
  
  // Komplementäre Zahlen (schwieriger, aber lernt voneinander)
  const challenges = {
    1: [2, 4, 6],
    2: [1, 5, 7],
    3: [7, 8],
    4: [1, 5, 9],
    5: [2, 4, 8],
    6: [1, 3, 9],
    7: [2, 3, 9],
    8: [3, 5, 7],
    9: [4, 6, 7]
  };
  
  if (challenges[num1]?.includes(num2)) return 65;
  
  return 75; // Neutral
}

function getCompatibilityDescription(score) {
  if (score >= 90) return 'Sehr stark – Natürliche Resonanz';
  if (score >= 80) return 'Harmonisch – Gute Synergie';
  if (score >= 70) return 'Ausgeglichen – Wachstumspotenzial';
  return 'Herausfordernd – Lerneffekt';
}

function generateComparisonSummary(p1, p2, lifeScore, loShuComp) {
  const archetype1 = p1.lifePath.archetype?.name;
  const archetype2 = p2.lifePath.archetype?.name;
  
  return `${archetype1} trifft auf ${archetype2}. ${getCompatibilityDescription(lifeScore)}`;
}

// Hilfsfunktion für Lo-Shu Vergleich
function compareLoShu(grid1, grid2) {
  // Importiert aus lo-shu.js
  let similarity = 0;
  let totalDiff = 0;
  
  for (let i = 1; i <= 9; i++) {
    const diff = Math.abs(grid1[i] - grid2[i]);
    totalDiff += diff;
    if (grid1[i] > 0 && grid2[i] > 0) similarity++;
  }
  
  const score = Math.max(0, 100 - (totalDiff * 5));
  
  return {
    similarity,
    score: Math.round(score),
    sharedNumbers: Object.keys(grid1).filter(n => grid1[n] > 0 && grid2[n] > 0).map(Number)
  };
}
