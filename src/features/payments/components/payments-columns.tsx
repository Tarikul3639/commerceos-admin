"use client"

import { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye } from "lucide-react"

import type { DataTableFeatures } from "@/components/data-table"
import { DataTableColumnHeader } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useGetPaymentQuery } from "../api/payments.api"
import type { Payment, PaymentStatus } from "../types/payment.types"

const helper = createColumnHelper<DataTableFeatures, Payment>()

const statusVariant: Record<
  PaymentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "secondary",
  CANCELLED: "secondary",
}

const money = (value: string) =>
  `৳${Number(value).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`

export const paymentColumns = helper.columns([
  helper.accessor("order.invoiceNo", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Invoice" />
    ),
    cell: ({ row, getValue }) => (
      <div>
        <p className="font-medium">{getValue() || "—"}</p>
        <p className="text-xs text-muted-foreground">{row.original.orderId}</p>
      </div>
    ),
  }),
  helper.accessor("type", {
    header: "Type",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === "REFUND" ? "secondary" : "outline"}>
        {getValue()}
      </Badge>
    ),
  }),
  helper.accessor("method", {
    header: "Method",
    cell: ({ getValue }) => <span>{getValue().replaceAll("_", " ")}</span>,
  }),
  helper.accessor("amount", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Amount" />
    ),
    cell: ({ getValue, row }) => (
      <span className="font-medium tabular-nums">
        {row.original.type === "REFUND" ? "−" : ""}
        {money(getValue())}
      </span>
    ),
  }),
  helper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant={statusVariant[getValue()]}>{getValue()}</Badge>
    ),
  }),
  helper.accessor("transactionId", {
    header: "Transaction reference",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() || "—"}</span>
    ),
  }),
  helper.accessor("createdAt", {
    header: (info) => (
      <DataTableColumnHeader column={info.column} title="Created" />
    ),
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(getValue()))}
      </span>
    ),
  }),
  helper.display({
    id: "actions",
    header: () => <div className="text-center">Details</div>,
    size: 80,
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => <PaymentDetailsCell payment={row.original} />,
  }),
])

function PaymentDetailsCell({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false)
  const { data, isLoading, isError } = useGetPaymentQuery(payment.id, {
    skip: !open,
  })

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="View payment details"
          onClick={() => setOpen(true)}
        >
          <Eye className="size-4" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {payment.type === "REFUND" ? "Refund" : "Payment"} details
            </DialogTitle>
            <DialogDescription>
              Transaction record and related order information
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading transaction details...
            </p>
          ) : isError || !data ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Transaction details could not be loaded.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Invoice</p>
                  <p className="font-medium">{data.order?.invoiceNo ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Order payment status
                  </p>
                  <Badge
                    variant={
                      statusVariant[data.order?.paymentStatus ?? data.status]
                    }
                  >
                    {data.order?.paymentStatus ?? data.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Transaction type
                  </p>
                  <p className="font-medium">{data.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Transaction status
                  </p>
                  <Badge variant={statusVariant[data.status]}>
                    {data.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Method / provider
                  </p>
                  <p className="font-medium">
                    {data.method} / {data.provider}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold tabular-nums">
                    {data.type === "REFUND" ? "−" : ""}
                    {money(data.amount)} {data.currency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="font-mono text-xs break-all">
                    {data.transactionId || "Not recorded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Session ID</p>
                  <p className="font-mono text-xs break-all">
                    {data.sessionId || "Not recorded"}
                  </p>
                </div>
                {data.originalPaymentId && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      Original payment
                    </p>
                    <p className="font-mono text-xs break-all">
                      {data.originalPaymentId}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(data.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="font-medium">
                    {new Date(data.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {data.notes && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{data.notes}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                This is a recorded transaction. Gateway verification and refund
                settlement are not performed from this screen.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
