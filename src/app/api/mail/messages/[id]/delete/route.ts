import { NextResponse } from "next/server";
import { requireOwnMailboxApi } from "@/features/messagerie/api/require-own-mailbox";

export async function POST() {
  const gate = await requireOwnMailboxApi();
  if ("error" in gate && gate.error) return gate.error;
  return NextResponse.json({ ok: false, code: "PHASE2_DISABLED" }, { status: 501 });
}
