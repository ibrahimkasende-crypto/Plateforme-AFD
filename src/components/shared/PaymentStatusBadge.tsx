import {
  paymentTransactionStatusLabels,
  type PaymentTransactionStatus,
} from "@/config/payment-statuses";
import { StatusBadge } from "@/components/shared/StatusBadge";

const toneByStatus: Record<
  PaymentTransactionStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  created: "neutral",
  pending: "warning",
  processing: "info",
  confirmed: "success",
  failed: "danger",
  cancelled: "neutral",
  expired: "warning",
  refunded: "info",
};

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentTransactionStatus;
}) {
  return (
    <StatusBadge
      label={paymentTransactionStatusLabels[status]}
      tone={toneByStatus[status]}
    />
  );
}
