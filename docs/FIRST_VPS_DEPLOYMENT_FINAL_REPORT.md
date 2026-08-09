# Rapport final — déploiement VPS Plateforme-AFD

Date : 2026-08-09  
Domaine : https://afd-rdc.org  
VPS : 187.55.230.121  
User app : afdrd7787  

## Cause réelle du 404 public

1. **nghttpx** occupait `127.0.0.1:3000` (proxy sample → OLS:80) → health local faux HTML.  
2. Après libération du port + PM2 online : proxy OLS manquant.  
3. Échec script proxy précédent :  
   `[ERROR] context:/.well-known/ path is not accessible: .../public_html/.well-known/`  
   + rollback déclenché à tort sur WARN `lshttpd -t`.

## Corrections appliquées

- `nghttpx.service` arrêté/désactivé  
- PM2 `plateforme-afd` sur `current/.next/standalone` → `:3000`  
- Vhost `/usr/local/lsws/conf/vhosts/afd-rdc.org/vhost.conf` :  
  - `extprocessor plateforme-afd` → `127.0.0.1:3000`  
  - `context /` type proxy  
  - ACME `/.well-known/acme-challenge` **conservé**  
- Validation : ignore WARN, échoue seulement sur ERROR  
- Backup : `/root/ols-afd-proxy-backup-20260809-161959`

## Validations finales

| Contrôle | Résultat |
|---|---|
| `http://127.0.0.1:3000/api/health` | **200** JSON `"status":"ok"` |
| `https://afd-rdc.org/api/health` | **200** JSON `"status":"ok"` |
| `https://afd-rdc.org/` | **200** (assets `/_next/static/...`, headers Next/CSP) |
| SSL | Let’s Encrypt `CN=afd-rdc.org`, valide jusqu’au **2026-11-06** |
| Reverse proxy | **actif** (LiteSpeed → Node :3000) |
| SHA release | `79572536c98c5602a2d7fbb51a7ea997f95f4228` |

## Post-déploiement recommandé

1. **Changer le mot de passe root** (exposé en chat) + privilégier clé SSH.  
2. `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u afdrd7787 --hp /home/afd-rdc.org`  
3. Configurer secrets GitHub Actions `VPS_*` pour `git push origin main`.  
4. Ne pas réactiver `nghttpx` sur le port 3000.

## Verdict

**PRODUCTION PUBLIC OK** — domaine servi via reverse proxy vers Next.js standalone, health JSON 200.
