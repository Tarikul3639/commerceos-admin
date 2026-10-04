import type { Metadata } from "next"
import { CreateBannerContent } from "@/features/banners/components/create/create-banner-content"

export const metadata: Metadata = {
  title: "Create Banner",
  description: "Create a storefront banner.",
}

export default function CreateBannerPage() {
  return <CreateBannerContent />
}
