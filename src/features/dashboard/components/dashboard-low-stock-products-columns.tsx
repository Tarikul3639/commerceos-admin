import { createColumnHelper } from "@tanstack/react-table"

import type { LowStockProduct } from "../dashboard.types"
import { type DataTableFeatures } from "@/components/data-table"
import { AppImage } from "@/components/media"

export const columnHelper = createColumnHelper<
  DataTableFeatures,
  LowStockProduct
>()

export const columns = columnHelper.columns([
  columnHelper.accessor("productName", {
    header: "Product",
    cell: (info) => {
      const product = info.row.original

      return (
        <div className="flex min-w-0 gap-1.5">
          <AppImage
            name={product.productName}
            image={product.productImage}
            className="mr-2 h-8 w-8"
          />
          <div>
            <p className="truncate font-medium">{product.productName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {product.sku}
            </p>
          </div>
        </div>
      )
    },
  }),

  columnHelper.accessor("quantity", {
    header: "Stock",
    cell: (info) => {
      const quantity = info.getValue()

      return <span className="font-medium">{quantity}</span>
    },
  }),
])
