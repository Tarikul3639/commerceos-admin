import type { Metadata } from "next"

import { EditProductContent } from "@/features/products/components/update/edit-product-content"

export const metadata: Metadata = {
  title: "Update product",
  description: "Update product details in your catalog.",
}

export default function ProductEditPage() {
  return <EditProductContent />
}
