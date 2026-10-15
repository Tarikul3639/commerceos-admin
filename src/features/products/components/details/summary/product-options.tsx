"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  ProductSizeGuideContent,
  ProductSizeGuideTrigger,
} from "@/components/shared/product-size-guide"
import type {
  ProductVariant,
  ProductOption,
  ProductOptionValue,
  ProductSizeGuide,
} from "../../../types/product-details.types"
import type { ProductOptionType } from "../../../types/product-option.types"

// Check valiant are available
function hasAvailableVariant(
  options: ProductOption[],
  variants: ProductVariant[],
  selectedOptions: Partial<Record<ProductOptionType, ProductOptionValue>>,
  currentOption: ProductOption,
  currentValue: ProductOptionValue
): boolean {
  const nextSelectedOptions = {
    ...selectedOptions,
    [currentOption.type]: currentValue,
  }

  // Check whether at least one available variant matches
  return variants.some((variant) => {
    // Ignore inactive, deleted, or out-of-stock variants
    if (!variant.isActive || variant.deletedAt || variant.stock <= 0) {
      return false
    }

    return options.every((option) => {
      // Get the selected value for this option
      const selectedValue = nextSelectedOptions[option.type]
      // If this option hasn't been selected, don't restrict availability
      if (!selectedValue) {
        return true
      }

      // Check whether the variant contains the selected option value
      return variant.options.some((variantOption) => {
        return (
          variantOption.optionId === option.id &&
          variantOption.id === selectedValue.id
        )
      })
    })
  })
}

// Find the matching variant
const findMatchedVariant = (
  options: ProductOption[],
  variants: ProductVariant[],
  nextSelectedOptions: Partial<Record<ProductOptionType, ProductOptionValue>>
): ProductVariant | undefined => {
  // Check whether all product options have been selected
  const isSelectedAllOptions = options.every(
    (option) => nextSelectedOptions[option.type] !== undefined
  )

  if (!isSelectedAllOptions) {
    return undefined
  }

  return variants.find((variant): boolean => {
    // Ignore inactive, deleted, or out-of-stock variants
    if (!variant.isActive || variant.deletedAt || variant.stock <= 0) {
      return false
    }

    // Check whether all selected options match this variant
    return options.every((option) => {
      const matched = nextSelectedOptions[option.type]

      if (!matched) {
        return false
      }

      return variant.options.some(
        (variantOption) =>
          variantOption.optionId === option.id &&
          variantOption.id === matched.id
      )
    })
  })
}

interface ProductOptionsProps {
  options: ProductOption[]
  variants: ProductVariant[]
  initialSelectedOptions?: Partial<
    Record<ProductOptionType, ProductOptionValue>
  >
  onSelect: (variant: ProductVariant | null) => void
  sizeGuide: ProductSizeGuide | null
}

export function ProductOptions({
  options,
  variants,
  initialSelectedOptions = {},
  onSelect,
  sizeGuide,
}: ProductOptionsProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<
    Partial<Record<ProductOptionType, ProductOptionValue>>
  >(initialSelectedOptions)

  const onSelectOption = (
    type: ProductOptionType,
    value: ProductOptionValue
  ) => {
    // Create a new object with the latest selection
    const nextSelectedOptions = {
      ...selectedOptions,
      [type]: value,
    }

    // Update the selected options state
    setSelectedOptions(nextSelectedOptions)

    // Find the matching available variant
    const matchedVariant = findMatchedVariant(
      options,
      variants,
      nextSelectedOptions
    )

    // Notify the parent component about the matched variant
    onSelect(matchedVariant ?? null)
  }

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => {
        const isColor = option.type === "COLOR"
        const isSize = option.type === "SIZE"
        const isOther = !isColor && !isSize

        return (
          <div key={option.id}>
            {/* Color selector */}
            {isColor && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase">
                  {option.name}:{" "}
                  <span className="font-normal text-primary">
                    {selectedOptions[option.type]?.value ?? "Select a color"}
                  </span>
                </Label>

                <div className="flex flex-wrap gap-2">
                  {option.values.map((item) => {
                    const isSelected =
                      selectedOptions[option.type]?.id === item.id
                    const isAvailable = hasAvailableVariant(
                      options,
                      variants,
                      selectedOptions,
                      option,
                      item
                    )

                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => onSelectOption(option.type, item)}
                        aria-label={`Select color ${item.value}`}
                        aria-pressed={isSelected}
                        title={item.value}
                        className={`relative rounded-xs! p-0.5! transition-colors ${isSelected
                          ? "border-2! border-primary!"
                          : "border-border hover:border-primary/50"
                          } ${!isAvailable ? "opacity-50" : ""}`}
                      >
                        <span
                          className="block size-7 rounded-xs border border-border/50"
                          style={{
                            backgroundColor: item.colorHex ?? "transparent",
                          }}
                        />

                        <UnavailableOverlay show={!isAvailable} />
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            {isSize && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase">
                    {option.name}:{" "}
                    <span className="font-normal text-primary">
                      {selectedOptions[option.type]?.value ?? "Select a size"}
                    </span>
                  </Label>

                  {sizeGuide && (
                    <ProductSizeGuideTrigger
                      open={sizeGuideOpen}
                      onClick={() => setSizeGuideOpen((prev) => !prev)}
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {option.values.map((item) => {
                    const isSelected =
                      selectedOptions[option.type]?.id === item.id

                    const isAvailable = hasAvailableVariant(
                      options,
                      variants,
                      selectedOptions,
                      option,
                      item
                    )

                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectOption(option.type, item)}
                        aria-pressed={isSelected}
                        className={`relative min-w-8 overflow-hidden rounded-xs! uppercase ${!isAvailable ? "opacity-50" : ""
                          }`}
                      >
                        {item.value}

                        <UnavailableOverlay show={!isAvailable} />
                      </Button>
                    )
                  })}
                </div>

                {sizeGuideOpen && (
                  <div className="mt-2">
                    <ProductSizeGuideContent
                      sizeGuide={sizeGuide}
                      selectedSize={selectedOptions[option.type]?.value ?? null}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Other option types */}
            {isOther && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase">
                  {option.name}:{" "}
                  <span className="font-normal text-primary">
                    {selectedOptions[option.type]?.value ?? "Select an option"}
                  </span>
                </Label>

                <div className="flex flex-wrap gap-2">
                  {option.values.map((item) => {
                    const isSelected =
                      selectedOptions[option.type]?.id === item.id

                    const isAvailable = hasAvailableVariant(
                      options,
                      variants,
                      selectedOptions,
                      option,
                      item
                    )

                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectOption(option.type, item)}
                        aria-pressed={isSelected}
                        className={`relative min-w-8 overflow-hidden rounded-xs! capitalize ${!isAvailable ? "opacity-50" : ""
                          }`}
                      >
                        {item.value}

                        <UnavailableOverlay show={!isAvailable} />
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function UnavailableOverlay({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <span className="h-[1.5px] w-[140%] -rotate-45 bg-muted-foreground/40 transition-opacity" />
    </span>
  )
}
