import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { siteConfig } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.appName,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0877d1" },
    { media: "(prefers-color-scheme: dark)", color: "#031b3c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('afd-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}else{document.documentElement.dataset.theme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--afd-background)] font-sans text-[var(--afd-text)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
