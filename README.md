# KAAM — Quick Available Assistance Manpower

Full-stack app: **React (Vite)** + **Express** + **MongoDB**. Connects clients with local workers (bookings, OTP auth, worker profiles, reviews).

**Repository:** [github.com/OnkarThengare/KAAM-kaam-quick-available-assistance-manpower-](https://github.com/OnkarThengare/KAAM-kaam-quick-available-assistance-manpower-)

## Project layout

| Folder | Role |
|--------|------|
| `client/` | React SPA — run `npm install` and `npm run dev` |
| `server/` | REST API — run `npm install` and `npm run dev` |
| Root `package.json` | Optional: `npm run dev` runs client + server together (after `npm install` at repo root) |

## Local setup

1. **MongoDB Atlas** (or local MongoDB) — copy connection string.
2. **`server/.env`** — copy from `server/.env.example` and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=http://localhost:5173`. For OTP email, add `GMAIL_USER` + `GMAIL_APP_PASSWORD` or use `DEMO_MODE=true` for on-screen codes.
3. **`client/.env`** — usually empty in dev (Vite proxies `/api` to the backend). If the API uses another port, set `VITE_PROXY_API=http://127.0.0.1:PORT`.
4. Start **server** then **client** (or `npm run dev` from repo root after installing root deps).

## Production deploy (summary)

- **API (e.g. [Render](https://render.com)):** Root directory `server/`, start `npm start`. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your live frontend URL), and optional email vars. See **`DEPLOY.md`**.
- **Frontend (e.g. [Vercel](https://vercel.com)):** Root directory `client/`, build `npm run build`, output `dist`. Set **`VITE_API_URL=https://your-api-host/api`** (example: `https://kaam-backend.onrender.com/api`).

**`client/vercel.json`** is included so SPA routes work on Vercel.

Details, email (OTP), and troubleshooting: **`DEPLOY.md`**.

## API quick check

- `GET /` — HTML in a browser; JSON if requested without `Accept: text/html`.
- `GET /api` — Health JSON (`emailConfigured`, etc.).
