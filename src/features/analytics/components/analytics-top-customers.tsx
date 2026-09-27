import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { columns } from "./analytics-top-customers-columns"

import type { TopCustomer } from "../analytics.types"
import { topCustomers } from "../analytics.data"

interface AnalyticsTopCustomersProps {
  customers?: TopCustomer[]
  isLoading?: boolean
  isFetching?: boolean
}

export function AnalyticsTopCustomers({
  customers = [],
}: AnalyticsTopCustomersProps) {
  customers = topCustomers

  return (
    <div className="h-full max-h-150 min-h-0 min-w-0">
      <DataTable
        columns={columns}
        data={customers}
        title="Top Customers"
        description="Most valuable customers based on orders"
        isLoading={false}
        isFetching={false}
        columnVisibility
        emptyText="No top customers"
      />
    </div>
  )
}
