"use client"

import { useQueryState } from "nuqs"
import {
  Info,
  Image as ImageIcon,
  SlidersHorizontal,
  Boxes,
  Percent,
} from "lucide-react"
import type { ProductFormValues } from "../../schemas/product.schema"
import type { useGetProductDetailsQuery } from "../../api/product.api"

import { ProductBasicInfo } from "../form/product-basic-info"
import { ProductDiscountForm } from "../form/product-discount-form"
import type { ProductDiscountValues } from "../form/product-discount-form"
import { ProductImages } from "../form/product-images"
import { ProductOptions } from "../form/product-options"
import { ProductVariants } from "../form/product-variants"
import { getErrorMessage } from "@/lib/utils/error"
import { toast } from "sonner"

import { useUpdateProductMutation } from "../../api/product.api"
import { useGetBrandsQuery } from "@/features/brands/api/brands.api"
import { useGetCategoriesQuery } from "@/features/categories/api/categories.api"
import { useGetSizeGuidesQuery } from "@/features/size-guides/api/size-guides.api"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Product = NonNullable<ReturnType<typeof useGetProductDetailsQuery>["data"]>

interface UpdateProductFormProps {
  productId: string
  product: Product
}

function toDateInputValue(value: string | null | undefined) {
  if (!value) return ""
  return value.slice(0, 10)
}

export function UpdateProductForm({
  productId,
  product,
}: UpdateProductFormProps) {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "basic-info",
  })

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const { data: brandsData, isLoading: isLoadingBrands } = useGetBrandsQuery({
    limit: 100,
  })

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategoriesQuery({ limit: 100 })

  const { data: sizeGuidesData, isLoading: isLoadingSizeGuides } =
    useGetSizeGuidesQuery()

  const saveProductChanges = async (
    data: Parameters<typeof updateProduct>[0]["data"],
    successMessage: string
  ) => {
    try {
      await updateProduct({ id: productId, data }).unwrap()
      toast.success(successMessage)
    } catch (error) {
      toast.error("Failed to update product", {
        description: getErrorMessage(error),
      })
    }
  }

  const handleProductUpdate = async (values: ProductFormValues) => {
    await saveProductChanges(
      {
        name: values.name,
        subDescription: values.subDescription ?? undefined,
        description: values.description ?? undefined,
        categoryId: values.categoryId ?? undefined,
        purchasePrice: Number(values.purchasePrice),
        sellingPrice: Number(values.sellingPrice),
        brandId: values.brandId || undefined,
        sizeGuideId: values.sizeGuideId || undefined,
        status: values.status,
        isFeatured: values.isFeatured ?? false,
      },
      "Product information updated successfully"
    )
  }

  const handleDiscountUpdate = async (values: ProductDiscountValues) => {
    await saveProductChanges(
      {
        productDiscount: {
          isActive: values.isActive,
          type: values.type,
          value: Number(values.value),
          startsAt: values.startsAt || null,
          endsAt: values.endsAt || null,
        },
      },
      "Product discount updated successfully"
    )
  }

  const discountDefaults: ProductDiscountValues = {
    isActive: product.productDiscount?.isActive ?? false,
    type: product.productDiscount?.type ?? "PERCENTAGE",
    value: Number(product.productDiscount?.value ?? 10),
    startsAt: toDateInputValue(product.productDiscount?.startsAt),
    endsAt: toDateInputValue(product.productDiscount?.endsAt),
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-6"
    >
      <TabsList className="grid h-auto! w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <TabsTrigger value="basic-info">
          <Info />
          Basic Info
        </TabsTrigger>
        <TabsTrigger value="discount">
          <Percent />
          Discount
        </TabsTrigger>
        <TabsTrigger value="images">
          <ImageIcon />
          Images
        </TabsTrigger>
        <TabsTrigger value="options">
          <SlidersHorizontal />
          Options
        </TabsTrigger>
        <TabsTrigger value="variants">
          <Boxes />
          Variants
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info" className="mt-0">
        <ProductBasicInfo
          brands={brandsData?.data ?? []}
          categories={categoriesData?.data ?? []}
          sizeGuides={sizeGuidesData?.data ?? []}
          isLoadingBrands={isLoadingBrands}
          isLoadingCategories={isLoadingCategories}
          isLoadingSizeGuides={isLoadingSizeGuides}
          onSubmit={handleProductUpdate}
          isSubmitting={isUpdating}
          defaultValues={{
            name: product.name,
            subDescription: product.subDescription ?? "",
            description: product.description ?? "",
            purchasePrice: Number(product.purchasePrice),
            sellingPrice: Number(product.sellingPrice),
            categoryId: product.categoryId,
            brandId: product.brandId ?? "",
            sizeGuideId: product.sizeGuideId ?? "",
            status: product.status,
            isFeatured: product.isFeatured,
          }}
        />
      </TabsContent>

      <TabsContent value="discount" className="mt-0">
        <ProductDiscountForm
          defaultValues={discountDefaults}
          isSubmitting={isUpdating}
          onSubmit={handleDiscountUpdate}
        />
      </TabsContent>

      <TabsContent value="images" className="mt-0">
        <ProductImages productId={product.id} />
      </TabsContent>

      <TabsContent value="options" className="mt-0">
        <ProductOptions productId={product.id} />
      </TabsContent>

      <TabsContent value="variants" className="mt-0">
        <ProductVariants productId={product.id} />
      </TabsContent>
    </Tabs>
  )
}
