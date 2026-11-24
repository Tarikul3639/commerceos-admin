"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { ImagePlus, LoaderCircle, Repeat1, X } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AppImage } from "@/components/media"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"

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
  submitLabel = "Save category",
  isLoading = false,
}: CategoryFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    upload,
    progress,
    error: uploadError,
    isUploading,
  } = useCloudinaryUpload()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      image: category?.image ?? "",
      publicId: category?.publicId ?? "",
      isActive: category?.isActive ?? true,
    },
  })

  useEffect(() => {
    form.reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      image: category?.image ?? "",
      publicId: category?.publicId ?? "",
      isActive: category?.isActive ?? true,
    })
  }, [category, form])

  const image = useWatch({
    control: form.control,
    name: "image",
  })

  const isDisabled = isLoading || isUploading

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await upload(file, {
        folder: "categories",
      })

      form.setValue("image", result.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
      })

      form.setValue("publicId", result.public_id, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } finally {
      event.target.value = ""
    }
  }

  const removeImage = () => {
    form.setValue("image", "", {
      shouldValidate: true,
      shouldDirty: true,
    })

    form.setValue("publicId", "", {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-h-[65vh] space-y-6 overflow-y-auto px-2">
        {/* Image Upload */}
        <section className="flex flex-col items-center gap-4 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isDisabled}
          />

          {/* Image Preview */}
          <div className="relative mt-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
              aria-label={
                image ? "Replace category image" : "Choose category image"
              }
              className={cn(
                "group relative size-32 overflow-hidden rounded-sm border bg-muted/30 transition-colors outline-none",
                "hover:border-primary/60 focus-visible:ring-[3px] focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-60",
                !image && "border-dashed"
              )}
            >
              {image ? (
                <AppImage
                  name={category?.name || form.getValues("name") || "Category"}
                  image={image}
                  clickable={false}
                  className="size-full rounded-sm after:rounded-sm"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-muted-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary">
                  <ImagePlus className="size-6" />
                </span>
              )}

              {isUploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <LoaderCircle className="size-5 animate-spin" />
                </span>
              )}

              {/* Hover replace overlay */}
              {image && !isUploading && (
                <div className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded-sm bg-background/80 group-hover:flex">
                  <span className="text-muted-foreground transition-colors group-hover:text-primary">
                    <Repeat1 className="size-6" />
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Upload Info */}
          <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
            {isUploading && (
              <div
                className="flex w-full max-w-xs items-center gap-3"
                role="status"
                aria-live="polite"
              >
                <Progress value={progress} className="h-1.5" />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {progress}%
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isDisabled}
              >
                {image ? "Change image" : "Upload image"}
              </Button>

              {image && (
                <Button
                  type="button"
                  size="icon-xs"
                  variant="destructive"
                  aria-label="Remove image"
                  title="Remove image"
                  onClick={removeImage}
                  disabled={isDisabled}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Use a square image (1:1 aspect ratio) for the best result. JPG,
              PNG, WebP or AVIF.
            </p>

            {uploadError && <FieldError>{uploadError}</FieldError>}
          </div>
        </section>

        {/* Category Name & Slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category-name">
                  Category name <span className="text-destructive">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  id="category-name"
                  placeholder="Enter a category name"
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category-slug">
                  URL slug <span className="text-destructive">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  id="category-slug"
                  placeholder="category-url-slug"
                  disabled={isLoading}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="category-description">
                Description
              </FieldLabel>

              <Textarea
                {...field}
                id="category-description"
                placeholder="Write a short description for this category..."
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
                rows={3}
                className="min-h-24 resize-y"
              />

              <FieldDescription>
                A short summary that helps customers understand what belongs
                here.
              </FieldDescription>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Category Visibility */}
        <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal" className="rounded-sm border p-4">
              <div className="flex-1 space-y-1">
                <FieldLabel>Category visibility</FieldLabel>

                <FieldDescription>
                  When enabled, this category can be assigned to products and
                  displayed in the store.
                </FieldDescription>
              </div>

              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
                aria-label="Category visibility"
              />
            </Field>
          )}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDisabled}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isDisabled}>
          {isLoading ? "Saving..." : isUploading ? "Uploading..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
