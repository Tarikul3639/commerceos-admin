import { createColumnHelper } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/data-table"
import { AppImage } from "@/components/media"

import { TopCustomer } from "../analytics.types"

export const columnHelper = createColumnHelper<DataTableFeatures, TopCustomer>()

export const columns = columnHelper.columns([
  columnHelper.accessor("customerName", {
    header: "Customer",
    sortFn: "sortFn_text",
    cell: (info) => {
      const customer = info.row.original

      return (
        <div className="flex min-w-0 items-center gap-2">
          <AppImage
            name={customer.customerName}
            image={customer.customerImage}
            className="h-10 w-10 shrink-0 rounded-full"
          />

          <div className="min-w-0">
            <p className="truncate font-medium">{customer.customerName}</p>

            <p className="truncate text-xs text-muted-foreground">
              {customer.customerId}
            </p>
          </div>
        </div>
      )
    },
  }),

  columnHelper.accessor("email", {
    header: "Email",
    sortFn: "sortFn_text",
    cell: (info) => {
      const email = info.getValue()

      return (
        <span className="block max-w-[220px] truncate text-sm">
          {email || "—"}
        </span>
      )
    },
  }),

  columnHelper.accessor("phone", {
    header: "Phone",
    sortFn: "sortFn_text",
    cell: (info) => {
      return (
        <span className="text-sm whitespace-nowrap">
          {info.getValue() || "—"}
        </span>
      )
    },
  }),

  columnHelper.accessor("totalOrders", {
    id: "Orders",
    header: () => (
      <div className="flex justify-center">
        <span>Orders</span>
      </div>
    ),
    sortFn: "sortFn_alphanumeric",
    cell: (info) => {
      const orders = Number(info.getValue())

      return (
        <div className="flex justify-center">
          <span className="font-medium">{orders.toLocaleString("en-BD")}</span>
        </div>
      )
    },
  }),

  columnHelper.accessor("totalSpent", {
    header: () => (
      <div className="flex justify-end">
        <span>Total Spent</span>
      </div>
    ),
    sortFn: "sortFn_alphanumeric",
    cell: (info) => {
      const totalSpent = Number(info.getValue())

      return (
        <div className="flex justify-end">
          <span className="font-medium whitespace-nowrap">
            ৳{totalSpent.toLocaleString("en-BD")}
          </span>
        </div>
      )
    },
  }),
])
