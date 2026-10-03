import type { Metadata } from "next"
import { PurchaseDetailsContent } from "@/features/purchases/components/details/purchase-details-content"

export const metadata: Metadata = {
  title: "Purchase Details",
  description: "View purchase details and line items.",
}
export default function PurchaseDetailsPage() {
  return <PurchaseDetailsContent />
}
