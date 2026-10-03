"use client"

import { useRef, useState } from "react"
import { Controller, type Control } from "react-hook-form"
import { ChevronDown, CloudUpload, Images, X } from "lucide-react"

import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

import type { ProductFormValues } from "../../schemas/product.schema"
import type { AddProductImageDto } from "../../types/product.types"

interface ProductImagesSectionProps {
  control: Control<ProductFormValues>
  disabled?: boolean
  onRemoveExistingImage?: (id: string) => void
}

interface DraftImage {
  id: string
  file: File
  preview: string
}

export function ProductImagesSection({
  control,
  disabled = false,
  onRemoveExistingImage,
}: ProductImagesSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(true)
  const [draftImages, setDraftImages] = useState<DraftImage[]>([])
  const [uploadIndex, setUploadIndex] = useState(0)

  const { upload, isUploading, progress, error } = useCloudinaryUpload()

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="group flex w-full items-center justify-between text-left"
            >
              <div>
                <CardTitle>Images</CardTitle>

                <CardDescription>
                  Select images first, then upload them.
                </CardDescription>
              </div>

              <ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <CardContent>
            <Controller
              name="images"
              control={control}
              render={({ field, fieldState }) => {
                const images = field.value ?? []

                const openFilePicker = () => {
                  if (!disabled && !isUploading) {
                    inputRef.current?.click()
                  }
                }

                const addDraftFiles = (files: File[]) => {
                  const imageFiles = files.filter((file) =>
                    file.type.startsWith("image/")
                  )

                  if (!imageFiles.length) {
                    return
                  }

                  const newDrafts = imageFiles.map((file) => ({
                    id: `${file.name}-${file.lastModified}-${Math.random()}`,
                    file,
                    preview: URL.createObjectURL(file),
                  }))

                  setDraftImages((current) => [...current, ...newDrafts])
                }

                const uploadDraftImages = async () => {
                  if (!draftImages.length || disabled || isUploading) {
                    return
                  }

                  const uploadedImages: AddProductImageDto[] = []

                  for (let index = 0; index < draftImages.length; index++) {
                    const draft = draftImages[index]

                    setUploadIndex(index + 1)

                    try {
                      const image = await upload(draft.file, {
                        folder: "products",
                      })

                      uploadedImages.push({
                        imageUrl: image.secure_url,
                        publicId: image.public_id,
                        sortOrder: images.length + uploadedImages.length,
                      })

                      URL.revokeObjectURL(draft.preview)
                    } catch {
                      break
                    }
                  }

                  if (uploadedImages.length) {
                    field.onChange([...images, ...uploadedImages])

                    setDraftImages((current) =>
                      current.slice(uploadedImages.length)
                    )
                  }

                  setUploadIndex(0)
                }

                const removeDraftImage = (id: string) => {
                  setDraftImages((current) => {
                    const image = current.find((item) => item.id === id)

                    if (image) {
                      URL.revokeObjectURL(image.preview)
                    }

                    return current.filter((item) => item.id !== id)
                  })
                }

                const removeUploadedImage = (index: number) => {
                  const image = images[index]

                  if (image?.id) {
                    onRemoveExistingImage?.(image.id)
                  }

                  field.onChange(
                    images
                      .filter((_, imageIndex) => imageIndex !== index)
                      .map((image, imageIndex) => ({
                        ...image,
                        sortOrder: imageIndex,
                      }))
                  )
                }

                const removeAll = () => {
                  images.forEach((image) => {
                    if (image.id) {
                      onRemoveExistingImage?.(image.id)
                    }
                  })

                  draftImages.forEach((image) => {
                    URL.revokeObjectURL(image.preview)
                  })

                  setDraftImages([])
                  field.onChange([])
                }

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Product images</FieldLabel>

                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      disabled={disabled || isUploading}
                      onChange={(event) => {
                        const files = Array.from(event.target.files ?? [])

                        addDraftFiles(files)

                        event.target.value = ""
                      }}
                    />

                    <div
                      role="button"
                      tabIndex={disabled ? -1 : 0}
                      onClick={openFilePicker}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          openFilePicker()
                        }
                      }}
                      onDragOver={(event) => {
                        event.preventDefault()
                      }}
                      onDrop={(event) => {
                        event.preventDefault()

                        if (disabled || isUploading) {
                          return
                        }

                        addDraftFiles(Array.from(event.dataTransfer.files))
                      }}
                      className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center transition-colors hover:bg-muted/40"
                    >
                      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-muted">
                        <Images className="size-10 text-muted-foreground" />
                      </div>

                      <p className="text-base font-semibold">
                        Drop or select files
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag files here, or{" "}
                        <span className="font-medium text-primary underline underline-offset-2">
                          browse
                        </span>{" "}
                        your device.
                      </p>
                    </div>

                    {error && (
                      <FieldError
                        errors={[
                          {
                            message: error,
                          },
                        ]}
                      />
                    )}

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}

                    {(images.length > 0 || draftImages.length > 0) && (
                      <>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                          {images.map((image, index) => (
                            <div
                              key={image.publicId}
                              className="group relative aspect-square overflow-hidden rounded-lg border"
                            >
                              <img
                                src={image.imageUrl}
                                alt={`Product image ${index + 1}`}
                                className="size-full object-cover"
                              />

                              <button
                                type="button"
                                aria-label={`Remove product image ${index + 1}`}
                                onClick={() => removeUploadedImage(index)}
                                disabled={disabled || isUploading}
                                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:pointer-events-none sm:size-6"
                              >
                                <X className="size-3 sm:size-3.5" />
                              </button>
                            </div>
                          ))}

                          {draftImages.map((image, index) => {
                            const isCurrentUpload =
                              isUploading && uploadIndex === index + 1

                            return (
                              <div
                                key={image.id}
                                className="group relative aspect-square overflow-hidden rounded-lg border"
                              >
                                <img
                                  src={image.preview}
                                  alt={image.file.name}
                                  className="size-full object-cover"
                                />

                                <button
                                  type="button"
                                  aria-label={`Remove ${image.file.name}`}
                                  onClick={() => removeDraftImage(image.id)}
                                  disabled={disabled || isUploading}
                                  className="absolute top-1 right-1 z-10 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:pointer-events-none sm:size-6"
                                >
                                  <X className="size-3 sm:size-3.5" />
                                </button>

                                {isCurrentUpload && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="relative flex size-10 items-center justify-center">
                                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                      <span className="relative text-[10px] font-semibold text-white">
                                        {progress}%
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={removeAll}
                            disabled={disabled || isUploading}
                          >
                            Remove All
                          </Button>

                          {draftImages.length > 0 && (
                            <Button
                              type="button"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={uploadDraftImages}
                              disabled={disabled || isUploading}
                            >
                              <CloudUpload />

                              {isUploading ? "Uploading..." : "Upload"}
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </Field>
                )
              }}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
