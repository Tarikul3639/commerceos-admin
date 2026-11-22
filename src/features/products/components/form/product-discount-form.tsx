"use client"

import { Controller, useForm, useWatch } from "react-hook-form"
import { Percent, Save } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ProductDiscountValues = {
  isActive: boolean
  type: "PERCENTAGE" | "FIXED"
  value: number
  startsAt: string
  endsAt: string
}

interface ProductDiscountFormProps {
  defaultValues: ProductDiscountValues
  isSubmitting?: boolean
  onSubmit: (values: ProductDiscountValues) => void | Promise<void>
}

export function ProductDiscountForm({
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: ProductDiscountFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProductDiscountValues>({
    values: defaultValues,
  })

  const [enabled, type, discountValue] = useWatch({
    control,
    name: ["isActive", "type", "value"],
  })
  const value = Number(discountValue) || 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="size-4 text-muted-foreground" />
            Product Discount
          </CardTitle>
          <CardDescription>
            Set a product-level sale price without changing its regular selling
            price.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4 border-b pb-5">
            <div className="space-y-1">
              <Label htmlFor="discount-active">Enable discount</Label>
              <p className="text-sm text-muted-foreground">
                Customers will see the discounted price while this discount is
                active and within its schedule.
              </p>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  id="discount-active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!enabled}
                  >
                    <SelectTrigger id="discount-type" className="w-full">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed amount (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-value">Discount Value</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  {type === "PERCENTAGE" ? "%" : "৳"}
                </span>
                <Input
                  id="discount-value"
                  type="number"
                  min="0.01"
                  max={type === "PERCENTAGE" ? 100 : undefined}
                  step="0.01"
                  className="pl-8"
                  readOnly={!enabled}
                  required={enabled}
                  {...register("value", {
                    valueAsNumber: true,
                    min: 0.01,
                    max: type === "PERCENTAGE" ? 100 : undefined,
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-start">Start Date (optional)</Label>
              <Input
                id="discount-start"
                type="date"
                disabled={!enabled}
                {...register("startsAt")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-end">End Date (optional)</Label>
              <Input
                id="discount-end"
                type="date"
                disabled={!enabled}
                {...register("endsAt")}
              />
            </div>
          </div>

          <div className="border border-dashed px-4 py-3 text-sm">
            <p className="text-muted-foreground">Discount preview</p>
            <p className="mt-1 font-medium">
              {enabled
                ? type === "PERCENTAGE"
                  ? `${Math.min(value, 100)}% off`
                  : `৳${value.toFixed(2)} off`
                : "No active discount"}
            </p>
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
          {isSubmitting ? "Saving..." : "Save Discount"}
        </Button>
      </div>
    </form>
  )
}
