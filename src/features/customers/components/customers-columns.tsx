"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"

import {
  type DataTableFeatures,
  DataTableColumnHeader,
} from "@/components/data-table"
import { AppImage } from "@/components/media"
import { Badge } from "@/components/ui/badge"

import type { Customer } from "../types/customers.types"
import { CustomerColumnActions } from "./customer-column-actions"
import { CustomerViewDialog } from "./customer-view-dialog"

export const columnHelper = createColumnHelper<DataTableFeatures, Customer>()

function CustomerNameCell({ customer }: { customer: Customer }) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsViewDialogOpen(true)}
        className="flex min-w-0 items-center gap-2 text-left"
        aria-label={`View details for ${customer.name}`}
      >
        <AppImage
          name={customer.name}
          image={customer.avatarUrl ?? undefined}
        />

        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium hover:underline">
            {customer.name}
          </span>

          <span className="truncate text-sm text-muted-foreground">
            {customer.email}
          </span>
        </div>
      </button>

      <CustomerViewDialog
        customer={customer}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </>
  )
}

export const customerColumns = columnHelper.columns([
  {
    id: "user",
    accessorFn: (customer) => `${customer.name} ${customer.email}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    sortFn: "sortFn_text",
    size: 250,
    minSize: 180,
    cell: ({ row }) => <CustomerNameCell customer={row.original} />,
  },

  {
    accessorKey: "address",
    header: "Address",
    size: 200,
    minSize: 150,
    cell: ({ row }) => (
      <span className="block truncate">{row.original.address ?? "—"}</span>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="flex w-full items-center justify-center"
      />
    ),
    sortFn: "sortFn_text",
    size: 120,
    minSize: 100,
    cell: ({ row }) => {
      const status = row.original.status

      const variant = (() => {
        switch (status) {
          case "ACTIVE":
            return "default" as const
          case "INACTIVE":
            return "secondary" as const
          case "SUSPENDED":
          case "DELETED":
            return "destructive" as const
          default:
            return "default" as const
        }
      })()

      return (
        <div className="flex items-center justify-center">
          <Badge variant={variant}>{status}</Badge>
        </div>
      )
    },
  },

  {
    accessorKey: "isVerified",
    id: "isVerified",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Verified"
        className="flex w-full items-center justify-center"
      />
    ),
    sortFn: "sortFn_alphanumeric",
    size: 100,
    minSize: 80,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Badge variant={row.original.isVerified ? "default" : "secondary"}>
          {row.original.isVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="flex w-full items-center justify-center"
      />
    ),
    sortFn: "sortFn_datetime",
    size: 180,
    minSize: 160,
    cell: ({ row }) => (
      <span className="block w-full text-center">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </span>
    ),
  },

  {
    id: "actions",
    header: "Action",
    size: 70,
    minSize: 60,
    maxSize: 70,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <CustomerColumnActions customer={row.original} />
      </div>
    ),
  },
])