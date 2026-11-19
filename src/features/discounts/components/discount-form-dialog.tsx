"use client"

import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Field, FieldError } from "@/components/ui/field"
import { getErrorMessage } from "@/lib/utils/error"
import { Permission } from "@/config/permissions.config"
import { usePermission } from "@/hooks/use-permission"

import {
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
} from "../api/discounts.api"
import {
  discountFormSchema,
  type DiscountFormValues,
} from "../schemas/discount.schema"
import type { Discount, DiscountPayload } from "../types/discount.types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  discount?: Discount | null
}

function dateInput(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

const emptyForm: DiscountFormValues = {
  code: "",
  description: "",
  type: "PERCENTAGE",
  value: "10",
  minOrderAmount: "0",
  maxDiscountAmount: "",
  startsAt: "",
  endsAt: "",
  usageLimit: "",
  isActive: true,
}

export function DiscountFormDialog({ open, onOpenChange, discount }: Props) {
  const permission = usePermission()
  const canSubmit = discount
    ? permission.has(Permission.DISCOUNT_UPDATE)
    : permission.has(Permission.DISCOUNT_CREATE)
  const [createDiscount, createState] = useCreateDiscountMutation()
  const [updateDiscount, updateState] = useUpdateDiscountMutation()
  const loading = createState.isLoading || updateState.isLoading
  const isEdit = Boolean(discount)

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: emptyForm,
  })

  const discountType = useWatch({ control: form.control, name: "type" })

  useEffect(() => {
    if (!open) return

    form.reset(
      discount
        ? {
            code: discount.code,
            description: discount.description ?? "",
            type: discount.type,
            value: discount.value,
            minOrderAmount: discount.minOrderAmount,
            maxDiscountAmount: discount.maxDiscountAmount ?? "",
            startsAt: dateInput(discount.startsAt),
            endsAt: dateInput(discount.endsAt),
            usageLimit:
              discount.usageLimit == null ? "" : String(discount.usageLimit),
            isActive: discount.isActive,
          }
        : emptyForm
    )
  }, [discount, form, open])

  const submit = async (values: DiscountFormValues) => {
    if (!canSubmit) {
      toast.error("You do not have permission to perform this action")
      return
    }

    const payload: DiscountPayload = {
      code: values.code.trim().toUpperCase(),
      description: values.description.trim() || undefined,
      type: values.type,
      value: Number(values.value),
      minOrderAmount: Number(values.minOrderAmount),
      maxDiscountAmount: values.maxDiscountAmount
        ? Number(values.maxDiscountAmount)
        : null,
      startsAt: values.startsAt
        ? new Date(values.startsAt).toISOString()
        : null,
      endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : null,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
      isActive: values.isActive,
    }

    try {
      if (discount) {
        await updateDiscount({ id: discount.id, data: payload }).unwrap()
        toast.success("Discount updated")
      } else {
        await createDiscount(payload).unwrap()
        toast.success("Discount created")
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Unable to save discount")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Update discount" : "Create discount"}
          </DialogTitle>
          <DialogDescription>
            Configure a coupon code, its discount value and validity rules.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!form.formState.errors.code}>
              <Label htmlFor="discount-code">Coupon code</Label>
              <Input
                id="discount-code"
                {...form.register("code")}
                onChange={(event) =>
                  form.setValue("code", event.target.value.toUpperCase(), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                placeholder="WELCOME10"
                maxLength={50}
                disabled={loading}
                aria-invalid={!!form.formState.errors.code}
              />
              {form.formState.errors.code && (
                <FieldError>{form.formState.errors.code.message}</FieldError>
              )}
            </Field>

            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Field>
                  <Label>Discount type</Label>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                      <SelectItem value="FIXED">Fixed amount</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Field data-invalid={!!form.formState.errors.value}>
              <Label htmlFor="discount-value">
                {discountType === "PERCENTAGE"
                  ? "Percentage (%)"
                  : "Amount (৳)"}
              </Label>
              <Input
                id="discount-value"
                type="number"
                min="0.01"
                max={discountType === "PERCENTAGE" ? 100 : undefined}
                step="0.01"
                {...form.register("value")}
                disabled={loading}
                aria-invalid={!!form.formState.errors.value}
              />
              {form.formState.errors.value && (
                <FieldError>{form.formState.errors.value.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.minOrderAmount}>
              <Label htmlFor="discount-minimum">Minimum order amount (৳)</Label>
              <Input
                id="discount-minimum"
                type="number"
                min="0"
                step="0.01"
                {...form.register("minOrderAmount")}
                disabled={loading}
                aria-invalid={!!form.formState.errors.minOrderAmount}
              />
              {form.formState.errors.minOrderAmount && (
                <FieldError>
                  {form.formState.errors.minOrderAmount.message}
                </FieldError>
              )}
            </Field>

            {discountType === "PERCENTAGE" && (
              <Field
                data-invalid={!!form.formState.errors.maxDiscountAmount}
                className="sm:col-span-2"
              >
                <Label htmlFor="discount-cap">
                  Maximum discount cap (৳) — optional
                </Label>
                <Input
                  id="discount-cap"
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...form.register("maxDiscountAmount")}
                  placeholder="No cap"
                  disabled={loading}
                  aria-invalid={!!form.formState.errors.maxDiscountAmount}
                />
                {form.formState.errors.maxDiscountAmount && (
                  <FieldError>
                    {form.formState.errors.maxDiscountAmount.message}
                  </FieldError>
                )}
              </Field>
            )}

            <Field data-invalid={!!form.formState.errors.startsAt}>
              <Label htmlFor="discount-start">Starts at — optional</Label>
              <Input
                id="discount-start"
                type="datetime-local"
                {...form.register("startsAt")}
                disabled={loading}
                aria-invalid={!!form.formState.errors.startsAt}
              />
              {form.formState.errors.startsAt && (
                <FieldError>
                  {form.formState.errors.startsAt.message}
                </FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.endsAt}>
              <Label htmlFor="discount-end">Ends at — optional</Label>
              <Input
                id="discount-end"
                type="datetime-local"
                {...form.register("endsAt")}
                disabled={loading}
                aria-invalid={!!form.formState.errors.endsAt}
              />
              {form.formState.errors.endsAt && (
                <FieldError>{form.formState.errors.endsAt.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.usageLimit}>
              <Label htmlFor="discount-limit">
                Total usage limit — optional
              </Label>
              <Input
                id="discount-limit"
                type="number"
                min="1"
                step="1"
                {...form.register("usageLimit")}
                placeholder="Unlimited"
                disabled={loading}
                aria-invalid={!!form.formState.errors.usageLimit}
              />
              {form.formState.errors.usageLimit && (
                <FieldError>
                  {form.formState.errors.usageLimit.message}
                </FieldError>
              )}
            </Field>

            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Field className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="discount-active">Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable this coupon code
                    </p>
                  </div>
                  <Switch
                    id="discount-active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </Field>
              )}
            />

            <Field
              data-invalid={!!form.formState.errors.description}
              className="sm:col-span-2"
            >
              <Label htmlFor="discount-description">
                Description — optional
              </Label>
              <Textarea
                id="discount-description"
                {...form.register("description")}
                maxLength={500}
                rows={2}
                placeholder="Short internal description"
                disabled={loading}
                aria-invalid={!!form.formState.errors.description}
              />
              {form.formState.errors.description && (
                <FieldError>
                  {form.formState.errors.description.message}
                </FieldError>
              )}
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !canSubmit}>
              {loading
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
