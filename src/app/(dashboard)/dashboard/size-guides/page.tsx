import type { Metadata } from "next"
import { SizeGuidesContent } from "@/features/size-guides/components/size-guides-content"

export const metadata: Metadata = {
  title: "Size Guides",
  description: "Manage product size guides.",
}

export default function SizeGuidesPage() {
  return <SizeGuidesContent />
}
