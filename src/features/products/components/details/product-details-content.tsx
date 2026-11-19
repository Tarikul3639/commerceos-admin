"use client"

import Link from "next/link"
import { SquarePen } from "lucide-react"

import { LoadingState } from "@/components/shared/loading-state"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"
import { ErrorState } from "@/components/shared/error-state"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useGetProductDetailsQuery } from "../../api/product.api"
import { GlobalBenefits } from "./global-benefits"
import { ProductImageGallery } from "./gallery/product-image-gallery"
import { ProductSummary } from "./summary/product-summary"
import { ProductDescription } from "./product-description"

interface ProductDetailsContentProps {
  productId: string
}

export function ProductDetailsContent({
  productId,
}: ProductDetailsContentProps) {
  const { has } = usePermission()
  const canRead = has(Permission.PRODUCT_READ)
  const canUpdate = has(Permission.PRODUCT_UPDATE)

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductDetailsQuery(productId, { skip: !canRead })

  if (!canRead) return <PermissionDenied />

  if (isLoading) {
    return <LoadingState message="Loading product details..." />
  }

  if (isError || !product) {
    return <ErrorState message="Failed to load product details." />
  }

  const statusVariant =
    product.status === "PUBLISHED"
      ? "default"
      : product.status === "REJECTED"
        ? "destructive"
        : product.status === "DRAFT"
          ? "secondary"
          : "outline"

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
          {canUpdate && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/products/${product.id}/update`}>
                <SquarePen className="size-4" />
                Update
              </Link>
            </Button>
          )}

          <Badge variant={statusVariant} className="ml-2">
            {product.status}
          </Badge>
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

      <ProductDescription
        description={product.description}
        brandName={product.brand?.name ?? null}
        categoryName={product.category?.name ?? null}
        createdAt={product.createdAt ?? null}
      />
    </PageContainer>
  )
}
