import { buildActivityDiff } from "../../utils/activity-log.utils"

type ActivityLogDiffTableProps = {
    oldValue: unknown
    newValue: unknown
}

export function ActivityLogDiffTable({
    oldValue,
    newValue,
}: ActivityLogDiffTableProps) {
    const rows = buildActivityDiff(oldValue, newValue)

    if (rows.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No field-level differences found.
            </p>
        )
    }

    return (
        <div className="overflow-hidden rounded-md border">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-b bg-muted/50">
                <div className="p-3 text-sm font-semibold">Previous</div>
                <div className="border-l p-3 text-sm font-semibold">New</div>
            </div>

            {rows.map((row) => (
                <div
                    key={row.key}
                    className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-b last:border-b-0"
                >
                    <div className="min-w-0 p-3">
                        <p className="mb-1 text-xs font-medium wrap-break-word text-muted-foreground">
                            {row.key}
                        </p>
                        <p
                            className={`text-sm wrap-break-word ${row.status === "removed"
                                ? "rounded bg-red-500/10 p-1 text-red-700 dark:text-red-400"
                                : ""
                                }`}
                        >
                            {row.before}
                        </p>
                    </div>

                    <div className="min-w-0 border-l p-3">
                        <p className="mb-1 text-xs font-medium wrap-break-word text-muted-foreground">
                            {row.key}
                        </p>
                        <p
                            className={`text-sm wrap-break-word ${row.status === "added" || row.status === "changed"
                                ? "rounded bg-green-500/10 p-1 text-green-700 dark:text-green-400"
                                : ""
                                }`}
                        >
                            {row.after}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
