"use client"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"

import {
  type DataTableFeatures,
  DataTableColumnHeader,
} from "@/components/data-table"
import { TakaIcon } from "@/components/icons/taka-icon"
import { AppImage } from "@/components/media"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "./product-actions"
import type { ProductListItem } from "../../types/product.types"

export const columnHelper = createColumnHelper<
  DataTableFeatures,
  ProductListItem
>()

export const columns = columnHelper.columns([
  // Product
  columnHelper.accessor("name", {
    id: "product",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Product" />
    ),
    sortFn: "sortFn_text",
    size: 300,

    cell: (info) => {
      const product = info.row.original

      return (
        <div className="flex min-w-0 items-center gap-3">
          <AppImage
            name={product.name}
            image={product.image}
            className="size-14 shrink-0 rounded-md after:hidden"
          />

          <div className="min-w-0">
            <Link
              href={`/dashboard/products/${product.id}`}
              className="truncate font-medium hover:text-primary hover:underline"
            >
              {product.name}
            </Link>

            {product.subDescription && (
              <p className="truncate text-xs text-muted-foreground">
                {product.subDescription}
              </p>
            )}
          </div>
        </div>
      )
    },
  }),

  // Category
  columnHelper.accessor("category.name", {
    id: "category",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Category" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const product = info.row.original

      return (
        <Link
          href={`/dashboard/categories/${product.category.id}`}
          className="text-sm whitespace-nowrap hover:text-primary hover:underline"
        >
          {product.category.name}
        </Link>
      )
    },
  }),

  // Brand
  columnHelper.accessor((product) => product.brand?.name ?? "", {
    id: "brand",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Brand" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const brand = info.row.original.brand

      if (!brand) {
        return <span className="text-sm text-muted-foreground">—</span>
      }

      return (
        <Link
          href={`/dashboard/brands/${brand.id}`}
          className="text-sm whitespace-nowrap hover:text-primary hover:underline"
        >
          {brand.name}
        </Link>
      )
    },
  }),

  // Size Guide
  columnHelper.accessor((product) => product.sizeGuide?.name ?? "", {
    id: "sizeGuide",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Size Guide" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const sizeGuide = info.row.original.sizeGuide

      if (!sizeGuide) {
        return <span className="text-sm text-muted-foreground">—</span>
      }

      return (
        <Link
          href={`/dashboard/size-guides/${sizeGuide.id}`}
          className="text-sm whitespace-nowrap hover:text-primary hover:underline"
        >
          {sizeGuide.name}
        </Link>
      )
    },
  }),

  // Pricing
  columnHelper.accessor("sellingPrice", {
    id: "pricing",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Pricing" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const product = info.row.original

      return (
        <div>
          <p className="flex items-center font-medium whitespace-nowrap">
            <TakaIcon className="size-4" />
            {Number(product.sellingPrice).toFixed(2)}
          </p>

          <p className="flex items-center text-xs whitespace-nowrap text-muted-foreground">
            Cost: <TakaIcon className="size-3" />
            {Number(product.purchasePrice).toFixed(2)}
          </p>
        </div>
      )
    },
  }),

  // Status
  columnHelper.accessor("status", {
    id: "status",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Status" />
    ),
    sortFn: "sortFn_text",

    cell: (info) => {
      const product = info.row.original

      if (product.deletedAt) {
        return <Badge variant="destructive">Deleted</Badge>
      }

      const status = info.getValue()

      const statusConfig = {
        DRAFT: {
          label: "Draft",
          variant: "secondary" as const,
        },
        PROPOSED: {
          label: "Proposed",
          variant: "outline" as const,
        },
        PUBLISHED: {
          label: "Published",
          variant: "default" as const,
        },
        REJECTED: {
          label: "Rejected",
          variant: "destructive" as const,
        },
      }

      const config = statusConfig[status]

      return <Badge variant={config.variant}>{config.label}</Badge>
    },
  }),

  // Created At
  columnHelper.accessor("createdAt", {
    id: "created_at",
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Created At" />
    ),
    sortFn: "sortFn_datetime",

    cell: (info) => {
      const date = new Date(info.getValue())

      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm whitespace-nowrap">
            {date.toLocaleDateString("en-BD", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          <span className="text-xs whitespace-nowrap text-muted-foreground">
            {date.toLocaleTimeString("en-BD", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      )
    },
  }),
  // Actions
  columnHelper.display({
    id: "actions",
    header: () => (
      <div className="flex w-full items-center justify-center">Actions</div>
    ),
    cell: (info) => <ProductActions product={info.row.original} />,
  }),
])
