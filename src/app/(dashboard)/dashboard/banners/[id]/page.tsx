import type { Metadata } from "next"
import { BannerDetailsContent } from "@/features/banners/components/details/banner-details-content"

export const metadata: Metadata = {
  title: "Banner details",
  description: "View storefront banner details.",
}

interface BannerDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function BannerDetailsPage({
  params,
}: BannerDetailsPageProps) {
  const { id } = await params
  return <BannerDetailsContent bannerId={id} />
}
