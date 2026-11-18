"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppImage } from "@/components/media"
import type { CustomerCart } from "../types/cart.types"

const money = (value: string) =>
  `৳${Number(value).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`

function DetailItem({
  label,
  value,
  secondary,
}: {
  label: string
  value: React.ReactNode
  secondary?: React.ReactNode
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium wrap-break-word">{value}</div>
      {secondary ? (
        <div className="text-xs break-all text-muted-foreground">{secondary}</div>
      ) : null}
    </div>
  )
}

export function CartDetailsDialog({
  cart,
  open,
  onOpenChange,
}: {
  cart: CustomerCart | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-2rem)]">
        <DialogHeader className="shrink-0 border-b px-4 py-4 pr-12 sm:px-6">
          <DialogTitle>Cart details</DialogTitle>
          <DialogDescription>
            Read-only snapshot of the customer&apos;s current shopping cart.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:space-y-5 sm:p-6">
          {cart ? (
            <>
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Customer overview</CardTitle>
                  <CardDescription>
                    Customer information and cart summary
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailItem
                    label="Customer"
                    value={cart.customer.name || "—"}
                    secondary={cart.customer.email}
                  />
                  <DetailItem label="Phone" value={cart.customer.phone || "—"} />
                  <DetailItem
                    label="Total quantity"
                    value={cart.totalQuantity.toLocaleString()}
                  />
                  <DetailItem
                    label="Estimated value"
                    value={money(cart.estimatedValue)}
                  />
                  <DetailItem
                    label="Product lines"
                    value={cart.itemCount.toLocaleString()}
                  />
                  <DetailItem
                    label="Last updated"
                    value={new Date(cart.updatedAt).toLocaleString()}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Cart items</CardTitle>
                  <CardDescription>
                    {cart.itemCount} {cart.itemCount === 1 ? "product line" : "product lines"} in this cart
                  </CardDescription>
                </CardHeader>
                <CardContent className="gap-0 pt-2">
                  {cart.items.length ? (
                    <div className="divide-y">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex min-w-0 flex-col gap-3 py-4 first:pt-2 last:pb-1 sm:flex-row sm:items-center"
                        >
                          <AppImage
                            name={item.product.name}
                            image={item.product.imageUrl}
                            className="size-16 rounded-lg! after:rounded-lg border"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-sm font-medium wrap-break-word">
                              {item.product.name}
                            </p>
                            {item.variant ? (
                              <p className="text-xs text-muted-foreground wrap-break-word">
                                {item.variant.title || item.variant.sku}
                                {" · "}SKU {item.variant.sku}
                              </p>
                            ) : null}
                            <p className="text-xs text-muted-foreground">
                              {money(item.product.price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="shrink-0 text-left sm:text-right">
                            <p className="text-xs text-muted-foreground">Line total</p>
                            <p className="text-sm font-semibold tabular-nums">
                              {money(
                                (Number(item.product.price) * item.quantity).toString()
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      This cart has no items.
                    </p>
                  )}
                </CardContent>
              </Card>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Estimated value uses current product selling prices. It is not a
                checkout quote and excludes discounts, shipping and taxes.
              </p>
            </>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Select a cart to view its details.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
