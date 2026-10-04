import type { Metadata } from "next"

import { UpdateProductContent } from "@/features/products/components/update/update-product-content"

export const metadata: Metadata = {
  title: "Update product",
  description: "Update product details in your catalog.",
}

export default function ProductUpdatePage() {
  return <UpdateProductContent />
}
