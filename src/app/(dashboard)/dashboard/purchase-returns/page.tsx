import type { Metadata } from "next"
import { PurchaseReturnListContent } from "@/features/purchase-returns/components/purchase-return-list-content"

export const metadata: Metadata = {
  title: "Purchase Returns",
  description: "Review and create purchase returns.",
}

export default function PurchaseReturnsPage() {
  return <PurchaseReturnListContent />
}
