"use client"

import { PageContainer } from "@/components/layout/page-container"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { PurchaseReturnForm } from "./purchase-return-form"

export function PurchaseReturnCreateContent({
  initialPurchaseId,
}: {
  initialPurchaseId?: string
}) {
  const permission = usePermission()
  return (
    <PageContainer
      access={permission.has(Permission.PURCHASE_CREATE)}
      accessFallback={<UnauthorizedContent />}
      title="Create purchase return"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchase Returns", href: "/dashboard/purchase-returns" },
        { label: "Create" },
      ]}
    >
      <PurchaseReturnForm initialPurchaseId={initialPurchaseId} />
    </PageContainer>
  )
}
