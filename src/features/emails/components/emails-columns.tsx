"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { EmailLog, EmailStatus } from "../types/email.types"
import { EmailDetailsDialog } from "./email-details-dialog"

const helper = createColumnHelper<DataTableFeatures, EmailLog>()

const statusVariant: Record<
  EmailStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  SENT: "default",
  FAILED: "destructive",
}

export const emailColumns = helper.columns([
  helper.accessor("to", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Recipient" />
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  helper.accessor("subject", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Subject" />
    ),
    cell: ({ getValue }) => (
      <span className="block max-w-[280px] truncate">{getValue()}</span>
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>
    ),
  }),
  helper.accessor("attemptCount", {
    header: "Attempts",
    cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
  }),
  helper.accessor("createdAt", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Created" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(getValue()))}
      </span>
    ),
  }),
  helper.display({
    id: "actions",
    header: () => <div className="text-center">Details</div>,
    size: 80,
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => <EmailDetailsCell email={row.original} />,
  }),
])

function EmailDetailsCell({ email }: { email: EmailLog }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="View email details"
          onClick={() => setOpen(true)}
        >
          <Eye className="size-4" />
        </Button>
      </div>
      <EmailDetailsDialog email={email} open={open} onOpenChange={setOpen} />
    </>
  )
}
