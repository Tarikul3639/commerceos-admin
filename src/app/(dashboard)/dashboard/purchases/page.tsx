import type { Metadata } from "next"

import { PurchasesContent } from "@/features/purchases/components/list/purchases-content"

export const metadata: Metadata = {
  title: "Purchases",
  description: "Manage purchases for your business.",
}

export default function PurchasesPage() {
  return <PurchasesContent />
}
