# Monitoring & Uptime Setup

## UptimeRobot (Kostenlos)

1. **Registriere dich** bei https://uptimerobot.com/
2. **Erstelle neuen Monitor:**
   - Type: HTTP(s)
   - Friendly Name: Numerologie Rechner
   - URL: https://flase-mbrn.github.io/NumerologieRechner/
   - Monitoring Interval: 5 Minuten
   
3. **Alert Contacts einrichten:**
   - E-Mail: erikk2k5@gmail.com
   - Optional: Telegram, Discord, Slack Webhook
   
4. **Status Page (optional):**
   - Erstelle öffentliche Status Page
   - Custom Domain: status.numerologie-rechner.de

## Alternativen

- **Pingdom** (kostenpflichtig, aber professioneller)
- **Better Uptime** (schönes UI, kostenlos)
- **Upptime** (Open Source, GitHub Actions-basiert)

## Status Badges

Füge dieses Badge zur README hinzu:

```markdown
![Uptime](https://img.shields.io/uptimerobot/status/monitor-id)
![Response Time](https://img.shields.io/uptimerobot/response/monitor-id)
```

## Health Check Endpunkt

Da es sich um eine statische Seite handelt, reicht ein einfacher HTTP-Check.
Falls später ein Backend kommt, erstelle `/api/health`:

```javascript
// api/health.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '8.9.0'
  });
}
```
