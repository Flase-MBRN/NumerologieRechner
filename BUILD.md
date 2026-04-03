# Numerologie Rechner v7.0 — Build Guide

## Schnellstart

### 1. Build-Tools installieren
```bash
npm install -g terser clean-css-cli
```

### 2. Build ausführen
```bash
node build.js
```

### 3. HTML anpassen (Production)
In `index.html`:
- `numerology.js` → `numerology.min.js`
- `style.css` → `style.min.css`

---

## Manuelle Minifikation (Alternative)

### JavaScript mit Terser
```bash
# Mit Source Map
terser numerology.js -o numerology.min.js -c -m --source-map

# Ohne Source Map
terser numerology.js -o numerology.min.js -c -m

# Nur Kompression, keine Mangle
terser numerology.js -o numerology.min.js -c -m reserved=['const CACHE_VERSION = \'v7.0.0\';']
```

Optionen:
- `-c` = Komprimieren
- `-m` = Variablen umbenennen (mangle)
- `--source-map` = Source Map erstellen

### CSS mit clean-css
```bash
# Standard
cleancss -o style.min.css style.css

# Mit Source Map
cleancss -o style.min.css style.css --source-map

# Optimierungslevel 2 (aggressiver)
cleancss -o style.min.css style.css --level 2
```

---

## Erwartete Ergebnisse

| Datei | Original | Minifiziert | Einsparung |
|-------|----------|-------------|------------|
| numerology.js | ~114 KB | ~55-65 KB | ~45-50% |
| style.css | ~63 KB | ~45-50 KB | ~20-25% |
| **Gesamt** | **~177 KB** | **~100-115 KB** | **~35-40%** |

---

## GitHub Pages Deployment

Da GitHub Pages keine Build-Pipeline hat:

1. Lokal builden: `node build.js`
2. Minifizierte Dateien committen:
   ```bash
   git add numerology.min.js style.min.css
   git commit -m "v7.0: Add minified assets"
   git push
   ```
3. Für Development: Unminifizierte Versionen behalten

---

## Performance-Tipps

### 1. Lazy Loading für Akkordeons
Bereits implementiert via `hidden` Attribute.

### 2. Font Loading
- `preconnect` zu fonts.googleapis.com bereits vorhanden
- `display=swap` für Fonts bereits aktiv

### 3. Cache-Strategie
- Service Worker mit Cache-First für Fonts
- Network-First für App-Shell

### 4. Bildoptimierung
- OG-Image als PNG (bere vorhanden)
- Icons als SVG + PNG Fallback

---

## Lighthouse-Ziele

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95
