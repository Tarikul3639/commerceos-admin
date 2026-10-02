import { Metadata } from "next"
import { DiscountDetails } from "@/features/discounts/components/discount-details"

export const metadata: Metadata = {
  title: "Discount Details",
  description: "View and manage the details of this discount.",
}

export default function DiscountDetailsPage() {
  return <DiscountDetails />
}
