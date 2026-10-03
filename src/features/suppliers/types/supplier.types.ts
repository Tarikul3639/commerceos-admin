import type { PaginatedResponse } from "@/types/pagination"

export interface Supplier {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  contactPerson: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type SupplierListResponse = PaginatedResponse<Supplier>
export interface SupplierQuery {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}
export interface SupplierRequest {
  name: string
  email?: string
  phone?: string
  address?: string
  contactPerson?: string
  isActive?: boolean
}
