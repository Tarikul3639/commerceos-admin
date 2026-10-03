"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/utils/error"
import { useUpdateDiscountMutation } from "../api/discount.api"
import type { Discount } from "../types/discount.types"
import {
  discountFormSchema,
  type DiscountFormValues,
} from "../schemas/discount.schema"
import { DiscountProductSelector } from "./discount-product-selector"

interface Props {
  discount: Discount
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateDiscountDialog({ discount, open, onOpenChange }: Props) {
  const [updateDiscount, { isLoading }] = useUpdateDiscountMutation()
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      productId: discount.productId,
      value: discount.value,
      startDate: discount.startDate?.slice(0, 10) ?? "",
      endDate: discount.endDate?.slice(0, 10) ?? "",
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      productId: discount.productId,
      value: discount.value,
      startDate: discount.startDate?.slice(0, 10) ?? "",
      endDate: discount.endDate?.slice(0, 10) ?? "",
    })
  }, [open, discount, form])

  const submit = async (values: DiscountFormValues) => {
    try {
      await updateDiscount({
        id: discount.id,
        data: {
          productId: values.productId,
          value: Number(values.value),
          startDate: values.startDate || null,
          endDate: values.endDate || null,
        },
      }).unwrap()
      toast.success("Discount updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update discount")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update discount</DialogTitle>
          <DialogDescription>
            Update the product, percentage, or discount dates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
          <Controller
            name="productId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Product</FieldLabel>
                <DiscountProductSelector
                  value={field.value}
                  onChange={field.onChange}
                  currentProductId={discount.productId}
                  selectedProduct={discount.product}
                  disabled={isLoading}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="value"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`update-discount-value-${discount.id}`}>
                  Discount percentage
                </FieldLabel>
                <Input
                  id={`update-discount-value-${discount.id}`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...field}
                  disabled={isLoading}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Start date</FieldLabel>
                  <Input type="date" {...field} disabled={isLoading} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>End date</FieldLabel>
                  <Input type="date" {...field} disabled={isLoading} />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update discount"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
