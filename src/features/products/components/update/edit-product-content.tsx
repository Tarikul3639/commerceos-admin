"use client"

import { AlertCircle, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PageContainer } from "@/components/layout/page-container"

import { useGetProductDetailsQuery } from "../../api/product.api"
import { UpdateProductForm } from "./update-product-form"

export function EditProductContent() {
  const params = useParams()
  const productId = params.id as string

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(productId)

  return (
    <PageContainer
      title="Update product"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products", href: "/dashboard/products" },
        { label: "Update product" },
      ]}
    >
      {isLoading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError || !product ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Unable to load product</AlertTitle>
          <AlertDescription>Failed to load product details.</AlertDescription>
        </Alert>
      ) : (
        <UpdateProductForm product={product} />
      )}
    </PageContainer>
  )
}
