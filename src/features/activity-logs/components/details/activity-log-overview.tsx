import { Badge } from "@/components/ui/badge"
import type { ActivityLog } from "../../types/activity-log.types"
import {
    formatActivityDate,
    formatRelativeTime,
    getActivityActor,
} from "../../utils/activity-log.utils"

type ActivityLogOverviewProps = {
    activity: ActivityLog
}

export function ActivityLogOverview({ activity }: ActivityLogOverviewProps) {
    return (
        <div className="space-y-3">
            <div>
                <p className="mb-0.5 text-xs text-muted-foreground">Action</p>
                <h3 className="text-sm font-semibold">{activity.action}</h3>

                {activity.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline">{activity.type}</Badge>
                <Badge variant="secondary">{activity.module}</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-2.5">
                    <p className="mb-0.5 text-xs text-muted-foreground">Performed By</p>
                    <p className="text-sm font-medium">{getActivityActor(activity)}</p>

                    {activity.user?.email && (
                        <p className="mt-0.5 break-all text-xs text-muted-foreground">
                            {activity.user.email}
                        </p>
                    )}
                </div>

                <div className="rounded-md border p-2.5">
                    <p className="mb-0.5 text-xs text-muted-foreground">Occurred At</p>
                    <p className="text-sm font-medium">
                        {formatActivityDate(activity.createdAt)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatRelativeTime(activity.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    )
}