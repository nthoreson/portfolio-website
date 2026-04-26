require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { syncEvents } = require('./sync');

const app = express();
const PORT = process.env.PORT || 3000;
const EVENTS_FILE = path.join(__dirname, 'events.json');

// Allow iframe embedding (Notion) and set a permissive CSP
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
  );
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calendar.html'));
});

app.get('/api/events', (req, res) => {
  try {
    const raw = fs.readFileSync(EVENTS_FILE, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(raw);
  } catch {
    res.json([]);
  }
});

app.get('/sync', async (req, res) => {
  try {
    const count = await syncEvents();
    const ts = new Date().toISOString();
    console.log(`[${ts}] Manual sync complete — ${count} events`);
    res.json({ ok: true, count, synced_at: ts });
  } catch (err) {
    const ts = new Date().toISOString();
    console.error(`[${ts}] Manual sync failed:`, err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Nightly sync at 2am server time
cron.schedule('0 2 * * *', async () => {
  const ts = new Date().toISOString();
  try {
    const count = await syncEvents();
    console.log(`[${ts}] Cron sync complete — ${count} events`);
  } catch (err) {
    console.error(`[${ts}] Cron sync failed:`, err.message);
  }
});

// Initial sync on startup
(async () => {
  const ts = new Date().toISOString();
  try {
    const count = await syncEvents();
    console.log(`[${ts}] Startup sync complete — ${count} events`);
  } catch (err) {
    console.error(`[${ts}] Startup sync failed:`, err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${new Date().toISOString()}] Server listening on 0.0.0.0:${PORT}`);
  });
})();
