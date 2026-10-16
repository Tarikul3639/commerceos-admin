import type { Metadata } from "next"
import { PaymentsContent } from "@/features/payments/components/payments-content"

export const metadata: Metadata = {
  title: "Payments",
  description: "Review payment transactions.",
}

export default function PaymentsPage() {
  return <PaymentsContent />
}
