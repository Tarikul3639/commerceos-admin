"use client"

import { useState } from "react"

import { Separator } from "@/components/ui/separator"

import { ProductActions } from "./product-actions"
import { ProductOptions } from "./product-options"
import { ProductOverview } from "./product-overview"
import { ProductQuantitySelector } from "./product-quantity-selector"

import type {
  ProductDetails,
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from "../../../types/product-details.types"
import type { ProductOptionType } from "../../../types/product-option.types"

/**
 * Extract selected option values from a variant.
 */
function getSelectedOptionsFromVariant(
  variant: ProductVariant | undefined,
  options: ProductOption[]
): Partial<Record<ProductOptionType, ProductOptionValue>> {
  const selectedOptions: Partial<
    Record<ProductOptionType, ProductOptionValue>
  > = {}

  if (!variant) return selectedOptions

  for (const option of options) {
    const variantOption = variant.options.find(
      (item) => item.optionId === option.id
    )

    const optionValue = option.values.find(
      (value) => value.id === variantOption?.id
    )

    if (optionValue) {
      selectedOptions[option.type] = optionValue
    }
  }

  return selectedOptions
}

export function ProductSummary({ product }: { product: ProductDetails }) {
  // Find the first active, non-deleted variant with available stock.
  const firstActiveVariant =
    product.variants.find(
      (variant) => variant.isActive && !variant.deletedAt && variant.stock > 0
    ) ?? null

  // Store the selected variant object.
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    firstActiveVariant
  )

  // Initialize selected options from the first available variant.
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
        onBuyNow={() => { }}
        onCompare={() => { }}
        onFavorite={() => { }}
        onShare={() => { }}
      />
    </div>
  )
}
