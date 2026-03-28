# Deploying KAAM (production checklist)

Stack: **MongoDB Atlas** + **Node/Express API** + **static React (Vite)**.

## 1. MongoDB Atlas

1. Create a cluster and a database user.
2. Network access: allow **0.0.0.0/0** (or your API host IPs only).
3. Copy **SRV connection string** → `MONGO_URI` (replace `<password>` with the DB user password).

## 2. Email (required for real OTP in inbox)

The API sends OTP only when email is configured. Open `GET https://your-api.../api` and check **`emailConfigured": true`**.

**Gmail (quick for demos)**

1. Enable 2-Step Verification on the Google account.
2. Create an [App Password](https://myaccount.google.com/apppasswords).
3. On the **server** host, set:

   - `GMAIL_USER` = that Gmail address  
   - `GMAIL_APP_PASSWORD` = 16-character app password (spaces optional)

**Resend (recommended for production)**

1. Sign up at [resend.com](https://resend.com), add API key → `RESEND_API_KEY`.
2. Set `RESEND_FROM` to a verified sender, e.g. `KAAM <otp@yourdomain.com>`.
3. Trial: `onboarding@resend.dev` only delivers to the email tied to your Resend account until you verify a domain.

## 3. Backend (API) environment

Set on your Node host (Render, Railway, Fly.io, VPS, etc.):

| Variable | Example |
|----------|---------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Atlas SRV string |
| `JWT_SECRET` | Long random string (32+ chars) |
| `CLIENT_URL` | Your live frontend URL(s), comma-separated if needed |
| `PORT` | Usually provided by host (e.g. Render sets automatically) |
| Email | `GMAIL_USER` + `GMAIL_APP_PASSWORD` **or** `RESEND_API_KEY` + `RESEND_FROM` **or** full `SMTP_*` |

**Turn off dev features in production:**

- `DEMO_MODE=false`
- `OTP_DEBUG=false`

**Repo API root:** `server/`. Start command: `npm start` (`node server.js`).

Optional: use `render.yaml` in this repo as a starting point for Render.

**Render: `Missing environment variable: JWT_SECRET`**

In production the API **exits** if `JWT_SECRET` is unset. In the Render dashboard: **Environment** → **Add environment variable** → `JWT_SECRET` = a long random string (e.g. run `openssl rand -hex 32` locally, or use a password manager). Redeploy.

Also set **`MONGO_URI`** (Atlas) and **`CLIENT_URL`** (your live frontend URL, comma-separated if several). The blueprint’s `render.yaml` can include `JWT_SECRET` with `generateValue: true` so Render creates one on first deploy—if you created the service manually, add `JWT_SECRET` yourself.

## 4. Frontend (Vite) build

Build from `client/`:

```bash
cd client
npm ci
```

Create **production** env (or host UI variables):

```env
VITE_API_URL=https://your-api-host.onrender.com/api
```

Use the **public HTTPS URL** of your API, including the `/api` suffix if your server mounts routes under `/api`.

Then:

```bash
npm run build
```

Deploy the `client/dist` folder to **Netlify**, **Vercel**, **Cloudflare Pages**, or serve behind Nginx with the API on another subdomain.

### Same domain (optional)

If you reverse-proxy `/api` on the same host as the SPA, you can set `VITE_API_URL=/api` and avoid CORS issues; ensure `CLIENT_URL` on the API matches the SPA origin.

## 5. Smoke tests after deploy

1. `GET /api` → `health: ok`, `emailConfigured: true`.
2. Sign up with a real email → message arrives (check spam).
3. Resend OTP from the verify page.
4. Login after verification.

If OTP never arrives but `emailConfigured` is true, read API logs for `[KAAM] OTP email failed` and fix provider credentials or spam policy.
