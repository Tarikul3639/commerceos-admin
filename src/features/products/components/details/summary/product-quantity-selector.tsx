"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ProductQuantitySelectorProps {
  stock?: number
}

export function ProductQuantitySelector({
  stock,
}: ProductQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1)

  const maxStock = Math.max(0, stock ?? 0)
  const isOutOfStock = maxStock === 0

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-2">
        <Label className="text-xs uppercase">Quantity</Label>

        <div className="flex w-fit items-center rounded-sm border">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            aria-label="Decrease quantity"
            className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Minus className="size-4" />
          </button>

          <span className="flex h-8 min-w-9 items-center justify-center border-x text-sm font-medium">
            {isOutOfStock ? 0 : Math.min(quantity, maxStock)}
          </span>

          <button
            type="button"
            onClick={() =>
              setQuantity((value) => Math.min(maxStock, value + 1))
            }
            disabled={isOutOfStock || quantity >= maxStock}
            title={quantity >= maxStock ? "Max stock reached" : undefined}
            aria-label="Increase quantity"
            className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center">
        {isOutOfStock ? (
          <span className="text-xs font-medium text-destructive">
            Out of stock
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-500">
              In stock
            </span>
            {" · "}
            {maxStock} left
          </span>
        )}
      </div>
    </div>
  )
}