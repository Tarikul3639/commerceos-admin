"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category.schema"
import type { Category } from "../types/categories.types"

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: CategoryFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isLoading = false,
}: CategoryFormProps) {
  const { control, handleSubmit } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      isActive: category?.isActive ?? true,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Category Name</FieldLabel>

            <Input
              {...field}
              placeholder="Electronics"
              disabled={isLoading}
              aria-invalid={fieldState.invalid}
            />

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Slug</FieldLabel>

            <Input
              {...field}
              placeholder="electronics"
              disabled={isLoading}
              aria-invalid={fieldState.invalid}
            />

            <FieldDescription>
              URL-friendly name for the category.
            </FieldDescription>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
              placeholder="Electronic devices and accessories"
              disabled={isLoading}
              aria-invalid={fieldState.invalid}
              rows={4}
            />

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel>Active</FieldLabel>

              <FieldDescription>
                Active categories can be used in products.
              </FieldDescription>
            </div>

            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isLoading}
            />
          </Field>
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? `${submitLabel}ing...` : submitLabel}
        </Button>
      </div>
    </form>
  )
}
