import { NextResponse } from "next/server";
import { requireOwnMailboxApi } from "@/features/messagerie/api/require-own-mailbox";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const gate = await requireOwnMailboxApi();
  if ("error" in gate && gate.error) return gate.error;
  const { id } = await ctx.params;
  return NextResponse.json({
    ok: false,
    code: "PHASE2_DISABLED",
    message: `Lecture du message ${id} non activée.`,
  }, { status: 501 });
}
