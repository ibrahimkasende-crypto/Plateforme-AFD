export async function listRapports() {
  return [] as const;
}

export async function createRapportDraft(input: {
  title: string;
  type: string;
}) {
  return { ok: true as const, status: "prepared" as const, title: input.title };
}
