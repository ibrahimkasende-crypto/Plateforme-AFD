/**
 * PM2 — Plateforme-AFD (releases + current + shared)
 *
 * Structure VPS attendue :
 *   $APP_ROOT/
 *     current -> releases/<stamp>
 *     shared/.env.production
 *     shared/logs/
 *     ecosystem.config.cjs   (ce fichier, à la racine APP_ROOT)
 *
 * Les secrets ne sont PAS codés ici.
 */
const path = require("node:path");

const appRoot = process.env.VPS_APP_PATH
  ? path.resolve(process.env.VPS_APP_PATH)
  : __dirname;

const standaloneDir = path.join(appRoot, "current", ".next", "standalone");
const logsDir = path.join(appRoot, "shared", "logs");
const envFile = path.join(appRoot, "shared", ".env.production");

module.exports = {
  apps: [
    {
      name: "plateforme-afd",
      cwd: standaloneDir,
      script: "server.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "750M",
      time: true,
      merge_logs: true,
      out_file: path.join(logsDir, "out.log"),
      error_file: path.join(logsDir, "error.log"),
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: process.env.PORT || "3000",
      },
      env_production: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: process.env.PORT || "3000",
      },
      // PM2 5.2+ charge ce fichier ; sinon le script de déploiement exporte les vars.
      env_file: envFile,
    },
  ],
};
