import type { Metadata } from "next"

import { CreateProductContent } from "@/features/products/components/create/create-product-content"

export const metadata: Metadata = {
  title: "Create product",
  description: "Add a product to your catalog.",
}

export default function CreateProductPage() {
  return <CreateProductContent />
}
