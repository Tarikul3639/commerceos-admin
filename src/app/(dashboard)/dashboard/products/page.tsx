import type { Metadata } from "next"

import { ProductsContent } from "@/features/products/components/list/products-content"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your product catalog.",
}

export default function ProductsPage() {
  return <ProductsContent />
}
