/**
 * PM2 — Plateforme-AFD
 *
 * cwd DOIT être current/.next/standalone (pas current/).
 * Aucun secret ici.
 */
const path = require("node:path");

const appRoot = process.env.VPS_APP_PATH
  ? path.resolve(process.env.VPS_APP_PATH)
  : __dirname;

const standaloneDir = path.join(appRoot, "current", ".next", "standalone");
const logsDir = path.join(appRoot, "logs");
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
      max_memory_restart: "700M",
      time: true,
      merge_logs: true,
      out_file: path.join(logsDir, "out.log"),
      error_file: path.join(logsDir, "error.log"),
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: process.env.PORT || "3000",
        GIT_SHA: process.env.GIT_SHA || process.env.AFD_RELEASE_SHA || "",
      },
      env_production: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: process.env.PORT || "3000",
        GIT_SHA: process.env.GIT_SHA || process.env.AFD_RELEASE_SHA || "",
      },
      env_file: envFile,
    },
  ],
};
