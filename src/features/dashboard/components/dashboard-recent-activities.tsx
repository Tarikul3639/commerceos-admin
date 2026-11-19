"use client"

import Link from "next/link"
import { ArrowRight, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RecentActivity } from "../dashboard.types"
import { DataTable } from "@/components/data-table"
import { columns } from "./dashboard-recent-activities-columns"
import { recentActivities } from "../dashboard.data"

interface DashboardRecentActivitiesProps {
  activities?: RecentActivity[]
  isLoading?: boolean
}

/** Displays the latest dashboard activities. */
export function DashboardRecentActivities({
  activities = [],
  isLoading = false,
}: DashboardRecentActivitiesProps) {
  return (
    <DataTable
      columns={columns}
      data={activities.length ? activities : recentActivities}
      title="Recent Activities"
      description="Latest activities on the dashboard"
      isLoading={isLoading}
      emptyText="No recent activities"
      emptyIcon={Activity}
      showPagination={false}
      toolbarActions={
        <Button variant="link" size="sm" asChild>
          <Link href="/activities">
            View All <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    />
  )
}
