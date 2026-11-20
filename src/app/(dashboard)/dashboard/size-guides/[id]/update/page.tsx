import type { Metadata } from "next"

import { UpdateSizeGuideContent } from "@/features/size-guides/components/update-size-guide-content"

export const metadata: Metadata = {
  title: "Update Size Guide",
  description: "Update a product size guide and its measurements.",
}

/** Renders the size guide update page. */
export default function UpdateSizeGuidePage() {
  return <UpdateSizeGuideContent />
}
