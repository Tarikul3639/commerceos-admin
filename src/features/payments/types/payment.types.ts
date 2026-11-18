export type PaymentMethod = "CASH" | "CARD" | "BKASH" | "NAGAD" | "ROCKET"
export type PaymentStatus =
  "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED"
export type PaymentType = "PAYMENT" | "REFUND"

export interface PaymentOrder {
  id: string
  invoiceNo: string
  total: string
  paymentStatus: PaymentStatus
}

export interface OriginalPayment {
  id: string
  transactionId: string | null
  method: PaymentMethod
  status: PaymentStatus
}

export interface Payment {
  id: string
  orderId: string
  amount: string
  currency: string
  method: PaymentMethod
  provider: string
  status: PaymentStatus
  type: PaymentType
  transactionId: string | null
  sessionId: string | null
  notes: string | null
  originalPaymentId: string | null
  originalPayment?: OriginalPayment | null
  order: PaymentOrder
  createdAt: string
  updatedAt: string
}

export interface PaymentQueryParams {
  page?: number
  limit?: number
  search?: string
  method?: PaymentMethod
  status?: PaymentStatus
  type?: PaymentType
}

export interface PaymentsResponse {
  data: Payment[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
