import { Images, Link2, ArrowUpRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Banner } from "../../types/banners.types"
import { formatEnumLabel } from "../../utils/banner-details.utils"

interface BannerInformationCardProps {
  banner: Banner
}

/** Presents the banner's content, placement, and destination configuration. */
export function BannerInformationCard({ banner }: BannerInformationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Images className="size-4 text-muted-foreground" />
          Banner information
        </CardTitle>
        <CardDescription>
          Content and destination configured for this banner.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <InfoItem
          label="Banner title"
          value={banner.title || "Untitled banner"}
        />
        <InfoItem
          label="Display position"
          value={formatEnumLabel(banner.position)}
        />
        <InfoItem label="Banner type" value={formatEnumLabel(banner.type)} />
        <InfoItem label="Sort order" value={String(banner.sortOrder)} />
        <div className="space-y-1.5 sm:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">
            Destination link
          </p>
          {banner.link ? (
            <a
              href={banner.link}
              target={banner.openInNewTab ? "_blank" : undefined}
              rel={banner.openInNewTab ? "noreferrer" : undefined}
              className="inline-flex max-w-full items-center gap-1.5 text-sm break-all text-primary hover:underline"
            >
              <Link2 className="size-3.5 shrink-0" />
              {banner.link}
              <ArrowUpRight className="size-3.5 shrink-0" />
            </a>
          ) : (
            <p className="text-sm">No destination configured</p>
          )}
        </div>
        <InfoItem
          label="Open in new tab"
          value={banner.openInNewTab ? "Yes" : "No"}
        />
      </CardContent>
    </Card>
  )
}

/** Renders one reusable label/value field in the information card. */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium wrap-break-word">{value}</p>
    </div>
  )
}
