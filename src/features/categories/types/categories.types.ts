import type { PaginatedResponse } from "@/types/pagination"

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  publicId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CategoriesResponse = PaginatedResponse<Category>

export type CreateCategory = {
  name: string
  slug: string
  description?: string
  image?: string
  publicId?: string
  isActive?: boolean
}

export type UpdateCategory = {
  name?: string
  slug?: string
  description?: string
  image?: string | null
  publicId?: string | null
  isActive?: boolean
}

export type CategoryQueryParams = {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}
