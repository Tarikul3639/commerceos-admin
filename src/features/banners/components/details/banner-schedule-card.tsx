import { CalendarDays, Clock3 } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Banner } from "../../types/banners.types"
import {
  formatDate,
  getScheduleDescription,
} from "../../utils/banner-details.utils"

interface BannerScheduleCardProps {
  startAt: Banner["startAt"]
  endAt: Banner["endAt"]
}

/** Shows the configured start/end dates and a concise schedule summary. */
export function BannerScheduleCard({
  startAt,
  endAt,
}: BannerScheduleCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="size-4 text-muted-foreground" />
          Schedule
        </CardTitle>
        <CardDescription>
          When this banner is scheduled to display.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScheduleItem label="Starts" value={formatDate(startAt)} />
        <div className="border-t" />
        <ScheduleItem label="Ends" value={formatDate(endAt)} />
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
          <Clock3 className="size-4 shrink-0" />
          {getScheduleDescription(startAt, endAt)}
        </div>
      </CardContent>
    </Card>
  )
}

/** Aligns a schedule label with its formatted timestamp. */
function ScheduleItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-right text-sm font-medium">{value}</p>
    </div>
  )
}
