"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import type { CustomerWishlist } from "../types/wishlist.types"
import { WishlistDetailsDialog } from "./wishlist-details-dialog"

const helper = createColumnHelper<DataTableFeatures, CustomerWishlist>()

/** Defines the customer, saved-product count and activity columns for wishlist reports. */
export const wishlistColumns = helper.columns([
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
    header: "Saved products",
    cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
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
    cell: ({ row }) => <WishlistDetailsCell wishlist={row.original} />,
  }),
])

/** Owns the open state for the selected wishlist's detail dialog. */
function WishlistDetailsCell({ wishlist }: { wishlist: CustomerWishlist }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`View wishlist for ${wishlist.customer.name}`}
          onClick={() => setOpen(true)}
        >
          <Eye className="size-4" />
        </Button>
      </div>
      <WishlistDetailsDialog
        wishlist={wishlist}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
