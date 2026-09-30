"use client"

import { PageContainer } from "@/components/layout/page-container"
import { DataTable } from "@/components/data-table"

import { useGetSizeChartsQuery } from "../api/size-chart.api"
import { CreateSizeChartDialog } from "./create-size-chart-dialog"
import { columns } from "./size-chart-columns"

export function SizeChartsContent() {
    const { data, isLoading, isError, error } = useGetSizeChartsQuery({
        page: 1,
        limit: 100,
    })

    return (
        <PageContainer
            pageTitle="Size Charts"
            pageDescription="Manage reusable product size charts and measurements."
            pageHeaderAction={<CreateSizeChartDialog />}
        >
            <DataTable
                title="Size Charts"
                description="Manage reusable product size charts and measurements."
                data={data?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />
        </PageContainer>
    )
}