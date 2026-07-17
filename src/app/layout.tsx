import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--afd-background)] font-sans text-[var(--afd-text)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
