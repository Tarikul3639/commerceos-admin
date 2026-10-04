import type { Metadata } from "next"
import { UpdateBannerContent } from "@/features/banners/components/update/update-banner-content"

export const metadata: Metadata = {
  title: "Update Banner",
  description: "Update a storefront banner.",
}

export default function UpdateBannerPage() {
  return <UpdateBannerContent />
}
