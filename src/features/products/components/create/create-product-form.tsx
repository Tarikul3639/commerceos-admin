"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LockKeyhole } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useCreateProductMutation } from "../../api/product.api"
import type { ProductFormValues } from "../../schemas/product.schema"

import { ProductBasicInfo } from "../form/product-basic-info"
import { getErrorMessage } from "@/lib/utils/error"

import { useGetBrandsQuery } from "@/features/brands/api/brands.api"
import { useGetCategoriesQuery } from "@/features/categories/api/categories.api"
import { useGetSizeGuidesQuery } from "@/features/size-guides/api/size-guides.api"

export function CreateProductForm() {
    const router = useRouter()

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()

    const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery()

    const { data: categoriesData, isLoading: isLoadingCategories } =
        useGetCategoriesQuery()

    const { data: sizeGuidesData, isLoading: isLoadingSizeGuides } =
        useGetSizeGuidesQuery()

    const handleProductCreate = async (values: ProductFormValues) => {
        try {
            const response = await createProduct(values).unwrap()
            const productId = response.id

            if (!productId) {
                throw new Error("Created product ID was not returned.")
            }

            toast.success("Product created successfully")

            router.push(`/admin/products/${productId}/edit`)
        } catch (error) {
            toast.error("Failed to create product", {
                description: getErrorMessage(error),
            })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Tabs value="basic-info" className="w-full">
                <TabsList className="grid h-auto! w-full grid-cols-3 gap-1 sm:gap-2">
                    <TabsTrigger
                        value="basic-info"
                        className="min-w-0 gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm rounded-xs py-1.5"
                    >
                        <span>1. Basic Info</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="images"
                        className="pointer-events-none min-w-0 gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
                    >
                        <LockKeyhole className="size-3 shrink-0 sm:size-3.5" />
                        <span>2. Images</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="variants"
                        className="pointer-events-none min-w-0 gap-1 px-1 text-xs sm:gap-2 sm:px-3 sm:text-sm"
                    >
                        <LockKeyhole className="size-3 shrink-0 sm:size-3.5" />
                        <span className="truncate">3. Variants & Options</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <ProductBasicInfo
                brands={brandsData?.data ?? []}
                categories={categoriesData?.data ?? []}
                sizeGuides={sizeGuidesData?.data ?? []}
                isLoadingBrands={isLoadingBrands}
                isLoadingCategories={isLoadingCategories}
                isLoadingSizeGuides={isLoadingSizeGuides}
                isSubmitting={isCreating}
                onSubmit={handleProductCreate}
            />
        </div>
    )
}
