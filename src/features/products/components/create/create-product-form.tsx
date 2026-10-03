"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useCreateProductMutation } from "../../api/product.api"
import {
  productFormSchema,
  type ProductFormValues,
} from "../../schemas/product.schema"
import type { CreateProductRequest } from "../../types/product.types"

import { ProductDetailsSection } from "./product-details-section"
import { ProductPropertiesSection } from "./product-properties-section"
import { ProductPricingSection } from "./product-pricing-section"
import { ProductPublishSection } from "./product-publish-section"
import { ProductImagesSection } from "./product-images-section"
import { getErrorMessage } from "@/lib/utils/error"

export function CreateProductForm() {
  const router = useRouter()

  const [createProduct, { isLoading }] = useCreateProductMutation()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      description: "",
      subDescription: "",
      purchasePrice: 0,
      sellingPrice: 0,
      categoryId: "",
      brandId: "",
      stock: 0,
      sizes: [],
      colors: [],
      images: [],
      isActive: true,
      discountValue: "",
      discountStartDate: "",
      discountEndDate: "",
    },
  })

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const data: CreateProductRequest = {
        name: values.name,
        sku: values.sku,
        purchasePrice: values.purchasePrice,
        sellingPrice: values.sellingPrice,
        categoryId: values.categoryId,
        stock: values.stock,
        sizes: values.sizes,
        colors: values.colors,
        images: values.images.map(({ imageUrl, publicId, sortOrder }) => ({
          imageUrl,
          publicId,
          sortOrder,
        })),
        isActive: values.isActive,
        ...(values.discountValue !== "" && {
          discount: {
            value: Number(values.discountValue),
            startDate: values.discountStartDate || null,
            endDate: values.discountEndDate || null,
          },
        }),
      }

      if (values.description) {
        data.description = values.description
      }

      if (values.subDescription) {
        data.subDescription = values.subDescription
      }

      if (values.brandId) {
        data.brandId = values.brandId
      }
      if (values.barcode) data.barcode = values.barcode

      const product = await createProduct(data).unwrap()

      toast.success("Product created successfully")

      router.push(`/dashboard/products/${product.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to create product")
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mx-auto w-full max-w-3xl space-y-6"
    >
      <ProductDetailsSection control={form.control} disabled={isLoading} />

      <ProductImagesSection control={form.control} disabled={isLoading} />

      <ProductPropertiesSection control={form.control} disabled={isLoading} />

      <ProductPricingSection control={form.control} disabled={isLoading} />

      <ProductPublishSection
        control={form.control}
        isLoading={isLoading}
        isDirty={form.formState.isDirty}
        onCancel={() => router.back()}
      />
    </form>
  )
}
