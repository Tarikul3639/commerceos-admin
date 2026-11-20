"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import { useGetPurchaseQuery } from "../../api/purchase.api"
import { PurchaseForm } from "../../components/purchase-form"

/** Loads and renders an editable purchase when the user has update access. */
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
        { label: data?.invoiceNo ?? "Update" },
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
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Loading purchase details...
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Unable to load purchase details. Please try again.
        </div>
      ) : data.status !== "PENDING" ? (
        <div className="rounded-xl border bg-card p-6">
          <p className="font-medium">This purchase can no longer be edited.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Only pending purchases can be updated. Received or cancelled
            purchases are read-only.
          </p>
        </div>
      ) : (
        <PurchaseForm purchase={data} />
      )}
    </PageContainer>
  )
}
