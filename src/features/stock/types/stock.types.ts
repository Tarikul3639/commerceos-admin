export interface Stock {
  id: string
  productId: string
  quantity: number
  sku: string
  productName: string
  productImage: string | null
  updatedAt: string
}

export interface StockQueryParams {
  page?: number
  limit?: number
  search?: string
  lowStock?: boolean
}

export interface StockResponse {
  data: Stock[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface AdjustStockRequest {
  productId: string
  quantity: number
  reason?: string
}
