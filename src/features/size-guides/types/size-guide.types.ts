import type { PaginatedResponse } from "@/types/pagination"

export const SIZE_GUIDE_UNITS = ["cm", "in"] as const
export type Unit = (typeof SIZE_GUIDE_UNITS)[number]

export type SizeGuideCell = string | number

export type SizeGuideRow = Record<string, SizeGuideCell>

export type SizeGuide = {
  id: string
  name: string
  description: string | null
  unit: Unit
  columns: string[]
  rows: SizeGuideRow[]
  createdAt: string
  updatedAt: string
}

export type SizeGuidesResponse = PaginatedResponse<SizeGuide>

export type SizeGuidePayload = {
  name: string
  description?: string
  unit: Unit
  columns: string[]
  rows: SizeGuideRow[]
}

export type SizeGuideQueryParams = {
  page?: number
  limit?: number
  search?: string
}
