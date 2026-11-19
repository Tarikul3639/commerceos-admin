"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import {
  useApproveOrderReturnMutation,
  useCompleteOrderReturnMutation,
  useGetOrderReturnQuery,
  useRejectOrderReturnMutation,
} from "../api/returns.api"
import type { OrderReturn, OrderReturnStatus } from "../types/return.types"

interface ReturnDetailsDialogProps {
  orderReturn: OrderReturn
}

const statusVariant: Record<
  OrderReturnStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  PARTIALLY_PAID: "secondary",
  REJECTED: "destructive",
  COMPLETED: "default",
}

function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : null
}

function DetailField({
  label,
  value,
  description,
}: {
  label: string
  value: React.ReactNode
  description?: string | null
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium wrap-break-word">{value}</div>
      {description && (
        <p className="text-xs break-all text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold">{children}</h3>
}

export function ReturnDetailsDialog({ orderReturn }: ReturnDetailsDialogProps) {
  const [open, setOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false)
  const canUpdate = usePermission().has(Permission.ORDER_UPDATE)

  const { data, isLoading, isError } = useGetOrderReturnQuery(orderReturn.id, {
    skip: !open,
  })
  const [approveReturn, { isLoading: isApproving }] =
    useApproveOrderReturnMutation()
  const [rejectReturn, { isLoading: isRejecting }] =
    useRejectOrderReturnMutation()
  const [completeReturn, { isLoading: isCompleting }] =
    useCompleteOrderReturnMutation()
  const isBusy = isApproving || isRejecting || isCompleting

  const handleApprove = async () => {
    if (!canUpdate) return

    try {
      await approveReturn(orderReturn.id).unwrap()
      toast.success("Return approved")
    } catch {
      toast.error("Could not approve return")
    }
  }

  const handleReject = async () => {
    if (!canUpdate) return

    const reason = rejectionReason.trim()
    if (reason.length < 3) {
      toast.error("Please enter a rejection reason (at least 3 characters)")
      return
    }

    try {
      await rejectReturn({ id: orderReturn.id, reason }).unwrap()
      setRejectionReason("")
      toast.success("Return rejected")
    } catch {
      toast.error("Could not reject return")
    }
  }

  const handleComplete = async () => {
    if (!canUpdate) return

    try {
      await completeReturn(orderReturn.id).unwrap()
      setConfirmCompleteOpen(false)
      toast.success("Return completed and tracked stock restored")
    } catch {
      toast.error("Could not complete return")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`View return ${orderReturn.returnNo}`}
        onClick={() => setOpen(true)}
      >
        <Eye className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-2rem)]">
          <DialogHeader className="shrink-0 border-b px-4 py-4 pr-12 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-base sm:text-lg">
                Return {orderReturn.returnNo}
              </DialogTitle>
              {data && (
                <Badge variant={statusVariant[data.status]}>
                  {data.status.replaceAll("_", " ")}
                </Badge>
              )}
            </div>
            <DialogDescription>
              Review returned items, request details and decision history.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
            {isLoading ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Loading return details...
              </p>
            ) : isError || !data ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium">
                  Return details could not be loaded.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Please close this window and try again.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <section className="space-y-3">
                  <SectionHeading>Overview</SectionHeading>
                  <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Order invoice"
                      value={data.order.invoiceNo}
                    />
                    <DetailField
                      label="Customer"
                      value={data.order.customer.name || "—"}
                    />
                    <DetailField
                      label="Requested on"
                      value={formatDate(data.createdAt) ?? "—"}
                    />
                    <DetailField
                      label="Created by"
                      value={data.createdBy.name}
                      description={data.createdBy.email}
                    />
                    <DetailField
                      label="Approved by"
                      value={data.approvedBy?.name ?? "Not approved"}
                      description={formatDate(data.approvedAt)}
                    />
                    <DetailField
                      label="Rejected by"
                      value={data.rejectedBy?.name ?? "Not rejected"}
                      description={formatDate(data.rejectedAt)}
                    />
                    <DetailField
                      label="Completed by"
                      value={data.completedBy?.name ?? "Not completed"}
                      description={formatDate(data.completedAt)}
                    />
                  </div>
                </section>

                <section className="space-y-3">
                  <SectionHeading>Returned items</SectionHeading>
                  <div className="divide-y rounded-lg border">
                    {data.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-medium wrap-break-word">
                            {item.orderItem.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ordered: {item.orderItem.quantity} · Return
                            quantity: {item.quantity}
                          </p>
                          {item.reason && (
                            <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                              {item.reason}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary" className="w-fit shrink-0">
                          Qty {item.quantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>

                {data.reason && (
                  <section className="space-y-2">
                    <SectionHeading>Customer reason</SectionHeading>
                    <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {data.reason}
                    </p>
                  </section>
                )}

                {data.rejectionReason && (
                  <section className="space-y-2">
                    <SectionHeading>Rejection reason</SectionHeading>
                    <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {data.rejectionReason}
                    </p>
                  </section>
                )}

                {data.status === "APPROVED" && (
                  <p className="rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                    Complete only after goods have physically arrived and passed
                    inspection. Completion restores tracked variant stock; it
                    does not issue a refund.
                  </p>
                )}
              </div>
            )}
          </div>

          {data && canUpdate && data.status === "PENDING" && (
            <DialogFooter className="shrink-0 flex-col! gap-3! border-t! bg-background px-4 py-4! sm:items-end sm:px-6">
              <div className="w-full min-w-0 flex-1 space-y-1.5">
                <Label
                  htmlFor={`rejection-reason-${orderReturn.id}`}
                  className="text-xs font-medium"
                >
                  Rejection reason
                </Label>
                <Textarea
                  id={`rejection-reason-${orderReturn.id}`}
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explain why this return is being rejected..."
                  maxLength={500}
                  rows={2}
                  className="min-h-16 resize-y"
                />
              </div>
              <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isBusy || rejectionReason.trim().length < 3}
                  className="w-full"
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isBusy}
                  className="w-full"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
              </div>
            </DialogFooter>
          )}

          {data && canUpdate && data.status === "APPROVED" && (
            <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
              <Button
                onClick={() => setConfirmCompleteOpen(true)}
                disabled={isBusy}
                className="w-full sm:w-auto"
              >
                Complete return & restore stock
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmCompleteOpen}
        onOpenChange={setConfirmCompleteOpen}
        title="Complete this return?"
        description="Confirm only after the returned goods have been received and inspected. Tracked variant stock will be restored. No refund will be issued."
        confirmLabel={isCompleting ? "Completing..." : "Complete return"}
        onConfirm={handleComplete}
        isLoading={isCompleting}
      />
    </>
  )
}
