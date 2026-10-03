import type { Metadata } from "next"

import { PurchaseUpdateContent } from "@/features/purchases/components/update/purchase-update-content"

export const metadata: Metadata = {
  title: "Update Purchase",
  description: "Update a pending purchase",
}

export default function UpdatePurchasePage() {
  return <PurchaseUpdateContent />
}
