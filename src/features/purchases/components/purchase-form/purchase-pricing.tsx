"use client"

import { Controller, type Control } from "react-hook-form"
import { Calculator } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils/format-currency"

import type { PurchaseFormValues } from "../../schemas/purchase.schema"

interface PurchasePricingProps {
  control: Control<PurchaseFormValues>
  subtotal: number
  total: number
  discount: number
  tax: number
  isLoading: boolean
}

/** Shows editable adjustments and a live purchase total. */
export function PurchasePricing({
  control,
  subtotal,
  total,
  discount,
  tax,
  isLoading,
}: PurchasePricingProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
            <Calculator className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">Purchase summary</CardTitle>
            <CardDescription>Review cost and adjustments.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <FieldGroup className="grid grid-cols-2 gap-3 xl:grid-cols-1">
          <Controller
            control={control}
            name="discount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Discount</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  step="any"
                  min={0}
                  disabled={isLoading}
                  placeholder="0.00"
                  aria-invalid={fieldState.invalid}
                  className="h-10"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="tax"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tax</FieldLabel>
                <Input
                  {...field}
                  type="number"
                  step="any"
                  min={0}
                  disabled={isLoading}
                  placeholder="0.00"
                  aria-invalid={fieldState.invalid}
                  className="h-10"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="space-y-3 border-t pt-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(subtotal, { compact: false })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Discount</span>
            <span className="tabular-nums">
              − {formatCurrency(discount, { compact: false })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Tax</span>
            <span className="tabular-nums">
              + {formatCurrency(tax, { compact: false })}
            </span>
          </div>
          <div className="flex items-end justify-between gap-3 border-t pt-4">
            <span className="font-semibold">Grand total</span>
            <span className="text-xl font-semibold tracking-tight tabular-nums">
              {Number.isFinite(total)
                ? formatCurrency(total, { compact: false })
                : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
