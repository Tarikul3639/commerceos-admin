"use client"

import Link from "next/link"
import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { SquarePen } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { AppImage } from "@/components/media"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
          clickable={false}
          className="size-11 rounded-md"
        />

        <span className="truncate font-medium hover:underline">
          {row.original.productName}
        </span>
      </Link>
    ),
  }),

  helper.accessor("sku", {
    header: () => <div className="text-center">SKU</div>,
    cell: ({ row, getValue }) => (
      <Link
        href={`/dashboard/products/${row.original.productId}/update?tab=variants&sku=${encodeURIComponent(getValue())}`}
        className="text-center text-sm text-primary hover:underline"
      >
        {getValue()}
      </Link>
    ),
  }),

  helper.accessor("quantity", {
    header: (info) => (
      <div className="text-center">
        <DataTableColumnHeader column={info.column} title="Stock" />
      </div>
    ),
    cell: (info) => {
      const stock = info.getValue()
      const progress = Math.min(stock, 100)

      const progressColor =
        stock < 5
          ? "[&>div]:bg-destructive"
          : stock < 20
            ? "[&>div]:bg-yellow-500"
            : stock < 50
              ? "[&>div]:bg-blue-500"
              : "[&>div]:bg-green-500"

      return (
        <div className="flex w-full items-center justify-center gap-2">
          <div className="flex w-20 flex-col space-y-1">
            <Progress value={progress} className={`h-1.5 ${progressColor}`} />

            <p className="text-center text-xs text-muted-foreground tabular-nums">
              {stock === 0 ? "Out of stock" : `${stock} in stock`}
            </p>
          </div>
        </div>
      )
    },
  }),

  helper.accessor("updatedAt", {
    header: () => <div className="text-center">Updated</div>,
    cell: ({ getValue }) => (
      <div className="text-center">
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(getValue()))}
      </div>
    ),
  }),

  helper.display({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 100,
    minSize: 100,
    maxSize: 100,
    cell: ({ row }) => <StockActionsCell stock={row.original} />,
  }),
])

function StockActionsCell({ stock }: { stock: Stock }) {
  const [open, setOpen] = useState(false)
  const canAdjust = usePermission().has(Permission.STOCK_UPDATE)

  if (!canAdjust) return null

  return (
    <div className="flex justify-center">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <SquarePen className="size-4" />
        Adjust
      </Button>

      <AdjustStockDialog stock={stock} open={open} onOpenChange={setOpen} />
    </div>
  )
}
