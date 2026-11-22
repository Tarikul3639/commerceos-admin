"use client"

import { useForm, useWatch } from "react-hook-form"
import { Save, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProductPriceValues {
  purchasePrice: number
  sellingPrice: number
}

interface ProductPriceFormProps {
  purchasePrice: number
  sellingPrice: number
  isSubmitting?: boolean
  onSubmit: (values: ProductPriceValues) => void | Promise<void>
}

export function ProductPriceForm({
  purchasePrice,
  sellingPrice,
  isSubmitting = false,
  onSubmit,
}: ProductPriceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProductPriceValues>({
    values: { purchasePrice, sellingPrice },
  })

  const [purchasePriceValue, sellingPriceValue] = useWatch({
    control,
    name: ["purchasePrice", "sellingPrice"],
  })
  const cost = Number(purchasePriceValue) || 0
  const price = Number(sellingPriceValue) || 0
  const profit = price - cost
  const margin = price > 0 ? (profit / price) * 100 : 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="size-4 text-muted-foreground" />
            Product Pricing
          </CardTitle>
          <CardDescription>
            Manage the product cost and regular selling price. Active discounts
            are configured separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                ৳
              </span>
              <Input
                id="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                required
                className="pl-8"
                {...register("purchasePrice", { valueAsNumber: true, min: 0 })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Regular Selling Price</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                ৳
              </span>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                step="0.01"
                required
                className="pl-8"
                {...register("sellingPrice", { valueAsNumber: true, min: 0 })}
              />
            </div>
          </div>
          <div className="flex items-center justify-between border border-dashed px-4 py-3 text-sm sm:col-span-2">
            <span className="text-muted-foreground">Estimated profit</span>
            <span className="font-medium tabular-nums">
              ৳{profit.toFixed(2)}{" "}
              <span className="ml-2 text-muted-foreground">
                ({margin.toFixed(1)}%)
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          className="rounded-none"
          disabled={isSubmitting || !isDirty}
        >
          <Save className="size-4" />
          {isSubmitting ? "Saving..." : "Save Price"}
        </Button>
      </div>
    </form>
  )
}
