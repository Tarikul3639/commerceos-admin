"use client"

import { useEffect, useRef } from "react"
import { Camera } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AppImage } from "@/components/media"

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
  submitLabel = "Save",
  isLoading = false,
}: BrandFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { upload, progress, error, isUploading } = useCloudinaryUpload()

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

  const avatarUrl = useWatch({ control: form.control, name: "image" })
  const name = useWatch({ control: form.control, name: "name" })

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

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
    } finally {
      event.target.value = ""
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="flex items-center gap-3">
        <div className="relative size-24">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            aria-label={avatarUrl ? "Change brand image" : "Upload brand image"}
            className="group relative block size-24 overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
          >
            <AppImage
              name={name}
              image={avatarUrl}
              clickable={false}
              className="size-24 text-2xl font-semibold"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {isUploading ? (
                <span className="text-sm font-semibold">{progress}%</span>
              ) : (
                <Camera className="size-5" />
              )}
            </span>
          </button>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <FieldDescription>Profile image</FieldDescription>
        {error && <FieldError>{error}</FieldError>}
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="brand-name">Name <span className="text-destructive">*</span></FieldLabel>

              <Input
                {...field}
                id="brand-name"
                placeholder="Nike"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="brand-slug">Slug <span className="text-destructive">*</span></FieldLabel>

              <Input
                {...field}
                id="brand-slug"
                placeholder="nike"
                aria-invalid={fieldState.invalid}
              />

              <FieldDescription>
                Use lowercase letters, numbers, and hyphens.
              </FieldDescription>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="brand-description">Description</FieldLabel>

              <Textarea
                {...field}
                id="brand-description"
                placeholder="Nike is a global sportswear brand."
                rows={4}
                maxLength={500}
                className="max-h-38 resize-none overflow-scroll"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldLabel htmlFor="brand-active">Active</FieldLabel>

                <FieldDescription>
                  Inactive brands will not be available for active catalog
                  operations.
                </FieldDescription>
              </div>

              <Switch
                id="brand-active"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isLoading || isUploading || !form.formState.isDirty}
        >
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
