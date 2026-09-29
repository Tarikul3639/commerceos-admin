export enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED = "FIXED",
}

export interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface Discount {
    id: string
    name: string
    description: string | null
    type: DiscountType
    value: string
    startDate: string | null
    endDate: string | null
    isActive: boolean
    createdById: string
    createdAt: string
    updatedAt: string
}

export interface DiscountWithPagination {
    data: Discount[]
    meta: PaginationMeta
}

export interface DiscountProduct {
    id: string
    name: string
    slug: string
    thumbnail: string | null
}

export interface CreateDiscountRequest {
    name: string
    description?: string
    type: DiscountType
    value: string
    startDate?: string
    endDate?: string
    isActive?: boolean
}

export interface UpdateDiscountRequest {
    name?: string
    description?: string | null
    type?: DiscountType
    value?: string
    startDate?: string | null
    endDate?: string | null
    isActive?: boolean
}

export interface AssignProductDiscountRequest {
    productIds: string[]
}

export interface DiscountQueryParams {
    search?: string
    type?: DiscountType
    isActive?: boolean
    page?: number
    limit?: number
}

export interface DiscountProductsResponse {
    data: DiscountProduct[]
    meta: PaginationMeta
}