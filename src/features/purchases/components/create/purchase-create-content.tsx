"use client"

import { PageContainer } from "@/components/layout/page-container"
import { PermissionDenied } from "@/components/shared/permission-denied"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { PurchaseForm } from "../../components/purchase-form"
import { useRouter } from "next/navigation"

export function PurchaseCreateContent() {
  const canCreate = usePermission().has(Permission.PURCHASE_CREATE)
  const router = useRouter()

  if (!canCreate) return <PermissionDenied />
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
