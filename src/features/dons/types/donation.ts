import type {
  DonationIntentStatus,
} from "@/config/payment-statuses";
import type { PaymentTransactionStatus } from "@/config/payment-statuses";
import type { SupportType, AllowedCurrency } from "@/config/site";

export type DonationIntent = {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string | null;
  donor_country: string | null;
  anonymous: boolean;
  support_type: SupportType;
  programme_id: string | null;
  project_id: string | null;
  amount: number;
  currency: AllowedCurrency;
  message: string | null;
  status: DonationIntentStatus;
  created_at: string;
};

export type PaymentTransaction = {
  id: string;
  donation_intent_id: string;
  internal_reference: string;
  provider: "serdipay";
  provider_reference: string | null;
  amount: number;
  currency: AllowedCurrency;
  status: PaymentTransactionStatus;
  payment_method: string | null;
  provider_status: string | null;
  provider_response: Record<string, unknown> | null;
  webhook_verified: boolean;
  confirmed_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
};
