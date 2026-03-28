# Numerologie Rechner v1.0 🧮✨

[![Deploy Status](https://github.com/Flase-MBRN/NumerologieRechner/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/Flase-MBRN/NumerologieRechner/actions)
[![CodeQL](https://github.com/Flase-MBRN/NumerologieRechner/workflows/CodeQL%20Security%20Scan/badge.svg)](https://github.com/Flase-MBRN/NumerologieRechner/security)

> **Berechne deine 36 persönlichen Zahlen:** Lebenszahl, Seelenzahl, Archetyp, Karma — kostenlos, privat, lokal im Browser.

🌐 **Live:** https://flase-mbrn.github.io/NumerologieRechner/

## ✨ Features

### Numerologie-Engine
- 🎯 **Lebensweg-Zahl** mit Archetyp-System
- 💫 **Seelen-Zahl** (innere Motivation)
- 🎭 **Ausdrucks-Zahl** (äußere Persönlichkeit)
- 🔮 **Geburts-Zahl** (natürliche Talente)
- ⚡ **Meister-Zahlen** (11, 22, 33) Erkennung
- 🌀 **Karmische Schulden** (13, 14, 16, 19)
- 📊 **Lo-Shu Psychomatrix** (3×3 Gitter)
- 🌊 **Ebenen-Analyse** (Physisch, Emotional, Geistig, Intuitiv)
- ⚛️ **Quantum Score** (Kohärenz-Berechnung)
- 💕 **Kompatibilitäts-Check** (2-Personen-Vergleich)

### UX & Design
- 🎨 **Cosmic Premium UI** (Violett × Gold)
- 🌓 **Dark/Light Mode**
- 📱 **Mobile-First** (responsive bis 320px)
- 🖨️ **Print-Optimierung** (A4/PDF-ready)
- ♿ **Accessibility** (ARIA, Keyboard, Screenreader)
- 🚀 **PWA** (offline-fähig, installierbar)

### Technisch
- 🔒 **100% Client-Side** (keine Datenübertragung)
- 📦 **Progressive Web App** (Service Worker)
- 🎨 **Canvas Share Cards** (1080×1080, 1080×1920)
- 📜 **History** (letzte 5 Berechnungen)
- 🐛 **Error Tracking** (Sentry)
- 📊 **Analytics** (DSGVO-konform, optional)

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Flase-MBRN/NumerologieRechner.git
cd NumerologieRechner

# Lokaler Server
npx serve .

# Tests
npm test
npm run test:coverage

# E2E Tests
npx playwright test
```

## 🧪 Testing

| Type | Command | Status |
|------|---------|--------|
| Unit Tests | `npm test` | Vitest + jsdom |
| E2E Tests | `npx playwright test` | Cross-browser |
| Lighthouse | `npm run lighthouse` | Performance 90+ |
| Accessibility | `axe-core` | WCAG 2.1 AA |

## 🛡️ Sicherheit & Datenschutz

- ✅ **Keine Datenübertragung** (alles lokal im Browser)
- ✅ **DSGVO-konform** (Impressum, Datenschutz, Datenexport)
- ✅ **CSP Headers** (Content Security Policy)
- ✅ **HTTPS enforced**
- ✅ **CodeQL Scanning** (automatisierter Security-Scan)

## 🏗️ Architektur

```
NumerologieRechner/
├── index.html          # Hauptseite (SPA)
├── style.css           # Stylesheet (~1700 Zeilen)
├── numerology.js       # Kern-Engine (~2700 Zeilen)
├── manifest.json       # PWA Manifest
├── sw.js               # Service Worker
├── sitemap.xml         # SEO Sitemap
├── robots.txt          # Crawler-Anweisungen
├── 404.html            # Error-Seite
├── impressum.html      # Impressum (DSGVO)
├── datenschutz.html    # Datenschutz (DSGVO)
├── package.json        # NPM Konfiguration
├── vitest.config.js    # Unit Test Config
├── playwright.config.js # E2E Test Config
├── .github/workflows/  # CI/CD (Deploy, CodeQL)
├── tests/              # Unit Tests
├── e2e/                # E2E Tests
├── assets/             # Favicons, JS Configs
└── docs/               # Dokumentation
```

## 📊 Performance Budget

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.8s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |
| Accessibility Score | > 95 | ✅ |

## 📄 Changelog

### v8.9 (Launch-Ready)
- ✅ DSGVO Datenexport-Funktion
- ✅ Sitemap.xml + Robots.txt
- ✅ Error Tracking (Sentry)
- ✅ Offline-Indikator
- ✅ CSP Security Headers
- ✅ Schema.org JSON-LD
- ✅ 404-Seite
- ✅ CI/CD Pipeline (GitHub Actions)
- ✅ Security Scanning (CodeQL)
- ✅ Testing Setup (Vitest + Playwright)

Siehe [CHANGELOG.md](CHANGELOG.md) für vollständige Historie.

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 👤 Autor

**Erik Klauß** - [@Flase-MBRN](https://github.com/Flase-MBRN)

---

<p align="center">Made with 💜 and numbers ✨</p>
