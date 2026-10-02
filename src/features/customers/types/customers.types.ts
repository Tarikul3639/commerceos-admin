import { PaginatedResponse } from "@/types/pagination"

export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export type Customer = {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl?: string | null
  publicId?: string | null
  address: string | null
  status: CustomerStatus
  isVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export type CustomersResponse = PaginatedResponse<Customer>

export type CreateCustomer = {
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  publicId?: string
  address?: string
}

export type UpdateCustomer = Partial<CreateCustomer>

export type CustomerSortBy = "name" | "email" | "createdAt" | "updatedAt"
export type CustomerSortOrder = "asc" | "desc"

export type CustomerQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: CustomerStatus
  sortBy?: CustomerSortBy
  sortOrder?: CustomerSortOrder
}
