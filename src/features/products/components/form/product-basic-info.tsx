"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Tag, Layers, Save } from "lucide-react"

import { productSchema } from "../../schemas/product.schema"
import type { ProductFormValues } from "../../schemas/product.schema"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { RichTextEditor } from "@/components/shared/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface ProductBasicInfoOption {
    id: string
    name: string
}

interface ProductBasicInfoProps {
    brands?: ProductBasicInfoOption[]
    categories?: ProductBasicInfoOption[]
    sizeGuides?: ProductBasicInfoOption[]
    isLoadingBrands?: boolean
    isLoadingCategories?: boolean
    isLoadingSizeGuides?: boolean
    isSubmitting?: boolean
    defaultValues?: Partial<ProductFormValues>
    onSubmit: (values: ProductFormValues) => void | Promise<void>
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null
    return <p className="text-sm text-destructive">{message}</p>
}

function MoneyInput({
    id,
    ...props
}: React.ComponentProps<typeof Input> & { id: string }) {
    return (
        <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                ৳
            </span>
            <Input
                id={id}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                {...props}
            />
        </div>
    )
}

export function ProductBasicInfo({
    brands = [],
    categories = [],
    sizeGuides = [],
    isLoadingBrands = false,
    isLoadingCategories = false,
    isLoadingSizeGuides = false,
    isSubmitting = false,
    defaultValues,
    onSubmit,
}: ProductBasicInfoProps) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            subDescription: "",
            description: "",
            purchasePrice: 0,
            sellingPrice: 0,
            categoryId: "",
            brandId: "",
            sizeGuideId: "",
            status: "DRAFT",
            ...defaultValues,
        },
    })

    const purchasePrice = Number(watch("purchasePrice")) || 0
    const sellingPrice = Number(watch("sellingPrice")) || 0
    const subDescriptionLength = (watch("subDescription") ?? "").length
    const profit = sellingPrice - purchasePrice
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid items-start gap-6 lg:grid-cols-3">
                {/* ---------- Left: main content ---------- */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Box className="size-4 text-muted-foreground" />
                                General
                            </CardTitle>
                            <CardDescription>Name and describe your product.</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Product Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Classic Cotton T-Shirt"
                                    {...register("name")}
                                />
                                <FieldError message={errors.name?.message} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="subDescription">Short Description</Label>
                                    <span className="text-xs text-muted-foreground">
                                        {subDescriptionLength} chars
                                    </span>
                                </div>
                                <Input
                                    id="subDescription"
                                    placeholder="Write a short product summary"
                                    {...register("subDescription")}
                                />
                                <FieldError message={errors.subDescription?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Product Description</Label>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <RichTextEditor
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <FieldError message={errors.description?.message} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="size-4 text-muted-foreground" />
                                Pricing
                            </CardTitle>
                            <CardDescription>
                                What you pay and what customers pay.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="purchasePrice">
                                        Purchase Price <span className="text-destructive">*</span>
                                    </Label>
                                    <MoneyInput
                                        id="purchasePrice"
                                        {...register("purchasePrice", { valueAsNumber: true })}
                                    />
                                    <FieldError message={errors.purchasePrice?.message} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sellingPrice">
                                        Selling Price <span className="text-destructive">*</span>
                                    </Label>
                                    <MoneyInput
                                        id="sellingPrice"
                                        {...register("sellingPrice", { valueAsNumber: true })}
                                    />
                                    <FieldError message={errors.sellingPrice?.message} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-dashed px-4 py-3 text-sm">
                                <span className="text-muted-foreground">Estimated profit</span>
                                <span className="font-medium tabular-nums">
                                    ৳{profit.toFixed(2)}
                                    <span className="ml-2 text-muted-foreground">
                                        ({margin.toFixed(1)}%)
                                    </span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ---------- Right: sidebar ---------- */}
                <div className="space-y-6 lg:sticky lg:top-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Status</CardTitle>
                            <CardDescription>
                                Set the visibility of your product.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="grid gap-3"
                                    >
                                        {[
                                            {
                                                value: "DRAFT",
                                                label: "Draft",
                                                description:
                                                    "Saved as draft. Not visible to customers.",
                                            },
                                            {
                                                value: "PROPOSED",
                                                label: "Proposed",
                                                description: "Waiting for review or approval.",
                                            },
                                            {
                                                value: "PUBLISHED",
                                                label: "Published",
                                                description: "Visible to customers on your store.",
                                            },
                                            {
                                                value: "REJECTED",
                                                label: "Rejected",
                                                description: "Not approved for publication.",
                                            },
                                        ].map((status) => (
                                            <Label
                                                key={status.value}
                                                htmlFor={`status-${status.value}`}
                                                className="flex cursor-pointer items-start gap-3"
                                            >
                                                <RadioGroupItem
                                                    id={`status-${status.value}`}
                                                    value={status.value}
                                                    className="mt-0.5"
                                                />

                                                <div className="space-y-1">
                                                    <p className="text-sm leading-none font-medium">
                                                        {status.label}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {status.description}
                                                    </p>
                                                </div>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />

                            <div className="mt-2">
                                <FieldError message={errors.status?.message} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="size-4 text-muted-foreground" />
                                Organization
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">
                                    Category <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={isLoadingCategories}
                                        >
                                            <SelectTrigger id="categoryId" className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingCategories
                                                            ? "Loading categories..."
                                                            : "Select category"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError message={errors.categoryId?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="brandId">Brand</Label>
                                <Controller
                                    control={control}
                                    name="brandId"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? ""}
                                            onValueChange={(value) =>
                                                field.onChange(value || undefined)
                                            }
                                            disabled={isLoadingBrands}
                                        >
                                            <SelectTrigger id="brandId" className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingBrands
                                                            ? "Loading brands..."
                                                            : "Select brand"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError message={errors.brandId?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sizeGuideId">Size Guide</Label>
                                <Controller
                                    control={control}
                                    name="sizeGuideId"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? ""}
                                            onValueChange={(value) =>
                                                field.onChange(value || undefined)
                                            }
                                            disabled={isLoadingSizeGuides}
                                        >
                                            <SelectTrigger id="sizeGuideId" className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingSizeGuides
                                                            ? "Loading size guides..."
                                                            : "Select size guide"
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sizeGuides.map((sizeGuide) => (
                                                    <SelectItem key={sizeGuide.id} value={sizeGuide.id}>
                                                        {sizeGuide.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError message={errors.sizeGuideId?.message} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ---------- Sticky save bar ---------- */}
            <Card className="sticky bottom-0 -mx-1 py-0.5!">
                <CardContent className="flex flex-row items-center">
                    <p className="hidden text-sm text-muted-foreground sm:block">
                        Fields marked <span className="text-destructive">*</span> are
                        required.
                    </p>
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isSubmitting || !isValid || !isDirty}
                        className="ml-auto"
                    >
                        <Save className="size-4" />
                        {isSubmitting ? "Saving..." : "Save Product"}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
