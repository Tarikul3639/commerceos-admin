"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { LoaderCircle, Monitor, Smartphone, Upload, X } from "lucide-react"
import type { ChangeEvent, RefObject } from "react"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { FieldError } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import { getErrorMessage } from "@/lib/utils/error"

import type { BannerFormValues } from "../../schemas/banner.schema"

interface BannerMediaSectionProps {
  form: UseFormReturn<BannerFormValues>
  onUploadingChange: (isUploading: boolean) => void
}

type ImageTarget = "desktop" | "mobile"

interface TargetFieldConfig {
  url: "imageUrl" | "mobileImageUrl"
  publicId: "imagePublicId" | "mobileImagePublicId"
  label: string
  description: string
  recommendedSize: string
  previewAspectClass: string
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

const TARGET_CONFIG: Record<ImageTarget, TargetFieldConfig> = {
  desktop: {
    url: "imageUrl",
    publicId: "imagePublicId",
    label: "Desktop image",
    description: "Wide image used on desktop and as fallback.",
    recommendedSize: "1920 × 540 px (32:9)",
    previewAspectClass: "aspect-16/11 sm:aspect-2/1 lg:aspect-32/9",
  },
  mobile: {
    url: "mobileImageUrl",
    publicId: "mobileImagePublicId",
    label: "Mobile image",
    description: "Optional image optimized for phone screens.",
    recommendedSize: "900 × 620 px (16:11)",
    previewAspectClass: "aspect-16/11",
  },
}

/** Uploads selected desktop and optional mobile images directly to Cloudinary. */
export function BannerMediaSection({
  form,
  onUploadingChange,
}: BannerMediaSectionProps) {
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingTarget, setUploadingTarget] = useState<ImageTarget | null>(
    null
  )

  const {
    upload,
    isUploading,
    progress,
    error: uploadError,
  } = useCloudinaryUpload()

  const busy = isUploading || uploadingTarget !== null
  const desktopImageUrl = form.watch("imageUrl")
  const mobileImageUrl = form.watch("mobileImageUrl")
  const desktopErrorMessage = form.formState.errors.imageUrl?.message

  const setTargetMedia = (
    target: ImageTarget,
    values: { url: string; publicId: string }
  ) => {
    const fields = TARGET_CONFIG[target]
    const options = { shouldDirty: true, shouldValidate: true }
    form.setValue(fields.url, values.url, options)
    form.setValue(fields.publicId, values.publicId, options)
  }

  /** Upload the selected file immediately and save its URL and public ID. */
  const handleImageChange = async (
    target: ImageTarget,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file || busy) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Image size must be 10 MB or less")
      return
    }

    const config = TARGET_CONFIG[target]
    onUploadingChange(true)
    setUploadingTarget(target)

    try {
      const result = await upload(file, { folder: "banners" })
      setTargetMedia(target, {
        url: result.secure_url,
        publicId: result.public_id,
      })
      toast.success(`${config.label} uploaded`)
    } catch (error) {
      toast.error("Failed to upload banner image", {
        description: getErrorMessage(error),
      })
    } finally {
      setUploadingTarget(null)
      onUploadingChange(false)
    }
  }

  /** Clear the selected image from form state. */
  const removeImage = (target: ImageTarget) => {
    if (busy) return
    setTargetMedia(target, { url: "", publicId: "" })
  }

  /** Render one image picker; selecting a file uploads it immediately. */
  const renderImageField = (
    target: ImageTarget,
    imageUrl: string,
    inputRef: RefObject<HTMLInputElement | null>
  ) => {
    const config = TARGET_CONFIG[target]
    const isTargetUploading = uploadingTarget === target
    const lowerLabel = config.label.toLowerCase()

    return (
      <div className="min-w-0 space-y-3 border p-4">
        <div className="flex items-center gap-2">
          {target === "desktop" ? (
            <Monitor className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <Smartphone className="size-4 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold">{config.label}</p>
            <p className="text-xs text-muted-foreground">
              {config.description}
            </p>
          </div>
          {target === "desktop" && (
            <span className="ml-auto shrink-0 text-xs text-destructive">
              Required
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          disabled={busy}
          onChange={(event) => void handleImageChange(target, event)}
        />

        {imageUrl ? (
          <div
            className={`relative overflow-hidden border bg-muted ${config.previewAspectClass}`}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              aria-label={`Replace ${lowerLabel}`}
              className="group absolute inset-0 z-0 block size-full disabled:cursor-not-allowed"
            >
              <Image
                src={imageUrl}
                alt={config.label}
                fill
                unoptimized
                className="object-cover"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {isTargetUploading ? (
                  <>
                    <LoaderCircle className="size-6 animate-spin" />
                    <span>Uploading {progress}%</span>
                  </>
                ) : (
                  <span>Click to replace image</span>
                )}
              </span>
            </button>

            <button
              type="button"
              aria-label={`Remove ${lowerLabel}`}
              onClick={() => removeImage(target)}
              disabled={busy}
              className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center bg-black/65 text-white hover:bg-black/80 disabled:cursor-not-allowed"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed bg-muted/20 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40 disabled:cursor-not-allowed ${config.previewAspectClass}`}
          >
            {isTargetUploading ? (
              <LoaderCircle className="size-6 animate-spin text-primary" />
            ) : (
              <Upload className="size-5" />
            )}
            <span>
              {isTargetUploading
                ? `Uploading ${progress}%`
                : `Select ${lowerLabel}`}
            </span>
            {!isTargetUploading && (
              <span className="text-xs text-muted-foreground">
                Recommended size: {config.recommendedSize}
              </span>
            )}
          </button>
        )}

        {isTargetUploading && (
          <div className="space-y-1.5" role="status" aria-live="polite">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                Uploading {lowerLabel}...
              </span>
              <span className="text-muted-foreground tabular-nums">
                {progress}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-1.5 rounded-none [&>div]:rounded-none"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4">
        {renderImageField("desktop", desktopImageUrl, desktopInputRef)}
        {renderImageField("mobile", mobileImageUrl, mobileInputRef)}
      </div>

      {uploadError && <FieldError>{uploadError}</FieldError>}
      {!desktopImageUrl && !busy && (
        <FieldError>
          {desktopErrorMessage ?? "A desktop banner image is required."}
        </FieldError>
      )}

      <p className="text-xs text-muted-foreground">
        Upload one image for each device size. If no mobile image is provided,
        the desktop image is used.
      </p>
    </div>
  )
}
