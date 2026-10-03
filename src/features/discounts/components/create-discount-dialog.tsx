"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { getErrorMessage } from "@/lib/utils/error"
import { useCreateDiscountMutation } from "../api/discount.api"
import {
  discountFormSchema,
  type DiscountFormValues,
} from "../schemas/discount.schema"
import { DiscountProductSelector } from "./discount-product-selector"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaults: DiscountFormValues = {
  productId: "",
  value: "",
  startDate: "",
  endDate: "",
}

export function CreateDiscountDialog({ open, onOpenChange }: Props) {
  const [createDiscount, { isLoading }] = useCreateDiscountMutation()
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (open) form.reset(defaults)
  }, [open, form])

  const submit = async (values: DiscountFormValues) => {
    try {
      await createDiscount({
        productId: values.productId,
        value: Number(values.value),
        startDate: values.startDate || null,
        endDate: values.endDate || null,
      }).unwrap()
      toast.success("Discount created successfully")
      onOpenChange(false)
      form.reset(defaults)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to create discount")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus />
          Discount
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create discount</DialogTitle>
          <DialogDescription>
            Apply a percentage discount to one product.
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
                <FieldLabel htmlFor="create-discount-value">
                  Discount percentage
                </FieldLabel>
                <Input
                  id="create-discount-value"
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
                  <FieldLabel htmlFor="create-discount-start">
                    Start date
                  </FieldLabel>
                  <Input
                    id="create-discount-start"
                    type="date"
                    {...field}
                    disabled={isLoading}
                  />
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
                  <FieldLabel htmlFor="create-discount-end">
                    End date
                  </FieldLabel>
                  <Input
                    id="create-discount-end"
                    type="date"
                    {...field}
                    disabled={isLoading}
                  />
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
              {isLoading ? "Creating..." : "Create discount"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
