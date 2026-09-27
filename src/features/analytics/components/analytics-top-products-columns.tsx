import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "@/components/data-table"

import { AppImage } from "@/components/media"
import { TopProduct } from "../analytics.types"

export const columnHelper = createColumnHelper<DataTableFeatures, TopProduct>()

export const columns = columnHelper.columns([
  columnHelper.accessor("productName", {
    header: "Product Name",
    sortFn: "sortFn_text",
    cell: (info) => {
      const product = info.row.original

      return (
        <div className="flex min-w-0 items-center gap-2">
          <AppImage
            name={product.productName}
            image={product.productImage}
            className="h-10 w-10 rounded-sm"
          />

          <div className="min-w-0">
            <p className="truncate font-medium">{product.productName}</p>

            <p className="truncate text-xs text-muted-foreground">
              {product.sku}
            </p>
          </div>
        </div>
      )
    },
  }),

  columnHelper.accessor("totalRevenue", {
    id: "Revenue",
    header: () => (
      <div className="flex justify-center gap-2">
        <span>Revenue</span>
      </div>
    ),
    sortFn: "sortFn_alphanumeric",
    cell: (info) => {
      const revenue = Number(info.getValue())

      return (
        <div className="flex min-w-0 justify-center gap-2">
          <span className="font-medium">
            ৳ {revenue.toLocaleString("en-BD")}
          </span>
        </div>
      )
    },
  }),

  columnHelper.accessor("totalSold", {
    header: "Units Sold",
    sortFn: "sortFn_alphanumeric",
    cell: (info) => {
      return (
        <div className="flex min-w-0 justify-center gap-2">
          <span className="font-medium">
            {info.getValue().toLocaleString("en-BD")}
          </span>
        </div>
      )
    },
  }),
])
