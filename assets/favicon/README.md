# Favicon Setup Guide

## Benötigte Dateien (im assets/favicon/ Ordner)

| Datei | Größe | Zweck |
|-------|-------|-------|
| favicon.ico | 16x16, 32x32 | Browser-Tab, Lesezeichen |
| favicon-16x16.png | 16x16 | Legacy Browser |
| favicon-32x32.png | 32x32 | Retina Displays |
| apple-touch-icon.png | 180x180 | iOS Homescreen |
| icon-192x192.png | 192x192 | Android/PWA |
| icon-512x512.png | 512x512 | PWA Splash |
| mstile-150x150.png | 150x150 | Windows Tiles |
| safari-pinned-tab.svg | Vektor | Safari (monochrom) |

## Generierung

1. Gehe zu: https://realfavicongenerator.net/
2. Lade Logo hoch (mind. 512x512, transparent oder farbig)
3. Wähle Hintergrundfarbe: #07070f (Dark) oder #f2f1f8 (Light)
4. Download Package
5. Entpacke nach assets/favicon/
6. Kopiere HTML-Code in index.html <head>

## Design-Vorgaben

- Primary Color: #7c3aed (Violett)
- Secondary: #f59e0b (Gold)
- Symbol: ✦ oder Zahl im Kreis
- Style: Minimal, Cosmic Premium
