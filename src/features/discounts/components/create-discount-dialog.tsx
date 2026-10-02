"use client"

import { useState } from "react"
import { Calendar, Loader2, Percent, Plus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
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

import { getErrorMessage } from "@/lib/utils/error"

import {
  createDiscountSchema,
  type CreateDiscountFormValues,
} from "../schemas/create-discount.schema"
import { useCreateDiscountMutation } from "../api/discount.api"
import { DiscountType } from "../types/discount.types"

export function CreateDiscountDialog() {
  const [open, setOpen] = useState(false)
  const [createDiscount, { isLoading }] = useCreateDiscountMutation()

  const form = useForm<CreateDiscountFormValues>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      name: "",
      description: "",
      type: DiscountType.PERCENTAGE,
      value: "",
      startDate: "",
      endDate: "",
      isActive: true,
    },
  })

  async function onSubmit(values: CreateDiscountFormValues) {
    try {
      await createDiscount({
        name: values.name,
        description: values.description || undefined,
        type: values.type,
        value: values.value,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        isActive: values.isActive,
      }).unwrap()

      toast.success("Discount created successfully")

      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error(
        getErrorMessage(error) || "Failed to create discount. Please try again."
      )
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value)

    if (!value) {
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Discount
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Percent className="size-4" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <DialogTitle>Create Discount</DialogTitle>

              <DialogDescription>
                Create a discount campaign for your products.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[calc(90vh-73px)] flex-col overflow-auto"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Discount Name</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Eid Sale"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe this discount..."
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                    className="min-h-20 resize-none"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Discount Type</FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
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

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="value"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Discount Value</FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={
                        form.watch("type") === DiscountType.PERCENTAGE
                          ? "e.g. 10"
                          : "e.g. 500"
                      }
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>

                    <div className="relative">
                      <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        {...field}
                        id={field.name}
                        type="datetime-local"
                        disabled={isLoading}
                        aria-invalid={fieldState.invalid}
                        className="pl-9"
                      />
                    </div>

                    {fieldState.invalid && (
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
                    <FieldLabel htmlFor={field.name}>End Date</FieldLabel>

                    <div className="relative">
                      <Calendar className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        {...field}
                        id={field.name}
                        type="datetime-local"
                        disabled={isLoading}
                        aria-invalid={fieldState.invalid}
                        className="pl-9"
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Active Discount</p>

                    <p className="text-xs text-muted-foreground">
                      Enable this discount immediately.
                    </p>
                  </div>

                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </div>
              )}
            />
          </div>

          <DialogFooter className="flex-row items-center justify-end border-t px-4 py-3 sm:justify-between sm:px-6">
            <span className="hidden text-xs text-muted-foreground sm:flex">
              You can assign products after creating the discount.
            </span>

            <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
