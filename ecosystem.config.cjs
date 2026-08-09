/**
 * PM2 — Plateforme-AFD (releases + current + shared + logs)
 *
 * Structure VPS :
 *   /home/afd-rdc.org/apps/plateforme-afd/
 *     current -> releases/<stamp>
 *     shared/.env.production
 *     logs/
 *     ecosystem.config.cjs
 *
 * Aucun secret dans ce fichier.
 * Utilisateur PM2 recommandé : afdrd7787
 */
const path = require("node:path");

const appRoot = process.env.VPS_APP_PATH
  ? path.resolve(process.env.VPS_APP_PATH)
  : __dirname;

const currentDir = path.join(appRoot, "current");
const logsDir = path.join(appRoot, "logs");
const envFile = path.join(appRoot, "shared", ".env.production");

module.exports = {
  apps: [
    {
      name: "plateforme-afd",
      cwd: currentDir,
      script: path.join(".next", "standalone", "server.js"),
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
      },
      env_production: {
        NODE_ENV: "production",
        HOSTNAME: "127.0.0.1",
        PORT: process.env.PORT || "3000",
      },
      // PM2 charge ce fichier (pas de secrets hardcodés ici).
      env_file: envFile,
    },
  ],
};
