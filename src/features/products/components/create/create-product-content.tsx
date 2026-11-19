"use client"

import { PageContainer } from "@/components/layout/page-container"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { usePermission } from "@/hooks/use-permission"
import { Permission } from "@/config/permissions.config"

import { CreateProductForm } from "./create-product-form"

export function CreateProductContent() {
  const canCreate = usePermission().has(Permission.PRODUCT_CREATE)

  if (!canCreate) return <PermissionDenied />
  return (
    <PageContainer
      title="Create a product"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products", href: "/dashboard/products" },
        { label: "Create" },
      ]}
    >
      <CreateProductForm />
    </PageContainer>
  )
}
