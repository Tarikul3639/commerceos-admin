"use client"

import Link from "next/link"
import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { SquarePen } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { AppImage } from "@/components/media"
import { Button } from "@/components/ui/button"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import type { Stock } from "../types/stock.types"
import { AdjustStockDialog } from "./adjust-stock-dialog"

const helper = createColumnHelper<DataTableFeatures, Stock>()

export const columns = helper.columns([
  helper.accessor("productName", {
    header: "Product",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/products/${row.original.productId}`}
        className="flex min-w-0 items-center gap-3 hover:text-primary"
      >
        <AppImage
          image={row.original.productImage}
          name={row.original.productName}
          className="size-11 rounded-md"
        />

        <span className="truncate font-medium hover:underline">
          {row.original.productName}
        </span>
      </Link>
    ),
  }),

  helper.accessor("sku", {
    header: "SKU",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue()}</span>
    ),
  }),

  helper.accessor("quantity", {
    header: "Current stock",
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">{getValue()}</span>
    ),
  }),

  helper.accessor("updatedAt", {
    header: "Updated",
    cell: ({ getValue }) =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(getValue())),
  }),

  helper.display({
    id: "actions",
    header: "Actions",
    size: 100,
    minSize: 100,
    maxSize: 100,
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      const canAdjust = usePermission().has(Permission.STOCK_UPDATE)

      if (!canAdjust) return null

      return (
        <>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <SquarePen />
            Adjust
          </Button>

          <AdjustStockDialog
            stock={row.original}
            open={open}
            onOpenChange={setOpen}
          />
        </>
      )
    },
  }),
])
