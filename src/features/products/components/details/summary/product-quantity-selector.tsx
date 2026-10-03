"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ProductQuantitySelectorProps {
  stock: number
}

export function ProductQuantitySelector({
  stock,
}: ProductQuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase">Quantity</Label>

      <div className="flex w-fit items-center rounded-sm border">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={quantity <= 1}
          className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus className="size-4" />
        </button>

        <span className="flex h-8 min-w-9 items-center justify-center border-x text-sm font-medium">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity((value) => Math.min(stock, value + 1))}
          disabled={quantity >= stock}
          title={quantity >= stock ? "Max stock reached" : undefined}
          className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
