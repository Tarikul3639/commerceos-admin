"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CloudUpload, Upload, X } from "lucide-react"
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

interface DraftImage {
  id: string
  file: File
  preview: string
}

/** Multi-image banner uploader, following the product image draft/preview workflow. */
export function BannerMediaSection({
  form,
  onUploadingChange,
}: BannerMediaSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const draftsRef = useRef<DraftImage[]>([])
  const [draftImages, setDraftImages] = useState<DraftImage[]>([])
  const [uploadingIndex, setUploadingIndex] = useState(0)
  const {
    upload,
    isUploading,
    progress,
    error: uploadError,
  } = useCloudinaryUpload()
  const savedImages = form.watch("images") ?? []
  const busy = isUploading || uploadingIndex > 0

  useEffect(() => {
    draftsRef.current = draftImages
  }, [draftImages])

  useEffect(() => {
    return () =>
      draftsRef.current.forEach((image) => URL.revokeObjectURL(image.preview))
  }, [])

  /** Add selected image files to the local preview queue. */
  const addDraftImages = (files: File[]) => {
    if (busy) return
    const validFiles = files.filter((file) => file.type.startsWith("image/"))
    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped", {
        description: "Only image files are allowed.",
      })
    }
    setDraftImages((current) => [
      ...current,
      ...validFiles.map((file) => ({
        id: uuidv4(),
        file,
        preview: URL.createObjectURL(file),
      })),
    ])
  }

  /** Remove a not-yet-uploaded image and release its preview URL. */
  const removeDraftImage = (id: string) => {
    if (busy) return
    setDraftImages((current) => {
      const draft = current.find((image) => image.id === id)
      if (draft) URL.revokeObjectURL(draft.preview)
      return current.filter((image) => image.id !== id)
    })
  }

  /** Remove an already-uploaded image from the form payload. */
  const removeSavedImage = (index: number) => {
    if (busy) return
    form.setValue(
      "images",
      savedImages
        .filter((_, imageIndex) => imageIndex !== index)
        .map((image, sortOrder) => ({ ...image, sortOrder })),
      { shouldDirty: true, shouldValidate: true }
    )
  }

  /** Upload all queued files, then append their Cloudinary references to the form. */
  const saveImages = async () => {
    if (busy || draftImages.length === 0) return
    onUploadingChange(true)
    const uploadedImages = [...savedImages]
    try {
      for (let index = 0; index < draftImages.length; index++) {
        setUploadingIndex(index + 1)
        const result = await upload(draftImages[index].file, {
          folder: "banners",
        })
        uploadedImages.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
          sortOrder: uploadedImages.length,
        })
      }
      form.setValue("images", uploadedImages, {
        shouldDirty: true,
        shouldValidate: true,
      })
      draftImages.forEach((image) => URL.revokeObjectURL(image.preview))
      setDraftImages([])
      toast.success("Banner images uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload banner images", {
        description: getErrorMessage(error),
      })
    } finally {
      setUploadingIndex(0)
      onUploadingChange(false)
    }
  }

  /** Clear all queued local previews without changing saved images. */
  const clearDrafts = () => {
    if (busy) return
    draftImages.forEach((image) => URL.revokeObjectURL(image.preview))
    setDraftImages([])
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={busy}
        onChange={(event) => {
          addDraftImages(Array.from(event.currentTarget.files ?? []))
          event.currentTarget.value = ""
        }}
      />

      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-disabled={busy}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            if (!busy) inputRef.current?.click()
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          if (!busy) addDraftImages(Array.from(event.dataTransfer.files))
        }}
        className={`group flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-center transition-colors ${
          busy
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-primary hover:bg-muted/40"
        }`}
      >
        <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10">
          <Upload className="size-5 text-muted-foreground group-hover:text-primary" />
        </div>
        <p className="text-sm font-semibold">Click or drop banner images</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Select multiple images. One responsive image size works on desktop and
          mobile.
        </p>
      </div>

      {(savedImages.length > 0 || draftImages.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {savedImages.map((image, index) => (
            <div
              key={image.publicId}
              className="group relative aspect-2/1 overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={image.imageUrl}
                alt={`Banner image ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                Image {index + 1}
              </span>
              <button
                type="button"
                aria-label={`Remove banner image ${index + 1}`}
                onClick={() => removeSavedImage(index)}
                disabled={busy}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:cursor-not-allowed md:opacity-0 md:group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}

          {draftImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-3/1 overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={image.preview}
                alt={image.file.name}
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                aria-label={`Remove ${image.file.name}`}
                onClick={() => removeDraftImage(image.id)}
                disabled={busy}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 disabled:cursor-not-allowed"
              >
                <X className="size-3.5" />
              </button>
              {uploadingIndex === index + 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-xs font-semibold text-white">
                    {progress}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadError && <FieldError>{uploadError}</FieldError>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {savedImages.length} uploaded · {draftImages.length} ready to upload
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={clearDrafts}
            disabled={busy || draftImages.length === 0}
          >
            Clear selection
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void saveImages()}
            disabled={busy || draftImages.length === 0}
          >
            <CloudUpload className="size-4" />
            {busy
              ? `Uploading ${uploadingIndex}/${draftImages.length}`
              : "Upload images"}
          </Button>
        </div>
      </div>
      {savedImages.length === 0 && (
        <FieldError>
          At least one banner image is required before saving.
        </FieldError>
      )}
    </div>
  )
}
