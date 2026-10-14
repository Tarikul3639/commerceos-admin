import type { PaginatedResponse } from "@/types/pagination"

// Product status
export type ProductStatus = "DRAFT" | "PROPOSED" | "PUBLISHED" | "REJECTED"

// Relation summary
export interface RelationSummary {
  id: string
  name: string
}

// Product
export interface Product {
  id: string
  name: string
  subDescription: string | null
  purchasePrice: string
  sellingPrice: string
  status: ProductStatus

  category: RelationSummary
  brand: RelationSummary | null
  sizeGuide: RelationSummary | null

  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

// Product list item
export interface ProductListItem extends Product {
  image: string | null
  variants?: Array<{
    sku: string
    isActive: boolean
  }>
}

// Product query parameters
export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
  status?: ProductStatus
}

// Products response
export interface ProductsResponse extends PaginatedResponse<ProductListItem> {}

// Create product request
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
}

// Update product request
export type UpdateProductRequest = Partial<CreateProductRequest>