"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

import { getErrorMessage } from "@/lib/utils/error"

import {
  updateDiscountSchema,
  type UpdateDiscountFormValues,
} from "../schemas/update-discount.schema"
import { useUpdateDiscountMutation } from "../api/discount.api"
import { DiscountType, type Discount } from "../types/discount.types"

interface UpdateDiscountDialogProps {
  discount: Discount
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateDiscountDialog({
  discount,
  open,
  onOpenChange,
}: UpdateDiscountDialogProps) {
  const [updateDiscount, { isLoading }] = useUpdateDiscountMutation()

  const form = useForm<UpdateDiscountFormValues>({
    resolver: zodResolver(updateDiscountSchema),
    defaultValues: {
      name: discount.name,
      description: discount.description ?? "",
      type: discount.type,
      value: discount.value,
      startDate: discount.startDate ? toDateTimeLocal(discount.startDate) : "",
      endDate: discount.endDate ? toDateTimeLocal(discount.endDate) : "",
      isActive: discount.isActive,
    },
  })

  useEffect(() => {
    if (!open) return

    form.reset({
      name: discount.name,
      description: discount.description ?? "",
      type: discount.type,
      value: discount.value,
      startDate: discount.startDate ? toDateTimeLocal(discount.startDate) : "",
      endDate: discount.endDate ? toDateTimeLocal(discount.endDate) : "",
      isActive: discount.isActive,
    })
  }, [open, discount, form])

  const onSubmit = async (values: UpdateDiscountFormValues) => {
    try {
      await updateDiscount({
        id: discount.id,
        data: {
          name: values.name,
          description: values.description || null,
          type: values.type,
          value: values.value,
          startDate: values.startDate
            ? new Date(values.startDate).toISOString()
            : null,
          endDate: values.endDate
            ? new Date(values.endDate).toISOString()
            : null,
          isActive: values.isActive,
        },
      }).unwrap()

      toast.success("Discount updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update discount", {
        description: getErrorMessage(error) || "Something went wrong.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Discount</DialogTitle>
          <DialogDescription>
            Update the discount information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>

                  <Input
                    {...field}
                    placeholder="Eid Sale"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Discount Type</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value={DiscountType.PERCENTAGE}>
                        Percentage
                      </SelectItem>

                      <SelectItem value={DiscountType.FIXED}>
                        Fixed Amount
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>

                <Textarea
                  {...field}
                  placeholder="Special Eid discount campaign"
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  Optional description for this discount.
                </FieldDescription>

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Value</FieldLabel>

                <Input
                  {...field}
                  type="number"
                  min="0"
                  step="any"
                  placeholder="10"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Start Date</FieldLabel>

                  <Input
                    type="datetime-local"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="endDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>End Date</FieldLabel>

                  <Input
                    type="datetime-local"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldLabel>Active</FieldLabel>

                  <FieldDescription>Enable this discount.</FieldDescription>
                </div>

                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? "Updating..." : "Update Discount"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function toDateTimeLocal(date: string) {
  const value = new Date(date)

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  const hours = String(value.getHours()).padStart(2, "0")
  const minutes = String(value.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}
