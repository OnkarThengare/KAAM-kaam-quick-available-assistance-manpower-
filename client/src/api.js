/**
 * In dev, leave VITE_API_URL unset to use same-origin `/api` (Vite proxies to the backend).
 * For production build, set VITE_API_URL=https://your-api.com/api
 */
function getApiBase() {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (!raw) {
    return "/api";
  }
  let base = raw.replace(/\/$/, "");
  if (base.startsWith("http") && !base.endsWith("/api")) {
    base = `${base}/api`;
  }
  return base;
}

const API_BASE = getApiBase();

function getToken() {
  return localStorage.getItem("kaam_token");
}

export async function api(path, options = {}) {
  const rel = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${rel}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const text = await res.text();
  const isJson =
    res.headers.get("content-type")?.includes("application/json") ?? false;

  let data = {};
  if (isJson && text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || "Invalid JSON" };
    }
  } else if (!res.ok) {
    data = {
      message:
        text?.replace(/<[^>]+>/g, " ").slice(0, 200) ||
        res.statusText ||
        "Request failed",
    };
  }

  if (!res.ok) {
    let msg = data.message || `Request failed (${res.status})`;

    if (
      /cannot\s+post\s+\/api/i.test(msg) ||
      /cannot\s+get\s+\/api/i.test(msg) ||
      /api\s+unreachable/i.test(msg)
    ) {
      msg =
        "API is not reachable. In dev: (1) Run the backend (server/: npm run dev). (2) In the server console, note the port (e.g. 8001). Set the same in client/.env as VITE_PROXY_API=http://127.0.0.1:THAT_PORT — then restart Vite. (3) Or set VITE_API_URL=http://127.0.0.1:THAT_PORT/api. Production: set VITE_API_URL to your live API URL ending in /api.";
    }

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export { API_BASE };
