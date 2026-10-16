import { ActivityLogDiffTable } from "./activity-log-diff-table"
import { ActivityLogRawPanel } from "./activity-log-raw-panel"

type ActivityLogChangesProps = {
    oldValue: unknown
    newValue: unknown
}

export function ActivityLogChanges({
    oldValue,
    newValue,
}: ActivityLogChangesProps) {
    const hasOldValue =
        oldValue !== null && oldValue !== undefined

    const hasNewValue =
        newValue !== null && newValue !== undefined

    if (!hasOldValue && !hasNewValue) {
        return (
            <p className="text-sm text-muted-foreground">
                No change data available for this activity.
            </p>
        )
    }

    return (
        <div className="space-y-4">
            <ActivityLogDiffTable
                oldValue={oldValue}
                newValue={newValue}
            />

            <div className="grid gap-3 md:grid-cols-2">
                <ActivityLogRawPanel
                    title="Previous Value"
                    value={oldValue}
                />

                <ActivityLogRawPanel
                    title="New Value"
                    value={newValue}
                />
            </div>
        </div>
    )
}