"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye, MailCheck, Trash2 } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  useDeleteNotificationMutation,
  useMarkNotificationReadMutation,
} from "../api/notifications.api"
import type {
  Notification,
  NotificationType,
} from "../types/notification.types"
import { NotificationDetailsDialog } from "./notification-details-dialog"

const helper = createColumnHelper<DataTableFeatures, Notification>()

const typeVariant: Record<
  NotificationType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  INFO: "secondary",
  SUCCESS: "default",
  WARNING: "outline",
  ERROR: "destructive",
}

export const notificationColumns = helper.columns([
  helper.accessor("title", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Notification" />
    ),
    cell: ({ row, getValue }) => (
      <div className="flex min-w-0 items-start gap-2">
        {!row.original.isRead && (
          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
        )}
        <div className="min-w-0">
          <p className={row.original.isRead ? "font-medium" : "font-semibold"}>
            {getValue()}
          </p>
          <p className="mt-0.5 max-w-[420px] truncate text-xs text-muted-foreground">
            {row.original.message}
          </p>
        </div>
      </div>
    ),
  }),
  helper.accessor("type", {
    header: "Type",
    cell: ({ getValue }) => (
      <Badge variant={typeVariant[getValue()]}>{getValue()}</Badge>
    ),
  }),
  helper.accessor("isRead", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={getValue() ? "secondary" : "default"}>
        {getValue() ? "Read" : "Unread"}
      </Badge>
    ),
  }),
  helper.accessor("createdAt", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Received" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(getValue()).toLocaleString()}
      </span>
    ),
  }),
  helper.display({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 112,
    minSize: 112,
    maxSize: 112,
    cell: ({ row }) => <NotificationActions notification={row.original} />,
  }),
])

function NotificationActions({ notification }: { notification: Notification }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [markRead, { isLoading: isMarkingRead }] =
    useMarkNotificationReadMutation()
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation()

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="View notification details"
          onClick={() => setDetailsOpen(true)}
        >
          <Eye className="size-4" />
        </Button>
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Mark notification as read"
            disabled={isMarkingRead}
            onClick={() => markRead(notification.id)}
          >
            <MailCheck className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete notification"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <NotificationDetailsDialog
        notificationId={notification.id}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete notification?</AlertDialogTitle>
            <AlertDialogDescription>
              This notification will be permanently removed from your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => deleteNotification(notification.id)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
