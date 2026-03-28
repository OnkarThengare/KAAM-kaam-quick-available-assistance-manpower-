import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_TARGET =
    env.VITE_PROXY_API?.trim() ||
    env.VITE_DEV_API_ORIGIN?.trim() ||
    "http://127.0.0.1:8000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
          configure(proxy) {
            proxy.on("error", (err, _req, res) => {
              console.error(
                "[KAAM] API proxy error — is the backend running?",
                err?.code || err?.message || err
              );
              if (res && !res.headersSent) {
                res.writeHead(502, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    message:
                      "API unreachable. Start the server from the server/ folder (e.g. npm run dev) on the same port as VITE_PROXY_API, or set VITE_API_URL=http://127.0.0.1:PORT/api in client/.env",
                  })
                );
              }
            });
          },
        },
      },
    },
  };
});
