import type { Metadata } from "next"

import { EditCategoryContent } from "@/features/categories/components/create-category-dialog"

export const metadata: Metadata = {
  title: "Edit category",
  description: "Update a category in your product catalog.",
}

export default function EditCategoryPage() {
  return <EditCategoryContent />
}
