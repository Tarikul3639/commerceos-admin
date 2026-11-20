import { DataTable } from "@/components/data-table"
import { columns } from "./analytics-top-customers-columns"

import type { TopCustomer } from "../analytics.types"

interface AnalyticsTopCustomersProps {
  customers?: TopCustomer[]
  isLoading?: boolean
  isFetching?: boolean
}

export function AnalyticsTopCustomers({
  customers = [],
  isLoading = false,
  isFetching = false,
}: AnalyticsTopCustomersProps) {
  return (
    <div className="h-full max-h-150 min-h-0 min-w-0">
      <DataTable
        columns={columns}
        data={customers}
        title="Top Customers"
        description="Most valuable customers based on orders"
        isLoading={isLoading}
        isFetching={isFetching}
        columnVisibility
        emptyText="No top customers"
      />
    </div>
  )
}
