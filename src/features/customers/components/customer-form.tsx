"use client"

import { useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { AppImage } from "@/components/media"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"

import {
  customerSchema,
  type CustomerFormValues,
} from "../schemas/customer.schema"

import type { Customer } from "../types/customers.types"

interface CustomerFormProps {
  customer?: Customer
  onSubmit: (data: CustomerFormValues) => void
  onCancel: () => void
  submitLabel?: string
  isLoading?: boolean
}

export function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isLoading = false,
}: CustomerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { upload, isUploading, progress } = useCloudinaryUpload()

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      avatarUrl: customer?.avatarUrl ?? "",
      publicId: customer?.publicId ?? "",
      address: customer?.address ?? "",
    },
  })

  useEffect(() => {
    if (!customer) {
      return
    }

    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      avatarUrl: customer.avatarUrl ?? "",
      publicId: customer.publicId ?? "",
      address: customer.address ?? "",
    })
  }, [customer, form])

  const avatarUrl = form.watch("avatarUrl")
  const name = form.watch("name")

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const result = await upload(file, { folder: "customers" })

      form.setValue("avatarUrl", result.secure_url, {
        shouldValidate: true,
        shouldDirty: true,
      })

      form.setValue("publicId", result.public_id, {
        shouldDirty: true,
      })
    } finally {
      event.target.value = ""
    }
  }

  const handleRemoveAvatar = () => {
    form.setValue("avatarUrl", "", {
      shouldValidate: true,
      shouldDirty: true,
    })

    form.setValue("publicId", "", {
      shouldDirty: true,
    })
  }

  const isSubmitting = isLoading || isUploading

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center justify-center gap-3 pb-2">
        <div className="group relative">
          <AppImage
            name={name}
            image={avatarUrl}
            clickable={false}
            className="size-24 text-2xl font-semibold"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:bg-primary/90 active:scale-95 disabled:opacity-50"
            title="Upload avatar"
          >
            <Camera className="size-4" />
          </button>
        </div>

        {isUploading && (
          <div className="w-full max-w-[180px] space-y-1 text-center">
            <Progress value={progress} className="h-1.5" />

            <span className="text-xs text-muted-foreground">
              Uploading {progress}%
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="h-8 text-xs"
          >
            {isUploading ? "Uploading..." : "Change Picture"}
          </Button>

          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={isSubmitting}
              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="mr-1 size-3.5" />
              Remove
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>

      {/* Customer Fields */}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customer-name">Full Name</FieldLabel>

                <FieldContent>
                  <Input
                    {...field}
                    id="customer-name"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="customer-email">
                  Email Address
                  {customer?.isVerified && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (Verified)
                    </span>
                  )}
                </FieldLabel>

                <FieldContent>
                  <Input
                    {...field}
                    id="customer-email"
                    type="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting || customer?.isVerified}
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-phone">Phone Number</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  id="customer-phone"
                  type="tel"
                  placeholder="+8801712345678"
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customer-address">Address</FieldLabel>

              <FieldContent>
                <Textarea
                  {...field}
                  id="customer-address"
                  placeholder="Dhanmondi, Dhaka"
                  disabled={isSubmitting}
                  rows={3}
                  className="resize-none"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      {/* Actions */}
      <div className="flex w-full flex-row items-center justify-end gap-2 border-t pt-2">
        <span className="mr-auto hidden text-sm text-muted-foreground sm:flex">
          {isSubmitting ? "Please wait..." : "All fields are required."}
        </span>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting} className="min-w-[90px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
