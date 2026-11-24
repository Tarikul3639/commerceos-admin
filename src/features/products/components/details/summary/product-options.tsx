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

interface ProductOptionsProps {
  options: ProductOption[]
  variants: ProductVariant[]
  initialSelectedOptions?: Record<string, ProductOptionValue>
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
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions)

  const findMatchedVariant = (selected: Record<string, ProductOptionValue>) => {
    if (!options.every((option) => selected[option.id])) return null

    return (
      variants.find(
        (variant) =>
          variant.isActive &&
          !variant.deletedAt &&
          variant.stock > 0 &&
          options.every(
            (option) => variant.options[option.id] === selected[option.id]?.id
          )
      ) ?? null
    )
  }

  const hasAvailableVariant = (
    option: ProductOption,
    value: ProductOptionValue
  ) => {
    const next = { ...selectedOptions, [option.id]: value }

    return variants.some(
      (variant) =>
        variant.isActive &&
        !variant.deletedAt &&
        variant.stock > 0 &&
        options.every(
          (item) =>
            !next[item.id] || variant.options[item.id] === next[item.id].id
        )
    )
  }

  const handleSelect = (option: ProductOption, value: ProductOptionValue) => {
    const next = { ...selectedOptions, [option.id]: value }

    setSelectedOptions(next)
    onSelect(findMatchedVariant(next))
  }

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => {
        const isColor = option.type === "COLOR"
        const isSize = option.type === "SIZE"
        const selected = selectedOptions[option.id]

        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase">
                {option.name}:{" "}
                <span className="font-normal text-primary">
                  {selected?.label ?? `Select ${option.name.toLowerCase()}`}
                </span>
              </Label>

              {isSize && sizeGuide && (
                <ProductSizeGuideTrigger
                  open={sizeGuideOpen}
                  onClick={() => setSizeGuideOpen((prev) => !prev)}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const active = selected?.id === value.id
                const available = hasAvailableVariant(option, value)

                return (
                  <Button
                    key={value.id}
                    type="button"
                    variant={
                      isColor ? "outline" : active ? "default" : "outline"
                    }
                    size={isColor ? "icon" : "sm"}
                    onClick={() => handleSelect(option, value)}
                    aria-pressed={active}
                    aria-label={
                      isColor ? `Select color ${value.label}` : undefined
                    }
                    title={value.label}
                    className={
                      isColor
                        ? `relative rounded-xs! p-0.5! ${active ? "border-2! border-primary!" : ""} ${!available ? "opacity-50" : ""}`
                        : `relative min-w-8 overflow-hidden rounded-xs! ${!available ? "opacity-50" : ""}`
                    }
                  >
                    {isColor ? (
                      <span
                        className="block size-7 rounded-xs border border-border/50"
                        style={{
                          backgroundColor: value.colorCode ?? "transparent",
                        }}
                      />
                    ) : (
                      value.label
                    )}

                    {!available && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                        <span className="h-[1.5px] w-[140%] -rotate-45 bg-muted-foreground/40" />
                      </span>
                    )}
                  </Button>
                )
              })}
            </div>

            {isSize && sizeGuideOpen && sizeGuide && (
              <div className="mt-2">
                <ProductSizeGuideContent
                  sizeGuide={sizeGuide}
                  selectedSize={selected?.label ?? null}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
