"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye, XCircle } from "lucide-react"
import { toast } from "sonner"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import type { Order, OrderStatus } from "../types/order.types"
import {
  useCancelOrderMutation,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} from "../api/orders.api"

const helper = createColumnHelper<DataTableFeatures, Order>()

const orderStatusVariant: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PROCESSING: "default",
  SHIPPED: "secondary",
  DELIVERED: "default",
  CANCELLED: "destructive",
}

export const orderColumns = helper.columns([
  helper.accessor("invoiceNo", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Invoice" />
    ),
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  helper.accessor((row) => row.customer?.name ?? "Guest", {
    id: "customer",
    header: "Customer",
    cell: ({ getValue }) => <span className="truncate">{getValue()}</span>,
  }),
  helper.accessor("items", {
    header: "Items",
    cell: ({ getValue }) => (
      <span>
        {getValue().reduce((total, item) => total + item.quantity, 0)}
      </span>
    ),
  }),
  helper.accessor("total", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Total" />
    ),
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">
        ৳
        {Number(getValue()).toLocaleString("en-BD", {
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  helper.accessor("paymentStatus", {
    header: "Payment",
    cell: ({ getValue }) => (
      <Badge
        variant={
          getValue() === "PAID"
            ? "default"
            : getValue() === "FAILED"
              ? "destructive"
              : "outline"
        }
      >
        {getValue()}
      </Badge>
    ),
  }),
  helper.accessor("status", {
    header: "Order status",
    cell: ({ getValue }) => (
      <Badge variant={orderStatusVariant[getValue()]}>
        {getValue().replaceAll("_", " ")}
      </Badge>
    ),
  }),
  helper.accessor("createdAt", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Placed" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
          new Date(getValue())
        )}
      </span>
    ),
  }),
  helper.display({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 150,
    minSize: 150,
    maxSize: 150,
    cell: ({ row }) => <OrderActionsCell order={row.original} />,
  }),
])

function OrderActionsCell({ order }: { order: Order }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const canUpdate = usePermission().has(Permission.ORDER_UPDATE)
  const { data: details, isLoading } = useGetOrderQuery(order.id, {
    skip: !detailsOpen,
  })
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  const nextStatus: Partial<
    Record<OrderStatus, Exclude<OrderStatus, "CANCELLED">>
  > = {
    PENDING: "CONFIRMED",
    CONFIRMED: "PROCESSING",
    PROCESSING: "SHIPPED",
    SHIPPED: "DELIVERED",
  }

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({
        id: order.id,
        data: { status: status as Exclude<OrderStatus, "CANCELLED"> },
      }).unwrap()
      toast.success("Order status updated")
    } catch {
      toast.error("Unable to update order status")
    }
  }

  const handleCancel = async () => {
    try {
      await cancelOrder({ id: order.id }).unwrap()
      toast.success("Order cancelled and stock restored")
      setCancelOpen(false)
    } catch {
      toast.error("Unable to cancel order")
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="View order"
        onClick={() => setDetailsOpen(true)}
      >
        <Eye className="size-4" />
      </Button>

      {canUpdate &&
        order.status !== "CANCELLED" &&
        order.status !== "SHIPPED" &&
        order.status !== "DELIVERED" && (
          <>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-8 w-[122px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nextStatus[order.status] && (
                  <SelectItem value={nextStatus[order.status]!}>
                    Mark {nextStatus[order.status]!.toLowerCase()}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Cancel order"
              className="text-destructive hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="size-4" />
            </Button>
          </>
        )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order {order.invoiceNo}</DialogTitle>
            <DialogDescription>Order details and line items</DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading order details...
            </p>
          ) : details ? (
            <div className="space-y-5">
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {details.customer?.name ?? "Guest"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Order status</p>
                  <Badge variant={orderStatusVariant[details.status]}>
                    {details.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment status
                  </p>
                  <p className="font-medium">{details.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Placed on</p>
                  <p className="font-medium">
                    {new Date(details.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Items</h3>
                {details.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b pb-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">
                        {[item.variantColor, item.variantSize, item.variantSku]
                          .filter(Boolean)
                          .join(" · ") || "Standard"}{" "}
                        × {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium tabular-nums">
                      ৳{Number(item.subtotal).toLocaleString("en-BD")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="ml-auto max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ৳{Number(details.subtotal).toLocaleString("en-BD")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>
                    −৳{Number(details.discount).toLocaleString("en-BD")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>৳{Number(details.tax).toLocaleString("en-BD")}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>৳{Number(details.total).toLocaleString("en-BD")}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Order details could not be loaded.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel this order?"
        description="The order will be marked as cancelled and its reserved variant stock will be restored."
        confirmLabel="Cancel order"
        onConfirm={handleCancel}
        isLoading={isCancelling}
      />
    </div>
  )
}
