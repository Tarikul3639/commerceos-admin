"use client"

import { useParams } from "next/navigation"
import { PageContainer } from "@/components/layout/page-container"
import { LoadingState } from "@/components/shared/loading-state"
import { ErrorState } from "@/components/shared/error-state"
import { useGetProductDetailsQuery } from "../../api/product.api"
import { UpdateProductForm } from "./update-product-form"

export function UpdateProductContent() {
  const { id: productId } = useParams<{ id: string }>()

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductDetailsQuery(productId)

  if (isLoading) {
    return <LoadingState message="Loading product details..." />
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Failed to load product"
        message="Unable to fetch product details."
        onRetry={() => refetch()}
      />
    )
  }

  const title = `${product.name.slice(0, 20)}${product.name.length > 20 ? "..." : ""}`

  return (
    <PageContainer
      title={title}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products", href: "/dashboard/products" },
        { label: "Update" },
      ]}
    >
      <UpdateProductForm productId={productId} product={product} />
    </PageContainer>
  )
}
