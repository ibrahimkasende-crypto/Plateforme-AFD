import { describe, expect, it } from "vitest";
import { safeAuthNext } from "@/lib/auth/safe-auth-next";

describe("safeAuthNext", () => {
  it("accepte les chemins internes avec query", () => {
    expect(safeAuthNext("/?newsletter=google-success", "/admin")).toBe(
      "/?newsletter=google-success",
    );
    expect(safeAuthNext("/connexion", "/")).toBe("/connexion");
  });

  it("refuse les redirections externes", () => {
    expect(safeAuthNext("https://evil.test", "/admin")).toBe("/admin");
    expect(safeAuthNext("//evil.test", "/admin")).toBe("/admin");
    expect(safeAuthNext("\\evil", "/admin")).toBe("/admin");
  });

  it("utilise le fallback si next est vide", () => {
    expect(safeAuthNext(null, "/")).toBe("/");
    expect(safeAuthNext("", "/admin")).toBe("/admin");
  });
});
