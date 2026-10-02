"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useUpdateProductMutation } from "../../api/product.api"
import {
  productFormSchema,
  type ProductFormValues,
} from "../../schemas/product.schema"
import type { ProductColor, ProductDetails } from "../../types/product.types"
import { getErrorMessage } from "@/lib/utils/error"

import { ProductDetailsSection } from "../create/product-details-section"
import { ProductImagesSection } from "../create/product-images-section"
import { ProductPropertiesSection } from "../create/product-properties-section"
import { ProductPricingSection } from "../create/product-pricing-section"
import { ProductPublishSection } from "../create/product-publish-section"

export function UpdateProductForm({ product }: { product: ProductDetails }) {
  const router = useRouter()
  const [updateProduct, { isLoading }] = useUpdateProductMutation()
  const [imageIdsToDelete, setImageIdsToDelete] = useState<string[]>([])

  const colors = Array.isArray(product.colors)
    ? product.colors.filter(
        (color): color is ProductColor =>
          typeof color === "object" &&
          color !== null &&
          "name" in color &&
          typeof color.name === "string" &&
          "hex" in color &&
          typeof color.hex === "string"
      )
    : []

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      barcode: product.barcode ?? "",
      description: product.description ?? "",
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
      categoryId: product.category.id,
      brandId: product.brand?.id ?? "",
      stock: product.stock,
      sizes: product.sizes ?? [],
      colors,
      images: [...product.images]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ id, imageUrl, publicId, sortOrder }) => ({
          id,
          imageUrl,
          publicId,
          sortOrder,
        })),
      isActive: product.isActive,
    },
  })

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await updateProduct({
        id: product.id,
        data: {
          name: values.name,
          slug: values.slug,
          sku: values.sku,
          barcode: values.barcode || null,
          description: values.description || null,
          purchasePrice: values.purchasePrice,
          sellingPrice: values.sellingPrice,
          categoryId: values.categoryId,
          brandId: values.brandId || null,
          stock: values.stock,
          sizes: values.sizes,
          colors: values.colors,
          images: values.images.map(
            ({ id, imageUrl, publicId, sortOrder }) => ({
              ...(id ? { id } : {}),
              imageUrl,
              publicId,
              sortOrder,
            })
          ),
          imageIdsToDelete,
          isActive: values.isActive,
        },
      }).unwrap()

      toast.success("Product updated successfully")
      router.push(`/dashboard/products/${product.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update product")
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mx-auto w-full max-w-3xl space-y-6"
    >
      <ProductDetailsSection control={form.control} disabled={isLoading} />

      <ProductImagesSection
        control={form.control}
        disabled={isLoading}
        onRemoveExistingImage={(id) =>
          setImageIdsToDelete((current) =>
            current.includes(id) ? current : [...current, id]
          )
        }
      />

      <ProductPropertiesSection control={form.control} disabled={isLoading} />

      <ProductPricingSection control={form.control} disabled={isLoading} />

      <ProductPublishSection
        control={form.control}
        isLoading={isLoading}
        isDirty={form.formState.isDirty}
        onCancel={() => router.back()}
        submitLabel="Update"
        busyLabel="Updating..."
      />
    </form>
  )
}
