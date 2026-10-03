import type { PaginatedResponse } from "@/types/pagination"

export type PurchaseStatus = "PENDING" | "RECEIVED" | "CANCELLED"
export interface PurchaseItem {
  id: string
  quantity: number
  unitPrice: string
  subtotal: string
  productId: string
  product: { id: string; name: string; sku: string }
  createdAt: string
  updatedAt: string
}
export interface Purchase {
  id: string
  invoiceNo: string
  subtotal: string
  discount: string
  tax: string
  total: string
  status: PurchaseStatus
  supplier: { id: string; name: string }
  user: { id: string; name: string; email: string }
  items: PurchaseItem[]
  createdAt: string
  updatedAt: string
}
export type PurchaseListResponse = PaginatedResponse<Purchase>
export interface PurchaseQuery {
  search?: string
  status?: PurchaseStatus
  supplierId?: string
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
}
export interface PurchaseItemRequest {
  productId: string
  quantity: number
  unitPrice: string
}
export interface CreatePurchaseRequest {
  supplierId: string
  items: PurchaseItemRequest[]
  discount?: string
  tax?: string
}
export interface UpdatePurchaseRequest {
  supplierId?: string
  items?: Array<Partial<PurchaseItemRequest>>
  discount?: string
  tax?: string
}
