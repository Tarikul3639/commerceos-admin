"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { DataTableFeatures } from "@/components/data-table"
import type { Discount } from "../types/discount.types"

const helper = createColumnHelper<DataTableFeatures, Discount>()

export function getDiscountColumns(
  onEdit: (discount: Discount) => void,
  onDelete: (discount: Discount) => void
) {
  return helper.columns([
    helper.accessor("code", {
      header: "Coupon code",
      cell: ({ getValue }) => (
        <span className="font-mono font-semibold tracking-wide">
          {getValue()}
        </span>
      ),
    }),
    helper.accessor("type", {
      header: "Type",
      cell: ({ getValue }) =>
        getValue() === "PERCENTAGE" ? "Percentage" : "Fixed amount",
    }),
    helper.accessor("value", {
      header: "Value",
      cell: ({ row }) =>
        row.original.type === "PERCENTAGE"
          ? `${row.original.value}%`
          : `৳${Number(row.original.value).toLocaleString("en-BD")}`,
    }),
    helper.accessor("minOrderAmount", {
      header: "Min. order",
      cell: ({ getValue }) => `৳${Number(getValue()).toLocaleString("en-BD")}`,
    }),
    helper.accessor("usageLimit", {
      header: "Usage limit",
      cell: ({ getValue }) => (getValue() == null ? "Unlimited" : getValue()),
    }),
    helper.accessor("isActive", {
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "default" : "secondary"}>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    }),
    helper.accessor("endsAt", {
      header: "Expires",
      cell: ({ getValue }) =>
        getValue() ? new Date(getValue()!).toLocaleDateString() : "No expiry",
    }),
    helper.display({
      id: "actions",
      header: "Actions",
      size: 90,
      minSize: 90,
      maxSize: 90,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Discount actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
}
