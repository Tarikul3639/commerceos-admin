import type { PaginatedResponse } from "@/types/pagination"

export type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type CategoriesResponse = PaginatedResponse<Category>

export type CreateCategory = {
    name: string
    slug: string
    description?: string
    isActive?: boolean
}

export type UpdateCategory = Partial<CreateCategory>

export type CategoryQueryParams = {
    page?: number
    limit?: number
    search?: string
    isActive?: boolean
}
