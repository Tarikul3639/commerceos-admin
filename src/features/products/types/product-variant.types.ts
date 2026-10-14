import type { ProductOptionType } from "./product-option.types"

export interface ProductVariantOption {
  id: string
  value: string
  colorHex: string | null
  optionId: string
  optionName: string
  optionType: ProductOptionType
}

export interface ProductVariant {
  id: string
  productId: string
  title: string | null
  sku: string
  barcode: string | null
  stock: number
  options: ProductVariantOption[]
  isActive: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateProductVariantRequest {
  productId: string
  title?: string
  sku: string
  barcode?: string
  stock?: number
  optionValueIds?: string[]
}

export type UpdateProductVariantRequest = Partial<CreateProductVariantRequest>
