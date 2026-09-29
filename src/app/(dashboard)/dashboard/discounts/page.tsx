import { Metadata } from "next"
import { DiscountContent } from "@/features/discounts/components/discount-content"

export const metadata: Metadata = {
    title: "Discounts",
    description: "Manage your discounts and promotions effectively.",
}

export default function DiscountsPage() {
    return <DiscountContent />
}
