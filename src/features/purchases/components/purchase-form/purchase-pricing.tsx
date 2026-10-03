"use client"

import { Controller, type Control } from "react-hook-form"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  values: PurchaseFormValues
  isLoading: boolean
}

export function PurchasePricing({
  control,
  subtotal,
  total,
  values,
  isLoading,
}: PurchasePricingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pricing</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
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
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="ml-auto w-full max-w-sm space-y-3 rounded-lg border bg-muted/20 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>

            <span>
              {formatCurrency(subtotal, {
                compact: false,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>

            <span>
              -{" "}
              {formatCurrency(Number(values.discount || 0), {
                compact: false,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tax</span>

            <span>
              +{" "}
              {formatCurrency(Number(values.tax || 0), {
                compact: false,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-medium">Total</span>

            <span className="text-lg font-semibold">
              {Number.isFinite(total)
                ? formatCurrency(total, {
                    compact: false,
                  })
                : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
