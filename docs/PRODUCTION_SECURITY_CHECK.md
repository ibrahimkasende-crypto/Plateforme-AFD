# Checklist sécurité production — Plateforme-AFD

## Runtime

- [ ] Node écoute uniquement `127.0.0.1:3000` (`HOSTNAME=127.0.0.1`)
- [ ] Port 3000 **non** ouvert sur l’Internet (firewall)
- [ ] Accès public uniquement via OpenLiteSpeed HTTPS → proxy
- [ ] PM2 géré par `afdrd7787` (pas root dans GitHub Actions)

## Fichiers

- [ ] `/home/afd-rdc.org/apps/plateforme-afd/shared/.env.production` → `chmod 600` `chown afdrd7787`
- [ ] Aucune clé privée dans le dépôt Git
- [ ] Deploy Key GitHub en **lecture seule**
- [ ] Secret Actions `VPS_SSH_PRIVATE_KEY` = clé **Actions → VPS** (distincte de la Deploy Key)

## Application

- [ ] `SUPABASE_SERVICE_ROLE_KEY` jamais en `NEXT_PUBLIC_*`
- [ ] Mot de passe SMTP jamais journalisé
- [ ] `/api/health` sans secrets
- [ ] `/api/health/dependencies` protégé si token défini
- [ ] Flags démo désactivés en prod réelle

## CyberPanel / SSH

- [ ] Fail2ban actif
- [ ] Mot de passe admin CyberPanel fort + 2FA si possible
- [ ] Connexion root SSH désactivée après validation du compte `afdrd7787` + sudo
- [ ] DNS email (MX/SPF/DKIM/DMARC) **non modifié** par le déploiement web

## GitHub

- [ ] Dépôt privé
- [ ] Environment `production` protégé (reviewers optionnels)
- [ ] Secrets listés uniquement dans Settings → Secrets (jamais dans YAML)
