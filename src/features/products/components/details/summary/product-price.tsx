import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import type { ProductDetails } from "../../../types/product.types"

interface ProductPriceProps {
  product: ProductDetails
}

export function ProductPrice({ product }: ProductPriceProps) {
  const originalPrice = Number(product.sellingPrice)
  const now = Date.now()
  const candidateDiscount = product.discount
  const activeDiscount =
    candidateDiscount &&
    (!candidateDiscount.startDate ||
      new Date(candidateDiscount.startDate).getTime() <= now) &&
    (!candidateDiscount.endDate ||
      new Date(candidateDiscount.endDate).getTime() >= now)
      ? candidateDiscount
      : null

  const discountAmount = candidateDiscount
    ? originalPrice * (Number(candidateDiscount.value) / 100)
    : 0
  const discountedPrice = Math.max(originalPrice - discountAmount, 0)

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-semibold tracking-tight">
          ৳{(activeDiscount ? discountedPrice : originalPrice).toFixed(2)}
        </p>

        {candidateDiscount && (
          <>
            <Badge variant="destructive">
              {Number(candidateDiscount.value)}% OFF
            </Badge>

            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="View discount details"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </HoverCardTrigger>

              <HoverCardContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Discount Details</p>
                    <p className="text-xs text-muted-foreground">
                      Current discount information
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Regular price
                      </span>
                      <span>৳{originalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-destructive">
                        {Number(candidateDiscount.value)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Discounted price
                      </span>
                      <span className="font-medium">
                        ৳{discountedPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>

                      <Badge variant={activeDiscount ? "default" : "secondary"}>
                        {activeDiscount
                          ? "Active"
                          : candidateDiscount.startDate &&
                              new Date(candidateDiscount.startDate).getTime() >
                                now
                            ? "Upcoming"
                            : "Expired"}
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Starts</span>
                        <span>
                          {candidateDiscount.startDate
                            ? new Date(
                                candidateDiscount.startDate
                              ).toLocaleDateString()
                            : "No start date"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ends</span>
                        <span>
                          {candidateDiscount.endDate
                            ? new Date(
                                candidateDiscount.endDate
                              ).toLocaleDateString()
                            : "No end date"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Cost: ৳{Number(product.purchasePrice).toFixed(2)}
      </p>
    </div>
  )
}
