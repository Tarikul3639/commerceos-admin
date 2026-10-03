export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface DiscountProduct {
  id: string
  name: string
  sku: string
  image: string | null
}
export interface DiscountCreator {
  id: string
  name: string
}

export interface Discount {
  id: string
  value: string
  startDate: string | null
  endDate: string | null
  productId: string
  product: DiscountProduct
  createdById: string
  createdBy: DiscountCreator
  createdAt: string
  updatedAt: string
}

export interface DiscountWithPagination {
  data: Discount[]
  meta: PaginationMeta
}
export interface CreateDiscountRequest {
  productId: string
  value: number
  startDate?: string | null
  endDate?: string | null
}

export interface UpdateDiscountRequest {
  productId?: string
  value?: number
  startDate?: string | null
  endDate?: string | null
}

export interface DiscountQueryParams {
  search?: string
  page?: number
  limit?: number
}
