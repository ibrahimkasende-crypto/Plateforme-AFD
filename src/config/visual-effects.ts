export type VisualEffectsConfig = {
  waterRipple: {
    enabled: boolean;
    minViewportWidth: number;
    intensity: number;
    radius: number;
    decayMs: number;
    maxDevicePixelRatio: number;
    disabledRoutes: readonly string[];
  };
  sectionAnimations: {
    enabled: boolean;
  };
  mobileHorizontalRails: {
    enabled: boolean;
    breakpointMax: number;
  };
};

function envFlag(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value === "1" || value.toLowerCase() === "true";
}

export const visualEffects: VisualEffectsConfig = {
  waterRipple: {
    enabled: envFlag("NEXT_PUBLIC_ENABLE_WATER_RIPPLE", true),
    minViewportWidth: 1024,
    intensity: 0.52,
    radius: 118,
    decayMs: 880,
    maxDevicePixelRatio: 1.5,
    disabledRoutes: [
      "/admin",
      "/connexion",
      "/mot-de-passe-oublie",
      "/nouveau-mot-de-passe",
      "/auth",
      "/api/payments",
    ],
  },
  sectionAnimations: {
    enabled: envFlag("NEXT_PUBLIC_ENABLE_SECTION_ANIMATIONS", true),
  },
  mobileHorizontalRails: {
    enabled: envFlag("NEXT_PUBLIC_ENABLE_MOBILE_RAILS", true),
    breakpointMax: 767,
  },
};

export function isWaterRippleRouteDisabled(pathname: string): boolean {
  return visualEffects.waterRipple.disabledRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
