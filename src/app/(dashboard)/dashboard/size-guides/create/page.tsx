import type { Metadata } from "next"

import { CreateSizeGuideContent } from "@/features/size-guides/components/create-size-guide-content"

export const metadata: Metadata = {
  title: "Create Size Guide",
  description: "Create a product size guide and measurement chart.",
}

/** Renders the size guide creation page. */
export default function CreateSizeGuidePage() {
  return <CreateSizeGuideContent />
}
