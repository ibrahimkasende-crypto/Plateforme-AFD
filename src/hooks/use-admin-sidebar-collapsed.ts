"use client";

import { useCallback, useState } from "react";

const COOKIE_NAME = "afd-admin-sidebar-collapsed";
const STORAGE_KEY = "afd-admin-sidebar-collapsed";

function readCookie(): boolean | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  return match.split("=")[1] === "1";
}

function writeCookie(collapsed: boolean) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${collapsed ? "1" : "0"}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function readLocal(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === null) return null;
    return value === "1";
  } catch {
    return null;
  }
}

function writeLocal(collapsed: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // Préférence visuelle uniquement — ignorer le stockage indisponible.
  }
}

function readInitial(fallback: boolean): boolean {
  return readCookie() ?? readLocal() ?? fallback;
}

export function useAdminSidebarCollapsed(initialCollapsed = false) {
  const [collapsed, setCollapsed] = useState(() => readInitial(initialCollapsed));

  const setCollapsedPersisted = useCallback((next: boolean) => {
    setCollapsed(next);
    writeCookie(next);
    writeLocal(next);
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }, []);

  const toggle = useCallback(() => {
    setCollapsedPersisted(!collapsed);
  }, [collapsed, setCollapsedPersisted]);

  return { collapsed, setCollapsed: setCollapsedPersisted, toggle };
}
