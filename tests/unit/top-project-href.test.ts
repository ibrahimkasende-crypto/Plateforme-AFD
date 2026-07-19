import { describe, expect, it } from "vitest";
import { topProjectHref } from "@/components/admin/dashboard-top-projects";
import type { TopProject } from "@/features/statistiques/types/dashboard";

function project(partial: Partial<TopProject> & Pick<TopProject, "id" | "title">): TopProject {
  return {
    location: null,
    beneficiaries: null,
    imageUrl: null,
    ...partial,
  };
}

describe("topProjectHref", () => {
  it("ouvre le détail pour un UUID réel", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(topProjectHref(project({ id, title: "Puits" }))).toBe(
      `/admin/projets/${id}`,
    );
  });

  it("évite la 404 pour les ids démo", () => {
    expect(topProjectHref(project({ id: "demo-1", title: "Alpha" }))).toBe(
      "/admin/projets?q=Alpha",
    );
  });

  it("encode le titre dans la recherche", () => {
    expect(
      topProjectHref(project({ id: "demo-2", title: "Eau & Santé" })),
    ).toBe(`/admin/projets?q=${encodeURIComponent("Eau & Santé")}`);
  });

  it("retombe sur la liste si titre vide", () => {
    expect(topProjectHref(project({ id: "x", title: "  " }))).toBe(
      "/admin/projets",
    );
  });

  it("couvre cinq projets Top 5 sans lien analyse cassé", () => {
    const demos = [1, 2, 3, 4, 5].map((n) =>
      topProjectHref(project({ id: `demo-${n}`, title: `Projet ${n}` })),
    );
    for (const href of demos) {
      expect(href).not.toContain("/analyse");
      expect(href.startsWith("/admin/projets")).toBe(true);
    }
  });
});
