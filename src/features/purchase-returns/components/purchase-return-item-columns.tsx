import { createColumnHelper } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/data-table"
import { formatCurrency } from "@/lib/utils/format-currency"
import type { PurchaseReturnItem } from "../types/purchase-return.types"

const helper = createColumnHelper<DataTableFeatures, PurchaseReturnItem>()

export const purchaseReturnItemColumns = helper.columns([
  {
    accessorKey: "purchaseItem.product.name",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.purchaseItem.product.name}
      </span>
    ),
  },
  {
    accessorKey: "purchaseItem.product.sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.purchaseItem.product.sku}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Return quantity",
    cell: ({ row }) => row.original.quantity,
  },
  {
    accessorKey: "purchaseItem.unitPrice",
    header: "Unit price",
    cell: ({ row }) =>
      formatCurrency(row.original.purchaseItem.unitPrice, { compact: false }),
  },
  {
    id: "subtotal",
    header: "Subtotal",
    cell: ({ row }) =>
      formatCurrency(
        Number(row.original.purchaseItem.unitPrice) * row.original.quantity,
        { compact: false }
      ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => row.original.reason || "—",
  },
])
