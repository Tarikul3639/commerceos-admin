"use client"

import { useState } from "react"
import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"
import { ChevronDown } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { ProductFormValues } from "../../schemas/product.schema"

interface ProductPricingSectionProps {
  control: Control<ProductFormValues>
  disabled?: boolean
}

export function ProductPricingSection({
  control,
  disabled = false,
}: ProductPricingSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="group flex w-full items-center justify-between text-left"
            >
              <div>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Set stock and product pricing.
                </CardDescription>
              </div>

              <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent className="mt-3 overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent className="pt-0">
            <FieldGroup className="grid gap-5 md:grid-cols-3">
              <Controller
                name="stock"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Opening stock</FieldLabel>

                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      disabled={disabled}
                    />

                    <FieldDescription>
                      Initial available quantity.
                    </FieldDescription>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="purchasePrice"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Purchase price</FieldLabel>

                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      disabled={disabled}
                    />

                    <FieldDescription>
                      Cost price of the product.
                    </FieldDescription>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="sellingPrice"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Selling price</FieldLabel>

                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                      disabled={disabled}
                    />

                    <FieldDescription>
                      Price customers will pay.
                    </FieldDescription>

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
