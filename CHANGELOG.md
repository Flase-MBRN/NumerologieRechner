# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [8.9.0] - 2026-03-28 - 🚀 LAUNCH-READY

### Added
- ✅ DSGVO Datenexport-Funktion (Art. 20) mit JSON-Download
- ✅ Sitemap.xml und Robots.txt für SEO
- ✅ Error Tracking mit Sentry SDK
- ✅ Offline-Indikator für PWA (visuelles Feedback)
- ✅ CSP (Content Security Policy) Header
- ✅ Schema.org JSON-LD strukturierte Daten
- ✅ 404-Fehlerseite mit Navigation
- ✅ CI/CD Pipeline mit GitHub Actions
- ✅ Security Scanning mit CodeQL
- ✅ Dependency Review Workflow
- ✅ Testing Setup mit Vitest (Unit) und Playwright (E2E)
- ✅ Lighthouse Performance Budget
- ✅ Monitoring-Dokumentation (UptimeRobot)
- ✅ Vollständige README.md mit Badges
- ✅ API Dokumentation (docs/)

### Changed
- 🔧 Impressum um EU-Streitschlichtung ergänzt
- 🔧 Favicon-Set auf vollständige Größen aktualisiert (16-512px)
- 🔧 Meta-Tags erweitert (OG, Twitter Cards)
- 🔧 Canonical URLs implementiert

### Security
- 🔒 CSP Header implementiert
- 🔒 CodeQL Security Scanning aktiviert
- 🔒 Dependency Review Workflow

## [8.8.0] - 2026-03-28 - Release Candidate

### Changed
- 🎨 Versionsnummer auf v8.8 RC konsistent gesetzt (HTML, CSS, JS)
- 🎨 Finale Polishing-Runde für Release

## [8.7.0] - 2026-03-27 - Final Polishing

### Changed
- 🎨 Typografie-Feinschliff
- 🎨 Farb-Harmonisierung
- 🎨 Abstand-Optimierungen

## [8.6.0] - 2026-03-27 - Mobile UX

### Added
- 📱 Touch-Targets auf 48px+ erhöht (Mobile)
- 📱 Responsive Card-Optimierungen
- 📱 History-Chips größer für bessere Touch-Ergonomie

### Changed
- 🔧 Breakpoints für sehr kleine Screens (<360px) optimiert

## [8.5.0] - 2026-03-27 - Print-Optimierung

### Added
- 🖨️ A4/PDF-ready Print-Styles
- 🖨️ Life Hero Print-Optimierung mit Gold-Rahmen
- 🖨️ Profile Strip 3-Spalten im Druck
- 🖨️ Results Grid 2-Spalten im Druck

### Changed
- 🔧 Druck-CSS: Nur Ergebnisse sichtbar, UI-Elemente ausgeblendet

## [8.4.0] - 2026-03-27 - Archetyp-Icons

### Added
- 🎭 Emoji-Icons für alle Lebenszahl-Archetypen
- 🎭 Emoji-Icons für alle Seelenzahl-Archetypen
- 🎭 Icon-Anzeige im Life Hero Display
- 🎭 CSS-Styling für Archetyp-Icons

### Changed
- 🔧 Life Hero HTML um Icon-Span erweitert
- 🔧 numerology.js Life Hero Rendering aktualisiert

## [8.3.0] - 2026-03-26 - Accessibility & Performance

### Added
- ♿ ARIA-Labels auf allen Buttons
- ♿ aria-pressed für History-Chips
- ♿ aria-expanded für Akkordeons
- ♿ Skip-Link für Screenreader
- ⚡ Lazy Loading für Akkordeons via IntersectionObserver

### Changed
- 🔧 Accordion HTML: aria-controls/aria-labelledby korrekt verknüpft
- 🔧 Modal Dialogs mit role="dialog" und aria-describedby

## [8.2.0] - 2026-03-25 - UI Polish

### Added
- ✨ Share Bar Verbesserungen
- ✨ CTA Bar für Conversion
- ✨ Toast-Benachrichtigungen

### Changed
- 🔧 Verbesserte Share-Texte
- 🔧 Quantum Score Visualisierung

## [8.1.0] - 2026-03-24 - History & UX

### Added
- 📜 History Bar (letzte 5 Berechnungen)
- 📜 History-Chips mit aria-pressed
- 🗑️ Clear-History Funktion
- 🌓 Theme Toggle (Dark/Light)

### Changed
- 🔧 localStorage für History und Theme

## [8.0.0] - 2026-03-23 - Foundation

### Added
- 🎯 Numerologie Engine v8.0
- 🎯 36 Kennzahlen Berechnung
- 🎯 PWA Setup (Manifest, Service Worker)
- 🎯 Canvas Share Cards
- 🎯 Cosmic Premium Design (Violett × Gold)
- 🎯 Responsive Design (Mobile-First)

---

## Roadmap / Geplant

### v9.0 (Major)
- 🌍 Multi-Language Support (EN, FR, ES)
- 📄 PDF-Export Funktion
- 🎬 Onboarding-Tour
- 📧 Newsletter-Anmeldung

### v9.1 (Feature)
- 💰 Premium-Features / Monetarisierung
- 📱 Native App Wrapper (Capacitor)
- 🔔 Push Notifications
- 📊 Erweiterte Analytics

### Backlog
- 🎨 Dark Mode Auto-Detection
- 🔐 Optional: Account-System
- ☁️ Optional: Cloud-Sync
- 🤖 AI-basierte Interpretationen

---

## Legende

- 🚀 Release / Launch
- ✅ Added (Neue Features)
- 🔧 Changed (Änderungen)
- 🐛 Fixed (Bugfixes)
- 🔒 Security (Sicherheit)
- ⚡ Performance (Geschwindigkeit)
- ♿ Accessibility (Barrierefreiheit)
- 📱 Mobile (Mobile-Optimierung)
- 🎨 Design (UI/UX)
- 📊 SEO (Suchmaschinenoptimierung)
