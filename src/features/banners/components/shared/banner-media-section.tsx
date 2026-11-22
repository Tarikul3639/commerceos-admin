"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { CloudUpload, Monitor, Smartphone, Upload, X } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import { getErrorMessage } from "@/lib/utils/error"

import type { BannerFormValues } from "../../schemas/banner.schema"

interface BannerMediaSectionProps {
  form: UseFormReturn<BannerFormValues>
  onUploadingChange: (isUploading: boolean) => void
}

type ImageTarget = "desktop" | "mobile"

interface ImageDraft {
  target: ImageTarget
  file: File
  preview: string
}

/** Uploads one desktop image and one optional mobile image to Cloudinary. */
export function BannerMediaSection({
  form,
  onUploadingChange,
}: BannerMediaSectionProps) {
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const draftsRef = useRef<ImageDraft[]>([])
  const [drafts, setDrafts] = useState<ImageDraft[]>([])
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

  useEffect(() => {
    draftsRef.current = drafts
  }, [drafts])

  useEffect(() => {
    return () => {
      draftsRef.current.forEach((draft) => URL.revokeObjectURL(draft.preview))
    }
  }, [])

  /** Keep one pending file per device target and replace its old preview. */
  const addDraft = (target: ImageTarget, file?: File) => {
    if (busy || !file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    onUploadingChange(true)
    setDrafts((current) => {
      const previous = current.find((draft) => draft.target === target)
      if (previous) URL.revokeObjectURL(previous.preview)
      return [
        ...current.filter((draft) => draft.target !== target),
        { target, file, preview: URL.createObjectURL(file) },
      ]
    })
  }

  /** Remove a queued file or clear the uploaded image from form state. */
  const removeImage = (target: ImageTarget) => {
    if (busy) return
    const draft = drafts.find((item) => item.target === target)
    if (draft) {
      URL.revokeObjectURL(draft.preview)
      const remainingDrafts = drafts.filter((item) => item.target !== target)
      setDrafts(remainingDrafts)
      onUploadingChange(remainingDrafts.length > 0)
    }

    if (target === "desktop") {
      form.setValue("imageUrl", "", { shouldDirty: true, shouldValidate: true })
      form.setValue("imagePublicId", "", {
        shouldDirty: true,
        shouldValidate: true,
      })
    } else {
      form.setValue("mobileImageUrl", "", {
        shouldDirty: true,
        shouldValidate: true,
      })
      form.setValue("mobileImagePublicId", "", {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }

  /** Upload a selected image and save its URL and Cloudinary ID together. */
  const uploadDraft = async (target: ImageTarget) => {
    const draft = drafts.find((item) => item.target === target)
    if (!draft || busy) return

    onUploadingChange(true)
    setUploadingTarget(target)
    try {
      const result = await upload(draft.file, { folder: "banners" })
      if (target === "desktop") {
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
      URL.revokeObjectURL(draft.preview)
      setDrafts((current) => current.filter((item) => item.target !== target))
      onUploadingChange(drafts.some((item) => item.target !== target))
      toast.success(
        `${target === "desktop" ? "Desktop" : "Mobile"} image uploaded`
      )
    } catch (error) {
      toast.error("Failed to upload banner image", {
        description: getErrorMessage(error),
      })
    } finally {
      setUploadingTarget(null)
      onUploadingChange(drafts.some((item) => item.target !== target))
    }
  }

  /** Render one image picker with its own preview and upload action. */
  const renderImageField = (
    target: ImageTarget,
    label: string,
    description: string,
    recommendedSize: string,
    imageUrl: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    const draft = drafts.find((item) => item.target === target)
    const preview = draft?.preview ?? imageUrl
    const previewAspectClass =
      target === "desktop"
        ? "aspect-16/11 sm:aspect-2/1 lg:aspect-32/9"
        : "aspect-16/11"

    return (
      <div className="min-w-0 space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          {target === "desktop" ? (
            <Monitor className="size-4 text-muted-foreground" />
          ) : (
            <Smartphone className="size-4 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {target === "desktop" && (
            <span className="ml-auto text-xs text-destructive">Required</span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(event) => {
            addDraft(target, event.currentTarget.files?.[0])
            event.currentTarget.value = ""
          }}
        />

        {preview ? (
          <div className={`relative overflow-hidden rounded-md border bg-muted ${previewAspectClass}`}>
            <Image
              src={preview}
              alt={label}
              fill
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              aria-label={`Remove ${label.toLowerCase()}`}
              onClick={() => removeImage(target)}
              disabled={busy}
              className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black/80 disabled:cursor-not-allowed"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted/40 disabled:cursor-not-allowed ${previewAspectClass}`}
          >
            <Upload className="size-5" />
            <span>Select {label.toLowerCase()}</span>
            <span className="text-xs text-muted-foreground">
              Recommended size: {recommendedSize}
            </span>
          </button>
        )}

        {draft && (
          <Button
            type="button"
            size="sm"
            className="w-full"
            onClick={() => void uploadDraft(target)}
            disabled={busy}
          >
            <CloudUpload className="size-4" />
            {uploadingTarget === target
              ? `Uploading ${progress}%`
              : `Upload ${label}`}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4">
        {renderImageField(
          "desktop",
          "Desktop image",
          "Wide image used on desktop and as fallback.",
          "1920 × 540 px (32:9)",
          desktopImageUrl,
          desktopInputRef
        )}
        {renderImageField(
          "mobile",
          "Mobile image",
          "Optional image optimized for phone screens.",
          "900 × 620 px (16:11)",
          mobileImageUrl,
          mobileInputRef
        )}
      </div>
      {uploadError && <FieldError>{uploadError}</FieldError>}
      {!desktopImageUrl &&
        !drafts.some((draft) => draft.target === "desktop") && (
          <FieldError>A desktop banner image is required.</FieldError>
        )}
      <p className="text-xs text-muted-foreground">
        Upload one image for each device size. If no mobile image is provided,
        the desktop image is used.
      </p>
    </div>
  )
}
