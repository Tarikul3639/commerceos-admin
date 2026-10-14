"use client"

import { useState } from "react"

import { Separator } from "@/components/ui/separator"

import { ProductActions } from "./product-actions"
import { ProductOptions } from "./product-options"
import { ProductOverview } from "./product-overview"
import { ProductQuantitySelector } from "./product-quantity-selector"
import type { ProductDetails } from "../../../types/product-details.types"

export function ProductSummary({ product }: { product: ProductDetails }) {
  // Find the first active, non-deleted variant that has available stock
  const firstActiveVariant = product.variants.find(
    (variant) => variant.isActive && !variant.deletedAt && variant.stock > 0
  )

  // Initialize the selected variant ID with the first available variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    firstActiveVariant?.id ?? null
  )

  // Find the currently selected variant, ensuring it is active and not deleted
  const selectedVariant =
    product.variants.find(
      (variant) =>
        variant.id === selectedVariantId &&
        variant.isActive &&
        !variant.deletedAt
    ) ?? null

  // Check whether the product has any variants
  const hasVariants = product.variants.length > 0

  return (
    <div className="flex flex-col justify-center gap-4">
      <ProductOverview product={product} />
      <Separator />

      <ProductOptions
        variants={product.variants}
        options={product.options}
        onSelect={(variant) => setSelectedVariantId(variant?.id ?? null)}
        sizeGuide={product.sizeGuide}
      />

      <ProductQuantitySelector stock={selectedVariant?.stock} />

      <Separator />

      <ProductActions
        disabled={
          hasVariants && (!selectedVariant || selectedVariant.stock <= 0)
        }
        onAddToCart={() => { }}
        onBuyNow={() => { }}
        onCompare={() => { }}
        onFavorite={() => { }}
        onShare={() => { }}
      />
    </div>
  )
}
