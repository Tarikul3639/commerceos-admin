import type { Metadata } from "next"
import { PurchaseReturnDetailsContent } from "@/features/purchase-returns/components/purchase-return-details-content"

export const metadata: Metadata = {
  title: "Purchase Return Details",
  description: "View purchase return information and items.",
}

export default function PurchaseReturnDetailsPage() {
  return <PurchaseReturnDetailsContent />
}
