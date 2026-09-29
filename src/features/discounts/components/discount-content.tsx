"use client"

import { useState } from "react"

import { PageContainer } from "@/components/layout/page-container"
import { CreateDiscountDialog } from "@/features/discounts/components/create-discount-dialog"
import { PaginationState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { columns } from "./discount-columns"
import { useGetDiscountsQuery } from "../api/discount.api"
import { DiscountType } from "../types/discount.types"
import { DiscountFilters } from "./discount-filters"

export function DiscountContent() {
    const [search, setSearch] = useState<string>("")
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined)
    const [type, setType] = useState<DiscountType | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const { data, isLoading, isFetching, isError, error } = useGetDiscountsQuery({
        search,
        isActive,
        type,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    })

    const discounts = data?.data || []
    const meta = data?.meta || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    }

    return (
        <PageContainer
            pageTitle="Discounts"
            pageDescription="Manage your discounts and promotions effectively."
            pageHeaderAction={<CreateDiscountDialog />}

        >
            <DataTable
                title="Discounts"
                description="Manage your discounts and promotions effectively."
                columns={columns}
                data={discounts || []}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                error={error}

                toolbarFilters={
                    <DiscountFilters
                        isActive={isActive}
                        type={type}
                        onIsActiveChange={setIsActive}
                        onTypeChange={setType}
                    />
                }

                // Search
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: "Search discounts...",
                }}

                // Pagination
                pagination={pagination}
                onPaginationChange={setPagination}
                totalRows={meta.total}

                // Column visibility
                columnVisibility={true}
                initialColumnVisibility={{
                    createdAt: false,
                    updatedAt: false,
                }}
            />
        </PageContainer>
    )
}
