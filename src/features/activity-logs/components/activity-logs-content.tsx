"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Permission } from "@/config/permissions.config"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { usePermission } from "@/hooks/use-permission"
import { useGetActivityLogsQuery } from "../api/activity-logs.api"
import {
  activityModules,
  activityTypes,
  type ActivityModule,
  type ActivityType,
} from "../types/activity-log.types"
import { activityLogColumns } from "./activity-logs-columns"

export function ActivityLogsContent() {
  const permission = usePermission()
  const [search, setSearch] = useState("")
  const [action, setAction] = useState("")
  const [type, setType] = useState<ActivityType | undefined>()
  const [module, setModule] = useState<ActivityModule | undefined>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const { data, isLoading, isFetching, isError, error } =
    useGetActivityLogsQuery({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search || undefined,
      action: action || undefined,
      type,
      module,
    })

  const updateFilter = (update: () => void) => {
    update()
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  return (
    <PageContainer
      access={permission.has(Permission.ACTIVITY_LOG_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Activity Logs"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Activity Logs" },
      ]}
    >
      <DataTable
        title="Activity Logs"
        description="Review and search activity across your workspace."
        columns={activityLogColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching && !isLoading}
        isError={isError}
        error={error}
        emptyText="No activity logs found."
        search={{
          value: search,
          onChange: (value) => updateFilter(() => setSearch(value)),
          placeholder: "Search activities...",
        }}
        toolbarFilters={
          <>
            <Select
              value={type ?? "all"}
              onValueChange={(value) =>
                updateFilter(() =>
                  setType(value === "all" ? undefined : (value as ActivityType))
                )
              }
            >
              <SelectTrigger size="sm" aria-label="Filter by type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {activityTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={module ?? "all"}
              onValueChange={(value) =>
                updateFilter(() =>
                  setModule(
                    value === "all" ? undefined : (value as ActivityModule)
                  )
                )
              }
            >
              <SelectTrigger size="sm" aria-label="Filter by module">
                <SelectValue placeholder="All modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>
                {activityModules.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="h-8 w-32"
              value={action}
              onChange={(event) =>
                updateFilter(() => setAction(event.target.value))
              }
              placeholder="Action"
              aria-label="Filter by action"
            />
          </>
        }
        manualPagination
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={data?.meta.total ?? 0}
        columnVisibility
      />
    </PageContainer>
  )
}
