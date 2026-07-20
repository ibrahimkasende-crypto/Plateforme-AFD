import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Désactive le N Next.js ; le chargement admin utilise le logo AFD.
  devIndicators: false,
  // Avatars / uploads FormData (limite client 5 Mo) — défaut Next = 1 Mo
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ];
    // CSP uniquement en production : en dev elle casse Turbopack/HMR → écran blanc.
    if (isProd) {
      security.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
      security.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://*.supabase.co",
          "font-src 'self' data:",
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      });
    }
    return [{ source: "/:path*", headers: security }];
  },
  async redirects() {
    return [
      { source: "/brand/logo-afd.jpg", destination: "/assets/brand/Logo_AFD.jpeg", permanent: true },
      { source: "/images/adf1.jpg", destination: "/assets/home/Femmes_AFD.png", permanent: true },
      { source: "/images/adf2.png", destination: "/assets/home/presentation-afd.png", permanent: true },
      { source: "/images/adf-logo.jpg", destination: "/assets/brand/Logo_AFD.jpeg", permanent: true },
      { source: "/images/adf-logo0.jpg", destination: "/assets/brand/Logo_AFD.jpeg", permanent: true },
      { source: "/assets/brand/logo-afd.jpg", destination: "/assets/brand/Logo_AFD.jpeg", permanent: true },
      { source: "/assets/home/hero-afd.jpg", destination: "/assets/home/Femmes_AFD.png", permanent: true },
      { source: "/about", destination: "/qui-sommes-nous", permanent: true },
      { source: "/programs", destination: "/actions/programmes", permanent: true },
      {
        source: "/programs/:slug",
        destination: "/actions/programmes/:slug",
        permanent: true,
      },
      { source: "/projects", destination: "/actions/projets", permanent: true },
      {
        source: "/projects/:slug",
        destination: "/actions/projets/:slug",
        permanent: true,
      },
      { source: "/clusters", destination: "/actions/clusters", permanent: true },
      { source: "/news", destination: "/actualites", permanent: true },
      {
        source: "/news/:slug",
        destination: "/actualites/:slug",
        permanent: true,
      },
      {
        source: "/gallery",
        destination: "/ressources/mediatheque",
        permanent: true,
      },
      { source: "/membership", destination: "/adhesion", permanent: true },
      { source: "/donate", destination: "/soutenir", permanent: true },
      { source: "/impact-stories", destination: "/impact/histoires", permanent: false },
      { source: "/legal", destination: "/mentions-legales", permanent: true },
      { source: "/team", destination: "/qui-sommes-nous/equipe", permanent: true },
      { source: "/partners", destination: "/qui-sommes-nous", permanent: false },
      {
        source: "/organisation",
        destination: "/qui-sommes-nous",
        permanent: true,
      },
      {
        source: "/admin/dashboard",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/admin/login",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
