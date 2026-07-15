# VAISHworld.exe

A five-page interactive site: Landing (agreement + image upload) → blank transition page → Pacman/maze page → QR page → Feedback page.

## Structure

```
vaishworld/
  client/   React app (Vite)
  server/   Node/Express API (image upload, QR generation, feedback storage)
```

## Requirements

- Node.js 18+
- npm

## 1. Install

From the project root, install both apps:

```bash
cd server && npm install
cd ../client && npm install
```

## 2. Run

Open two terminals.

**Terminal 1 — server** (runs on http://localhost:5000):
```bash
cd server
npm run dev
```

**Terminal 2 — client** (runs on http://localhost:5173):
```bash
cd client
npm run dev
```

Then open http://localhost:5173 in your browser.

## Page flow

1. **/** — Landing / agreement page. Upload a picture ("For Authentication") and click **Submit** → navigates to Page 2 and uploads the image to the server (`POST /api/upload`).
2. **/page-2** — Intentionally blank for now. Click anywhere to continue to the Pacman page.
3. **/pacman** — "LEVEL 2 — Find the Coffee" maze graphic. Non-interactive for now (per request). A small "Continue" control moves you to the QR page.
4. **/qr** — "End of Transmission" copy with a QR code fetched from the server (`GET /api/qr`), generated fresh each time. Click the QR card to continue to the feedback page.
5. **/feedback** — Collage layout with placeholder `image.png` tiles (swap the `src` values in `FeedbackPage.jsx` — they're marked with `TODO: replace with real image link`) plus a feedback textarea that posts to `POST /api/feedback`.

## Server endpoints

- `POST /api/upload` — multipart form field `image`, stores the authentication picture in `server/uploads/`.
- `GET /api/qr` — returns a PNG QR code (generated with the `qrcode` package, encoding a random per-request token) as `image/png`.
- `POST /api/feedback` — JSON body `{ "message": "..." }`, appends to `server/feedback.json`.

## Notes

- All copy from the original slides is preserved verbatim.
- The 5 palette colors (`#d7c6a8`, `#31080B`, `#952530`, `#641920`, `#c63140`) are defined as CSS variables in `client/src/index.css` and used throughout.
- Wherever a photo/image asset was referenced in the brief, the code points at `image.png` placeholders (in `client/public/`) — swap those files or the `src` paths later.
