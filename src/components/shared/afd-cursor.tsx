"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type CursorMode = "idle" | "hover" | "click";

function subscribePointerFine(onStoreChange: () => void) {
  const media = window.matchMedia("(pointer: fine)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getPointerFine() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Boule flottante floutée qui suit la souris.
 * Le pointeur système reste visible pour éviter toute disparition.
 */
export function AfdCursor() {
  const finePointer = useSyncExternalStore(
    subscribePointerFine,
    getPointerFine,
    getServerSnapshot,
  );
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerSnapshot,
  );
  const enabled = finePointer && !reduceMotion;

  const ballRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const started = useRef(false);
  const raf = useRef<number | null>(null);
  const [mode, setMode] = useState<CursorMode>("idle");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    function onMove(event: MouseEvent) {
      target.current.x = event.clientX;
      target.current.y = event.clientY;

      if (!started.current) {
        started.current = true;
        pos.current.x = event.clientX;
        pos.current.y = event.clientY;
        setReady(true);
      }

      const el = document.elementFromPoint(event.clientX, event.clientY);
      const interactive = Boolean(
        el?.closest(
          "a, button, [role='button'], input, textarea, select, label, summary",
        ),
      );
      setMode((current) => {
        if (current === "click") return current;
        return interactive ? "hover" : "idle";
      });
    }

    function onDown() {
      setMode("click");
    }

    function onUp() {
      window.setTimeout(() => setMode("idle"), 160);
    }

    function tick() {
      pos.current.x += (target.current.x - pos.current.x) * 0.16;
      pos.current.y += (target.current.y - pos.current.y) * 0.16;

      if (ballRef.current) {
        ballRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      raf.current = window.requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current != null) window.cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ballRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[200] rounded-full transition-[width,height,opacity] duration-200 ease-out will-change-transform",
        !ready && "opacity-0",
        ready && "opacity-90",
        mode === "idle" && "h-[52px] w-[52px]",
        mode === "hover" && "h-[68px] w-[68px]",
        mode === "click" && "h-[34px] w-[34px]",
      )}
      style={{
        background:
          mode === "hover"
            ? "radial-gradient(circle, rgba(233,147,8,0.55) 0%, rgba(233,147,8,0.18) 45%, transparent 70%)"
            : mode === "click"
              ? "radial-gradient(circle, rgba(6,38,83,0.6) 0%, rgba(6,38,83,0.2) 45%, transparent 70%)"
              : "radial-gradient(circle, rgba(8,119,209,0.5) 0%, rgba(8,119,209,0.16) 45%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  );
}
