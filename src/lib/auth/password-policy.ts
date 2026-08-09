/**
 * Politique de mot de passe AFD (côté serveur et UI).
 * Ne stocke jamais de mot de passe ; rejette les modèles temporaires AFD-xxx.
 */

const COMMON_PASSWORDS = new Set(
  [
    "password",
    "password123",
    "motdepasse",
    "motdepasse1",
    "123456789012",
    "azertyuiop12",
    "qwertyuiop12",
    "adminadmin12",
    "afdadmin1234",
    "changeme1234",
    "welcome12345",
  ].map((p) => p.toLowerCase()),
);

export type PasswordPolicyContext = {
  email?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type PasswordPolicyResult = {
  ok: boolean;
  message?: string;
  score: number;
};

function hasUpper(s: string) {
  return /[A-ZÀ-Ÿ]/.test(s);
}
function hasLower(s: string) {
  return /[a-zà-ÿ]/.test(s);
}
function hasDigit(s: string) {
  return /\d/.test(s);
}
function hasSpecial(s: string) {
  return /[^A-Za-zÀ-ÿ0-9]/.test(s);
}

/** Modèles de mots de passe temporaires institutionnels (préfixe AFD- + 3 chiffres). */
function isTemporaryPattern(password: string): boolean {
  return /^AFD-\d{3}$/i.test(password.trim());
}

export function scorePasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (hasUpper(password)) score += 1;
  if (hasLower(password)) score += 1;
  if (hasDigit(password)) score += 1;
  if (hasSpecial(password)) score += 1;
  return score;
}

export function validatePasswordPolicy(
  password: string,
  ctx: PasswordPolicyContext = {},
): PasswordPolicyResult {
  const score = scorePasswordStrength(password);

  if (password.length < 12) {
    return {
      ok: false,
      score,
      message: "Le mot de passe doit contenir au moins 12 caractères.",
    };
  }
  if (!hasUpper(password) || !hasLower(password)) {
    return {
      ok: false,
      score,
      message: "Incluez au moins une majuscule et une minuscule.",
    };
  }
  if (!hasDigit(password)) {
    return {
      ok: false,
      score,
      message: "Incluez au moins un chiffre.",
    };
  }
  if (!hasSpecial(password)) {
    return {
      ok: false,
      score,
      message: "Incluez au moins un caractère spécial.",
    };
  }
  if (isTemporaryPattern(password)) {
    return {
      ok: false,
      score,
      message: "Ce modèle de mot de passe temporaire n’est plus autorisé.",
    };
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return {
      ok: false,
      score,
      message: "Ce mot de passe est trop commun.",
    };
  }

  const emailLocal = ctx.email?.split("@")[0]?.toLowerCase();
  const lowered = password.toLowerCase();
  if (ctx.email && lowered.includes(ctx.email.toLowerCase())) {
    return {
      ok: false,
      score,
      message: "Le mot de passe ne doit pas contenir votre e-mail.",
    };
  }
  if (emailLocal && emailLocal.length >= 4 && lowered.includes(emailLocal)) {
    return {
      ok: false,
      score,
      message: "Le mot de passe ne doit pas contenir votre identifiant e-mail.",
    };
  }

  const nameParts = [
    ctx.displayName,
    ctx.firstName,
    ctx.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter((p) => p.length >= 3);

  for (const part of nameParts) {
    if (lowered.includes(part)) {
      return {
        ok: false,
        score,
        message: "Le mot de passe ne doit pas contenir votre nom.",
      };
    }
  }

  return { ok: true, score };
}
