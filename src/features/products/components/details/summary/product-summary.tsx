"use client"

import { Separator } from "@/components/ui/separator"
import { ProductActions } from "./product-actions"
import { ProductOptions } from "./product-options"
import { ProductOverview } from "./product-overview"
import { ProductQuantitySelector } from "./product-quantity-selector"
import type { ProductDetails } from "../../../types/product.types"

interface ProductSummaryProps {
  product: ProductDetails
}

export function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <div className="flex flex-col justify-center">
      <ProductOverview product={product} />

      <Separator className="my-6" />

      <div className="space-y-5">
        <ProductOptions colors={product.colors} sizes={product.sizes} />
        <ProductQuantitySelector stock={product.stock} />
      </div>

      <Separator className="my-6" />

      <ProductActions
        disabled={product.stock <= 0}
        onAddToCart={() => {}}
        onBuyNow={() => {}}
        onCompare={() => {}}
        onFavorite={() => {}}
        onShare={() => {}}
      />
    </div>
  )
}
