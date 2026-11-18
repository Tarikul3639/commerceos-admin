import type { PaginatedResponse } from "@/types/pagination"

export type DiscountType = "PERCENTAGE" | "FIXED"

export interface Discount {
  id: string
  code: string
  description: string | null
  type: DiscountType
  value: string
  minOrderAmount: string
  maxDiscountAmount: string | null
  startsAt: string | null
  endsAt: string | null
  usageLimit: number | null
  isActive: boolean
  createdById: string
  updatedById: string | null
  createdAt: string
  updatedAt: string
}

export type DiscountsResponse = PaginatedResponse<Discount>
export interface DiscountQueryParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}
export interface DiscountPayload {
  code: string
  description?: string
  type: DiscountType
  value: number
  minOrderAmount?: number
  maxDiscountAmount?: number | null
  startsAt?: string | null
  endsAt?: string | null
  usageLimit?: number | null
  isActive?: boolean
}
