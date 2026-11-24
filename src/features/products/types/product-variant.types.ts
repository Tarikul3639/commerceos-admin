export type VariantOptions = Record<string, string>

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  barcode: string | null
  stock: number
  options: VariantOptions
  isActive: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateProductVariantRequest {
  productId: string
  sku: string
  barcode: string
  options: VariantOptions
}

export interface GeneratedVariantRequest {
  sku: string
  barcode: string
  options: VariantOptions
}

export type UpdateProductVariantRequest = Partial<
  Pick<CreateProductVariantRequest, "sku" | "barcode" | "options">
> & {
  isActive?: boolean
}
