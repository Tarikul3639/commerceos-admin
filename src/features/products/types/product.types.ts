import type { PaginatedResponse } from "@/types/pagination"

export type ProductStatus = "DRAFT" | "PROPOSED" | "PUBLISHED" | "REJECTED"

export interface RelationSummary {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  subDescription: string | null
  purchasePrice: string
  sellingPrice: string
  status: ProductStatus
  isFeatured: boolean
  category: RelationSummary
  brand: RelationSummary | null
  sizeGuide: RelationSummary | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductListItem extends Product {
  image: string | null
  variants?: Array<{ sku: string; isActive: boolean }>
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
  status?: ProductStatus
}

export type ProductsResponse = PaginatedResponse<ProductListItem>

export interface CreateProductRequest {
  name: string
  subDescription?: string
  description?: string
  purchasePrice: number
  sellingPrice: number
  categoryId: string
  brandId?: string
  sizeGuideId?: string
  status?: ProductStatus
  isFeatured?: boolean
  productDiscount?: {
    isActive: boolean
    type: "PERCENTAGE" | "FIXED"
    value: number
    startsAt?: string | null
    endsAt?: string | null
  } | null
}

export type UpdateProductRequest = Partial<CreateProductRequest>
