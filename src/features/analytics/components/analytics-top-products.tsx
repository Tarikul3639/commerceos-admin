import { DataTable } from "@/components/data-table"
import { columns } from "./analytics-top-products-columns"

import type { TopProduct } from "../analytics.types"
import { products as topProducts } from "../analytics.data"

interface AnalyticsTopProductsProps {
  products?: TopProduct[]
  isLoading?: boolean
  isFetching?: boolean
}

export function AnalyticsTopProducts({
  products = [],
}: AnalyticsTopProductsProps) {
  products = topProducts

  return (
    <div className="h-full max-h-150 min-h-0 min-w-0">
      <DataTable
        columns={columns}
        data={products}
        title="Top Products"
        description="Most popular products based on sales"
        isLoading={false}
        isFetching={false}
        columnVisibility
        emptyText="No top products"
      />
    </div>
  )
}
