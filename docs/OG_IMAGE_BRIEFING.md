# OG Image Design Briefing

## Ziel
Ein professionelles Open Graph Image für Social Media Shares (Facebook, LinkedIn, Twitter)

## Spezifikationen
- **Format:** PNG oder JPG
- **Größe:** 1200 x 630 Pixel (1.91:1 Ratio)
- **Dateiname:** `og-image.png`
- **Speicherort:** Root-Verzeichnis (`/og-image.png`)

## Design-Vorgaben

### Farben (aus style.css)
- **Hintergrund:** `#07070f` (Dark) oder `#7c3aed` (Violett-Gradient)
- **Akzent:** `#f59e0b` (Gold)
- **Text:** `#e8e8f4` (Hell)
- **Sekundär:** `#a78bfa` (Violett hell)

### Layout-Struktur
```
[Logo/Symbol oben links]     ✦ (Goldenes Symbol)

[Haupt-Headline zentriert]
"Dein numerologisches Profil"
- Schrift: Cinzel oder ähnliche Serif
- Größe: 60-80px
- Farbe: Gold (#f59e0b) oder Weiß

[Subheadline darunter]
"36 Kennzahlen · Lebenszahl · Archetyp"
- Schrift: Outfit oder Sans-Serif
- Größe: 32-40px
- Farbe: Hellviolett (#a78bfa)

[Bottom Bar]
🔒 100% lokal · Kostenlos · Ohne Account
- Schrift: 24px
- Farbe: Text-Mid (#8888b0)

[Background]
- Subtiles Gitternetz (wie in der App)
- Dezenter Violett-Gold-Gradient
- Optionale Zahlen-Symbole (11, 22, 33, 7, 9)
```

### Elemente die drauf müssen
1. ✦ Symbol (Gold, groß)
2. "Numerologie" Branding
3. "36 Zahlen" Value Proposition
4. Trust-Signale (🔒, "kostenlos", "ohne Account")

### Elemente die NICHT drauf sollen
- Keine Screenshots der App
- Keine langen URLs
- Kein "http://" Text

## Tools zum Erstellen

### Option A: Canva (Empfohlen)
1. https://www.canva.com/
2. "Custom Size" → 1200 x 630 px
3. Farben eingeben (#07070f, #f59e0b, #7c3aed)
4. Texte einfügen
5. Download als PNG

### Option B: Figma (Professioneller)
1. Frame: 1200 x 630
2. Farben aus Style-Guide
3. Export: PNG @2x

## Beispiel-Texte für das Image

**Headline:**
"Was sagt dein Name über dich aus?"

**Subheadline:**
"Berechne deine 36 persönlichen Zahlen"

**Bottom Text:**
"✦ Kostenlos  ·  🔒 Datenschutz  ·  ⚡ Sofort"

## Nach dem Erstellen

1. Datei als `og-image.png` speichern
2. In Root-Verzeichnis legen (neben index.html)
3. Testen: https://www.opengraph.xyz/

## Aktueller Status in index.html

Der OG Image Tag ist bereits vorhanden:
```html
<meta property="og:image" content="https://flase-mbrn.github.io/NumerologieRechner/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

**Wichtig:** Das Bild muss genau diesen Pfad haben, sonst funktioniert der Share nicht!
