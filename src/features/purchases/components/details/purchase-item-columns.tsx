import { createColumnHelper } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/data-table"
import { formatCurrency } from "@/lib/utils/format-currency"

import type { PurchaseItem } from "../../types/purchase.types"

const helper = createColumnHelper<DataTableFeatures, PurchaseItem>()

export const purchaseItemColumns = helper.columns([
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.product.name}</span>
    ),
  },
  {
    accessorKey: "product.sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.product.sku}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-right">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Unit price",
    cell: ({ row }) => (
      <div className="text-right">
        {formatCurrency(row.original.unitPrice, {
          compact: false,
        })}
      </div>
    ),
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.original.subtotal, {
          compact: false,
        })}
      </div>
    ),
  },
])
