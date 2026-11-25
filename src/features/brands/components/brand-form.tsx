"use client"

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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"

import type { Brand } from "../types/brands.types"
import { brandSchema, type BrandFormValues } from "../schemas/brand.schema"

interface BrandFormProps {
  brand?: Brand
  onSubmit: (data: BrandFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

export function BrandForm({
  brand,
  onSubmit,
  onCancel,
  submitLabel = "Save brand",
  isLoading = false,
}: BrandFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    upload,
    progress,
    error: uploadError,
    isUploading,
  } = useCloudinaryUpload()

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name ?? "",
      slug: brand?.slug ?? "",
      description: brand?.description ?? "",
      image: brand?.image ?? "",
      publicId: brand?.publicId ?? "",
      isActive: brand?.isActive ?? true,
    },
  })

  useEffect(() => {
    form.reset({
      name: brand?.name ?? "",
      slug: brand?.slug ?? "",
      description: brand?.description ?? "",
      image: brand?.image ?? "",
      publicId: brand?.publicId ?? "",
      isActive: brand?.isActive ?? true,
    })
  }, [brand, form])

  const image = useWatch({ control: form.control, name: "image" })
  const isDisabled = isLoading || isUploading

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]

    if (!allowedTypes.includes(file.type)) {
      form.setError("image", {
        type: "manual",
        message: "Only JPG, PNG, WebP, and AVIF images are allowed.",
      })
      return
    }

    form.clearErrors("image")

    try {
      const result = await upload(file, { folder: "brands" })

      form.setValue("image", result.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
      })
      form.setValue("publicId", result.public_id, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } catch {
      // The upload hook exposes the failure message below.
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
    form.clearErrors("image")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-h-[65vh] space-y-6 overflow-y-auto px-1">
        <section className="flex flex-col items-center gap-4 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isDisabled}
          />

          <div className="relative mt-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled}
              aria-label={image ? "Replace brand image" : "Choose brand image"}
              className="group relative size-28 overflow-hidden rounded-sm border border-dashed bg-muted/30 outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {image ? (
                <AppImage
                  name={brand?.name || form.getValues("name") || "Brand"}
                  image={image}
                  clickable={false}
                  className="size-full rounded-sm"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-muted-foreground group-hover:text-primary">
                  <ImagePlus className="size-6" />
                </span>
              )}

              {isUploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <LoaderCircle className="size-5 animate-spin" />
                </span>
              )}

              {image && !isUploading && (
                <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-background/80 group-hover:flex">
                  <Repeat1 className="size-6 text-primary" />
                </span>
              )}
            </button>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
            {isUploading && (
              <div
                className="flex w-full max-w-xs items-center gap-3"
                role="status"
                aria-live="polite"
              >
                <Progress value={progress} className="h-1.5" />
                <span className="text-xs tabular-nums text-muted-foreground">
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
                  aria-label="Remove brand image"
                  title="Remove image"
                  onClick={removeImage}
                  disabled={isDisabled}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground sm:text-left">
              Square image recommended. JPG, PNG, WebP, or AVIF.
            </p>

            {uploadError && <FieldError>{uploadError}</FieldError>}
            {form.formState.errors.image && (
              <FieldError>{form.formState.errors.image.message}</FieldError>
            )}
          </div>
        </section>


        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="brand-name">
                    Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="brand-name"
                    placeholder="Nike"
                    disabled={isDisabled}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Enter your brand name
                  </FieldDescription>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="slug"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="brand-slug">
                    Slug <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="brand-slug"
                    placeholder="nike"
                    disabled={isDisabled}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Use lowercase letters, numbers, and hyphens.
                  </FieldDescription>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

          </div>

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="brand-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="brand-description"
                  placeholder="Write a short brand description..."
                  rows={3}
                  maxLength={1000}
                  disabled={isDisabled}
                  className="min-h-24 resize-y"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal" className="rounded-sm border p-4">
                <div className="flex-1 space-y-1">
                  <FieldLabel>Brand visibility</FieldLabel>
                  <FieldDescription>
                    When enabled, this brand can be used in the active catalog.
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isDisabled}
                  aria-label="Brand visibility"
                />
              </Field>
            )}
          />
        </FieldGroup>
      </div>

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
