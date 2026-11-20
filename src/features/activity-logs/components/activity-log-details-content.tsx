"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, FileSearch } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import { useGetActivityLogQuery } from "../api/activity-logs.api"
import type { ActivityLog } from "../types/activity-log.types"
import { ActivityLogOverview } from "./details/activity-log-overview"
import { ActivityLogChanges } from "./details/activity-log-changes"
import { ActivityLogMetadata } from "./details/activity-log-metadata"
import { ActivityLogUserAgent } from "./details/activity-log-user-agent"

function DetailsLoading() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
      <div className="space-y-5">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  )
}

/** Displays a complete activity record on a shareable, dedicated page. */
export function ActivityLogDetailsContent() {
  const params = useParams<{ id: string }>()
  const permission = usePermission()
  const canRead = permission.has(Permission.ACTIVITY_LOG_READ)
  const {
    currentData: activity,
    isLoading,
    isError,
  } = useGetActivityLogQuery(params.id, { skip: !canRead || !params.id })

  const pageTitle = activity?.action ?? "Activity Log Details"

  return (
    <PageContainer
      access={canRead}
      accessFallback={<UnauthorizedContent />}
      title={pageTitle}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Activity Logs", href: "/dashboard/activity-logs" },
        { label: "Details" },
      ]}
      pageHeaderAction={
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/activity-logs">
            <ArrowLeft className="size-4" />
            Back to logs
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <DetailsLoading />
      ) : isError || !activity ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <FileSearch className="mt-0.5 size-5 text-destructive" />
            <div className="space-y-1">
              <h2 className="font-semibold">Activity log unavailable</h2>
              <p className="text-sm text-muted-foreground">
                This activity record could not be loaded. It may have been
                removed, or you may not have access to it.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ActivityLogDetails activity={activity} />
      )}
    </PageContainer>
  )
}

function ActivityLogDetails({ activity }: { activity: ActivityLog }) {
  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="grid w-full min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <Card className="min-w-0 gap-0 py-0">
            <CardHeader className="min-w-0 border-b px-5 py-4">
              <CardTitle className="text-base">Activity overview</CardTitle>
              <CardDescription>
                What happened, who performed the action, and when it occurred.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <ActivityLogOverview activity={activity} />
            </CardContent>
          </Card>

          <Card className="min-w-0 gap-0 py-0">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="text-base">Changes</CardTitle>
              <CardDescription>
                Compare the previous and updated values for this activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden p-5">
              <ActivityLogChanges
                oldValue={activity.oldValue}
                newValue={activity.newValue}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 space-y-5">
          <Card className="min-w-0 gap-0 py-0">
            <CardHeader className="min-w-0 border-b px-5 py-4">
              <CardTitle className="text-base">Request metadata</CardTitle>
              <CardDescription>
                Identifiers and network information recorded with this event.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ActivityLogMetadata activity={activity} />
            </CardContent>
          </Card>

          <Card className="min-w-0 gap-0 py-0">
            <CardHeader className="min-w-0 border-b px-5 py-4">
              <CardTitle className="text-base">User agent</CardTitle>
              <CardDescription>
                Browser, operating system and device details.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ActivityLogUserAgent userAgent={activity.userAgent} />
            </CardContent>
          </Card>
        </aside>
      </div>

      <Separator />
      <p className="text-xs break-all text-muted-foreground">
        Activity ID: {activity.id}
      </p>
    </div>
  )
}
