"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { ProductActions } from "./product-actions"
import { ProductOptions } from "./product-options"
import { ProductOverview } from "./product-overview"
import { ProductQuantitySelector } from "./product-quantity-selector"
import type {
  ProductDetails,
  ProductOptionValue,
  ProductVariant,
} from "../../../types/product-details.types"

function getSelectedOptionsFromVariant(
  variant: ProductVariant | undefined,
  productOptions: ProductDetails["options"]
): Record<string, ProductOptionValue> {
  const selected: Record<string, ProductOptionValue> = {}
  if (!variant) return selected
  for (const option of productOptions) {
    const valueId = variant.options[option.id]
    const value = option.values.find((item) => item.id === valueId)
    if (value) selected[option.id] = value
  }
  return selected
}

export function ProductSummary({ product }: { product: ProductDetails }) {
  const firstActiveVariant =
    product.variants.find(
      (variant) => variant.isActive && !variant.deletedAt && variant.stock > 0
    ) ?? null
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    firstActiveVariant
  )
  const initialSelectedOptions = getSelectedOptionsFromVariant(
    firstActiveVariant ?? undefined,
    product.options
  )
  const hasVariants = product.variants.length > 0

  const handleAddToCart = () => {
    if (
      !selectedVariant ||
      !selectedVariant.isActive ||
      selectedVariant.deletedAt ||
      selectedVariant.stock <= 0
    ) {
      console.warn("No available variant selected. Cannot add to cart.")
      return
    }
    console.log("Adding variant:", selectedVariant)
  }

  return (
    <div className="flex flex-col justify-center gap-4">
      <ProductOverview product={product} />
      <Separator />
      <ProductOptions
        key={product.id}
        variants={product.variants}
        options={product.options}
        initialSelectedOptions={initialSelectedOptions}
        onSelect={setSelectedVariant}
        sizeGuide={product.sizeGuide}
      />
      <ProductQuantitySelector stock={selectedVariant?.stock} />
      <Separator />
      <ProductActions
        disabled={
          hasVariants &&
          (!selectedVariant ||
            !selectedVariant.isActive ||
            !!selectedVariant.deletedAt ||
            selectedVariant.stock <= 0)
        }
        onAddToCart={handleAddToCart}
        onBuyNow={() => {}}
        onCompare={() => {}}
        onFavorite={() => {}}
        onShare={() => {}}
      />
    </div>
  )
}
