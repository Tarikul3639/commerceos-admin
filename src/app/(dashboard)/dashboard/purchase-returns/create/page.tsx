import type { Metadata } from "next"
import { PurchaseReturnCreateContent } from "@/features/purchase-returns/components/purchase-return-create-content"

export const metadata: Metadata = {
  title: "Create Purchase Return",
  description: "Create a return from a received purchase.",
}

export default async function PurchaseReturnCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ purchaseId?: string }>
}) {
  const { purchaseId } = await searchParams
  return <PurchaseReturnCreateContent initialPurchaseId={purchaseId} />
}
