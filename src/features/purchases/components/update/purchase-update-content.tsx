"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import { Button } from "@/components/ui/button"

import { useGetPurchaseQuery } from "../../api/purchase.api"
import { PurchaseForm } from "../../components/purchase-form"

export function PurchaseUpdateContent() {
  const params = useParams<{ id: string }>()
  const permission = usePermission()

  const canRead = permission.has(Permission.PURCHASE_READ)
  const canUpdate = permission.has(Permission.PURCHASE_UPDATE)

  const { data, isLoading, isError } = useGetPurchaseQuery(params.id, {
    skip: !canRead || !canUpdate,
  })

  if (!canUpdate) {
    return (
      <PageContainer access={false} accessFallback={<UnauthorizedContent />} />
    )
  }

  return (
    <PageContainer
      title={data ? `Update ${data.invoiceNo}` : "Update purchase"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchases", href: "/dashboard/purchases" },
        {
          label: data?.invoiceNo ?? "Update",
        },
      ]}
      pageHeaderAction={
        <Button asChild variant="outline">
          <Link
            href={
              data ? `/dashboard/purchases/${data.id}` : "/dashboard/purchases"
            }
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Loading purchase...
        </div>
      ) : isError || !data ? (
        <div className="rounded-lg border p-6 text-sm text-destructive">
          Unable to load purchase details.
        </div>
      ) : data.status !== "PENDING" ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Only pending purchases can be updated.
        </div>
      ) : (
        <PurchaseForm purchase={data} />
      )}
    </PageContainer>
  )
}
