#Requires -Version 5.1
<#
.SYNOPSIS
  Prépare une paire de clés SSH dédiée GitHub Actions → VPS (afdrd7787).

.DESCRIPTION
  - Génère ed25519 dans %USERPROFILE%\.ssh\ (hors dépôt Git)
  - Affiche uniquement le chemin de la clé publique
  - N'affiche jamais la clé privée
  - N'envoie jamais la clé privée ailleurs
#>

$ErrorActionPreference = "Stop"

$KeyPath = Join-Path $env:USERPROFILE ".ssh\github_actions_afd_production"
$PubPath = "$KeyPath.pub"
$SshKeygen = Join-Path $env:WINDIR "System32\OpenSSH\ssh-keygen.exe"

if (-not (Test-Path $SshKeygen)) {
  throw "ssh-keygen introuvable: $SshKeygen"
}

New-Item -ItemType Directory -Force -Path (Split-Path $KeyPath -Parent) | Out-Null

if ((Test-Path $KeyPath) -and (Test-Path $PubPath)) {
  Write-Host "Paire existante réutilisée (aucune régénération)."
} else {
  & $SshKeygen -t ed25519 -C "github-actions-afd-production" -f $KeyPath -N '""' -q
  if ($LASTEXITCODE -ne 0) { throw "ssh-keygen a échoué (code $LASTEXITCODE)" }
  Write-Host "Paire générée."
}

if (-not (Test-Path $PubPath)) {
  throw "Clé publique manquante: $PubPath"
}

Write-Host ""
Write-Host "Clé publique (chemin) :"
Write-Host "  $PubPath"
Write-Host ""
Write-Host "Clé privée (chemin, ne pas afficher le contenu) :"
Write-Host "  $KeyPath"
Write-Host ""
Write-Host "Étapes suivantes :"
Write-Host "  1. Ajouter le contenu de la clé PUBLIQUE dans authorized_keys du VPS (user afdrd7787)."
Write-Host "  2. Coller le contenu COMPLET de la clé PRIVÉE dans GitHub :"
Write-Host "     Settings → Secrets and variables → Actions → New repository secret"
Write-Host "     Nom : VPS_SSH_PRIVATE_KEY"
Write-Host "  3. Créer aussi VPS_HOST, VPS_PORT, VPS_USER, VPS_APP_PATH."
Write-Host "  4. Ne jamais committer ces fichiers."
Write-Host ""
Write-Host "Voir : scripts/setup-github-actions-ssh.md"
