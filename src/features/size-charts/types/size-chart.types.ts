import type { PaginatedResponse } from "@/types/pagination"

export type SizeChartItem = {
  id: string
  size: string
  chest: string | null
  length: string | null
  shoulder: string | null
  sleeve: string | null
  waist: string | null
  hip: string | null
  inseam: string | null
  sizeChartId: string
  createdAt: string
  updatedAt: string
}

export type SizeChart = {
  id: string
  name: string
  items: SizeChartItem[]
  productCount?: number
  createdAt: string
  updatedAt: string
}

export type SizeChartsResponse = PaginatedResponse<SizeChart>

export type SizeChartQueryParams = {
  page?: number
  limit?: number
  search?: string
}

export type CreateSizeChartRequest = {
  name: string
}

export type UpdateSizeChartRequest = Partial<CreateSizeChartRequest>

export type CreateSizeChartItemRequest = {
  size: string
  chest?: number
  length?: number
  shoulder?: number
  sleeve?: number
  waist?: number
  hip?: number
  inseam?: number
}

export type UpdateSizeChartItemRequest = Partial<CreateSizeChartItemRequest>
