"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Collapsible } from "@/components/ui/collapsible"
import {
  ProductSizeGuideContent,
  ProductSizeGuideTrigger,
} from "./product-size-guide"

interface ProductOptionsProps {
  colors: { name: string; hex: string }[] | null
  sizes: string[]
}

const sizeGuide = [
  { size: "S", chest: "36–38", length: "27", shoulder: "17", sleeve: "8" },
  { size: "M", chest: "38–40", length: "28", shoulder: "18", sleeve: "8.5" },
  { size: "L", chest: "40–42", length: "29", shoulder: "19", sleeve: "9" },
  { size: "XL", chest: "42–44", length: "30", shoulder: "20", sleeve: "9.5" },
  { size: "XXL", chest: "44–46", length: "31", shoulder: "21", sleeve: "10" },
]

export function ProductOptions({ colors, sizes }: ProductOptionsProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")

  return (
    <>
      {colors && colors.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs uppercase">
            Select Color:{" "}
            <span className="text-primary">{selectedColor || "None"}</span>
          </Label>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedColor === color.name

              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                  className={`rounded-xs border p-0.5 transition-colors ${
                    isSelected
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span
                    className="block size-7 rounded-xs"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <Collapsible
          open={isSizeGuideOpen}
          onOpenChange={setIsSizeGuideOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase">
              Select Size:{" "}
              <span className="text-primary">{selectedSize || "None"}</span>
            </Label>

            <ProductSizeGuideTrigger open={isSizeGuideOpen} />
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-8 rounded-xs border px-2 py-1 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>

          <ProductSizeGuideContent
            sizes={sizeGuide}
            selectedSize={selectedSize}
          />
        </Collapsible>
      )}
    </>
  )
}
