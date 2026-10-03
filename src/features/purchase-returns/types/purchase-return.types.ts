import type { PaginatedResponse } from "@/types/pagination"

export type PurchaseReturnStatus =
  "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"

export interface PurchaseReturnPurchase {
  id: string
  invoiceNo: string
  supplier?: { id: string; name: string }
}

export interface PurchaseReturnItem {
  id: string
  quantity: number
  reason: string | null
  purchaseItemId?: string
  purchaseItem: {
    id: string
    quantity: number
    unitPrice: string
    productId: string
    product: { id: string; name: string; sku: string }
  }
  createdAt: string
  updatedAt: string
}

export interface PurchaseReturn {
  id: string
  returnNo: string
  status: PurchaseReturnStatus
  reason: string | null
  purchase: PurchaseReturnPurchase
  items: PurchaseReturnItem[]
  createdBy: { id: string; name: string; email: string }
  approvedBy: { id: string; name: string; email: string } | null
  approvedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PurchaseReturnListResponse = PaginatedResponse<PurchaseReturn>

export interface PurchaseReturnQuery {
  status?: PurchaseReturnStatus
  purchaseId?: string
  page?: number
  limit?: number
}

export interface CreatePurchaseReturnRequest {
  purchaseId: string
  reason?: string
  items: Array<{
    purchaseItemId: string
    quantity: number
    reason?: string
  }>
}
