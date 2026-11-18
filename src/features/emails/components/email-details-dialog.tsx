"use client"

import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useGetEmailLogQuery } from "../api/emails.api"
import type { EmailLog, EmailStatus } from "../types/email.types"

const statusVariant: Record<
  EmailStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  SENT: "default",
  FAILED: "destructive",
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium wrap-break-word">{children}</div>
    </div>
  )
}

export function EmailDetailsDialog({
  email,
  open,
  onOpenChange,
}: {
  email: EmailLog
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data, isLoading, isError } = useGetEmailLogQuery(email.id, {
    skip: !open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Email delivery details</DialogTitle>
          <DialogDescription>
            Delivery status and audit information
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading email details...
          </p>
        ) : isError || !data ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Email details could not be loaded.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <Detail label="Recipient">{data.to}</Detail>
              <Detail label="Status">
                <Badge variant={statusVariant[data.status]}>
                  {data.status}
                </Badge>
              </Detail>
              <div className="sm:col-span-2">
                <Detail label="Subject">{data.subject}</Detail>
              </div>
              <Detail label="Attempts">{data.attemptCount}</Detail>
              <Detail label="Sent at">
                {data.sentAt
                  ? new Date(data.sentAt).toLocaleString()
                  : "Not sent"}
              </Detail>
              <Detail label="Created">
                {new Date(data.createdAt).toLocaleString()}
              </Detail>
              <Detail label="Last updated">
                {new Date(data.updatedAt).toLocaleString()}
              </Detail>
              <Detail label="Related entity">
                {data.entityType
                  ? data.entityType + " · " + (data.entityId ?? "—")
                  : "—"}
              </Detail>
              <Detail label="Triggered by">
                {data.triggeredById ?? "System / automated"}
              </Detail>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Message summary</p>
              <p className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
                {data.preview || "No preview available."}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Rendered email content, reset links and authentication tokens are
              intentionally not exposed in the Admin panel.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
