import type { Metadata } from "next"
import { CartsContent } from "@/features/carts/components/carts-content"

export const metadata: Metadata = {
  title: "Carts",
  description: "Review active customer shopping carts.",
}

export default function CartsPage() {
  return <CartsContent />
}
