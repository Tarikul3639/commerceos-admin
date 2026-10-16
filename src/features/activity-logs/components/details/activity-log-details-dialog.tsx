"use client"

import type { ReactNode } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetActivityLogQuery } from "../../api/activity-logs.api"
import type { ActivityLog } from "../../types/activity-log.types"

import { ActivityLogOverview } from "./activity-log-overview"
import { ActivityLogMetadata } from "./activity-log-metadata"
import { ActivityLogChanges } from "./activity-log-changes"
import { ActivityLogUserAgent } from "./activity-log-user-agent"

type ActivityLogDetailsDialogProps = {
    activityId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

function Section({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <section className="min-w-0 space-y-2.5">
            <h3 className="text-sm font-semibold">{title}</h3>
            {children}
        </section>
    )
}

function LoadingState() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    )
}

export function ActivityLogDetailsDialog({
    activityId,
    open,
    onOpenChange,
}: ActivityLogDetailsDialogProps) {
    const { data, isLoading, isError } = useGetActivityLogQuery(
        activityId ?? "",
        {
            skip: !open || !activityId,
        },
    )

    // API returns undefined if the activity log is not found, so we need to handle that case
    const activity: ActivityLog | undefined = data

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-1 sm:max-w-3xl">
                <DialogHeader className="shrink-0 border-b gap-0 px-4 py-3 pr-12 sm:px-6 sm:py-4">
                    <DialogTitle className="text-base sm:text-lg">
                        Activity Log Details
                    </DialogTitle>

                    <DialogDescription>
                        View activity information, changes, and request metadata.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
                        {isLoading && <LoadingState />}

                        {isError && (
                            <p className="text-sm text-destructive" role="alert">
                                Failed to load activity details. Please try again.
                            </p>
                        )}

                        {!isLoading && !isError && !activity && (
                            <p className="text-sm text-muted-foreground">
                                Activity log not found.
                            </p>
                        )}

                        {!isLoading && !isError && activity && (
                            <>
                                <Section title="Overview">
                                    <ActivityLogOverview activity={activity} />
                                </Section>

                                <Separator />

                                <Section title="Changes">
                                    <ActivityLogChanges
                                        oldValue={activity.oldValue}
                                        newValue={activity.newValue}
                                    />
                                </Section>

                                <Separator />

                                <Section title="Metadata">
                                    <ActivityLogMetadata activity={activity} />
                                </Section>

                                <Separator />

                                <Section title="User Agent">
                                    <ActivityLogUserAgent
                                        userAgent={activity.userAgent}
                                    />
                                </Section>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}