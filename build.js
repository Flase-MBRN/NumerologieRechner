/**
 * build.js — Numerologie v5.0 Build Script
 * Minifies JS and CSS for production
 * 
 * Usage:
 *   npm install -g terser clean-css-cli
 *   node build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = '5.0';

console.log(`🔧 Numerologie Rechner v${VERSION} — Build Script\n`);

// Check if tools are installed
function checkTool(name, command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    console.error(`❌ ${name} nicht gefunden. Installiere mit:`);
    console.error(`   npm install -g ${name.toLowerCase().replace(' ', '-')}`);
    return false;
  }
}

const hasTerser = checkTool('Terser', 'terser');
const hasCleanCSS = checkTool('clean-css', 'cleancss');

if (!hasTerser || !hasCleanCSS) {
  console.error('\n⚠️  Bitte fehlende Tools installieren.');
  process.exit(1);
}

// Minify JS
console.log('📦 Minifiziere JavaScript...');
try {
  execSync('terser numerology.js -o numerology.min.js -c -m --source-map', { stdio: 'inherit' });
  console.log('✅ numerology.min.js erstellt\n');
} catch (err) {
  console.error('❌ Fehler bei JS-Minifikation:', err.message);
}

// Minify CSS
console.log('📦 Minifiziere CSS...');
try {
  execSync('cleancss -o style.min.css style.css --source-map', { stdio: 'inherit' });
  console.log('✅ style.min.css erstellt\n');
} catch (err) {
  console.error('❌ Fehler bei CSS-Minifikation:', err.message);
}

// Calculate savings
const jsOriginal = fs.statSync('numerology.js').size;
const jsMinified = fs.statSync('numerology.min.js').size;
const cssOriginal = fs.statSync('style.css').size;
const cssMinified = fs.statSync('style.min.css').size;

const jsSavings = ((1 - jsMinified / jsOriginal) * 100).toFixed(1);
const cssSavings = ((1 - cssMinified / cssOriginal) * 100).toFixed(1);

console.log('📊 Ergebnisse:');
console.log(`   JavaScript: ${(jsOriginal/1024).toFixed(1)} KB → ${(jsMinified/1024).toFixed(1)} KB (${jsSavings}% kleiner)`);
console.log(`   CSS:        ${(cssOriginal/1024).toFixed(1)} KB → ${(cssMinified/1024).toFixed(1)} KB (${cssSavings}% kleiner)`);
console.log('\n✅ Build abgeschlossen!');
console.log('\n📝 Nächste Schritte:');
console.log('   1. index.html anpassen: numerology.js → numerology.min.js');
console.log('   2. index.html anpassen: style.css → style.min.css');
console.log('   3. Für GitHub Pages: minifizierte Versionen committen');
