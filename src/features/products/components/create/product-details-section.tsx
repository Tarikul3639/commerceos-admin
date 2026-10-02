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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { ProductFormValues } from "../../schemas/product.schema"

interface ProductDetailsSectionProps {
  control: Control<ProductFormValues>
  disabled?: boolean
}

export function ProductDetailsSection({
  control,
  disabled = false,
}: ProductDetailsSectionProps) {
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
                <CardTitle>Details</CardTitle>
                <CardDescription>
                  Basic information about your product.
                </CardDescription>
              </div>

              <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent className="mt-3 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent>
            <FieldGroup className="gap-4">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Product name</FieldLabel>

                    <Input
                      {...field}
                      placeholder="Product name"
                      disabled={disabled}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="subDescription"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Short description</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="A brief product summary..."
                      className="min-h-20 resize-none"
                      disabled={disabled}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>

                    <Textarea
                      {...field}
                      placeholder="Write something about this product..."
                      className="min-h-32 resize-none"
                      disabled={disabled}
                    />

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
