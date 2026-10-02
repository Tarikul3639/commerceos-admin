"use client"

import { PageContainer } from "@/components/layout/page-container"

import { CreateProductForm } from "./create-product-form"

export function CreateProductContent() {
  return (
    <PageContainer
      title="Create a new product"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Products", href: "/dashboard/products" },
        { label: "Create a new product" },
      ]}
    >
      <CreateProductForm />
    </PageContainer>
  )
}
