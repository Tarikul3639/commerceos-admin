"use client"

import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { X, CloudUpload, Upload } from "lucide-react"
import { toast } from "sonner"

import {
    useAddProductImageMutation,
    useGetProductImagesQuery,
    useDeleteProductImageMutation,
} from "../../api/product-image-api"

import type { ProductImage } from "../../types/product-image.types"

import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload"
import { getErrorMessage } from "@/lib/utils/error"
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { LoadingState } from "@/components/shared/loading-state"
import { ErrorState } from "@/components/shared/error-state"

interface DraftImage {
    id: string
    file: File
    preview: string
}

export function ProductImages({ productId }: { productId: string }) {
    const inputRef = useRef<HTMLInputElement>(null)
    const draftImagesRef = useRef<DraftImage[]>([])

    const [draftImages, setDraftImages] = useState<DraftImage[]>([])
    const [uploadingImageIndex, setUploadingImageIndex] = useState(0)

    const { upload, isUploading, progress } = useCloudinaryUpload()

    const {
        data: images = [],
        isLoading,
        isError,
        refetch,
    } = useGetProductImagesQuery(productId)

    const [addProductImage, { isLoading: isSavingImage }] =
        useAddProductImageMutation()

    const [deleteProductImage, { isLoading: isDeletingImage }] =
        useDeleteProductImageMutation()

    const busy =
        isSavingImage || isDeletingImage || isUploading || uploadingImageIndex > 0

    useEffect(() => {
        draftImagesRef.current = draftImages
    }, [draftImages])

    useEffect(() => {
        return () => {
            draftImagesRef.current.forEach((image) => {
                URL.revokeObjectURL(image.preview)
            })
        }
    }, [])

    const handleAddDraftImages = (files: File[]) => {
        if (busy) return

        const validFiles = files.filter((file) => file.type.startsWith("image/"))

        if (validFiles.length !== files.length) {
            toast.error("Some files were skipped", {
                description: "Only image files are allowed.",
            })
        }

        const drafts = validFiles.map((file) => ({
            id: uuidv4(),
            file,
            preview: URL.createObjectURL(file),
        }))

        setDraftImages((current) => [...current, ...drafts])
    }

    const handleRemoveDraftImage = (id: string) => {
        if (busy) return

        setDraftImages((current) => {
            const draft = current.find((image) => image.id === id)

            if (draft) {
                URL.revokeObjectURL(draft.preview)
            }

            return current.filter((image) => image.id !== id)
        })
    }

    const handleClearAllDrafts = () => {
        if (busy) return

        draftImages.forEach((image) => {
            URL.revokeObjectURL(image.preview)
        })

        setDraftImages([])
    }

    const handleSaveImages = async () => {
        if (busy || draftImages.length === 0) return

        const uploadedImages: {
            imageUrl: string
            publicId: string
            sortOrder: number
        }[] = []

        try {
            for (let index = 0; index < draftImages.length; index++) {
                const draft = draftImages[index]

                setUploadingImageIndex(index + 1)

                const uploaded = await upload(draft.file, {
                    folder: "products",
                })

                uploadedImages.push({
                    imageUrl: uploaded.secure_url,
                    publicId: uploaded.public_id,
                    sortOrder: images.length + index + 1,
                })
            }

            await addProductImage({
                productId,
                data: {
                    images: uploadedImages,
                },
            }).unwrap()

            draftImages.forEach((image) => {
                URL.revokeObjectURL(image.preview)
            })

            setDraftImages([])

            toast.success("Product images saved successfully")
        } catch (error) {
            toast.error("Failed to save product images", {
                description: getErrorMessage(error),
            })
        } finally {
            setUploadingImageIndex(0)
        }
    }

    const handleRemoveExistingImage = async (imageId: string) => {
        try {
            // Instant delete the image from the UI for better UX
            setDraftImages((current) =>
                current.filter((image) => image.id !== imageId)
            )

            await deleteProductImage({
                productId,
                imageId,
            }).unwrap()

            toast.success("Image deleted successfully")
        } catch (error) {
            toast.error("Failed to delete image", {
                description: getErrorMessage(error),
            })

            refetch() // Refetch images to restore the deleted image in case of failure
        }
    }

    if (isLoading) {
        return <LoadingState message="Loading product images..." />
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load product images"
                message="Unable to fetch product images."
                onRetry={() => refetch()}
            />
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <Card>
                <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>
                        Select images first, then click Save Images to upload them.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={busy}
                        onChange={(event) => {
                            handleAddDraftImages(Array.from(event.currentTarget.files ?? []))

                            event.currentTarget.value = ""
                        }}
                    />

                    <div
                        role="button"
                        tabIndex={busy ? -1 : 0}
                        aria-disabled={busy}
                        onClick={() => {
                            if (!busy) inputRef.current?.click()
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()

                                if (!busy) inputRef.current?.click()
                            }
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault()

                            if (!busy) {
                                handleAddDraftImages(Array.from(event.dataTransfer.files))
                            }
                        }}
                        className={`group flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-center transition-colors ${busy
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:border-primary hover:bg-muted/40"
                            }`}
                    >
                        <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
                            <Upload className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>

                        <p className="text-sm font-semibold">
                            Click or drop images
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Drag images here, or browse your device.
                        </p>
                    </div>

                    {(images.length > 0 || draftImages.length > 0) && (
                        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                            {images.map((image: ProductImage, index: number) => (
                                <div
                                    key={image.id}
                                    className="group relative aspect-square overflow-hidden rounded-lg border"
                                >
                                    <img
                                        src={image.imageUrl}
                                        alt={`Product image ${index + 1}`}
                                        className="size-full object-cover"
                                    />

                                    <button
                                        type="button"
                                        aria-label={`Remove image ${index + 1}`}
                                        onClick={() => void handleRemoveExistingImage(image.id)}
                                        disabled={busy}
                                        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 disabled:cursor-not-allowed md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            ))}

                            {draftImages.map((image, index) => (
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
                                        onClick={() => handleRemoveDraftImage(image.id)}
                                        disabled={busy}
                                        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 disabled:cursor-not-allowed md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        <X className="size-3.5" />
                                    </button>

                                    {uploadingImageIndex === index + 1 && (
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
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="sticky bottom-0 -mx-1 py-0.5!">
                <CardContent className="flex flex-row items-center">
                    <p className="hidden text-sm text-muted-foreground sm:block">
                        {draftImages.length > 0
                            ? `${draftImages.length} images ready to upload`
                            : "Select images before saving."}
                    </p>

                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleClearAllDrafts}
                            disabled={busy || draftImages.length === 0}
                        >
                            Reset
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={() => void handleSaveImages()}
                            disabled={busy || draftImages.length === 0}
                        >
                            <CloudUpload className="size-4" />

                            {isUploading || uploadingImageIndex > 0
                                ? `Uploading ${draftImages.length}/${uploadingImageIndex}`
                                : isSavingImage
                                    ? "Saving..."
                                    : "Save Images"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
