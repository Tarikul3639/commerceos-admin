"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Camera, X } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import type { Banner } from "../types/banners.types"
import { BannerPosition, BannerType } from "../types/banners.types"
import { bannerSchema, type BannerFormValues } from "../schemas/banner.schema"

interface BannerFormProps {
  banner?: Banner
  onSubmit: (values: BannerFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel: string
  isLoading?: boolean
}

function toDateTimeInput(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)
}

export function BannerForm({
  banner,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading = false,
}: BannerFormProps) {
  const desktopInput = useRef<HTMLInputElement>(null)
  const mobileInput = useRef<HTMLInputElement>(null)
  const {
    upload,
    progress,
    error: uploadError,
    isUploading,
  } = useCloudinaryUpload()
  const [uploadingSlot, setUploadingSlot] = useState<
    "desktop" | "mobile" | null
  >(null)
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title ?? "",
      imageUrl: banner?.imageUrl ?? "",
      imagePublicId: banner?.imagePublicId ?? "",
      mobileImageUrl: banner?.mobileImageUrl ?? "",
      mobileImagePublicId: banner?.mobileImagePublicId ?? "",
      type: banner?.type ?? BannerType.PROMOTION,
      position: banner?.position ?? BannerPosition.HOME_TOP,
      link: banner?.link ?? "",
      buttonText: banner?.buttonText ?? "",
      openInNewTab: banner?.openInNewTab ?? false,
      sortOrder: String(banner?.sortOrder ?? 0),
      isActive: banner?.isActive ?? true,
      startAt: toDateTimeInput(banner?.startAt),
      endAt: toDateTimeInput(banner?.endAt),
    },
  })

  useEffect(() => {
    form.reset({
      title: banner?.title ?? "",
      imageUrl: banner?.imageUrl ?? "",
      imagePublicId: banner?.imagePublicId ?? "",
      mobileImageUrl: banner?.mobileImageUrl ?? "",
      mobileImagePublicId: banner?.mobileImagePublicId ?? "",
      type: banner?.type ?? BannerType.PROMOTION,
      position: banner?.position ?? BannerPosition.HOME_TOP,
      link: banner?.link ?? "",
      buttonText: banner?.buttonText ?? "",
      openInNewTab: banner?.openInNewTab ?? false,
      sortOrder: String(banner?.sortOrder ?? 0),
      isActive: banner?.isActive ?? true,
      startAt: toDateTimeInput(banner?.startAt),
      endAt: toDateTimeInput(banner?.endAt),
    })
  }, [banner, form])

  const desktopUrl = form.watch("imageUrl")
  const mobileUrl = form.watch("mobileImageUrl")
  const title = form.watch("title")

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    slot: "desktop" | "mobile"
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingSlot(slot)
    try {
      const result = await upload(file, { folder: "banners" })
      if (slot === "desktop") {
        form.setValue("imageUrl", result.secure_url, {
          shouldDirty: true,
          shouldValidate: true,
        })
        form.setValue("imagePublicId", result.public_id, {
          shouldDirty: true,
          shouldValidate: true,
        })
      } else {
        form.setValue("mobileImageUrl", result.secure_url, {
          shouldDirty: true,
          shouldValidate: true,
        })
        form.setValue("mobileImagePublicId", result.public_id, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    } catch {
      // Upload errors are shown below using the upload hook state.
    } finally {
      setUploadingSlot(null)
      event.target.value = ""
    }
  }

  const clearMobileImage = () => {
    form.setValue("mobileImageUrl", "", { shouldDirty: true })
    form.setValue("mobileImagePublicId", "", { shouldDirty: true })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-h-[75vh] space-y-5 overflow-y-auto px-1"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BannerImageField
          label="Desktop image"
          name={title || "Desktop banner"}
          value={desktopUrl}
          inputRef={desktopInput}
          isUploading={isUploading && uploadingSlot === "desktop"}
          progress={progress}
          required
          onSelect={() => desktopInput.current?.click()}
          onChange={(event) => handleImageUpload(event, "desktop")}
        />
        <BannerImageField
          label="Mobile image"
          name={title || "Mobile banner"}
          value={mobileUrl}
          inputRef={mobileInput}
          isUploading={isUploading && uploadingSlot === "mobile"}
          progress={progress}
          onSelect={() => mobileInput.current?.click()}
          onChange={(event) => handleImageUpload(event, "mobile")}
          onClear={mobileUrl ? clearMobileImage : undefined}
        />
      </div>

      {form.formState.errors.imageUrl && (
        <FieldError>{form.formState.errors.imageUrl.message}</FieldError>
      )}
      {uploadError && <FieldError>{uploadError}</FieldError>}

      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="banner-title">Title</FieldLabel>
              <Input {...field} id="banner-title" placeholder="Summer sale" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BannerType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatEnumLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="position"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Position</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BannerPosition).map((position) => (
                      <SelectItem key={position} value={position}>
                        {formatEnumLabel(position)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="link"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="banner-link">Link</FieldLabel>
              <Input {...field} id="banner-link" placeholder="/shop/sale" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="buttonText"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="banner-button-text">
                  Button text
                </FieldLabel>
                <Input
                  {...field}
                  id="banner-button-text"
                  placeholder="Shop now"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="sortOrder"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="banner-sort-order">Sort order</FieldLabel>
                <Input
                  {...field}
                  id="banner-sort-order"
                  type="number"
                  min="0"
                  step="1"
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
            name="startAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="banner-start-at">Start date</FieldLabel>
                <Input {...field} id="banner-start-at" type="datetime-local" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="endAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="banner-end-at">End date</FieldLabel>
                <Input {...field} id="banner-end-at" type="datetime-local" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="openInNewTab"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldLabel htmlFor="banner-new-tab">
                  Open link in new tab
                </FieldLabel>
                <FieldDescription>
                  Open the banner destination in a new tab.
                </FieldDescription>
              </div>
              <Switch
                id="banner-new-tab"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Field>
          )}
        />

        <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldLabel htmlFor="banner-active">Active</FieldLabel>
                <FieldDescription>
                  Inactive banners are hidden from the storefront.
                </FieldDescription>
              </div>
              <Switch
                id="banner-active"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || isUploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? "Saving..." : isUploading ? "Uploading..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

interface BannerImageFieldProps {
  label: string
  name: string
  value: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isUploading: boolean
  progress: number
  required?: boolean
  onSelect: () => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
}

function BannerImageField({
  label,
  name,
  value,
  inputRef,
  isUploading,
  progress,
  required = false,
  onSelect,
  onChange,
  onClear,
}: BannerImageFieldProps) {
  return (
    <Field>
      <FieldLabel>
        {label}
        {required ? " *" : " (optional)"}
      </FieldLabel>
      <div className="flex items-center gap-3">
        <AppImage
          name={name}
          image={value}
          clickable={false}
          className="size-20 rounded-md"
        />
        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSelect}
            disabled={isUploading}
          >
            <Camera />
            {isUploading
              ? `Uploading ${progress}%`
              : value
                ? "Replace image"
                : "Upload image"}
          </Button>
          {onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              disabled={isUploading}
            >
              <X />
              Remove mobile image
            </Button>
          )}
        </div>
      </div>
      <FieldDescription>
        {required
          ? "Required desktop banner image."
          : "Optional image for mobile screens."}
      </FieldDescription>
    </Field>
  )
}

function formatEnumLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}
