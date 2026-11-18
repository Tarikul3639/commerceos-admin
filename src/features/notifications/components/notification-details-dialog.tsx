"use client"

import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import { useGetNotificationQuery } from "../api/notifications.api"

interface NotificationDetailsDialogProps {
  notificationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeVariant = {
  INFO: "secondary",
  SUCCESS: "default",
  WARNING: "outline",
  ERROR: "destructive",
} as const

export function NotificationDetailsDialog({
  notificationId,
  open,
  onOpenChange,
}: NotificationDetailsDialogProps) {
  const { data, isLoading, isError } = useGetNotificationQuery(
    notificationId ?? "",
    { skip: !open || !notificationId }
  )
  const internalLink =
    data?.link?.startsWith("/") && !data.link.startsWith("//")
      ? data.link
      : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(85dvh,720px)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="pr-8">Notification details</DialogTitle>
          <DialogDescription>
            Full message and related record information
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading notification...
          </p>
        ) : isError || !data ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Notification details could not be loaded.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={typeVariant[data.type]}>{data.type}</Badge>
              <Badge variant={data.isRead ? "secondary" : "default"}>
                {data.isRead ? "Read" : "Unread"}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold wrap-break-word">
                {data.title}
              </h3>
              <p className="text-sm leading-6 wrap-break-word whitespace-pre-wrap text-muted-foreground">
                {data.message}
              </p>
            </div>
            <div className="grid gap-3 rounded-lg border p-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="mt-1 font-medium">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="mt-1 font-medium">
                  {new Date(data.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Related type</p>
                <p className="mt-1 font-medium">{data.entityType || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Related ID</p>
                <p className="mt-1 font-mono text-xs break-all">
                  {data.entityId || "—"}
                </p>
              </div>
              {data.link && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Related link</p>
                  {internalLink ? (
                    <Link
                      href={internalLink}
                      className="mt-1 inline-block break-all text-primary underline underline-offset-4"
                      onClick={() => onOpenChange(false)}
                    >
                      {data.link}
                    </Link>
                  ) : (
                    <p className="mt-1 text-sm break-all text-muted-foreground">
                      {data.link}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
