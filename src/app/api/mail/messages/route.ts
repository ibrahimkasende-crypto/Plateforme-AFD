import { NextResponse } from "next/server";
import { requireOwnMailboxApi } from "@/features/messagerie/api/require-own-mailbox";

/** Phase 2 — liste des messages. */
export async function GET() {
  const gate = await requireOwnMailboxApi();
  if ("error" in gate && gate.error) return gate.error;
  return NextResponse.json({ ok: true, messages: [] });
}
