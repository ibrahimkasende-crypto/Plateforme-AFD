import { describe, expect, it } from "vitest";
import {
  sanitizeEmailHtml,
  stripRemoteImages,
} from "@/lib/mail/sanitize-html";

describe("sanitizeEmailHtml", () => {
  it("supprime script et iframe", () => {
    const dirty =
      '<p>Bonjour</p><script>alert(1)</script><iframe src="https://x"></iframe>';
    const clean = sanitizeEmailHtml(dirty);
    expect(clean).toContain("Bonjour");
    expect(clean.toLowerCase()).not.toContain("<script");
    expect(clean.toLowerCase()).not.toContain("<iframe");
  });

  it("neutralise les handlers onclick", () => {
    const dirty = '<a href="#" onclick="alert(1)">x</a>';
    const clean = sanitizeEmailHtml(dirty);
    expect(clean.toLowerCase()).not.toContain("onclick");
  });

  it("bloque javascript: URLs", () => {
    const dirty = '<a href="javascript:alert(1)">x</a>';
    const clean = sanitizeEmailHtml(dirty);
    expect(clean.toLowerCase()).not.toContain("javascript:");
  });
});

describe("stripRemoteImages", () => {
  it("remplace les images http(s)", () => {
    const html = '<img src="https://evil.example/a.png" alt="x" />';
    const out = stripRemoteImages(html);
    expect(out).toContain("Image distante bloquée");
    expect(out).not.toContain("https://evil.example");
  });
});
