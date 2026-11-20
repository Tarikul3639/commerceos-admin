import { UserRound } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { Banner } from "../../types/banners.types"
import { formatDate } from "../../utils/banner-details.utils"

interface BannerActivityCardProps {
  banner: Banner
}

/** Displays who created and last updated the banner, with timestamps. */
export function BannerActivityCard({ banner }: BannerActivityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserRound className="size-4 text-muted-foreground" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PersonItem
          label="Created by"
          name={banner.createdBy?.name || "Unknown"}
          date={formatDate(banner.createdAt)}
        />
        <div className="border-t" />
        <PersonItem
          label="Last updated by"
          name={banner.updatedBy?.name || "Unknown"}
          date={formatDate(banner.updatedAt)}
        />
      </CardContent>
    </Card>
  )
}

/** Renders one creator/updater entry in the activity panel. */
function PersonItem({
  label,
  name,
  date,
}: {
  label: string
  name: string
  date: string
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
    </div>
  )
}
