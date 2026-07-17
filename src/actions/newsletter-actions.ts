"use server";

import {
  isEmailSubscribed,
} from "@/features/newsletter/services/newsletter.service";
import { createClientSafe } from "@/lib/supabase/safe";

export async function getNewsletterPopupEligibilityAction(): Promise<{
  shouldShow: boolean;
  reason:
    | "anonymous"
    | "authenticated_unsubscribed"
    | "subscribed"
    | "no_email";
}> {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { shouldShow: true, reason: "anonymous" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { shouldShow: true, reason: "anonymous" };
  }

  const subscribed = await isEmailSubscribed(user.email);
  if (subscribed) {
    return { shouldShow: false, reason: "subscribed" };
  }

  return { shouldShow: true, reason: "authenticated_unsubscribed" };
}
