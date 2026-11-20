"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { Info } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { ActivityLog } from "../types/activity-log.types"

const helper = createColumnHelper<DataTableFeatures, ActivityLog>()

function DetailsCell({ log }: { log: ActivityLog }) {
  return (
    <Button asChild variant="secondary" size="sm">
      <Link href={`/dashboard/activity-logs/${log.id}`}>
        <Info className="size-4" />
        Details
      </Link>
    </Button>
  )
}

export const activityLogColumns = helper.columns([
  {
    accessorKey: "createdAt",
    header: "Date",
    size: 176,
    minSize: 150,
    cell: ({ row }) => (
      <span className="block text-xs leading-relaxed whitespace-normal text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 128,
    minSize: 110,
    cell: ({ row }) => (
      <Badge variant="secondary" className="whitespace-normal">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "module",
    header: "Module",
    size: 140,
    minSize: 120,
    cell: ({ row }) => (
      <span className="block text-sm wrap-break-word whitespace-normal">
        {row.original.module}
      </span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    size: 200,
    minSize: 160,
    cell: ({ row }) => (
      <span className="block text-sm font-medium wrap-break-word whitespace-normal">
        {row.original.action}
      </span>
    ),
  },
  {
    id: "user",
    header: "Actor",
    size: 180,
    minSize: 140,
    accessorFn: (row) => row.user?.name || row.user?.email || "System",
    cell: ({ row }) => (
      <span className="block text-sm break-all whitespace-normal">
        {row.original.user?.name || row.original.user?.email || "System"}
      </span>
    ),
  },
  {
    id: "entity",
    header: "Entity",
    size: 180,
    minSize: 140,
    accessorFn: (row) =>
      [row.entityType, row.entityId].filter(Boolean).join(" / ") || "—",
    cell: ({ row }) => (
      <span className="block text-xs break-all whitespace-normal text-muted-foreground">
        {[row.original.entityType, row.original.entityId]
          .filter(Boolean)
          .join(" / ") || "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    size: 104,
    minSize: 96,
    cell: ({ row }) => <DetailsCell log={row.original} />,
  },
])
