"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToasterProvider } from "./toaster-provider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryProvider>
        {children}
        <ToasterProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}
