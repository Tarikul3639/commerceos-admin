"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import {
  Info,
  MoreHorizontal,
  SquarePen,
  Trash2,
  Truck,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"
import { formatCurrency } from "@/lib/utils/format-currency"

import {
  useCancelPurchaseMutation,
  useDeletePurchaseMutation,
  useReceivePurchaseMutation,
} from "../../api/purchase.api"
import type { Purchase, PurchaseStatus } from "../../types/purchase.types"
import { useState } from "react"

const helper = createColumnHelper<DataTableFeatures, Purchase>()

const statusVariant: Record<
  PurchaseStatus,
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  RECEIVED: "default",
  CANCELLED: "destructive",
}

export const columns = helper.columns([
  {
    accessorKey: "invoiceNo",
    header: "Invoice",
    cell: ({ row }) => {
      const purchase = row.original

      return (
        <div className="min-w-0">
          <Link
            href={`/dashboard/purchases/${purchase.id}`}
            className="font-medium hover:underline"
          >
            {purchase.invoiceNo}
          </Link>

          <p className="truncate text-xs text-muted-foreground">
            {purchase.supplier.name}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) =>
      formatCurrency(row.original.subtotal, { compact: false }),
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) =>
      formatCurrency(row.original.discount, { compact: false }),
  },
  {
    accessorKey: "tax",
    header: "Tax",
    cell: ({ row }) => formatCurrency(row.original.tax, { compact: false }),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">
        {formatCurrency(row.original.total, { compact: false })}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={statusVariant[row.original.status]}
        className="capitalize"
      >
        {row.original.status.toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "",
    size: 56,
    minSize: 56,
    maxSize: 56,
    cell: ({ row }) => <PurchaseActions purchase={row.original} />,
  },
])

function PurchaseActions({ purchase }: { purchase: Purchase }) {
  const permission = usePermission()

  const [confirmAction, setConfirmAction] = useState<
    "receive" | "cancel" | "delete" | null
  >(null)

  const [receivePurchase, receiveState] = useReceivePurchaseMutation()
  const [cancelPurchase, cancelState] = useCancelPurchaseMutation()
  const [deletePurchase, deleteState] = useDeletePurchaseMutation()

  const canUpdate = permission.has(Permission.PURCHASE_UPDATE)
  const canDelete = permission.has(Permission.PURCHASE_DELETE)
  const isPending = purchase.status === "PENDING"

  const handleConfirm = async () => {
    if (!confirmAction) return

    try {
      if (confirmAction === "receive") {
        await receivePurchase({
          id: purchase.id,
        }).unwrap()

        toast.success("Purchase marked as received")
      }

      if (confirmAction === "cancel") {
        await cancelPurchase({
          id: purchase.id,
        }).unwrap()

        toast.success("Purchase cancelled")
      }

      if (confirmAction === "delete") {
        await deletePurchase(purchase.id).unwrap()
        toast.success("Purchase deleted")
      }

      setConfirmAction(null)
    } catch (error) {
      toast.error("Unable to update purchase", {
        description:
          (error as { data?: { message?: string } })?.data?.message ??
          "Please try again.",
      })
    }
  }

  const isSubmitting =
    receiveState.isLoading || cancelState.isLoading || deleteState.isLoading

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open purchase actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 p-1">
          <DropdownMenuLabel>Purchase actions</DropdownMenuLabel>

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/purchases/${purchase.id}`}>
                <Info />
                Details
              </Link>
            </DropdownMenuItem>

            {isPending && canUpdate && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/purchases/${purchase.id}/update`}>
                    <SquarePen className="size-4" />
                    Update
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setConfirmAction("receive")}>
                  <Truck className="size-4" />
                  Receive
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>

          {isPending && canUpdate && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmAction("cancel")}
              >
                <XCircle className="size-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}

          {isPending && canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setConfirmAction("delete")}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
        title={
          confirmAction === "receive"
            ? "Receive purchase"
            : confirmAction === "cancel"
              ? "Cancel purchase"
              : "Delete purchase"
        }
        description={
          confirmAction === "receive" ? (
            <>
              Receive <strong>{purchase.invoiceNo}</strong>? Its item quantities
              will be added to stock.
            </>
          ) : confirmAction === "cancel" ? (
            <>
              Cancel <strong>{purchase.invoiceNo}</strong>? Only pending
              purchases can be cancelled.
            </>
          ) : (
            <>
              Delete <strong>{purchase.invoiceNo}</strong>? Only pending
              purchases without returns can be deleted.
            </>
          )
        }
        confirmLabel={
          isSubmitting
            ? "Working..."
            : confirmAction === "receive"
              ? "Receive"
              : confirmAction === "cancel"
                ? "Confirm"
                : "Delete"
        }
        onConfirm={handleConfirm}
      />
    </>
  )
}
