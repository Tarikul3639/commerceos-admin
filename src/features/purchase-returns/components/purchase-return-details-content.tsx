"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { formatCurrency } from "@/lib/utils/format-currency"
import { useGetPurchaseQuery } from "@/features/purchases/api/purchase.api"
import { useGetPurchaseReturnQuery } from "../api/purchase-return.api"
import { purchaseReturnItemColumns } from "./purchase-return-item-columns"

export function PurchaseReturnDetailsContent() {
  const params = useParams<{ id: string }>()
  const permission = usePermission()
  const canRead = permission.has(Permission.PURCHASE_READ)
  const {
    currentData: purchaseReturn,
    isLoading,
    isError,
  } = useGetPurchaseReturnQuery(params.id, { skip: !canRead })
  const { currentData: purchase } = useGetPurchaseQuery(
    purchaseReturn?.purchase.id ?? "",
    { skip: !purchaseReturn?.purchase.id }
  )
  const total = (purchaseReturn?.items ?? []).reduce(
    (sum, item) => sum + Number(item.purchaseItem.unitPrice) * item.quantity,
    0
  )

  return (
    <PageContainer
      access={canRead}
      accessFallback={<UnauthorizedContent />}
      title={purchaseReturn?.returnNo ?? "Purchase return details"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchase Returns", href: "/dashboard/purchase-returns" },
        { label: purchaseReturn?.returnNo ?? "Details" },
      ]}
      pageHeaderAction={
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/purchase-returns">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Loading purchase return...
        </div>
      ) : isError || !purchaseReturn ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Unable to load purchase return details.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="py-2">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Return information</CardTitle>
                <CardDescription>
                  Return number, status and creation details.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Return number</p>
                  <p className="font-medium">{purchaseReturn.returnNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      purchaseReturn.status === "REJECTED"
                        ? "destructive"
                        : purchaseReturn.status === "PENDING"
                          ? "secondary"
                          : "default"
                    }
                    className="capitalize"
                  >
                    {purchaseReturn.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {new Date(purchaseReturn.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <div>
                    <p className="text-sm font-medium">
                      {purchaseReturn.createdBy.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {purchaseReturn.createdBy.email}
                    </p>
                  </div>
                </div>
                {purchaseReturn.approvedBy && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Approved by</p>
                    <p className="text-sm">{purchaseReturn.approvedBy.name}</p>
                  </div>
                )}
                {purchaseReturn.reason && (
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Reason</p>
                    <p className="text-sm">{purchaseReturn.reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="py-2">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Original purchase</CardTitle>
                <CardDescription>
                  Purchase and supplier this return was created against.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Purchase invoice
                  </p>
                  <Link
                    href={`/dashboard/purchases/${purchaseReturn.purchase.id}`}
                    className="font-medium hover:underline"
                  >
                    {purchaseReturn.purchase.invoiceNo}
                  </Link>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="text-sm font-medium">
                    {purchase?.supplier.name ??
                      purchaseReturn.purchase.supplier?.name ??
                      "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataTable
            title="Return items"
            description="Products and quantities included in this return."
            columns={purchaseReturnItemColumns}
            data={purchaseReturn.items}
            columnVisibility
            showPagination={false}
            initialColumnVisibility={{
              pagination: false,
              sorting: false,
              filtering: false,
              columnVisibility: false,
              rowSelection: false,
            }}
          />

          <div className="flex justify-end">
            <Card className="w-full py-2 md:max-w-xs">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Return summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total returned value
                  </span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(total, { compact: false })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
