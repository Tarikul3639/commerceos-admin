"use client"

import Link from "next/link"
import { ExternalLink, SquarePen } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"

import { useGetProductDetailsQuery } from "../../api/product.api"
import { GlobalBenefits } from "./global-benefits"
import { ProductImageGallery } from "./product-image-gallery"
import { ProductSummary } from "./product-summary"
import { ProductTabs } from "./product-tabs"

interface ProductDetailsContentProps {
  productId: string
}

export function ProductDetailsContent({
  productId,
}: ProductDetailsContentProps) {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(productId)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !product) {
    return <div>Failed to load product.</div>
  }

  const status = product.deletedAt
    ? "Deleted"
    : product.isActive
      ? "Active"
      : "Inactive"

  const statusVariant = product.deletedAt
    ? "destructive"
    : product.isActive
      ? "default"
      : "secondary"

  return (
    <PageContainer
      title={product.name}
      className="mx-auto max-w-6xl"
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Products",
          href: "/dashboard/products",
        },
        {
          label: "Product Details",
        },
      ]}
      pageHeaderAction={
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon-sm">
            <Link
              href={`/products/${product.id}`}
              target="_blank"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="size-4" />
              <span className="sr-only">View product</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon-sm">
            <Link
              href={`/dashboard/products/${product.id}/edit`}
              className="text-muted-foreground hover:text-primary"
            >
              <SquarePen className="size-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>

          <Button variant={statusVariant} size="sm" disabled className="ml-2">
            {status}
          </Button>
        </div>
      }
    >
      <div className="grid min-w-0 gap-8 md:grid-cols-2">
        <div className="min-w-0 md:flex md:justify-center">
          <div className="w-full md:max-w-lg">
            <ProductImageGallery name={product.name} images={product.images} />
          </div>
        </div>

        <ProductSummary product={product} />
      </div>

      <GlobalBenefits />

      <ProductTabs product={product} />
    </PageContainer>
  )
}
