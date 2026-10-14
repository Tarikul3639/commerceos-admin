export type ProductOptionType =
  "COLOR" | "SIZE" | "MATERIAL" | "STYLE" | "CUSTOM"

export interface ProductOptionValue {
  id: string
  value: string
  colorHex: string | null
  optionId: string
  createdAt: string
  updatedAt: string
}

export interface ProductOption {
  id: string
  name: string
  type: ProductOptionType
  productId: string
  values: ProductOptionValue[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductOptionValueRequest {
  value: string
  colorHex?: string
}

export interface CreateProductOptionRequest {
  productId: string
  name: string
  type: ProductOptionType
  values: CreateProductOptionValueRequest[]
}

export type UpdateProductOptionRequest = Partial<
  Omit<CreateProductOptionRequest, "productId" | "values">
>
