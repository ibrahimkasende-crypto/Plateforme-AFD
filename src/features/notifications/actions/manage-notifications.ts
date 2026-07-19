"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/services/notifications.service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClientSafe } from "@/lib/supabase/safe";

export async function markNotificationReadAction(notificationId: string) {
  const session = await requireAdmin("/admin/notifications");
  if (!z.string().uuid().safeParse(notificationId).success) return;
  const supabase = await createClientSafe();
  if (!supabase) return;
  await markNotificationRead(supabase, session.user.id, notificationId);
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsReadAction() {
  const session = await requireAdmin("/admin/notifications");
  const supabase = await createClientSafe();
  if (!supabase) return;
  await markAllNotificationsRead(supabase, session.user.id);
  revalidatePath("/admin");
  revalidatePath("/admin/notifications");
}
