import type { ProductImage } from "./product-image.types"
import type { ProductStatus, RelationSummary } from "./product.types"
import type { ProductOption, ProductOptionValue } from "./product-option.types"
import type { VariantOptions } from "./product-variant.types"

export interface ProductSizeGuide extends RelationSummary {
  description: string | null
  unit: string
  columns: string[]
  rows: Record<string, string | number>[]
}

export type { ProductOption, ProductOptionValue }

export interface ProductVariant {
  id: string
  sku: string
  barcode: string | null
  stock: number
  isActive: boolean
  deletedAt: string | null
  options: VariantOptions
  createdAt: string
  updatedAt: string
}

export interface ProductDiscount {
  id: string
  type: "PERCENTAGE" | "FIXED"
  value: string
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
}

export interface ProductDetails {
  id: string
  name: string
  subDescription: string | null
  description: string | null
  purchasePrice: string
  sellingPrice: string
  productDiscount: ProductDiscount | null
  status: ProductStatus
  isFeatured: boolean
  categoryId: string
  category: RelationSummary
  brandId: string | null
  brand: RelationSummary | null
  sizeGuideId: string | null
  sizeGuide: ProductSizeGuide | null
  images: ProductImage[]
  options: ProductOption[]
  variants: ProductVariant[]
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}
