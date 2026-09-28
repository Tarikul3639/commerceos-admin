import type { PaginatedResponse } from "@/types/pagination"

export type Brand = {
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

export type BrandsResponse = PaginatedResponse<Brand>

export type CreateBrand = {
    name: string
    description?: string
    slug: string
    image?: string
    publicId?: string
    isActive?: boolean
}

export type UpdateBrand = Partial<CreateBrand>

export type BrandQueryParams = {
    page?: number
    limit?: number
    search?: string
    isActive?: boolean
}