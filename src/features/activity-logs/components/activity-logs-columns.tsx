"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Info } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { ActivityLog } from "../types/activity-log.types"
import { ActivityLogDetailsDialog } from "./details/activity-log-details-dialog"

const helper = createColumnHelper<DataTableFeatures, ActivityLog>()

function DetailsCell({ log }: { log: ActivityLog }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <Info className="size-4" />
        Details
      </Button>

      <ActivityLogDetailsDialog
        activityId={log.id}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

export const activityLogColumns = helper.columns([
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
  },
  {
    accessorKey: "module",
    header: "Module",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    id: "user",
    header: "Actor",
    accessorFn: (row) => row.user?.name || row.user?.email || "System",
    cell: ({ row }) =>
      row.original.user?.name || row.original.user?.email || "System",
  },
  {
    id: "entity",
    header: "Entity",
    accessorFn: (row) =>
      [row.entityType, row.entityId].filter(Boolean).join(" / ") || "—",
  },
  {
    id: "actions",
    header: "Actions",
    size: 110,
    cell: ({ row }) => <DetailsCell log={row.original} />,
  },
])
