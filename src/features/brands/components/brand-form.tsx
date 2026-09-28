"use client"

import { useEffect, useRef } from "react"
import { Camera, Loader2 } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

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

    const avatarUrl = form.watch("image")
    const name = form.watch("name")

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
                    <AppImage
                        name={name}
                        image={avatarUrl}
                        clickable={false}
                        className="size-24 text-2xl font-semibold"
                    />

                    {isUploading && progress !== undefined && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-accent/80">
                            <span className="text-sm font-semibold text-accent-foreground">
                                {progress}%
                            </span>
                        </div>
                    )}

                    {!isUploading && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:bg-primary/90 active:scale-95"
                            title="Upload image"
                        >
                            <Camera className="size-4" />
                        </button>
                    )}

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
                            <FieldLabel htmlFor="brand-name">Name</FieldLabel>

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
                            <FieldLabel htmlFor="brand-slug">Slug</FieldLabel>

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
                                className="resize-none max-h-38 overflow-scroll"
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
