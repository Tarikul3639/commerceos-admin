"use client"

import { createColumnHelper } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

import type { OrderReturn, OrderReturnStatus } from "../types/return.types"
import { ReturnDetailsDialog } from "./return-details-dialog"

const helper = createColumnHelper<DataTableFeatures, OrderReturn>()

const statusVariant: Record<
  OrderReturnStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  PARTIALLY_PAID: "secondary",
  REJECTED: "destructive",
  COMPLETED: "default",
}

export const returnColumns = helper.columns([
  helper.accessor("returnNo", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Return ID" />
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  helper.accessor("order.invoiceNo", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Order" />
    ),
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),
  helper.accessor("order.customer.name", {
    header: "Customer",
    cell: ({ getValue }) => (
      <span className="max-w-40 truncate">{getValue() || "—"}</span>
    ),
  }),
  helper.accessor("items", {
    header: "Items",
    cell: ({ getValue }) => (
      <span>
        {getValue().reduce((total, item) => total + item.quantity, 0)}
      </span>
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={statusVariant[getValue()]}>
        {getValue().replaceAll("_", " ")}
      </Badge>
    ),
  }),
  helper.accessor("createdAt", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Requested" />
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
    size: 90,
    minSize: 90,
    maxSize: 90,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <ReturnDetailsDialog orderReturn={row.original} />
      </div>
    ),
  }),
])
