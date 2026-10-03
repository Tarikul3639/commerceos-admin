"use client"

import { PageContainer } from "@/components/layout/page-container"
import { PurchaseForm } from "../../components/purchase-form"
import { useRouter } from "next/navigation"

export function PurchaseCreateContent() {
  const router = useRouter()
  return (
    <PageContainer
      title="Create purchase"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchases", href: "/dashboard/purchases" },
        { label: "Create" },
      ]}
    >
      <PurchaseForm
        onSuccess={() => {
          router.push("/dashboard/purchases")
        }}
      />
    </PageContainer>
  )
}
