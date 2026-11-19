"use client"

import Link from "next/link"

import { ArrowRight, Package } from "lucide-react"

import type { LowStockProduct } from "../dashboard.types"
import { columns } from "./dashboard-low-stock-products-columns"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { lowStockProducts } from "../dashboard.data"

interface DashboardLowStockProductsProps {
  products?: LowStockProduct[]
  isLoading?: boolean
}

/** Displays products that are currently low in stock. */
export function DashboardLowStockProducts({
  products = [],
  isLoading = false,
}: DashboardLowStockProductsProps) {
  return (
    <DataTable
      columns={columns}
      data={products.length ? products : lowStockProducts}
      title="Low Stock Products"
      description="Products that are low in stock"
      isLoading={isLoading}
      // columnVisibility
      emptyText="No low stock products"
      emptyIcon={Package}
      showPagination={false}
      toolbarActions={
        <Button variant="link" size="sm" asChild>
          <Link href="/products">
            View All <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    />
  )
}
