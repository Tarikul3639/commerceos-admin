"use client"

import { useParams } from "next/navigation"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"

import { useGetSizeChartQuery } from "../api/size-chart.api"
import { sizeChartItemColumns } from "./size-chart-item-columns"
import { CreateSizeChartItemDialog } from "./create-size-chart-item-dialog"

export function SizeChartDetails() {
    const { id } = useParams<{ id: string }>()

    const { data, isLoading, isFetching, isError, error } =
        useGetSizeChartQuery(id)

    return (
        <PageContainer
            pageTitle={`Size Chart: ${data?.name ?? ""}`}
            pageDescription="Manage the measurements available for each size."
            pageHeaderAction={<CreateSizeChartItemDialog sizeChartId={id} />}
        >
            <DataTable
                title="Size Chart Items"
                description="Manage the measurements available for each size."
                data={data?.items ?? []}
                columns={sizeChartItemColumns}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                error={error}
            />
        </PageContainer>
    )
}
