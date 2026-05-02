# Emirates ID — Node.js Prototype

Minimal Node.js + Express app that reads an Emirates ID card from a smartcard reader, parses the signed XML response, and exposes a clean JSON API.

## What this is

A working prototype of a web-based Emirates ID reader. The browser talks to a local FAIC Toolkit Agent (Windows service) for card I/O, then sends the signed XML response to this Node backend, which returns clean structured JSON. Suitable for back-office workstations, kiosks, and admin tools — **not** for general end-user identity flows on arbitrary devices (use UAE Pass for that).

## Architecture

```
Browser (Windows PC)  ──HTTP──▶  Node server (this app)
        │
        └──WebSocket──▶  Toolkit Agent (Windows service on same PC)
                              │
                              └──USB──▶  Smartcard reader + Emirates ID
```

The Node server never touches the card directly. The browser reads the card via the local agent and forwards the signed XML to the server's `/api/parse-public-data` endpoint, which returns clean JSON.

## Prerequisites

On every PC that reads cards (Windows only):

1. Smartcard reader (HID Omnikey 3121 or any PC/SC-compliant reader)
2. FAIC Toolkit Agent (`ICAToolkitService.msi`) installed with `CONFIG_DIRECTORY` pointed at your encrypted FAIC config bundle
3. Hosts entry: `127.0.0.1 toolkitagent.emiratesid.ae`
4. Node.js LTS — https://nodejs.org

The agent + configs are not in this repo. Get them from the FAIC developer portal.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:8080/`. Click Initialize → Read Public Data.

On Windows, you can double-click `start.bat` instead — it runs `npm install` on first launch and opens the browser automatically.

## Run on Ubuntu

The Node code is cross-platform. On a server:

```bash
npm install --omit=dev
node server.js
```

Or with PM2 in production:

```bash
npm install -g pm2
npm install --omit=dev
pm2 start server.js --name eid-app
pm2 save
```

The agent itself is Windows-only and stays on each end-user PC. The server only handles HTML/JS hosting and the JSON API — it doesn't need a card reader.

## JSON API

### `POST /api/parse-public-data`

Convert a card's signed XML response into structured JSON.

**Request**
```json
{
  "xml": "<ValidationGatewayResponse>...</ValidationGatewayResponse>",
  "verify": false
}
```

`verify: true` runs XMLDSig signature verification first and refuses to parse a forged or tampered response.

**Response (success)**
```json
{
  "status": "SUCCESS",
  "signature": null,
  "data": {
    "request":        { "service": "...", "action": "...", "requestId": "...", "timestamp": "...", "cardSerialNumber": "..." },
    "responseStatus": "Success",
    "identity": {
      "idNumber":            "...",
      "cardNumber":          "...",
      "issueDate":           "...",
      "expiryDate":          "...",
      "fullNameEnglish":     "...",
      "fullNameArabic":      "...",
      "gender":              "M",
      "dateOfBirth":         "...",
      "nationality":         { "code": "PAK", "english": "Pakistan", "arabic": "..." }
    },
    "occupation":    { "code": "...", "english": "...", "arabic": "...", "...": "..." },
    "family":        { "...": "..." },
    "sponsor":       { "...": "..." },
    "residency":     { "...": "..." },
    "passport":      { "number": "...", "...": "..." },
    "qualification": { "...": "..." },
    "homeAddress":   { "email": "...", "mobilePhoneNumber": "...", "...": "..." },
    "workAddress":   { "...": "..." }
  }
}
```

Empty fields come back as `null`. Always pass `verify: true` in production.

### Other endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api` | Lists all endpoints |
| `GET` | `/health` | Liveness probe |
| `POST` | `/ToolkitController/pki/encrypt` | Used internally by the SDK for parameter encryption |
| `POST` | `/ToolkitController/pki/encode` | Used internally by the SDK for PIN encoding |
| `POST` | `/ToolkitController/pki/verify` | Used internally by the SDK for XML signature verification |

## Calling the API from another app

```javascript
const r = await fetch('http://localhost:8080/api/parse-public-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ xml: signedXmlFromCard, verify: true })
});
const { data } = await r.json();
console.log(data.identity.fullNameEnglish);
```

## Production checklist

- [ ] Set `verify: true` on every `/api/parse-public-data` call
- [ ] Restrict CORS — replace `app.use(cors())` with `app.use(cors({ origin: 'https://your-domain' }))`
- [ ] Serve over HTTPS (Let's Encrypt + nginx reverse proxy)
- [ ] When over HTTPS, set `agent_tls_enabled: true` in `public/app.js` to avoid mixed-content blocks on the WebSocket
- [ ] Add auth (API key, JWT, session) on the JSON endpoints
- [ ] Add request rate limiting

## Repo layout

```
.
├─ server.js              Express server: /api/* and /ToolkitController/*
├─ package.json           Dependencies
├─ start.bat              Windows convenience launcher
├─ public/
│  ├─ index.html          Minimal UI
│  ├─ app.js              Client logic; calls the SDK and the JSON API
│  └─ eidatoolkit.js      FAIC's browser SDK (see license note below)
└─ README.md
```

## License notes

- Node code in `server.js` and `public/app.js` is yours to use as you like.
- `public/eidatoolkit.js` is FAIC's browser SDK. Check with FAIC before redistributing it as part of a public-facing product.
