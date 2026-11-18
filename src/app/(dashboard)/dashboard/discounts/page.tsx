import type { Metadata } from "next"
import { DiscountsContent } from "@/features/discounts/components/discounts-content"

export const metadata: Metadata = {
  title: "Discounts",
  description: "Manage coupon codes and discount rules.",
}

export default function DiscountsPage() {
  return <DiscountsContent />
}
