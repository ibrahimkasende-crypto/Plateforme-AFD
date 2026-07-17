import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
