"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const fine = window.matchMedia("(pointer: fine)");
  const hover = window.matchMedia("(hover: hover)");
  fine.addEventListener("change", onChange);
  hover.addEventListener("change", onChange);
  return () => {
    fine.removeEventListener("change", onChange);
    hover.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(hover: hover)").matches
  );
}

function getServerSnapshot() {
  return false;
}

/** Souris / trackpad précis avec hover réel (pas tactile). */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
