/**
 * MBRN Core Calculations Module
 * Mathematische Kern-Funktionen für Numerologie
 */

'use strict';

// ═══════════════════════════════════════════════════════════
// KONSTANTEN
// ═══════════════════════════════════════════════════════════

export const PYTHAGORAS = {
  1: ['A','J','S'], 2: ['B','K','T'], 3: ['C','L','U'],
  4: ['D','M','V'], 5: ['E','N','W'], 6: ['F','O','X'],
  7: ['G','P','Y'], 8: ['H','Q','Z'], 9: ['I','R'],
};

export const VOWELS = new Set(['A','E','I','O','U']);
export const MASTER_NUMBERS = new Set([11, 22, 33]);
export const KARMIC_DEBT_NUMS = new Set([13, 14, 16, 19]);

export const PLANES = {
  mental:    new Set([1, 5, 9]),
  emotional: new Set([2, 3, 6]),
  physical:  new Set([4, 8]),
  intuitive: new Set([7]),
};

// ═══════════════════════════════════════════════════════════
// MATHEMATISCHE KERN-FUNKTIONEN
// ═══════════════════════════════════════════════════════════

export function digitSum(n) {
  return String(n).split('').reduce((s, d) => s + parseInt(d, 10), 0);
}

export function reduceForceSingle(n) {
  if (n === 0) return 0;
  while (n > 9) n = digitSum(n);
  return n;
}

export function reducePreserveMaster(n) {
  if (n === 0) return 0;
  if (MASTER_NUMBERS.has(n)) return n;
  while (n > 9) { 
    n = digitSum(n); 
    if (MASTER_NUMBERS.has(n)) break; 
  }
  return n;
}

export function formatValue(rawSum) {
  const normal = reduceForceSingle(rawSum);
  const master = reducePreserveMaster(rawSum);
  if (MASTER_NUMBERS.has(master) && master !== normal) return `${normal}/${master}`;
  return String(normal);
}

export function parseDisplayValue(displayValue) {
  const s = String(displayValue);
  if (s.includes('/')) {
    const [b, m] = s.split('/').map(Number);
    return { base: b, master: m };
  }
  return { base: Number(s), master: null };
}

export function findKarmicDebt(rawSum) {
  let n = rawSum;
  while (n > 9) {
    if (KARMIC_DEBT_NUMS.has(n)) return n;
    n = digitSum(n);
  }
  return null;
}

// ═══════════════════════════════════════════════════════════
// NAMENS-FUNKTIONEN
// ═══════════════════════════════════════════════════════════

export function normalizeName(name) {
  return name.toUpperCase()
    .replace(/Ä/g,'AE').replace(/Ö/g,'OE')
    .replace(/Ü/g,'UE').replace(/ß/g,'SS');
}

export function charToNumber(char) {
  for (const [num, chars] of Object.entries(PYTHAGORAS)) {
    if (chars.includes(char)) return parseInt(num, 10);
  }
  return 0;
}

export function nameToNumbers(name) {
  if (!name || typeof name !== 'string') return [];
  return normalizeName(name).replace(/\s+/g,'').split('')
    .map(ch => charToNumber(ch)).filter(n => n > 0);
}

// Y-Vokal-Regel
export function isYVowel(name, position) {
  const normalized = normalizeName(name);
  const chars = normalized.replace(/\s+/g, '').split('');
  const yIndex = chars.indexOf('Y');
  if (yIndex === -1) return false;
  
  const before = chars[yIndex - 1];
  const after = chars[yIndex + 1];
  
  // Y ist Vokal wenn kein Vokal direkt davor UND danach
  const beforeIsVowel = before && VOWELS.has(before);
  const afterIsVowel = after && VOWELS.has(after);
  
  return !beforeIsVowel && !afterIsVowel;
}

// ═══════════════════════════════════════════════════════════
// DATUMS-FUNKTIONEN
// ═══════════════════════════════════════════════════════════

export function parseDate(dateStr) {
  // Format: TT.MM.JJJJ
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return null;
  
  const [_, day, month, year] = match;
  return {
    day: parseInt(day, 10),
    month: parseInt(month, 10),
    year: parseInt(year, 10),
    dayStr: day,
    monthStr: month,
    yearStr: year
  };
}

export function isValidDate(dateStr) {
  const parsed = parseDate(dateStr);
  if (!parsed) return false;
  
  const { day, month, year } = parsed;
  
  // Basis-Validierung
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Tages-Validierung pro Monat
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Schaltjahr-Check
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeapYear) daysInMonth[1] = 29;
  
  return day <= daysInMonth[month - 1];
}

// ═══════════════════════════════════════════════════════════
// KOMPATIBILITÄTS-BERECHNUNGEN
// ═══════════════════════════════════════════════════════════

export function calculateCompatibility(lifePath1, lifePath2) {
  // Einfacher Kompatibilitäts-Algorithmus basierend auf Lebenszahlen
  const num1 = parseInt(lifePath1, 10);
  const num2 = parseInt(lifePath2, 10);
  
  if (isNaN(num1) || isNaN(num2)) return null;
  
  // Harmonische Zahlen
  const harmonies = {
    1: [1, 3, 5, 9],
    2: [2, 4, 6, 8],
    3: [1, 3, 5, 9],
    4: [2, 4, 6, 8],
    5: [1, 3, 5, 9],
    6: [2, 4, 6, 8],
    7: [7, 9],
    8: [2, 4, 6, 8],
    9: [1, 3, 5, 7, 9]
  };
  
  const isHarmonic = harmonies[num1]?.includes(num2) || harmonies[num2]?.includes(num1);
  const sameNumber = num1 === num2;
  
  // Basis-Score: 60-95%
  let score = 60;
  if (sameNumber) score += 25;
  if (isHarmonic) score += 20;
  
  // Zufällige Variation für Authentizität (immer gleich für gleiche Paare)
  const variation = ((num1 * 7 + num2 * 13) % 15) - 7;
  
  return Math.min(98, Math.max(45, score + variation));
}
