import { createColumnHelper } from "@tanstack/react-table"

import type { RecentOrder } from "../dashboard.types"
import { type DataTableFeatures } from "@/components/data-table"
import { AppImage } from "@/components/media"

export const columnHelper = createColumnHelper<DataTableFeatures, RecentOrder>()

export const columns = columnHelper.columns([
  columnHelper.accessor("orderNumber", {
    header: "Order",
    sortFn: "sortFn_alphanumeric",
    cell: (info) => {
      const order = info.row.original

      return (
        <div className="min-w-0">
          <p className="truncate font-medium">{order.orderNumber}</p>

          <p className="truncate text-xs text-muted-foreground">{order.id}</p>
        </div>
      )
    },
  }),

  columnHelper.accessor((row) => row.customer, {
    id: "Customer",
    header: "Customer",
    sortFn: "sortFn_text",
    cell: (info) => {
      const customer = info.getValue()
      return (
        <div className="flex min-w-0 gap-1.5">
          <AppImage
            name={customer.name}
            image={customer.image}
            className="mr-2 h-8 w-8"
          />
          <div>
            <p className="truncate font-medium">{customer.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {customer.id}
            </p>
          </div>
        </div>
      )
    },
  }),

  columnHelper.accessor("status", {
    header: "Status",
    sortFn: "sortFn_text",
    cell: (info) => {
      const order = info.row.original

      return (
        <div className="min-w-0">
          <p className="truncate font-medium">{order.status}</p>

          <p className="truncate text-xs text-muted-foreground">
            {order.paymentStatus || "N/A"}
          </p>
        </div>
      )
    },
  }),

  columnHelper.accessor("total", {
    header: "Order",
    sortFn: "sortFn_alphanumeric",
    cell: (info) => {
      const order = info.row.original

      return (
        <div className="text-right">
          <p className="font-medium">${order.total}</p>

          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      )
    },
  }),
])
