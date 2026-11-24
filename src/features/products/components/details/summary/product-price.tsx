"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import type { ProductDetails } from "../../../types/product-details.types"

interface ProductPriceProps {
  product: ProductDetails
}

export function ProductPrice({ product }: ProductPriceProps) {
  const originalPrice = Number(product.sellingPrice)
  const discount = product.productDiscount
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setNow(Date.now()), 0)
    return () => window.clearTimeout(timeout)
  }, [])

  const startsAt = discount?.startsAt ? new Date(discount.startsAt).getTime() : null
  const endsAt = discount?.endsAt ? new Date(discount.endsAt).getTime() : null
  const isDiscountActive =
    !!discount?.isActive &&
    now !== null &&
    (!startsAt || startsAt <= now) &&
    (!endsAt || endsAt >= now)

  const discountValue = isDiscountActive ? Number(discount.value) : 0
  const discountAmount =
    discount?.type === "PERCENTAGE"
      ? (originalPrice * discountValue) / 100
      : discountValue
  const finalDiscount = Math.min(Math.max(discountAmount, 0), originalPrice)
  const discountedPrice = originalPrice - finalDiscount
  const discountPercentage =
    originalPrice > 0 ? Math.round((finalDiscount / originalPrice) * 100) : 0
  const hasDiscount = isDiscountActive && finalDiscount > 0

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        {hasDiscount ? (
          <>
            <p className="text-2xl font-semibold tracking-tight">
              ৳{discountedPrice.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground line-through">
              ৳{originalPrice.toFixed(2)}
            </p>
            <Badge variant="destructive">{discountPercentage}% OFF</Badge>
          </>
        ) : (
          <p className="text-2xl font-semibold tracking-tight">
            ৳{originalPrice.toFixed(2)}
          </p>
        )}
      </div>

      <p className="ml-1 text-xs text-muted-foreground">
        Cost: ৳{Number(product.purchasePrice).toFixed(2)}
      </p>
    </div>
  )
}
