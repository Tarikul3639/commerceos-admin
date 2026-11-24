export type ProductOptionType =
  "COLOR" | "SIZE" | "STORAGE" | "CAPACITY" | "CUSTOM"

export interface ProductOptionValue {
  id: string
  label: string
  colorCode?: string
}

export interface ProductOption {
  id: string
  name: string
  type: ProductOptionType
  productId: string
  values: ProductOptionValue[]
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductOptionRequest {
  productId: string
  name: string
  type: ProductOptionType
  values: ProductOptionValue[]
  sortOrder?: number
}

export type UpdateProductOptionRequest = Partial<
  Pick<CreateProductOptionRequest, "name" | "type" | "values" | "sortOrder">
>
