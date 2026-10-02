import type { Metadata } from "next"

import { StockContent } from "@/features/stock/components/stock-content"

export const metadata: Metadata = {
  title: "Stock",
  description: "Monitor product stock levels.",
}

export default function StockPage() {
  return <StockContent />
}
