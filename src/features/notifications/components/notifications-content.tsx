"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { Bell, CheckCheck } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
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

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "../api/notifications.api"
import type { NotificationType } from "../types/notification.types"
import { notificationColumns } from "./notifications-columns"

export function NotificationsContent() {
  const [type, setType] = useState<NotificationType | "ALL">("ALL")
  const [readStatus, setReadStatus] = useState<"ALL" | "READ" | "UNREAD">("ALL")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const permission = usePermission()

  const query = useGetNotificationsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    type: type === "ALL" ? undefined : type,
    isRead:
      readStatus === "ALL"
        ? undefined
        : readStatus === "READ"
          ? "true"
          : "false",
  })
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation()

  const resetPage = () =>
    setPagination((current) => ({ ...current, pageIndex: 0 }))

  return (
    <PageContainer
      access={permission.has(Permission.NOTIFICATION_READ)}
      accessFallback={<UnauthorizedContent />}
      title="Notifications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications" },
      ]}
      infoContent={
        <p className="text-sm text-muted-foreground">
          Review your workspace notifications, filter read status and manage
          your inbox.
        </p>
      }
    >
      <DataTable
        title="Your notifications"
        description={`${query.data?.meta.unreadCount ?? "—"} unread notifications · Newest notifications appear first.`}
        columns={notificationColumns}
        data={query.data?.data ?? []}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        error={query.error}
        toolbarFilters={
          <>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value as NotificationType | "ALL")
                resetPage()
              }}
            >
              <SelectTrigger className="w-full sm:w-[135px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={readStatus}
              onValueChange={(value) => {
                setReadStatus(value as "ALL" | "READ" | "UNREAD")
                resetPage()
              }}
            >
              <SelectTrigger className="w-full sm:w-[135px]">
                <SelectValue placeholder="Read status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="UNREAD">Unread</SelectItem>
                <SelectItem value="READ">Read</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        toolbarActions={
          permission.has(Permission.NOTIFICATION_UPDATE) && (
            <Button
              variant="ghost"
              size="sm"
              disabled={!query.data?.meta.unreadCount || isMarkingAll}
              onClick={() => {
                if (permission.has(Permission.NOTIFICATION_UPDATE)) {
                  void markAllRead()
                }
              }}
            >
              <CheckCheck className="size-4" />
              {isMarkingAll ? "Marking..." : "Read all"}
            </Button>
          )
        }
        pagination={pagination}
        onPaginationChange={setPagination}
        manualPagination
        totalRows={query.data?.meta.total ?? 0}
        emptyIcon={Bell}
        emptyText="No notifications match the selected filters."
      />
    </PageContainer>
  )
}
