"use client"

import { useParams } from "next/navigation"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"

import { useGetDiscountProductsQuery } from "../api/discount.api"
import { columns } from "./discount-product-columns"

import { AssignProductsDialog } from "./assign-products-dialog"

export function DiscountDetails() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isFetching, isError, error } =
    useGetDiscountProductsQuery({
      discountId: id,
    })

  return (
    <PageContainer
      title="Discount Details"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discounts", href: "/dashboard/discounts" },
        { label: "Discount Details" },
      ]}
    >
      <DataTable
        title="Discount Products"
        description="List of products associated with this discount."
        columns={columns(id)}
        data={data?.data ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}

        toolbarActions={<AssignProductsDialog discountId={id} />}
      />
    </PageContainer>
  )
}
