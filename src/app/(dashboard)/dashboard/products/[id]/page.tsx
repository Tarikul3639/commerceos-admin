import type { Metadata } from "next"

import { ProductDetailsContent } from "@/features/products/components/details/product-details-content"

export const metadata: Metadata = {
  title: "Product details",
  description: "View product details from your catalog.",
}

export default function ProductDetailsPage() {
  return <ProductDetailsContent />
}
