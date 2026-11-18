export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED"

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  subtotal: string
  productId: string
  product: { id: string; name: string }
  variantId: string | null
  variantSku: string | null
  variantColor: string | null
  variantSize: string | null
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  invoiceNo: string
  subtotal: string
  discount: string
  tax: string
  total: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  customer: { id: string; name: string }
  user: { id: string; name: string; email: string }
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: OrderStatus
  paymentStatus?: PaymentStatus
}

export interface OrdersResponse {
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface UpdateOrderStatusRequest {
  status: Exclude<OrderStatus, "CANCELLED">
  reason?: string
}
