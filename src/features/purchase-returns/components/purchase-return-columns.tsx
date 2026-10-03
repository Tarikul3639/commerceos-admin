"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { Check, Info, MoreHorizontal, Trash2, X } from "lucide-react"
import { useState } from "react"
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
  useApprovePurchaseReturnMutation,
  useCompletePurchaseReturnMutation,
  useDeletePurchaseReturnMutation,
  useRejectPurchaseReturnMutation,
} from "../api/purchase-return.api"
import type {
  PurchaseReturn,
  PurchaseReturnStatus,
} from "../types/purchase-return.types"

const helper = createColumnHelper<DataTableFeatures, PurchaseReturn>()
const statusVariant: Record<
  PurchaseReturnStatus,
  "default" | "secondary" | "destructive"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  COMPLETED: "default",
}

export const purchaseReturnColumns = helper.columns([
  {
    accessorKey: "returnNo",
    header: "Return number",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/purchase-returns/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.returnNo}
      </Link>
    ),
  },
  {
    accessorKey: "purchase.invoiceNo",
    header: "Purchase invoice",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/purchases/${row.original.purchase.id}`}
        className="text-muted-foreground hover:underline"
      >
        {row.original.purchase.invoiceNo}
      </Link>
    ),
  },
  {
    id: "supplier",
    header: "Supplier",
    cell: ({ row }) => row.original.purchase.supplier?.name ?? "—",
  },
  {
    id: "total",
    header: "Total amount",
    cell: ({ row }) => {
      const total = row.original.items.reduce(
        (sum, item) =>
          sum + Number(item.purchaseItem.unitPrice) * item.quantity,
        0
      )
      return (
        <span className="font-medium">
          {formatCurrency(total, { compact: false })}
        </span>
      )
    },
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
    cell: ({ row }) => <PurchaseReturnActions purchaseReturn={row.original} />,
  },
])

type ConfirmAction = "approve" | "reject" | "complete" | "delete" | null

function PurchaseReturnActions({
  purchaseReturn,
}: {
  purchaseReturn: PurchaseReturn
}) {
  const permission = usePermission()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [approve, approveState] = useApprovePurchaseReturnMutation()
  const [reject, rejectState] = useRejectPurchaseReturnMutation()
  const [complete, completeState] = useCompletePurchaseReturnMutation()
  const [remove, deleteState] = useDeletePurchaseReturnMutation()

  const canUpdate = permission.has(Permission.PURCHASE_UPDATE)
  const canDelete = permission.has(Permission.PURCHASE_RETURN_DELETE)
  const isPending = purchaseReturn.status === "PENDING"
  const isApproved = purchaseReturn.status === "APPROVED"
  const canDeleteStatus = isPending || purchaseReturn.status === "REJECTED"

  const handleConfirm = async () => {
    if (!confirmAction) return

    try {
      if (confirmAction === "approve") {
        await approve(purchaseReturn.id).unwrap()
        toast.success("Purchase return approved")
      } else if (confirmAction === "reject") {
        await reject(purchaseReturn.id).unwrap()
        toast.success("Purchase return rejected")
      } else if (confirmAction === "complete") {
        await complete(purchaseReturn.id).unwrap()
        toast.success("Purchase return completed")
      } else if (confirmAction === "delete") {
        await remove(purchaseReturn.id).unwrap()
        toast.success("Purchase return deleted")
      }

      setConfirmAction(null)
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Please try again."
      toast.error("Unable to update purchase return", { description: message })
    }
  }

  const isSubmitting =
    approveState.isLoading ||
    rejectState.isLoading ||
    completeState.isLoading ||
    deleteState.isLoading

  const hasStatusAction = canUpdate && (isPending || isApproved)
  const hasDeleteAction = canDelete && canDeleteStatus

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open purchase return actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 p-1">
          <DropdownMenuLabel>Return actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/purchase-returns/${purchaseReturn.id}`}>
                <Info className="size-4" />
                Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {hasStatusAction && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isPending && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setConfirmAction("approve")}
                    >
                      <Check className="size-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setConfirmAction("reject")}
                    >
                      <X className="size-4" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
                {isApproved && (
                  <DropdownMenuItem
                    onClick={() => setConfirmAction("complete")}
                  >
                    <Check className="size-4" />
                    Complete
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}

          {hasDeleteAction && (
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
          confirmAction === "approve"
            ? "Approve purchase return"
            : confirmAction === "reject"
              ? "Reject purchase return"
              : confirmAction === "complete"
                ? "Complete purchase return"
                : "Delete purchase return"
        }
        description={
          confirmAction === "approve"
            ? `Approve ${purchaseReturn.returnNo}? This reserves its quantities against the purchase.`
            : confirmAction === "reject"
              ? `Reject ${purchaseReturn.returnNo}? This action cannot be undone.`
              : confirmAction === "complete"
                ? `Complete ${purchaseReturn.returnNo}? This action cannot be undone.`
                : `Delete ${purchaseReturn.returnNo}? Only pending or rejected returns can be deleted.`
        }
        confirmLabel={isSubmitting ? "Working..." : "Confirm"}
        onConfirm={handleConfirm}
      />
    </>
  )
}
