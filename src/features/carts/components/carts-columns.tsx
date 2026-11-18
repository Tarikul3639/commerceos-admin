"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Button } from "@/components/ui/button"

import type { CustomerCart } from "../types/cart.types"
import { CartDetailsDialog } from "./cart-details-dialog"

const helper = createColumnHelper<DataTableFeatures, CustomerCart>()
const money = (value: string) =>
  `৳${Number(value).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`

export const cartColumns = helper.columns([
  helper.accessor("customer.name", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="font-medium">{row.original.customer.name}</p>
        <p className="max-w-[220px] truncate text-xs text-muted-foreground">
          {row.original.customer.email}
        </p>
      </div>
    ),
  }),
  helper.accessor("itemCount", {
    header: "Products",
    cell: ({ getValue }) => (
      <span className="tabular-nums">{getValue()}</span>
    ),
  }),
  helper.accessor("totalQuantity", {
    header: "Total quantity",
    cell: ({ getValue }) => (
      <span className="tabular-nums">{getValue()}</span>
    ),
  }),
  helper.accessor("estimatedValue", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Estimated value" />
    ),
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">{money(getValue())}</span>
    ),
  }),
  helper.accessor("updatedAt", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Last updated" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(getValue()).toLocaleString()}
      </span>
    ),
  }),
  helper.display({
    id: "actions",
    header: () => <div className="text-center">Details</div>,
    size: 80,
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => <CartDetailsCell cart={row.original} />,
  }),
])

function CartDetailsCell({ cart }: { cart: CustomerCart }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`View cart for ${cart.customer.name}`}
          onClick={() => setOpen(true)}
        >
          <Eye className="size-4" />
        </Button>
      </div>
      <CartDetailsDialog cart={cart} open={open} onOpenChange={setOpen} />
    </>
  )
}
