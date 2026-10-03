"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, RotateCcw } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { PageContainer } from "@/components/layout/page-container"
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
import { UnauthorizedContent } from "@/features/permissions/components/unauthorized-content"
import { formatCurrency } from "@/lib/utils/format-currency"
import { purchaseItemColumns } from "./purchase-item-columns"

import { useGetPurchaseQuery } from "../../api/purchase.api"

export function PurchaseDetailsContent() {
  const params = useParams<{ id: string }>()
  const permission = usePermission()
  const canRead = permission.has(Permission.PURCHASE_READ)
  const canCreateReturn = permission.has(Permission.PURCHASE_CREATE)

  const { data, isLoading, isError } = useGetPurchaseQuery(params.id, {
    skip: !canRead,
  })

  return (
    <PageContainer
      access={canRead}
      accessFallback={<UnauthorizedContent />}
      title={data ? data.invoiceNo : "Purchase details"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Purchases", href: "/dashboard/purchases" },
        { label: data?.invoiceNo ?? "Details" },
      ]}
      pageHeaderAction={
        <div className="flex flex-wrap gap-2">
          {data?.status === "RECEIVED" && canCreateReturn && (
            <Button asChild size="sm">
              <Link
                href={`/dashboard/purchase-returns/create?purchaseId=${data.id}`}
              >
                <RotateCcw className="size-4" />
                Return items
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/purchases">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Loading purchase...
        </div>
      ) : isError || !data ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
          Unable to load purchase details.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="py-2">
              <CardHeader className="border-b">
                <CardTitle className="text-base">
                  Purchase information
                </CardTitle>
                <CardDescription className="text-sm">
                  Overview of the purchase details
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Invoice</p>
                  <p className="font-medium">{data.invoiceNo}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>

                  <Badge
                    variant={
                      data.status === "CANCELLED"
                        ? "destructive"
                        : data.status === "RECEIVED"
                          ? "default"
                          : "secondary"
                    }
                    className="capitalize"
                  >
                    {data.status.toLowerCase()}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {new Date(data.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Created by</p>
                  <div>
                    <p className="text-sm font-medium">{data.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-2">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Supplier</CardTitle>
                <CardDescription className="text-sm">
                  Overview of the supplier details
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-1">
                  <p className="font-medium">{data.supplier.name}</p>

                  <p className="text-sm text-muted-foreground">Supplier ID</p>

                  <p className="font-mono text-xs break-all text-muted-foreground">
                    {data.supplier.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <DataTable
            title="Purchase items"
            description="Products included in this purchase"
            columns={purchaseItemColumns}
            data={data.items}
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

          {/* Summary */}
          <div className="flex justify-end">
            <Card className="w-full py-2 md:max-w-xs">
              <CardHeader className="border-b">
                <CardTitle className="text-base">Purchase summary</CardTitle>
                <CardDescription className="text-sm">
                  Overview of the purchase summary
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {formatCurrency(data.subtotal, {
                      compact: false,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>
                    -{" "}
                    {formatCurrency(data.discount, {
                      compact: false,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>
                    {formatCurrency(data.tax, {
                      compact: false,
                    })}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>

                    <span className="text-lg font-semibold">
                      {formatCurrency(data.total, {
                        compact: false,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
