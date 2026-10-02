"use client"

import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { ProductFormValues } from "../../schemas/product.schema"

interface ProductPublishSectionProps {
  control: Control<ProductFormValues>
  isLoading?: boolean
  isDirty?: boolean
  onCancel: () => void
  submitLabel?: string
  busyLabel?: string
}

export function ProductPublishSection({
  control,
  isLoading = false,
  isDirty = false,
  onCancel,
  submitLabel = "Create",
  busyLabel = "Creating...",
}: ProductPublishSectionProps) {
  return (
    <div className="flex flex-col gap-4 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal" className="items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p>
                    Turn on to make this product active and visible to
                    customers.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <FieldLabel>Publish</FieldLabel>
          </Field>
        )}
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || !isDirty}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading || !isDirty}>
          {isLoading ? busyLabel : submitLabel}
        </Button>
      </div>
    </div>
  )
}
