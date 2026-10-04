"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { CloudUpload, Image as ImageIcon, LoaderCircle } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { AppImage } from "@/components/media"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"

import type { BannerFormValues } from "../../schemas/banner.schema"

interface BannerMediaSectionProps {
  form: UseFormReturn<BannerFormValues>
  onUploadingChange: (isUploading: boolean) => void
}

type ImageChangeEvent = React.ChangeEvent<HTMLInputElement>
type ImageSlot = "desktop" | "mobile"

export function BannerMediaSection({
  form,
  onUploadingChange,
}: BannerMediaSectionProps) {
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState<{
    desktop: string | null
    mobile: string | null
  }>({
    desktop: null,
    mobile: null,
  })

  const {
    upload,
    progress,
    error: uploadError,
    isUploading,
  } = useCloudinaryUpload()

  const [uploading, setUploading] = useState<ImageSlot | null>(null)

  const desktopUrl = form.watch("imageUrl")
  const mobileUrl = form.watch("mobileImageUrl")
  const title = form.watch("title")

  const handleImageUpload = async (file: File, slot: ImageSlot) => {
    setUploading(slot)
    onUploadingChange(true)

    try {
      const result = await upload(file, {
        folder: "banners",
      })

      if (slot === "desktop") {
        form.setValue("imageUrl", result.secure_url, {
          shouldDirty: true,
          shouldValidate: true,
        })

        form.setValue("imagePublicId", result.public_id, {
          shouldDirty: true,
          shouldValidate: true,
        })

        handleClearImage("desktop")
      } else {
        form.setValue("mobileImageUrl", result.secure_url, {
          shouldDirty: true,
          shouldValidate: true,
        })

        form.setValue("mobileImagePublicId", result.public_id, {
          shouldDirty: true,
          shouldValidate: true,
        })
        handleClearImage("mobile")
      }
    } catch {
      // Upload errors are shown below using the upload hook state.
    } finally {
      setUploading(null)
      onUploadingChange(false)
    }
  }

  const onDesktopInputChange = (event: ImageChangeEvent) => {
    const file = event.target.files?.[0]

    if (!file) return

    setImagePreview((prev) => ({
      ...prev,
      desktop: URL.createObjectURL(file),
    }))
  }

  const onMobileInputChange = (event: ImageChangeEvent) => {
    const file = event.target.files?.[0]

    if (!file) return

    setImagePreview((prev) => ({
      ...prev,
      mobile: URL.createObjectURL(file),
    }))
  }

  const handleDesktopUpload = async () => {
    const input = desktopInputRef.current
    const file = input?.files?.[0]

    if (!file) return

    await handleImageUpload(file, "desktop")
    input.value = ""
  }

  const handleMobileUpload = async () => {
    const input = mobileInputRef.current
    const file = input?.files?.[0]

    if (!file) return

    await handleImageUpload(file, "mobile")
    input.value = ""
  }

  const handleClearImage = (slot: ImageSlot) => {
    setImagePreview((prev) => ({
      ...prev,
      [slot]: null,
    }))
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-6">
        {/* Desktop Banner */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="space-y-0.5">
            <h6 className="text-sm font-medium">Desktop Banner</h6>
            <p className="text-xs text-muted-foreground">
              Recommended: 1920 × 640px
            </p>
          </div>

          <div
            className="relative aspect-3/1 cursor-pointer overflow-hidden rounded-md border border-dashed"
            onClick={() => desktopInputRef.current?.click()}
          >
            <input
              ref={desktopInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onDesktopInputChange}
            />

            {imagePreview.desktop ? (
              <Image
                src={imagePreview.desktop}
                alt={title || "Desktop banner"}
                fill
                className="object-cover"
              />
            ) : desktopUrl ? (
              <AppImage
                name={title || "Desktop banner"}
                image={desktopUrl}
                clickable={false}
                className="h-full w-full object-cover rounded-md after:inset-0 after:rounded-md"
              />
            ) : (
              <EmptyImagePreview label="Desktop" />
            )}

            {isUploading && uploading === "desktop" && (
              <UploadProgress progress={progress} />
            )}
          </div>

          {imagePreview.desktop && (
            <ImagePreviewActions
              image={imagePreview.desktop}
              onClear={() => handleClearImage("desktop")}
              onUpload={handleDesktopUpload}
              loading={isUploading && uploading === "desktop"}
            />
          )}
        </div>

        {/* Mobile Banner */}
        <div className="flex flex-col gap-2 overflow-hidden">
          <div className="space-y-0.5">
            <h6 className="text-sm font-medium">Mobile Banner</h6>
            <p className="text-xs text-muted-foreground">
              Recommended: 1080 × 540px
            </p>
          </div>

          <div
            className="relative mx-auto aspect-2/1 w-full cursor-pointer overflow-hidden rounded-md border border-dashed"
            onClick={() => mobileInputRef.current?.click()}
          >
            <input
              ref={mobileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onMobileInputChange}
            />

            {imagePreview.mobile ? (
              <Image
                src={imagePreview.mobile}
                alt={title || "Mobile banner"}
                fill
                className="object-cover"
              />
            ) : mobileUrl ? (
              <AppImage
                name={title || "Mobile banner"}
                image={mobileUrl}
                clickable={false}
                className="h-full w-full object-cover rounded-md after:inset-0 after:rounded-md"
              />
            ) : (
              <EmptyImagePreview label="Mobile" />
            )}

            {isUploading && uploading === "mobile" && (
              <UploadProgress progress={progress} />
            )}
          </div>

          {imagePreview.mobile && (
            <ImagePreviewActions
              image={imagePreview.mobile}
              onClear={() => handleClearImage("mobile")}
              onUpload={handleMobileUpload}
              loading={isUploading && uploading === "mobile"}
            />
          )}
        </div>
      </div>

      {uploadError && <FieldError>{uploadError}</FieldError>}
    </div>
  )
}

function EmptyImagePreview({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/30 transition-colors hover:bg-muted/50">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <ImageIcon className="size-6 text-muted-foreground" />
        </div>

        <div className="space-y-1">
          <h6 className="text-sm font-medium">
            No {label.toLowerCase()} image
          </h6>

          <p className="text-xs text-muted-foreground">
            Click <span className="font-medium text-primary">here</span> to
            upload an image
          </p>
        </div>
      </div>
    </div>
  )
}

function ImagePreviewActions({
  image,
  onClear,
  onUpload,
  loading,
}: {
  image: string | null
  onClear: () => void
  onUpload: () => void
  loading?: boolean
}) {
  return (
    <div className="flex justify-end gap-2 px-2">
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={onClear}
        disabled={!image || loading}
      >
        Clear
      </Button>

      <Button
        type="button"
        variant="default"
        size="xs"
        onClick={onUpload}
        disabled={!image || loading}
      >
        <CloudUpload />
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-muted/30">
      <div className="relative flex size-16 items-center justify-center">
        <LoaderCircle className="absolute size-16 animate-spin text-primary" />

        <span className="text-xs font-medium text-primary">{progress}%</span>
      </div>
    </div>
  )
}
