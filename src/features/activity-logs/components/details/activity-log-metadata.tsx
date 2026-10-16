"use client"

import { useState } from "react"
import { Activity, Check, Copy, Globe, Hash, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ActivityLog } from "../../types/activity-log.types"

function MetadataItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Activity
    label: string
    value: string | null | undefined
}) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        if (!value) return

        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="flex min-w-0 items-start gap-2 rounded-md border p-2">
            <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium break-all">{value || "—"}</p>
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                disabled={!value}
                aria-label={`Copy ${label}`}
                title={`Copy ${label}`}
            >
                {copied ? (
                    <Check className="size-3 text-green-600" />
                ) : (
                    <Copy className="size-3" />
                )}
            </Button>
        </div>
    )
}

export function ActivityLogMetadata({ activity }: { activity: ActivityLog }) {
    return (
        <div className="grid gap-2 sm:grid-cols-2">
            <MetadataItem icon={Hash} label="Activity ID" value={activity.id} />

            <MetadataItem
                icon={Activity}
                label="Entity Type"
                value={activity.entityType}
            />

            <MetadataItem icon={Hash} label="Entity ID" value={activity.entityId} />

            <MetadataItem icon={UserRound} label="User ID" value={activity.userId} />

            <MetadataItem
                icon={Globe}
                label="IP Address"
                value={activity.ipAddress}
            />
        </div>
    )
}
