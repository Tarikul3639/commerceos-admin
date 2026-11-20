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
import { Badge } from "@/components/ui/badge"
import { AppImage } from "@/components/media"
import type { CustomerWishlist } from "../types/wishlist.types"

const money = (value: string) =>
  `৳${Number(value).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`

/** Shows a bounded, scrollable, read-only view of one customer's saved products. */
export function WishlistDetailsDialog({
  wishlist,
  open,
  onOpenChange,
}: {
  wishlist: CustomerWishlist | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-2rem)]">
        <DialogHeader className="shrink-0 border-b px-4 py-4 pr-12 sm:px-6">
          <DialogTitle>Wishlist details</DialogTitle>
          <DialogDescription>
            Saved products for this customer. This view does not modify the
            wishlist.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {wishlist ? (
            <>
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Customer overview</CardTitle>
                  <CardDescription>
                    Customer details and saved product count
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 pt-3 sm:grid-cols-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="text-sm font-medium wrap-break-word">
                      {wishlist.customer.name}
                    </p>
                    <p className="text-xs break-all text-muted-foreground">
                      {wishlist.customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">
                      {wishlist.customer.phone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Saved products
                    </p>
                    <p className="text-sm font-medium tabular-nums">
                      {wishlist.itemCount}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Saved products</CardTitle>
                  <CardDescription>
                    {wishlist.itemCount}{" "}
                    {wishlist.itemCount === 1 ? "product" : "products"} in this
                    wishlist
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {wishlist.items.length ? (
                    <div className="divide-y">
                      {wishlist.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex min-w-0 items-center gap-3 py-3 first:pt-2 last:pb-1"
                        >
                          <AppImage
                            name={item.product.name}
                            image={item.product.imageUrl}
                            className="size-14 shrink-0 rounded-lg! border after:rounded-lg"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium wrap-break-word">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {money(item.product.price)}
                            </p>
                          </div>
                          <Badge
                            variant={
                              item.product.isAvailable ? "secondary" : "outline"
                            }
                          >
                            {item.product.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No saved products.
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Select a wishlist to view its details.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
