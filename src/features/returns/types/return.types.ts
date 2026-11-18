export type OrderReturnStatus =
  "PENDING" | "APPROVED" | "PARTIALLY_PAID" | "REJECTED" | "COMPLETED"

export interface OrderReturnItem {
  id: string
  quantity: number
  reason: string | null
  orderItemId: string
  orderItem: {
    id: string
    quantity: number
    variantId: string | null
    product: { id: string; name: string }
  }
  createdAt: string
  updatedAt: string
}

export interface OrderReturnUser {
  id: string
  name: string
  email: string
}

export interface OrderReturn {
  id: string
  returnNo: string
  status: OrderReturnStatus
  reason: string | null
  rejectionReason: string | null
  order: {
    id: string
    invoiceNo: string
    customer: { id: string; name: string }
  }
  items: OrderReturnItem[]
  createdBy: OrderReturnUser
  approvedBy: OrderReturnUser | null
  approvedAt: string | null
  rejectedBy: OrderReturnUser | null
  rejectedAt: string | null
  completedBy: OrderReturnUser | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderReturnQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: OrderReturnStatus
}

export interface OrderReturnsResponse {
  data: OrderReturn[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
