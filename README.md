# Global Nutrition AI Coach

A production-ready React app for generating location-aware nutrition plans from a structured intake form.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your server-side `ANTHROPIC_API_KEY`.

   Keep mock mode off when you want real AI reports:

   ```bash
   MOCK_COACH_REPORT=false
   ```

## Development

```bash
npm run dev
```

Vite serves the React app and proxies `/api/coach` through the local Node middleware so the API key stays off the browser.

## Testing

```bash
npm test
npm run test:repeat
```

`test:repeat` runs the full Vitest suite ten times.

## Production

```bash
npm run build
npm run preview
```

The production server serves `dist/` and exposes the same `/api/coach` endpoint. Set `PORT` to change the default `4173` port.
Set `HOST` if you need to bind somewhere other than `127.0.0.1`.

If you see "Demo mode is enabled" in the result, your server is running with `MOCK_COACH_REPORT=true`. Stop the server, set `MOCK_COACH_REPORT=false` or remove that line, then start it again.

## Render Deployment

This repo includes `render.yaml`, so Render can create the web service from a Blueprint.

When Render asks for environment variables, provide your real Anthropic key for `ANTHROPIC_API_KEY`. The key is intentionally marked `sync: false` so it is never committed to GitHub.
