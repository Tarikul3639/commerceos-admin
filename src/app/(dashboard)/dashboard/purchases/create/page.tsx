import type { Metadata } from "next"
import { PurchaseCreateContent } from "@/features/purchases/components/create/purchase-create-content"

export const metadata: Metadata = {
  title: "Create Purchase",
  description: "Create a new purchase and add line items.",
}
export default function PurchaseDetailsPage() {
  return <PurchaseCreateContent />
}
