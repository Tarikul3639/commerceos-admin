import type { ActivityLog } from "../types/activity-log.types"

export const EMPTY_VALUE = "—"

export function formatActivityDate(value?: string | null): string {
    if (!value) return EMPTY_VALUE

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

export function formatRelativeTime(value?: string | null): string {
    if (!value) return ""

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return ""

    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 31_536_000],
        ["month", 2_592_000],
        ["day", 86_400],
        ["hour", 3_600],
        ["minute", 60],
    ]

    const formatter = new Intl.RelativeTimeFormat(undefined, {
        numeric: "auto",
    })

    for (const [unit, seconds] of units) {
        if (Math.abs(diffSeconds) >= seconds) {
            return formatter.format(Math.round(diffSeconds / seconds), unit)
        }
    }

    return formatter.format(diffSeconds, "second")
}

export function valueToText(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return EMPTY_VALUE
    }

    if (typeof value === "string") return value

    try {
        return JSON.stringify(value)
    } catch {
        return String(value)
    }
}

export function valueToPrettyJson(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return EMPTY_VALUE
    }

    try {
        return JSON.stringify(value, null, 2)
    } catch {
        return String(value)
    }
}

export type ActivityDiffRow = {
    key: string
    before: string
    after: string
    status: "added" | "removed" | "changed"
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function buildActivityDiff(
    oldValue: unknown,
    newValue: unknown
): ActivityDiffRow[] {
    const rows: ActivityDiffRow[] = []

    if (isPlainObject(oldValue) || isPlainObject(newValue)) {
        const before = isPlainObject(oldValue) ? oldValue : {}
        const after = isPlainObject(newValue) ? newValue : {}

        const keys = new Set([...Object.keys(before), ...Object.keys(after)])

        for (const key of keys) {
            const previous = valueToText(before[key])
            const current = valueToText(after[key])

            if (previous === current) continue

            rows.push({
                key,
                before: previous,
                after: current,
                status: !(key in before)
                    ? "added"
                    : !(key in after)
                        ? "removed"
                        : "changed",
            })
        }

        return rows
    }

    const before = valueToText(oldValue)
    const after = valueToText(newValue)

    if (before === after) return rows

    rows.push({
        key: "value",
        before,
        after,
        status:
            before === EMPTY_VALUE
                ? "added"
                : after === EMPTY_VALUE
                    ? "removed"
                    : "changed",
    })

    return rows
}

export function getActivityActor(activity: ActivityLog): string {
    return activity.user?.name || activity.user?.email || "Unknown user"
}
